# Backend Supabase — AquiAtas

Projeto Supabase: `zgdopytmxjstwtorecpm` (região `sa-east-1`). Este documento descreve o schema, as políticas de segurança, as Edge Functions e os passos para configurar o ambiente do zero.

> **Estado atual**: o schema abaixo já está aplicado e ativo no projeto Supabase vinculado. As migrações foram aplicadas via API de gerenciamento do Supabase durante o desenvolvimento; a pasta `supabase/migrations/` com os arquivos SQL locais ainda **não** foi exportada neste repositório (ver "Pendências" no fim deste documento).

## 1. Configuração do projeto

1. Crie (ou use) um projeto no [Supabase Dashboard](https://supabase.com/dashboard).
2. Em **Project Settings → API**, copie a `Project URL` e a `anon` / `publishable` key para o `.env` do frontend (ver `.env.example` na raiz do repositório). **Nunca** copie a `service_role` key para o frontend.
3. Se estiver clonando o schema para um novo projeto, use a CLI do Supabase (`supabase db pull` a partir do projeto de origem, ou recrie as migrações a partir do inventário abaixo) e depois:

   ```bash
   supabase link --project-ref <seu-project-ref>
   supabase db push
   ```

4. Gere os tipos TypeScript do schema sempre que o banco mudar:

   ```bash
   supabase gen types typescript --project-id <seu-project-ref> > src/integrations/supabase/database.types.ts
   ```

## 2. Extensões

- `pgcrypto`, `pg_trgm` (busca por trigram), `unaccent` (busca sem acento) — instaladas no schema `extensions`.

## 3. Enums

| Enum | Valores |
|---|---|
| `user_role` | `user`, `manager`, `admin` |
| `user_status` | `active`, `inactive`, `blocked` |
| `publication_status` | `draft`, `published`, `archived` |
| `partner_status` | `active`, `inactive` |
| `agency_status` | `active`, `inactive` |

## 4. Tabelas

Todas as tabelas de negócio usam `id bigint generated always as identity` como chave primária. `profiles` é a exceção que referencia `auth.users`.

| Tabela | Observações |
|---|---|
| `profiles` | `auth_user_id uuid` único → `auth.users(id)`. `role`/`status` protegidos por trigger (`profiles_guard_protected_fields`) — só um admin (ou o `service_role`, usado pelas Edge Functions) pode alterá-los. |
| `categories`, `ata_types`, `brands` | Taxonomia das atas. `created_by`/`updated_by` → `profiles(id)` (`on delete set null`). |
| `partners` | Dados completos do parceiro (incluindo CNPJ, contato, endereço). Colunas privadas nunca são expostas via SELECT direto para `anon`/usuários não autenticados — ver views na seção 6. |
| `agencies` | Órgãos públicos. Mesmo padrão de privacidade que `partners` (embora tenha menos campos sensíveis). |
| `atas` | Tabela principal. `situation` (vigente/próxima do vencimento/vencida) é **calculada** via `calculate_ata_situation()`, nunca armazenada. |
| `ata_images` | Galeria de imagens por ata; índice parcial garante no máximo uma capa (`is_cover`) por ata. |
| `plans`, `subscriptions` | Planos comerciais e assinaturas dos parceiros. |
| `contact_messages` | Mensagens do formulário de contato público (INSERT público, SELECT restrito à equipe). |
| `newsletter_subscribers` | Inscrições de newsletter (via RPC, idempotente). |
| `audit_logs` | Log de auditoria imutável do lado do cliente — só é escrito via `write_audit_log()` (SECURITY DEFINER) chamada pelos triggers `audit_row_change`. |

## 5. Funções auxiliares (RLS)

Todas `stable security definer`, `set search_path = ''`, resolvendo a partir de `auth.uid()`:

- `current_profile_id()`, `current_user_role()`, `current_user_status()`
- `is_active_user()` — sessão válida **e** `status = 'active'`.
- `is_admin()`, `is_manager_or_admin()`
- `slugify(text)`, `only_digits(text)`, `calculate_ata_situation(date, integer)`

Essas funções aparecem nos Advisors do Supabase como "executável por anon/authenticated" — isso é **esperado**: políticas de RLS precisam poder chamá-las para qualquer usuário.

## 6. Views (privacidade)

Criadas com `security_invoker = false` (aparecem como "Security Definer View" nos Advisors — **intencional**, é o padrão recomendado para expor um subconjunto de colunas ignorando a RLS restritiva da tabela base):

| View | Visível para | Conteúdo |
|---|---|---|
| `public_partners` | `anon`, `authenticated` | id, nome fantasia, logo, cidade/estado, descrição — **sem** CNPJ/contato/telefone/e-mail. |
| `authenticated_partners` | `authenticated` + `is_active_user()` | todos os campos, incluindo contato. |
| `public_agencies` | `anon`, `authenticated` | dados básicos do órgão. |
| `public_atas` | `anon`, `authenticated` | atas publicadas, com nomes de categoria/tipo/marca/órgão e dados públicos do parceiro. |
| `authenticated_atas` | `authenticated` + `is_active_user()` | idem, mas com dados completos do parceiro e `document_path`. |

## 7. RPCs

| Função | Uso |
|---|---|
| `get_ata_details(p_slug)` | Detalhe de uma ata; decide internamente se retorna dados completos do parceiro (`partner_details_visible`) conforme `is_active_user()`. |
| `search_public_atas(...)` | Busca/filtro/ordenação/paginação server-side (usa `count(*) over()` para o total). |
| `increment_ata_view(p_ata_id)` | Incrementa `views_count` apenas de atas publicadas. |
| `get_dashboard_summary()` | Indicadores do painel administrativo — **exige** `is_manager_or_admin()`, senão levanta `42501`. |
| `subscribe_newsletter(p_email, p_name, p_source)` / `unsubscribe_newsletter(p_email)` | Idempotentes. |
| `write_audit_log(...)` | Uso interno pelos triggers de auditoria. |

## 8. Row Level Security

RLS habilitado em **todas** as tabelas `public.*`, com políticas separadas por operação (nunca uma política genérica cobrindo todos os comandos):

- **`profiles`**: SELECT do próprio registro ou por `is_manager_or_admin()`; UPDATE do próprio registro (campos protegidos revertidos automaticamente) ou por admin. Sem INSERT/DELETE via cliente — criação só pelo trigger `handle_new_user`, exclusão em cascata a partir de `auth.users`.
- **`categories` / `ata_types` / `brands`**: SELECT público quando `is_active`, ou por staff; INSERT/UPDATE por `is_manager_or_admin()`; DELETE só por `is_admin()`.
- **`partners` / `agencies`**: SELECT/INSERT/UPDATE restritos à equipe (`is_manager_or_admin()`); DELETE só admin. Leitura pública passa pelas views da seção 6.
- **`atas`**: SELECT público quando `publication_status = 'published'`, ou por staff; INSERT/UPDATE por staff; DELETE só admin.
- **`ata_images`**: SELECT espelha o status de publicação da ata pai; escrita restrita à equipe.
- **`plans`**: SELECT público quando ativo; escrita só admin. **`subscriptions`**: acesso só à equipe.
- **`contact_messages` / `newsletter_subscribers`**: INSERT público (validado por `check` constraints), SELECT/UPDATE só equipe, DELETE só admin.
- **`audit_logs`**: SELECT só admin; sem política de INSERT/UPDATE/DELETE para o cliente (somente via `write_audit_log`).

## 9. Auditoria

Trigger genérico `audit_row_change()` em `atas`, `partners`, `agencies`, `categories`, `ata_types`, `brands` (INSERT/UPDATE/DELETE) e `profiles` (UPDATE). Detecta automaticamente mudanças de `publication_status`, `status` ou `role` para rotular a ação (`publish_status_change`, `status_change`, `role_change`), usando comparação via `jsonb` para funcionar em tabelas com colunas diferentes.

## 10. Storage

| Bucket | Público | Limite | Uso |
|---|---|---|---|
| `avatars` | sim | 5MB, imagem | `avatars/{auth_user_id}/{timestamp}-{arquivo}` — só o dono (ou admin) escreve. |
| `partner-logos`, `agency-logos`, `brand-logos`, `ata-images` | sim | 5MB, imagem | Escrita restrita à equipe (`is_manager_or_admin()`). |
| `public-assets` | sim | 5MB, imagem | Ativos institucionais gerais. |
| `ata-documents` | não | 20MB, PDF | Documentos anexos de atas; leitura restrita à equipe. |

Dois buckets órfãos de uma tentativa de implementação anterior (`product-images`, `atas-produtos`) ficaram vazios e sem referência no código — não puderam ser removidos via SQL (a Storage API bloqueia `DELETE` direto em `storage.buckets`); remova-os manualmente pelo Dashboard (**Storage**) se desejar.

## 11. Edge Functions

### `admin-users`

Ponto de entrada único e seguro para toda mutação de gestão de usuários administrativos. Nunca confia no papel enviado pelo cliente — sempre redescobre o perfil do chamador no banco usando a `service_role` key (que só existe no ambiente da função).

Ações (`POST { action, ...payload }`):

| Ação | Payload | Regras |
|---|---|---|
| `create` | `{ name, email, phone?, role }` | Convida por e-mail (`inviteUserByEmail` — o próprio usuário define a senha); gestor só pode criar papel `user`. |
| `update` | `{ profile_id, name?, phone?, role? }` | Ninguém altera o próprio papel; gestor só edita usuários `user`; impede remover o último admin. |
| `set_status` | `{ profile_id, status }` | Ninguém altera o próprio status; impede desativar o último admin. |
| `update_email` | `{ profile_id, email }` | Só admin/gestor (sobre usuários `user`). |
| `delete` | `{ profile_id }` | Ninguém exclui a si mesmo; impede excluir o último admin. |
| `reset_password` | `{ profile_id }` | Envia e-mail de redefinição — a senha nunca é definida diretamente por um admin. |

Deploy: `supabase functions deploy admin-users` (ou via MCP `deploy_edge_function`). Requer `verify_jwt: true` (padrão).

## 12. Primeiro administrador

Os dois `auth.users` pré-existentes no projeto (`admin@aquiatas.com.br` e o e-mail real do responsável pelo projeto) já foram promovidos a `role = 'admin'` via backfill de `profiles`. Para promover qualquer outro usuário já cadastrado a administrador, rode como owner do banco (Dashboard → SQL Editor, **nunca** exponha isso como endpoint público):

```sql
update public.profiles set role = 'admin', status = 'active' where email = 'seu-email@dominio.com.br';
```

Nunca insira diretamente em `auth.users` via SQL — sempre use o fluxo de cadastro (`/cadastro`) seguido do comando acima, ou a Auth Admin API através de uma Edge Function autenticada.

## 13. Contas de demonstração

As contas abaixo são referenciadas na tela de login (`src/constants/demoAccounts.ts`), mas **precisam ser criadas manualmente** no Dashboard (Authentication → Users → Add user → marque "Auto Confirm User"):

| Papel | E-mail | Senha sugerida |
|---|---|---|
| Administrador | `admin@aquiatas.com.br` | `Admin@123` |
| Gestor | `gestor@aquiatas.com.br` | `Gestor@123` |
| Usuário | `usuario@aquiatas.com.br` | `Usuario@123` |

Após criar cada conta, defina o papel correto (o trigger `handle_new_user` sempre cria como `role = 'user'`):

```sql
update public.profiles set role = 'admin'   where email = 'admin@aquiatas.com.br';
update public.profiles set role = 'manager' where email = 'gestor@aquiatas.com.br';
-- usuario@aquiatas.com.br já fica correto como 'user'
```

## 14. Configurações recomendadas no Dashboard

- **Authentication → Providers → Email**: habilite "Confirm email" (já ativo por padrão) e configure o remetente/SMTP para produção.
- **Authentication → Auth Providers → Email → Leaked password protection**: habilite (aparece como pendência nos Advisors — não é configurável via SQL).
- **Authentication → URL Configuration**: adicione a URL de produção e `http://localhost:5173` às "Redirect URLs" (necessário para `/auth/callback` e `/redefinir-senha`).

## 15. Pendências conhecidas

- `supabase/migrations/*.sql` locais não foram exportados neste repositório — o schema documentado acima já está aplicado e ativo no projeto remoto. Recomenda-se rodar `supabase db pull` para gerar os arquivos locais e colocá-los sob controle de versão.
- Dois buckets de Storage órfãos (`product-images`, `atas-produtos`) precisam ser removidos manualmente pelo Dashboard.
- "Leaked password protection" do Supabase Auth está desabilitada por padrão — habilite manualmente no Dashboard.
- As três contas de demonstração precisam ser criadas manualmente (seção 13) — não foram criadas automaticamente por restrição de segurança do ambiente de desenvolvimento.
