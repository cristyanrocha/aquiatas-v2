# AquiAtas

A maior vitrine digital de Atas de Registro de Preços do Brasil. React + TypeScript + Vite no frontend, Supabase (Postgres, Auth, Storage, Edge Functions) no backend.

## Stack

- React 19, TypeScript, Vite, Tailwind v4, shadcn/ui (Radix)
- React Router v7, Context API
- Supabase: PostgreSQL + RLS, Auth, Storage, Edge Functions (Deno)

## Configuração local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e preencha com as credenciais do seu projeto Supabase (Dashboard → Project Settings → API):

   ```bash
   cp .env.example .env
   ```

   - `VITE_SUPABASE_URL`: URL do projeto (`https://<ref>.supabase.co`).
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: chave publicável/anon do projeto. **Nunca** use a `service_role` key no frontend.

3. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Scripts disponíveis:

   ```bash
   npm run dev      # servidor de desenvolvimento
   npm run build    # typecheck + build de produção
   npm run lint      # oxlint
   npm run preview  # preview do build de produção
   ```

## Backend Supabase

Toda a configuração do banco (migrações, seeds, Edge Functions, políticas de RLS) está documentada em [`supabase/README.md`](supabase/README.md), incluindo:

- Como aplicar as migrações e gerar os tipos TypeScript.
- Como criar o primeiro administrador.
- Como configurar as contas de demonstração.
- Inventário de tabelas, views, RPCs, triggers, buckets e políticas.

## Estrutura do projeto

```
src/
  components/    componentes reutilizáveis (common, ui, public, admin, forms)
  contexts/      AuthContext, SearchPaletteContext
  hooks/         hooks compartilhados (useAuth, useEntityStore, ...)
  integrations/supabase/   cliente Supabase + tipos gerados do banco
  lib/           mappers DB↔frontend, tradução de erros, utilitários do Supabase
  pages/         páginas públicas e do painel administrativo
  routes/        AppRouter, layouts, guardas de rota
  services/      camada de acesso a dados (um módulo por entidade)
  types/         tipos de domínio do frontend
  utils/         formatação, validação, máscaras
supabase/
  functions/     Edge Functions (Deno)
  README.md      documentação do backend
```

## Papéis de usuário

- **Visitante**: navega atas publicadas, parceiros e órgãos com dados públicos (sem contato do parceiro).
- **Usuário**: autenticado, visualiza dados de contato completos dos parceiros responsáveis pelas atas.
- **Gestor**: acesso ao painel administrativo; pode gerenciar atas, parceiros, órgãos, categorias, tipos e usuários com papel "Usuário".
- **Administrador**: acesso completo, incluindo gestão de usuários com qualquer papel e configurações sensíveis.

Todas as regras de autorização são aplicadas no banco (Row Level Security), nunca apenas no frontend.
