import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade e LGPD",
  description:
    "Saiba como o Mercado Livre GD coleta, trata e protege seus dados pessoais.",
};

export default function PoliticaPrivacidadePage() {
  const email = process.env.NEXT_PUBLIC_EMAIL ?? "contato@mercadolivregd.com";

  return (
    <div className="pt-20">
      <section className="bg-gradient-hero py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Política de Privacidade
          </h1>
          <p className="text-slate-300">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 prose prose-slate max-w-none">
          <h2 id="lgpd">1. Conformidade com a LGPD</h2>
          <p>
            O Mercado Livre GD está comprometido com a proteção dos dados
            pessoais de seus usuários, em conformidade com a{" "}
            <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)</strong>.
          </p>

          <h2>2. Dados Coletados</h2>
          <p>Coletamos os seguintes dados pessoais para prestação do serviço:</p>
          <ul>
            <li>Nome completo e CPF do titular da conta</li>
            <li>Endereço de e-mail e telefone</li>
            <li>Endereço residencial ou comercial</li>
            <li>Informações sobre o consumo de energia (distribuidora, valor médio, kWh)</li>
            <li>Documentos: conta de energia e documento de identificação</li>
          </ul>

          <h2>3. Finalidade do Tratamento</h2>
          <p>Os dados são utilizados exclusivamente para:</p>
          <ul>
            <li>Análise técnica e comercial do perfil de consumo energético</li>
            <li>Matching com fornecedores de energia compatíveis</li>
            <li>Contato comercial e envio de propostas personalizadas</li>
            <li>Cumprimento de obrigações legais e regulatórias</li>
          </ul>

          <h2>4. Compartilhamento de Dados</h2>
          <p>
            Seus dados poderão ser compartilhados com fornecedores de energia
            parceiros, exclusivamente para fins de viabilização do contrato de
            fornecimento. Não vendemos, alugamos nem cedemos dados a terceiros
            para fins de marketing ou publicidade.
          </p>

          <h2>5. Armazenamento e Segurança</h2>
          <p>
            Os dados e documentos são armazenados em ambiente seguro, com
            criptografia em trânsito e em repouso. Adotamos medidas técnicas e
            organizacionais adequadas para proteger seus dados contra acesso
            não autorizado, perda ou destruição.
          </p>

          <h2>6. Prazo de Retenção</h2>
          <p>
            Os dados são mantidos pelo tempo necessário para cumprimento das
            finalidades descritas ou pelo prazo legal aplicável. Após esse
            período, são excluídos ou anonimizados.
          </p>

          <h2>7. Direitos do Titular</h2>
          <p>
            Em conformidade com a LGPD, você tem direito a:
          </p>
          <ul>
            <li>Confirmar a existência de tratamento de seus dados</li>
            <li>Acessar seus dados</li>
            <li>Solicitar correção de dados incompletos ou inexatos</li>
            <li>Solicitar a exclusão de dados desnecessários</li>
            <li>Revogar o consentimento a qualquer momento</li>
            <li>Solicitar informações sobre compartilhamento de dados</li>
          </ul>
          <p>
            Para exercer seus direitos, entre em contato pelo e-mail:{" "}
            <a href={`mailto:${email}`} className="text-energy-600 font-medium">
              {email}
            </a>
          </p>

          <h2>8. Cookies</h2>
          <p>
            Utilizamos cookies técnicos essenciais para o funcionamento da
            plataforma. Não utilizamos cookies de rastreamento ou publicidade
            comportamental.
          </p>

          <h2>9. Contato do Encarregado (DPO)</h2>
          <p>
            Para questões relacionadas à privacidade e proteção de dados,
            entre em contato pelo e-mail:{" "}
            <a href={`mailto:${email}`} className="text-energy-600 font-medium">
              {email}
            </a>
          </p>

          <h2>10. Alterações nesta Política</h2>
          <p>
            Esta política pode ser atualizada periodicamente. Notificaremos
            os usuários sobre alterações relevantes por e-mail ou mediante
            aviso na plataforma.
          </p>
        </div>
      </section>
    </div>
  );
}
