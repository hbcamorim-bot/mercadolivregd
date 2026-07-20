# Análise de produto, regulação e monetização — Mercado Livre GD

Data da análise: 17 de julho de 2026.

> Esta análise orienta produto e estratégia, mas não substitui parecer jurídico-regulatório e tributário específico para o modelo contratual escolhido.

## Resumo executivo

O site atual é uma boa landing page de captação, mas ainda não é um marketplace. Ele possui dois formulários, persistência de clientes e fornecedores e um painel administrativo. Não existem entidades nem fluxos de oferta, demanda, compatibilidade, proposta, adesão, alocação, contrato, faturamento ou acompanhamento mensal.

O modelo confirmado para o produto é a locação de frações ou quotas de usinas dentro de uma estrutura de geração compartilhada. Os geradores cadastram suas usinas e a capacidade disponível; parceiros comerciais cadastram unidades consumidoras prospectadas; os consumidores aderem à associação, cooperativa ou consórcio e locam a fração correspondente à sua demanda. Os créditos não são objeto de compra e venda: são o resultado regulatório da geração e da alocação no SCEE.

Recomendação: começar como uma plataforma B2B2B2C de capacidade, originação e gestão de geração compartilhada. Geradores/gestoras oferecem quotas locáveis de múltiplas usinas; parceiros comerciais originam os consumidores; a plataforma valida compatibilidade, formaliza adesão e locação e acompanha as alocações. O fechamento ocorre por contrato de locação de quota e termo de adesão ao arranjo associativo.

## 1. O que existe hoje

### Pontos positivos

- Identidade visual profissional e proposta compreensível.
- Jornadas separadas para consumidor e fornecedor.
- Formulários com validação no navegador.
- Painel administrativo para acompanhar cadastros.
- Simulador simples que ajuda a converter visitantes.
- Base Next.js, TypeScript, Tailwind, Prisma e PostgreSQL adequada para evoluir um MVP.
- Build de produção concluído com sucesso.

### O que ainda não existe

- Cadastro de usinas/ativos geradores e sua documentação regulatória.
- Área de concessão/distribuidora como restrição obrigatória do matching.
- Curva de geração histórica e previsão mensal.
- Capacidade efetivamente disponível para novas alocações.
- Demanda mensal baseada no histórico de 12 faturas.
- Motor de matching, apesar de o site anunciar um “algoritmo”.
- Oferta comercial, adesão, aceite e assinatura.
- Entidade de cooperativa, consórcio, associação ou outro arranjo de geração compartilhada.
- Cadastro separado de parceiros comerciais e vínculo de autoria de cada prospect.
- Quotas/frações locáveis de cada usina e seus respectivos contratos.
- Gestão das listas e percentuais de alocação enviados às distribuidoras.
- Reconciliação entre geração, crédito alocado, fatura e economia realizada.
- Cobrança, repasse, inadimplência e conciliação.
- Portal do consumidor e portal do gerador.
- Trilha de auditoria e versionamento de documentos/consentimentos.

O banco atual possui apenas `Cliente` e `Fornecedor`. “Fornecedor” contém um volume em kWh e distribuidoras em texto livre, o que é insuficiente para verificar elegibilidade ou executar alocação.

## 1.1. Modelo operacional confirmado

O produto possui quatro lados principais:

1. **Fornecedor/gerador:** cadastra uma organização, uma ou mais usinas e a capacidade locável disponível em cada uma.
2. **Parceiro comercial:** cadastra e acompanha seus prospects/unidades consumidoras, preservando autoria, território, comissão e estágio comercial.
3. **Consumidor beneficiário:** adere ao arranjo de geração compartilhada e firma a locação da quota da usina dimensionada para seu perfil.
4. **Operador da associação/gestora:** controla documentos, adesões, quotas, listas de alocação e relacionamento com a distribuidora.

A plataforma não transfere nem negocia créditos. Ela organiza a oferta de capacidade física/econômica de sistemas de geração, o pipeline de consumidores, a adesão associativa, a locação das quotas e a operação das alocações decorrentes.

## 2. Enquadramento regulatório

### SCEE/GD não é o mesmo que Mercado Livre/ACL

O site mistura dois produtos diferentes:

- **Geração distribuída compartilhada / energia por assinatura:** funciona no SCEE, normalmente para consumidores cativos que recebem compensação na fatura da distribuidora.
- **Mercado Livre de Energia (ACL):** envolve compra e venda contratual de energia, comercializadores, regras da CCEE e, atualmente, está disponível a todos os consumidores do Grupo A. A Lei nº 15.269/2025 determinou um cronograma futuro para abertura da baixa tensão.

Para o MVP, a recomendação é trabalhar exclusivamente com geração compartilhada e deixar uma futura frente de ACL separada, preferencialmente por parceria com comercializadora habilitada.

### Regras que devem entrar no produto

- A geração compartilhada reúne consumidores em consórcio, cooperativa, condomínio ou outra associação civil instituída para essa finalidade.
- Todas as unidades beneficiárias precisam ser atendidas pela mesma distribuidora da unidade geradora. “Mesmo estado” ou “região nacional” não basta.
- Os créditos têm validade de 60 meses.
- A alocação é definida pelo titular da unidade geradora por percentual ou ordem de prioridade.
- Consumidores de baixa tensão continuam pagando o custo de disponibilidade; iluminação pública, tributos e outras parcelas também podem permanecer.
- A economia depende da data de conexão da usina, regra tarifária aplicável, distribuidora, perfil de consumo, geração, sazonalidade e componentes compensáveis.
- A Lei nº 14.300 e a REN ANEEL nº 1.000/2021, alterada pelas REN nº 1.059/2023 e nº 1.098/2024, devem ser tratadas como requisitos do domínio.

### Consequência para a comunicação

Evitar:

- “Compre créditos de qualquer gerador”.
- “Venda seus créditos para qualquer consumidor”.
- “Atendimento em todo o Brasil” sem disponibilidade por distribuidora.
- “20% a 35% de desconto real na conta” como promessa geral.
- “Fornecedores certificados” sem processo verificável de qualificação.

Preferir:

- “Encontre uma quota de usina compatível com sua distribuidora.”
- “Conectamos unidades consumidoras a geradores e gestoras por meio de geração compartilhada.”
- “Adesão associativa e locação de quota de sistema de geração.”
- “A economia é estimada após análise da fatura, disponibilidade e regras da distribuidora.”
- “Adesão sujeita à validação documental e regulatória.”

Concorrentes maduros costumam comunicar até 15% de economia na conta total ou até 25% sobre a parcela de energia, deixando claro que o resultado varia. A promessa atual de 20% a 35% sobre a conta precisa de comprovação por cenário ou deve ser reduzida.

## 3. Produto recomendado

### Proposta de valor

**Para consumidores:** descobrir se existe quota locável de uma usina compatível com sua distribuidora, aderir ao arranjo associativo, acompanhar a alocação decorrente e verificar a economia.

**Para geradores/gestoras:** cadastrar várias usinas, ocupar capacidade locável, organizar quotas, controlar adesões, alocações e desempenho por unidade consumidora.

**Para parceiros comerciais:** cadastrar prospects, verificar elegibilidade, acompanhar conversão/ativação e receber comissionamento rastreável.

### Atores

1. Consumidor/unidade consumidora.
2. Gerador/usina.
3. Gestora do portfólio.
4. Cooperativa, consórcio ou associação.
5. Distribuidora.
6. Operador interno da plataforma.
7. Parceiro comercial/originador.
8. Parceiros jurídico e financeiro.

### Fluxo do consumidor

1. O consumidor ou parceiro comercial informa CEP/cidade, distribuidora, classe, consumo e valor médio.
2. Envia inicialmente apenas a conta de energia; CPF e documento ficam para a etapa de contratação.
3. A plataforma extrai dados da fatura e calcula consumo elegível.
4. O motor procura oferta da mesma distribuidora e com capacidade mensal.
5. O consumidor recebe proposta de locação de quota com valor, economia, parcelas não compensáveis, prazo de ativação, fidelidade e regras de saída.
6. Após aceite, ocorre KYC, assinatura da locação e adesão ao arranjo jurídico.
7. A inclusão é protocolada/operada perante a distribuidora.
8. O portal acompanha status, créditos, fatura e economia realizada.

### Fluxo do gerador/gestora

1. Cadastra empresa e responsáveis.
2. Cadastra quantas usinas possuir, cada uma com distribuidora, fonte, potência, modalidade, data de conexão, homologação e arranjo jurídico.
3. Importa geração histórica, capacidade total, capacidade já locada e capacidade disponível em kWh.
4. Publica quotas/frações disponíveis para novas locações e adesões.
5. Recebe candidatos qualificados e aprova propostas.
6. Acompanha contratos, listas de alocação, ativações e reconciliação mensal.

### Matching mínimo

Filtro obrigatório:

1. Mesma distribuidora.
2. Modalidade e entidade jurídica compatíveis.
3. Classe/subgrupo tarifário elegível.
4. Capacidade disponível no mês previsto de ativação.

Pontuação:

- aderência entre consumo e curva de geração;
- margem de segurança para evitar sobrealocação;
- economia líquida estimada;
- prazo de ativação;
- duração e condições contratuais;
- qualidade documental e operacional do gerador.

Não alocar 100% da média histórica sem simulação. Começar com uma faixa conservadora e ajustar mensalmente reduz saldo ocioso e frustração.

### Entidades necessárias no banco

- `Organization`
- `User` e `Role`
- `CommercialPartner`
- `Prospect`
- `LeadOwnership`
- `ConsumerUnit`
- `Bill` e `ConsumptionReading`
- `GeneratorPlant`
- `SharedGenerationEntity`
- `PlantQuota`
- `QuotaAvailability`
- `GenerationReading`
- `AvailableCapacity`
- `DemandProfile`
- `Match`
- `Offer`
- `AssociationMembership`
- `QuotaLeaseAgreement`
- `Agreement`
- `Allocation`
- `AllocationBatch`
- `CreditStatement`
- `Invoice`
- `Payment`
- `Document`
- `ConsentVersion`
- `AuditEvent`

## 4. Monetização

### Recomendação principal: SaaS + originação + gestão das locações

Cobrar de geradores e gestoras por um conjunto claro de serviços, mantendo o consumidor beneficiário gratuito na plataforma:

1. **Mensalidade da plataforma:** por portfólio, quantidade de usinas e faixa de unidades consumidoras ativas.
2. **Implantação:** configuração do portfólio, importação de dados, treinamento e parametrização.
3. **Taxa de originação/ativação:** cobrada quando a locação e adesão são formalizadas ou quando a unidade entra efetivamente em operação.
4. **White-label:** portal com marca da gestora/cooperativa.
5. **Serviços opcionais:** qualificação documental, assinatura, atendimento, conciliação e relatórios.
6. **Gestão de parceiros:** módulo de comissionamento, território, campanhas e produtividade dos originadores.

Esse desenho remunera software, originação e operação, sem caracterizar os créditos como mercadoria. A taxa pode ser fixa ou relacionada ao contrato de locação formalizado, mas não deve ser descrita como preço de compra/venda de créditos. A documentação contratual e tributária deve refletir com precisão a locação da quota e os serviços prestados.

### Hipótese inicial de preços para validação

Os valores abaixo são hipóteses de teste, não benchmark de mercado:

- Plano inicial: R$ 1.500/mês até 200 unidades ativas.
- Unidade adicional: R$ 6 a R$ 12 por mês.
- Implantação: R$ 3.000 a R$ 15.000, conforme integrações e migração.
- Ativação: R$ 30 a R$ 100 por unidade efetivamente aprovada.
- White-label/enterprise: preço negociado, com mínimo mensal.

Exemplo: uma gestora com 500 unidades poderia gerar aproximadamente R$ 5.500/mês de receita recorrente usando mensalidade de R$ 1.500 mais R$ 8 por unidade, além das ativações. A precificação deve ser validada em entrevistas com pelo menos 10 gestoras e geradores antes do desenvolvimento completo.

### Alternativas

- **Lead qualificado:** simples para começar, mas cria receita pouco recorrente e incentiva volume, não qualidade.
- **Success fee de locação/adesão:** alinhado ao modelo, desde que o evento, a base de cálculo, o beneficiário e a comissão do parceiro sejam definidos nos contratos.
- **Percentual do contrato de locação:** pode gerar boa recorrência, desde que a cobrança remunere intermediação/gestão e não seja apresentada como preço do crédito. Exige validação contratual e tributária.
- **Custódia/fatura unificada:** melhora a experiência, mas traz cobrança, inadimplência, conciliação e risco financeiro. Adiar até haver escala e estrutura jurídica.
- **Marketplace ACL:** oportunidade futura, mas deve usar parceiro comercializador/CCEE e produto separado.

## 5. Segurança, privacidade e confiabilidade

### Bloqueadores antes de captar dados reais

1. **Uploads públicos e não persistentes:** conta de luz e documento são gravados em `public/uploads`. Na Vercel, o filesystem de execução não é armazenamento permanente e o caminho público expõe documentos por URL. Migrar para storage privado com URLs assinadas, criptografia, política de retenção e controle de acesso.
2. **Autenticação insegura:** o cookie administrativo contém uma codificação reversível da senha. Substituir por autenticação com hash, sessão aleatória/assinada, expiração, rotação, rate limit e proteção contra tentativa de força bruta.
3. **Dependência vulnerável:** o projeto usa Next.js 14.2.5. A auditoria encontrou 2 vulnerabilidades em dependências de produção, incluindo 1 crítica diretamente no Next.js.
4. **API pública sem proteção:** formulários não possuem rate limit, CAPTCHA alternativo/honeypot, proteção contra abuso ou validação completa no servidor.
5. **Consentimento não obrigatório no servidor:** a API aceita cadastro mesmo com consentimentos falsos.
6. **Duplicidade e integridade:** CPF/e-mail não são únicos e faltam restrições e normalização.
7. **Coleta excessiva no topo do funil:** CPF e documento de identidade devem ser solicitados somente quando necessários para contratação.
8. **LGPD operacional:** falta definir base legal por finalidade, retenção, descarte, operador/controlador, canal do titular, suboperadores e registro de compartilhamento.

## 6. Melhorias de experiência e conteúdo

### Nova arquitetura pública

- `/` — proposta e escolha de jornada.
- `/energia-compartilhada` — produto para consumidores cativos.
- `/geradores` — produto para usinas e gestoras.
- `/disponibilidade` — consulta por CEP/distribuidora.
- `/como-funciona` — explicação operacional e regulatória.
- `/seguranca-e-privacidade` — confiança, armazenamento e tratamento de dados.
- `/mercado-livre` — página educativa/futura para ACL, sem misturar com GD.

### Home sugerida

Título: **A quota certa da usina, para a unidade consumidora certa.**

Subtítulo: **Geradores cadastram suas usinas e capacidade disponível; parceiros cadastram consumidores; a plataforma organiza associação, locação, ativação e acompanhamento.**

CTAs:

- **Ver disponibilidade para minha conta**
- **Tenho uma usina ou portfólio**

### Simulador

O simulador atual apenas multiplica a conta por um percentual selecionado. O novo simulador deve considerar:

- distribuidora e tarifa;
- classe/subgrupo;
- consumo mínimo/custo de disponibilidade;
- CIP e componentes não compensáveis;
- regra da usina e data de conexão;
- desconto contratual;
- sazonalidade da geração;
- capacidade disponível.

O resultado precisa separar “desconto sobre a parcela de energia” de “economia estimada na conta total”.

## 7. Roadmap recomendado

### Fase 0 — desenho jurídico e comercial (2 a 3 semanas)

- Escolher modelo: software para gestoras existentes ou operação própria de geração compartilhada.
- Obter parecer jurídico-regulatório e tributário.
- Definir contratos, responsabilidades, faturamento e tratamento LGPD.
- Entrevistar 10 geradores/gestoras e 15 consumidores.

### Fase 1 — tornar o site seguro e verdadeiro (2 a 4 semanas)

- Corrigir uploads, autenticação, dependências e validação de API.
- Revisar promessas e separar GD de ACL.
- Transformar o cadastro em funil de qualificação de duas etapas.
- Adicionar disponibilidade por distribuidora.

### Fase 2 — MVP de matching assistido (4 a 8 semanas)

- Modelar organizações, múltiplas usinas, parceiros, prospects, quotas, unidades consumidoras, capacidade e demanda.
- Criar matching por distribuidora e capacidade.
- Criar pipeline de locação, adesão, aceite e ativação, com autoria do parceiro comercial.
- Manter operação junto à distribuidora inicialmente manual e auditável.

### Fase 3 — SaaS operacional (8 a 16 semanas)

- Portal do gerador/gestora.
- Lotes de alocação e trilha de auditoria.
- Importação/reconciliação de faturas e geração.
- Indicadores de economia realizada, ocupação e créditos.
- Cobrança do SaaS e white-label.
- Comissões e relatórios de parceiros comerciais.

### Fase 4 — escala

- Integrações com distribuidoras quando disponíveis.
- OCR de faturas com validação humana.
- Otimização de alocação.
- Fatura unificada somente após estruturar risco financeiro.
- Produto ACL separado via parceiro habilitado.

## 8. Métricas de sucesso

- Leads qualificados por distribuidora.
- Taxa de match elegível.
- Tempo do cadastro à proposta.
- Tempo da assinatura à primeira compensação.
- Capacidade disponível versus alocada.
- Taxa de ativação aprovada pela distribuidora.
- Economia estimada versus realizada.
- Churn e inadimplência.
- Receita recorrente por gerador/gestora.
- Custo de aquisição por unidade ativada.
- Incidentes de privacidade e retrabalho documental.

## 9. Recomendação final

Construir uma infraestrutura de matching e gestão de locação de quotas para operações reais de geração compartilhada, começando com uma ou duas distribuidoras e geradores já homologados. A vantagem competitiva deve ser controlar múltiplas usinas, capacidade locável, origem comercial de cada consumidor, adesão, ativação, alocação e economia comprovada.

O caminho recomendado de monetização inicial é **SaaS para geradores/gestoras + implantação + taxa de originação/ativação das locações**, com um módulo transparente de comissões dos parceiros. Depois de validar operação e contratos, a plataforma pode adicionar gestão recorrente dos contratos de locação, white-label e conciliação financeira.

## Fontes principais

- [Lei nº 14.300/2022 — Marco Legal da MMGD e do SCEE](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2022/lei/l14300.htm)
- [ANEEL — Micro e Minigeração Distribuída](https://www.gov.br/aneel/pt-br/assuntos/geracao-distribuida)
- [REN ANEEL nº 1.059/2023](https://www2.aneel.gov.br/cedoc/ren20231059.pdf)
- [REN ANEEL nº 1.000/2021](https://www2.aneel.gov.br/cedoc/ren20211000.pdf)
- [Lei nº 15.269/2025 — Modernização do setor elétrico](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15269.htm)
- [MME/EPE — PDE 2035: MMGD e baterias](https://www.gov.br/mme/pt-br/assuntos/noticias/mme-e-epe-publicam-caderno-sobre-micro-e-minigeracao-distribuida-e-baterias-atras-do-medidor-no-pde-2035)
- [EPE — Uso sustentável da energia: modelos de negócio](https://www.epe.gov.br/sites-pt/publicacoes-dados-abertos/publicacoes/PublicacoesArquivos/publicacao-519/topico-626/Cartilha02_2024_v01%20%281%29.pdf)
- [MME — Cooperativas de geração compartilhada](https://www.gov.br/mme/pt-br/assuntos/secretarias/sntep/sistemas-de-energia-do-futuro/projetos-vitrine)
- [Exemplo público de contrato de locação de quota de sistema de geração](https://origoenergia.com.br/wp-content/uploads/2026/02/Contrato_de_Locacao_de_Quota_SGE_-_ORIGO_-1.pdf)
- [Nextron — referência de comunicação de energia por assinatura](https://nextronenergia.com.br/)
- [Órigo — referência de comunicação de geração compartilhada](https://parceiroorigo.com.br/)
