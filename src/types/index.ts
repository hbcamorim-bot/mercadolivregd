export type StatusNegociacao =
  | "NOVO_CADASTRO"
  | "DOCUMENTACAO_RECEBIDA"
  | "EM_ANALISE"
  | "FORNECEDOR_IDENTIFICADO"
  | "PROPOSTA_EM_ANDAMENTO"
  | "CONTATO_REALIZADO"
  | "CONVERTIDO"
  | "NAO_CONVERTIDO";

export type StatusFornecedor =
  | "ATIVO"
  | "EM_NEGOCIACAO"
  | "PARCEIRO"
  | "INATIVO";

export interface Cliente {
  id: string;
  createdAt: string;
  updatedAt: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  distribuidora: string;
  valorMedio: number;
  consumoMedio: number | null;
  contaEnergiaUrl: string | null;
  documentoUrl: string | null;
  status: StatusNegociacao;
  observacoes: string | null;
  aceiteLgpd: boolean;
  aceitePrivacidade: boolean;
}

export interface Fornecedor {
  id: string;
  createdAt: string;
  updatedAt: string;
  nome: string;
  email: string;
  telefone: string;
  kwhDisponivel: number;
  regiaoAtuacao: string;
  distribuidoras: string;
  observacoes: string | null;
  status: StatusFornecedor;
}

export interface DashboardStats {
  totalClientes: number;
  totalFornecedores: number;
  kwhTotal: number;
  negociacoesAtivas: number;
  convertidos: number;
  taxaConversao: number;
  economiaPotencial: number;
  clientesPorStatus: { status: string; count: number }[];
  cadastrosPorMes: { mes: string; clientes: number; fornecedores: number }[];
}

export interface ClienteFormData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  distribuidora: string;
  valorMedio: number;
  consumoMedio?: number;
  contaEnergia?: FileList;
  documento?: FileList;
  aceiteLgpd: boolean;
  aceitePrivacidade: boolean;
}

export interface FornecedorFormData {
  nome: string;
  email: string;
  telefone: string;
  kwhDisponivel: number;
  regiaoAtuacao: string;
  distribuidoras: string;
  observacoes?: string;
}
