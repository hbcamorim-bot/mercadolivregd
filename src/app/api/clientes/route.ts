import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { saveUploadedFile } from "@/lib/server-utils";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const nome = formData.get("nome") as string;
    const cpf = formData.get("cpf") as string;
    const email = formData.get("email") as string;
    const telefone = formData.get("telefone") as string;
    const endereco = formData.get("endereco") as string;
    const cidade = formData.get("cidade") as string;
    const estado = formData.get("estado") as string;
    const cep = formData.get("cep") as string;
    const distribuidora = formData.get("distribuidora") as string;
    const valorMedio = parseFloat(formData.get("valorMedio") as string);
    const consumoMedioRaw = formData.get("consumoMedio");
    const consumoMedio = consumoMedioRaw ? parseFloat(consumoMedioRaw as string) : null;
    const aceiteLgpd = formData.get("aceiteLgpd") === "true";
    const aceitePrivacidade = formData.get("aceitePrivacidade") === "true";

    if (!nome || !cpf || !email || !telefone || !distribuidora || !valorMedio) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes" },
        { status: 400 }
      );
    }

    let contaEnergiaUrl: string | null = null;
    let documentoUrl: string | null = null;

    const contaFile = formData.get("contaEnergia") as File | null;
    if (contaFile && contaFile.size > 0) {
      contaEnergiaUrl = await saveUploadedFile(contaFile, "conta");
    }

    const docFile = formData.get("documento") as File | null;
    if (docFile && docFile.size > 0) {
      documentoUrl = await saveUploadedFile(docFile, "doc");
    }

    const cliente = await prisma.cliente.create({
      data: {
        nome,
        cpf,
        email,
        telefone,
        endereco,
        cidade,
        estado,
        cep,
        distribuidora,
        valorMedio,
        consumoMedio,
        contaEnergiaUrl,
        documentoUrl,
        aceiteLgpd,
        aceitePrivacidade,
        status: "NOVO_CADASTRO",
      },
    });

    return NextResponse.json({ success: true, id: cliente.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/clientes]", err);
    return NextResponse.json(
      { error: "Erro interno ao processar cadastro" },
      { status: 500 }
    );
  }
}
