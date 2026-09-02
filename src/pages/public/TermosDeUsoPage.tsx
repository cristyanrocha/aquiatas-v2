import { Seo } from '@/components/common'
import { ROUTES } from '@/constants/routes'

const LAST_UPDATED = 'agosto de 2026'

export function TermosDeUsoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Seo
        title="Termos de Uso"
        description="Termos de Uso da plataforma AquiAtas."
        path={ROUTES.termosDeUso}
      />

      <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">Termos de Uso</h1>
      <p className="mt-2 text-sm text-muted-foreground">Última atualização: {LAST_UPDATED}</p>

      <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar ou utilizar a plataforma AquiAtas, você declara ter lido, compreendido e concordado com estes
            Termos de Uso e com a Política de Privacidade da plataforma. Caso não concorde com qualquer uma das
            disposições aqui estabelecidas, recomendamos que não utilize nossos serviços.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">2. Sobre a AquiAtas</h2>
          <p>
            A AquiAtas é uma plataforma digital destinada à divulgação e consulta de informações relacionadas às
            Atas de Registro de Preços vigentes, promovendo a conexão entre empresas fornecedoras, órgãos públicos e
            demais interessados. A plataforma tem como objetivo facilitar o acesso às informações públicas,
            proporcionando maior transparência, agilidade e praticidade na consulta às Atas de Registro de Preços.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">3. Cadastro de Usuários</h2>
          <p>
            Algumas funcionalidades da plataforma, como a visualização dos dados de contato dos parceiros
            responsáveis pelas Atas, exigem a criação de uma conta. Ao realizar o cadastro, o usuário compromete-se
            a:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>fornecer informações verdadeiras, completas e atualizadas;</li>
            <li>manter seus dados cadastrais atualizados;</li>
            <li>preservar a confidencialidade de sua senha e credenciais de acesso;</li>
            <li>comunicar imediatamente qualquer uso não autorizado de sua conta.</li>
          </ul>
          <p className="mt-2">O usuário é responsável por todas as atividades realizadas por meio de sua conta.</p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">4. Uso da Plataforma</h2>
          <p>
            O usuário compromete-se a utilizar a AquiAtas de forma ética, responsável e em conformidade com a
            legislação vigente. É vedado:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>utilizar a plataforma para fins ilícitos ou fraudulentos;</li>
            <li>inserir informações falsas ou enganosas;</li>
            <li>tentar acessar áreas restritas sem autorização;</li>
            <li>comprometer a segurança, disponibilidade ou funcionamento da plataforma;</li>
            <li>
              utilizar robôs, scripts ou qualquer mecanismo automatizado para coleta indevida de informações, salvo
              quando expressamente autorizado.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">5. Informações Disponibilizadas</h2>
          <p>
            A AquiAtas atua como uma plataforma de divulgação e consulta de informações sobre Atas de Registro de
            Preços. Embora busquemos manter as informações atualizadas e consistentes, a responsabilidade pela
            veracidade, atualização e integridade dos dados cadastrados é dos respectivos parceiros responsáveis por
            sua publicação. Os usuários devem confirmar as informações diretamente com o órgão público ou empresa
            responsável antes da adoção de qualquer decisão administrativa, comercial ou contratual.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">6. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo da plataforma, incluindo marca, identidade visual, textos, imagens, layout,
            funcionalidades e demais elementos, é protegido pela legislação aplicável de propriedade intelectual. É
            proibida a reprodução, distribuição, modificação ou utilização desses conteúdos sem autorização prévia
            da AquiAtas, exceto quando permitido por lei.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">7. Disponibilidade dos Serviços</h2>
          <p>
            A AquiAtas busca manter seus serviços disponíveis de forma contínua. No entanto, poderão ocorrer
            interrupções temporárias decorrentes de manutenções programadas, atualizações, falhas técnicas ou
            situações alheias ao nosso controle.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">8. Alterações dos Termos</h2>
          <p>
            Estes Termos de Uso poderão ser atualizados a qualquer momento para refletir melhorias na plataforma,
            alterações legais ou mudanças em nossos serviços. A versão mais recente estará sempre disponível nesta
            página, produzindo efeitos a partir de sua publicação.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">9. Contato</h2>
          <p>
            Em caso de dúvidas, sugestões ou solicitações relacionadas a estes Termos de Uso, entre em contato
            conosco por meio da página Contato disponível na plataforma.
          </p>
        </section>
      </div>
    </div>
  )
}
