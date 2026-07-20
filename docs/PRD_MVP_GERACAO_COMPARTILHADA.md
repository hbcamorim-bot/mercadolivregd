# PRD — MVP da plataforma de geração compartilhada

Versão: 0.1
Data: 18 de julho de 2026
Status: definição inicial para validação com fornecedor piloto

## 1. Visão do produto

Construir uma plataforma que conecte a capacidade locável de múltiplas usinas de geração distribuída a unidades consumidoras elegíveis, por meio de parceiros comerciais e dos arranjos de geração compartilhada mantidos por cada fornecedor.

A plataforma organiza cadastro, qualificação, matching, proposta, adesão, locação, ativação, acompanhamento e comissionamento. Ela não compra, vende ou transfere créditos de energia e não constitui nem opera a estrutura associativa do fornecedor.

## 2. Premissa operacional

Cada fornecedor é responsável por:

- constituir e manter sua associação, cooperativa, consórcio ou estrutura aplicável;
- garantir a regularidade das usinas e da unidade geradora;
- definir e disponibilizar seus instrumentos de adesão e locação;
- responder pela veracidade da capacidade informada;
- executar ou autorizar os procedimentos perante a distribuidora;
- emitir cobranças e receber os valores dos contratos de locação;
- cumprir obrigações jurídicas, regulatórias, fiscais e contábeis de sua operação.

A plataforma pode:

- disponibilizar guias e checklists educacionais;
- indicar profissionais jurídicos, contábeis e regulatórios independentes;
- fornecer modelos de fluxo e requisitos documentais;
- verificar se documentos mínimos foram apresentados;
- sinalizar pendências e datas de validade;
- impedir publicação de usinas sem qualificação mínima;
- registrar declarações e responsabilidades aceitas pelo fornecedor.

A plataforma não deve prometer que a simples conclusão do checklist representa parecer jurídico, homologação, certificação ou garantia de regularidade.

## 3. Objetivos do MVP

1. Permitir que um fornecedor cadastre várias usinas e sua capacidade locável.
2. Permitir que parceiros comerciais cadastrem unidades consumidoras prospectadas.
3. Identificar matches compatíveis por distribuidora, capacidade e perfil de consumo.
4. Transformar um match em proposta de locação e adesão.
5. Acompanhar o processo até a ativação da unidade consumidora.
6. Preservar a autoria comercial e calcular a comissão do parceiro.
7. Disponibilizar visão operacional de capacidade total, reservada, locada e disponível.
8. Manter trilha de auditoria dos principais eventos e documentos.

## 4. Fora do escopo inicial

- Compra ou venda de créditos de energia.
- Negociação no Ambiente de Contratação Livre.
- Constituição ou administração jurídica de associações pela plataforma.
- Custódia e repasse dos pagamentos de locação.
- Fatura unificada.
- Integração automática com todas as distribuidoras.
- Otimização automática mensal das listas de alocação.
- OCR totalmente automático sem revisão humana.
- Aplicativo móvel nativo.

## 5. Atores e responsabilidades

### Administrador da plataforma

- aprova fornecedores;
- configura distribuidores, permissões e regras gerais;
- acompanha riscos, documentos e auditoria;
- administra planos, cobrança SaaS e suporte.

### Fornecedor/gestora

- cadastra organização, estrutura associativa e usuários;
- cadastra várias usinas;
- informa capacidade e disponibilidade;
- define preços, regras de locação e comissão;
- aprova prospects, propostas e ativações;
- gerencia documentos e procedimentos operacionais.

### Parceiro comercial

- cadastra prospects e unidades consumidoras;
- coleta consentimento para tratamento dos dados;
- acompanha análise, proposta, assinatura e ativação;
- visualiza somente sua carteira, salvo permissão adicional;
- acompanha comissão prevista, aprovada e paga.

### Consumidor beneficiário

- fornece dados da unidade consumidora;
- recebe e aceita a proposta;
- adere à estrutura associativa do fornecedor;
- assina o contrato de locação de quota;
- acompanha ativação e, futuramente, economia realizada.

## 6. Onboarding do fornecedor

### Etapa 1 — organização

- razão social e nome comercial;
- CNPJ;
- responsáveis;
- contatos operacionais, comerciais e financeiros;
- endereços;
- dados de cobrança do SaaS;
- aceite dos termos e declaração de responsabilidade.

### Etapa 2 — estrutura de geração compartilhada

- tipo da estrutura: associação, cooperativa, consórcio ou outra admitida;
- razão social/nome e CNPJ, quando aplicável;
- estatuto, contrato ou ato constitutivo;
- responsáveis e poderes de representação;
- modelo de termo de adesão;
- modelo de contrato de locação de quota;
- política de saída/cancelamento;
- status de revisão e data de validade dos documentos.

### Etapa 3 — usinas

Para cada usina:

- nome e código interno;
- CNPJ/CPF do titular aplicável;
- unidade consumidora geradora;
- distribuidora;
- município e estado;
- fonte de geração;
- potência instalada em kW;
- geração média mensal e histórico disponível;
- data de conexão;
- modalidade e enquadramento;
- documentação de conexão/homologação;
- capacidade total estimada em kWh/mês;
- capacidade já comprometida;
- capacidade reservada;
- capacidade disponível para locação;
- data prevista de disponibilidade;
- status operacional.

### Status de qualificação

- `RASCUNHO`
- `DOCUMENTOS_PENDENTES`
- `EM_ANALISE`
- `APROVADO_PARA_PUBLICACAO`
- `SUSPENSO`
- `REPROVADO`

“Aprovado para publicação” significa apenas que o checklist interno foi atendido, não que a plataforma emitiu certificação jurídica ou regulatória.

## 7. Cadastro de prospects

O parceiro comercial registra:

- nome ou razão social;
- CPF/CNPJ somente quando necessário para análise/contratação;
- telefone e e-mail;
- endereço da unidade consumidora;
- número da unidade consumidora;
- distribuidora;
- classe/subgrupo tarifário;
- tipo de ligação;
- consumo médio mensal em kWh;
- valor médio da fatura;
- histórico de até 12 meses, quando disponível;
- conta de energia em storage privado;
- consentimento e versão do aviso de privacidade;
- origem/campanha;
- parceiro proprietário do lead.

O cadastro inicial deve pedir o mínimo necessário. Documento de identidade e outros dados de KYC entram apenas após uma proposta elegível.

### Regras de propriedade do lead

- cada prospect possui um parceiro responsável;
- duplicidades devem ser detectadas por unidade consumidora, CPF/CNPJ, telefone e e-mail;
- conflitos de autoria ficam em fila de análise;
- transferências de carteira exigem permissão e trilha de auditoria;
- a regra de proteção do lead deve ter prazo configurável;
- comissão deve preservar a regra vigente no momento da proposta.

## 8. Motor de matching

### Filtros obrigatórios

1. Mesma distribuidora da usina.
2. Usina aprovada para publicação e operacional.
3. Estrutura associativa ativa.
4. Capacidade disponível na data prevista.
5. Perfil tarifário e documental elegível.

### Dimensionamento inicial

O MVP calcula a demanda locável com base no consumo histórico e aplica uma margem de segurança configurável. A capacidade não deve ser automaticamente dimensionada em 100% da média sem simulação.

Exemplo inicial:

```text
demanda_base = média dos últimos 12 meses
demanda_locável = demanda_base × percentual de cobertura configurado
```

### Pontuação do match

- compatibilidade de distribuidora: obrigatória;
- capacidade disponível: obrigatória;
- proximidade entre consumo e quota sugerida;
- prazo estimado de ativação;
- desconto/economia líquida estimada;
- duração e regras do contrato;
- prioridade comercial configurada pelo fornecedor.

## 9. Capacidade e quotas

Cada usina deve apresentar:

```text
capacidade disponível = capacidade operacional
                       - capacidade locada ativa
                       - capacidade reservada válida
                       - margem operacional
```

Uma reserva de capacidade precisa ter prazo de expiração. Ao vencer sem proposta/assinatura, a capacidade retorna automaticamente ao estoque disponível.

### Status da quota

- `DISPONIVEL`
- `RESERVADA`
- `PROPOSTA_EMITIDA`
- `CONTRATADA`
- `EM_ATIVACAO`
- `ATIVA`
- `EM_CANCELAMENTO`
- `ENCERRADA`

## 10. Funil comercial e operacional

### Status do prospect

- `NOVO`
- `DADOS_PENDENTES`
- `EM_ANALISE`
- `ELEGIVEL`
- `SEM_OFERTA_COMPATIVEL`
- `MATCH_ENCONTRADO`
- `PROPOSTA_ENVIADA`
- `PROPOSTA_ACEITA`
- `ADESAO_EM_ASSINATURA`
- `LOCACAO_ASSINADA`
- `EM_ATIVACAO`
- `ATIVO`
- `PERDIDO`
- `CANCELADO`

Cada mudança deve registrar usuário, data, motivo e observação.

## 11. Proposta

A proposta deve apresentar:

- fornecedor e estrutura associativa;
- usina e distribuidora;
- quota sugerida em kWh/mês;
- valor ou regra de cálculo da locação;
- economia estimada em reais e percentual;
- distinção entre parcela de energia e conta total;
- componentes que permanecem na fatura da distribuidora;
- prazo estimado para ativação;
- vigência, fidelidade e cancelamento;
- validade da proposta;
- documentos necessários;
- aviso de que o resultado real depende da geração, consumo, tarifas e processamento da distribuidora.

## 12. Adesão e locação

Após o aceite:

1. completar KYC;
2. selecionar a versão correta do termo de adesão do fornecedor;
3. gerar contrato de locação da quota;
4. coletar assinaturas;
5. verificar conclusão documental;
6. converter reserva em quota contratada;
7. iniciar processo de ativação;
8. registrar protocolo, pendências e conclusão.

A plataforma deve armazenar a versão exata dos documentos assinados, hash, signatários e eventos de assinatura.

## 13. Comissões

Cada fornecedor configura sua política:

- valor fixo por ativação;
- percentual sobre o contrato de locação;
- valor recorrente por unidade ativa;
- duração da recorrência;
- regras de estorno, cancelamento e inadimplência;
- data de corte e competência.

O MVP calcula e apresenta as comissões, mas o pagamento ocorre fora da plataforma. O fornecedor registra o pagamento e anexa comprovante quando necessário.

### Status da comissão

- `PREVISTA`
- `ELEGIVEL`
- `APROVADA`
- `PAGA`
- `ESTORNADA`
- `CANCELADA`

## 14. Monetização da plataforma

Modelo inicial recomendado:

- mensalidade base por fornecedor;
- adicional por usina ativa;
- faixa de preço por unidades consumidoras ativas;
- implantação e migração de dados;
- taxa de originação/ativação;
- white-label opcional;
- módulos futuros de assinatura, conciliação e inteligência operacional.

Os preços serão validados no piloto e não devem ser codificados de forma rígida.

## 15. Telas do MVP

### Administração da plataforma

- fornecedores;
- revisão documental;
- distribuidores;
- usuários e permissões;
- planos e cobrança;
- auditoria e suporte.

### Portal do fornecedor

- dashboard;
- estruturas associativas;
- usinas;
- capacidade e reservas;
- parceiros;
- prospects e matches;
- propostas;
- adesões e locações;
- ativações;
- comissões;
- documentos e configurações.

### Portal do parceiro

- dashboard da carteira;
- novo prospect;
- prospects;
- pendências;
- propostas;
- ativações;
- comissões;
- materiais comerciais e guias.

### Experiência do consumidor

- link seguro para revisar proposta;
- envio dos documentos restantes;
- aceite de termos;
- assinatura;
- acompanhamento do status.

## 16. Modelo de dados inicial

- `Organization`
- `User`
- `Membership`
- `Role`
- `SupplierProfile`
- `CommercialPartner`
- `SharedGenerationEntity`
- `GeneratorPlant`
- `PlantDocument`
- `CapacityPeriod`
- `PlantQuota`
- `Prospect`
- `LeadOwnership`
- `ConsumerUnit`
- `ConsumptionHistory`
- `EnergyBill`
- `Match`
- `CapacityReservation`
- `Proposal`
- `AssociationMembership`
- `QuotaLeaseAgreement`
- `ActivationProcess`
- `Allocation`
- `CommissionPolicy`
- `CommissionEntry`
- `ConsentRecord`
- `AuditEvent`

## 17. Segurança e LGPD

Requisitos bloqueadores:

- storage privado para faturas e documentos;
- URLs temporárias e autorizadas;
- autenticação robusta e sessões assinadas;
- controle de acesso por organização e função;
- rate limit e proteção contra abuso;
- validação de API no servidor;
- criptografia em trânsito e em repouso;
- trilha de acesso a documentos;
- retenção e descarte configuráveis;
- versionamento de consentimentos e políticas;
- exportação/correção/exclusão conforme processo aplicável;
- backup e restauração testados.

## 18. Métricas do piloto

- usinas cadastradas e aprovadas;
- capacidade total e disponível;
- prospects por parceiro;
- percentual de prospects elegíveis;
- taxa de match;
- propostas aceitas;
- tempo do cadastro à proposta;
- tempo da assinatura à ativação;
- capacidade reservada versus contratada;
- unidades ativas;
- comissão por parceiro;
- receita SaaS por fornecedor;
- cancelamentos e causas;
- erros e retrabalho documental.

## 19. Critérios de sucesso do piloto

O piloto será considerado validado quando:

- pelo menos um fornecedor cadastrar sua estrutura e uma ou mais usinas;
- pelo menos dois parceiros comerciais utilizarem o portal;
- 20 a 50 prospects forem cadastrados;
- o sistema identificar matches sem ultrapassar a capacidade disponível;
- pelo menos cinco locações percorrerem o fluxo completo;
- autoria e comissão forem preservadas sem conflito;
- todos os documentos permanecerem privados e auditáveis;
- o fornecedor conseguir operar o fluxo sem planilha paralela para as etapas cobertas pelo MVP.

## 20. Sequência de implementação

### Sprint 0 — validação do desenho

- selecionar fornecedor, usina e distribuidora do piloto;
- validar contratos e documentos utilizados pelo fornecedor;
- validar política de comissão;
- mapear o processo real de ativação na distribuidora;
- aprovar wireframes e escopo.

### Sprint 1 — fundação segura

- atualizar dependências vulneráveis;
- autenticação multiusuário;
- organizações, funções e permissões;
- storage privado;
- auditoria básica.

### Sprint 2 — fornecedor e usinas

- onboarding;
- estrutura associativa;
- múltiplas usinas;
- documentos;
- capacidade e quotas.

### Sprint 3 — parceiros e prospects

- cadastro de parceiros;
- propriedade do lead;
- prospects e unidades consumidoras;
- consumo e faturas;
- deduplicação.

### Sprint 4 — matching e proposta

- regras de compatibilidade;
- reserva de capacidade;
- proposta;
- aceite.

### Sprint 5 — adesão, locação e ativação

- documentos contratuais;
- assinatura;
- pipeline de ativação;
- comissões;
- dashboards do piloto.

## 21. Decisões pendentes para iniciar a Sprint 0

1. Qual fornecedor participará do piloto?
2. Qual distribuidora e quais usinas entrarão primeiro?
3. A estrutura utilizada será associação, cooperativa ou consórcio?
4. Quem aprova a elegibilidade final de um prospect?
5. Como será calculado o valor da locação?
6. Qual é a política de comissão dos parceiros?
7. Quais documentos e modelos contratuais o fornecedor já utiliza?
8. Quem executa o protocolo e acompanha a ativação na distribuidora?
9. A assinatura será integrada ou inicialmente externa?
10. Qual prazo de proteção da autoria de um lead?
