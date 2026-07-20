import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatCPF(cpf: string): string {
  return cpf
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
}

export function formatCEP(cep: string): string {
  return cep.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2");
}

export const STATUS_LABELS: Record<string, string> = {
  NOVO_ONBOARDING: "Novo onboarding",
  NOVO_CADASTRO: "Novo Cadastro",
  DOCUMENTACAO_RECEBIDA: "Doc. Recebida",
  EM_ANALISE: "Em Análise",
  FORNECEDOR_IDENTIFICADO: "Fornecedor Identificado",
  PROPOSTA_EM_ANDAMENTO: "Proposta em Andamento",
  CONTATO_REALIZADO: "Contato Realizado",
  CONVERTIDO: "Convertido",
  NAO_CONVERTIDO: "Não Convertido",
  ATIVO: "Ativo",
  EM_NEGOCIACAO: "Em Negociação",
  PARCEIRO: "Parceiro",
  INATIVO: "Inativo",
};

export const STATUS_COLORS: Record<string, string> = {
  NOVO_ONBOARDING: "bg-amber-100 text-amber-700",
  NOVO_CADASTRO: "bg-blue-100 text-blue-700",
  DOCUMENTACAO_RECEBIDA: "bg-purple-100 text-purple-700",
  EM_ANALISE: "bg-yellow-100 text-yellow-700",
  FORNECEDOR_IDENTIFICADO: "bg-indigo-100 text-indigo-700",
  PROPOSTA_EM_ANDAMENTO: "bg-orange-100 text-orange-700",
  CONTATO_REALIZADO: "bg-teal-100 text-teal-700",
  CONVERTIDO: "bg-green-100 text-green-700",
  NAO_CONVERTIDO: "bg-red-100 text-red-700",
  ATIVO: "bg-green-100 text-green-700",
  EM_NEGOCIACAO: "bg-orange-100 text-orange-700",
  PARCEIRO: "bg-blue-100 text-blue-700",
  INATIVO: "bg-gray-100 text-gray-600",
};

export const ESTADOS_BR = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

export const DISTRIBUIDORAS = [
  "Energisa",
  "CPFL Energia",
  "Enel",
  "Equatorial Energia",
  "Light",
  "Cemig",
  "Celesc",
  "COPEL",
  "AES Brasil",
  "EDP Brasil",
  "Neoenergia",
  "CELPE",
  "CEMAR",
  "CEAL",
  "CERON",
  "ELETROACRE",
  "Outra",
];

export function buildWhatsAppUrl(
  phone: string,
  message: string
): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
