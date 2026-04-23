const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CALLMEBOT_KEY = process.env.CALLMEBOT_API_KEY;
const ADMIN_EMAIL = "hbcamorim@gmail.com";
const ADMIN_WHATSAPP = "5581996455050";

export async function notifyNovoCliente(data: {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  distribuidora: string;
  valorMedio: number;
}) {
  const subject = `Novo cliente: ${data.nome}`;
  const html = `
    <div style="font-family:sans-serif;max-width:520px">
      <h2 style="color:#0B1F3A">🆕 Novo cadastro de cliente</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:6px 0;color:#64748b;width:140px">Nome</td><td style="padding:6px 0;font-weight:600">${data.nome}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">E-mail</td><td style="padding:6px 0">${data.email}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">Telefone</td><td style="padding:6px 0">${data.telefone}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">Cidade/UF</td><td style="padding:6px 0">${data.cidade} / ${data.estado}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">Distribuidora</td><td style="padding:6px 0">${data.distribuidora}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">Valor médio</td><td style="padding:6px 0;font-weight:600;color:#00C896">R$ ${data.valorMedio.toFixed(2)}</td></tr>
      </table>
      <p style="margin-top:20px"><a href="https://mercadolivregd-dva1vy7w6.vercel.app/admin/clientes" style="background:#00C896;color:#0B1F3A;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">Ver no painel admin →</a></p>
    </div>
  `;
  const wa = `🆕 *Novo cliente — MercadolivreGD*\n\n👤 ${data.nome}\n📱 ${data.telefone}\n📧 ${data.email}\n📍 ${data.cidade}/${data.estado}\n⚡ ${data.distribuidora}\n💰 R$ ${data.valorMedio}`;
  await enviar(subject, html, wa);
}

export async function notifyNovoFornecedor(data: {
  nome: string;
  email: string;
  telefone: string;
  kwhDisponivel: number;
  regiaoAtuacao: string;
  distribuidoras: string;
  faixaDesconto?: string | null;
  tipoOferta?: string | null;
}) {
  const subject = `Novo fornecedor: ${data.nome}`;
  const html = `
    <div style="font-family:sans-serif;max-width:520px">
      <h2 style="color:#0B1F3A">🆕 Novo cadastro de fornecedor</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:6px 0;color:#64748b;width:160px">Nome/Empresa</td><td style="padding:6px 0;font-weight:600">${data.nome}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">E-mail</td><td style="padding:6px 0">${data.email}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">Telefone</td><td style="padding:6px 0">${data.telefone}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">kWh disponível</td><td style="padding:6px 0;font-weight:600;color:#1A6EC8">${new Intl.NumberFormat("pt-BR").format(data.kwhDisponivel)} kWh/mês</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">Região</td><td style="padding:6px 0">${data.regiaoAtuacao}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b">Distribuidoras</td><td style="padding:6px 0">${data.distribuidoras}</td></tr>
        ${data.faixaDesconto ? `<tr><td style="padding:6px 0;color:#64748b">Desconto ofertado</td><td style="padding:6px 0">${data.faixaDesconto}</td></tr>` : ""}
        ${data.tipoOferta ? `<tr><td style="padding:6px 0;color:#64748b">Tipo de oferta</td><td style="padding:6px 0">${data.tipoOferta}</td></tr>` : ""}
      </table>
      <p style="margin-top:20px"><a href="https://mercadolivregd-dva1vy7w6.vercel.app/admin/fornecedores" style="background:#1A6EC8;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">Ver no painel admin →</a></p>
    </div>
  `;
  const wa = `🆕 *Novo fornecedor — MercadolivreGD*\n\n🏢 ${data.nome}\n📱 ${data.telefone}\n📧 ${data.email}\n⚡ ${new Intl.NumberFormat("pt-BR").format(data.kwhDisponivel)} kWh/mês\n📍 ${data.regiaoAtuacao}\n🔌 ${data.distribuidoras}${data.faixaDesconto ? `\n💰 Desconto: ${data.faixaDesconto}` : ""}`;
  await enviar(subject, html, wa);
}

async function enviar(subject: string, html: string, waMessage: string) {
  await Promise.allSettled([
    enviarEmail(subject, html),
    enviarWhatsApp(waMessage),
  ]);
}

async function enviarEmail(subject: string, html: string) {
  if (!RESEND_API_KEY) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "MercadolivreGD <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject,
        html,
      }),
    });
  } catch (err) {
    console.error("[notify:email]", err);
  }
}

async function enviarWhatsApp(message: string) {
  if (!CALLMEBOT_KEY) return;
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${ADMIN_WHATSAPP}&text=${encodeURIComponent(message)}&apikey=${CALLMEBOT_KEY}`;
    await fetch(url);
  } catch (err) {
    console.error("[notify:whatsapp]", err);
  }
}
