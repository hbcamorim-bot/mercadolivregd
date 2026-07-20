-- The first MVP migration was intentionally additive and assumed the two
-- landing-page lead tables already existed. A fresh VPS database does not have
-- them, so create them here while preserving databases migrated from Vercel.

CREATE TABLE IF NOT EXISTS "Cliente" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "distribuidora" TEXT NOT NULL,
    "valorMedio" DOUBLE PRECISION NOT NULL,
    "consumoMedio" DOUBLE PRECISION,
    "contaEnergiaUrl" TEXT,
    "documentoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NOVO_CADASTRO',
    "observacoes" TEXT,
    "aceiteLgpd" BOOLEAN NOT NULL DEFAULT false,
    "aceitePrivacidade" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Fornecedor" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "kwhDisponivel" DOUBLE PRECISION NOT NULL,
    "regiaoAtuacao" TEXT NOT NULL,
    "distribuidoras" TEXT NOT NULL,
    "observacoes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("id")
);
