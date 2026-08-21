import { Seo } from '@/components/common'
import { ROUTES } from '@/constants/routes'

const LAST_UPDATED = 'agosto de 2026'

export function PoliticaDePrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Seo
        title="Política de Privacidade"
        description="Política de Privacidade da plataforma AquiAtas."
        path={ROUTES.politicaDePrivacidade}
      />

      <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Política de Privacidade</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última atualização: {LAST_UPDATED}</p>

      <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">1. Compromisso com a privacidade</h2>
          <p>
            A AquiAtas valoriza a privacidade e a proteção dos dados pessoais de seus usuários. Esta Política de
            Privacidade explica quais informações coletamos, como elas são utilizadas, armazenadas e protegidas, em
            conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD). Ao utilizar a plataforma,
            você concorda com as práticas descritas nesta Política.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">2. Dados coletados</h2>
          <p>Durante o cadastro na plataforma, poderão ser coletadas as seguintes informações:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Nome completo;</li>
            <li>E-mail;</li>
            <li>Telefone (quando informado pelo usuário).</li>
          </ul>
          <p className="mt-2">
            Esses dados são utilizados exclusivamente para permitir a autenticação, o acesso às funcionalidades da
            plataforma e a visualização das informações completas dos parceiros responsáveis pelas Atas de Registro
            de Preços divulgadas.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">3. Como utilizamos seus dados</h2>
          <p>Os dados pessoais coletados são utilizados para:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>realizar a autenticação do usuário;</li>
            <li>permitir o acesso às funcionalidades restritas da plataforma;</li>
            <li>personalizar a experiência de navegação;</li>
            <li>garantir a segurança da plataforma e de seus usuários;</li>
            <li>responder solicitações de suporte e atendimento;</li>
            <li>cumprir obrigações legais e regulatórias, quando aplicável.</li>
          </ul>
          <p className="mt-2">
            A AquiAtas não comercializa, aluga ou compartilha dados pessoais com terceiros para fins de marketing ou
            publicidade.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">4. Compartilhamento de informações</h2>
          <p>Os dados pessoais somente poderão ser compartilhados quando:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>houver obrigação legal;</li>
            <li>forem necessários para o funcionamento da plataforma;</li>
            <li>houver determinação de autoridade competente;</li>
            <li>existir autorização expressa do titular dos dados.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">5. Armazenamento e segurança</h2>
          <p>
            Os dados são armazenados em ambiente seguro, utilizando mecanismos de proteção compatíveis com as boas
            práticas de segurança da informação. A plataforma adota controles de acesso baseados em perfis de
            usuários, garantindo que informações restritas, como os dados de contato dos parceiros, sejam
            disponibilizadas apenas para usuários autenticados e ativos, conforme as regras da plataforma. Embora
            adotemos medidas de segurança adequadas, nenhum ambiente digital é completamente imune a riscos. Por
            isso, recomendamos que os usuários também adotem boas práticas para proteger suas credenciais de acesso.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">6. Direitos do titular dos dados</h2>
          <p>Nos termos da LGPD, o usuário poderá, a qualquer momento:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>solicitar acesso aos seus dados pessoais;</li>
            <li>solicitar a atualização ou correção de informações;</li>
            <li>solicitar a exclusão de seus dados, quando legalmente possível;</li>
            <li>solicitar informações sobre o tratamento de seus dados.</li>
          </ul>
          <p className="mt-2">As solicitações poderão ser realizadas por meio da página Contato da plataforma.</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">7. Cookies e tecnologias semelhantes</h2>
          <p>
            A AquiAtas poderá utilizar cookies e tecnologias semelhantes para melhorar a navegação, manter sessões
            autenticadas, aprimorar a experiência do usuário e gerar informações estatísticas de uso da plataforma.
            Esses recursos não são utilizados para venda ou compartilhamento de dados pessoais para fins comerciais.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">8. Alterações desta Política</h2>
          <p>
            Esta Política de Privacidade poderá ser atualizada periodicamente para refletir melhorias na
            plataforma, alterações legais ou mudanças em nossos processos de tratamento de dados. Sempre que houver
            alterações relevantes, a versão atualizada será disponibilizada nesta página, indicando a data da
            última revisão.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">9. Contato</h2>
          <p>
            Em caso de dúvidas, solicitações ou qualquer assunto relacionado à privacidade e ao tratamento de dados
            pessoais, entre em contato conosco por meio da página Contato da plataforma. Ao utilizar a AquiAtas,
            você declara estar ciente desta Política de Privacidade e concorda com o tratamento de seus dados
            pessoais nos termos aqui estabelecidos.
          </p>
        </section>
      </div>
    </div>
  )
}
