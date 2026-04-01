# Personal Finance Dashboard - Frontend

Este é o Frontend do Gestor de Finanças Pessoais (MVP). Uma aplicação Single Page Application (SPA) desenvolvida em Angular, focada em proporcionar uma experiência de utilizador fluida, reativa e segura para o controlo financeiro.

## Stack Tecnológica & Arquitetura

* **Framework:** Angular (Standalone Components)
* **Linguagem:** TypeScript
* **Gestão de Estado/Reatividade:** RxJS (Subjects, Observables)
* **Estilização:** CSS3 puro (Variáveis globais CSS, Grid, Flexbox, Glassmorphism) sem dependência de bibliotecas externas pesadas.
* **Segurança de Rotas:** Implementação estrita de Route Guards (`AuthGuard` para áreas privadas e `GuestGuard` para ecrãs de login).
* **Configuração de Ambiente:** Separação limpa de variáveis de ambiente (`environment.ts` / `environment.development.ts`) para gestão dinâmica do endpoint da API.

## Principais Funcionalidades Implementadas (V1)

* **Dashboard Global:** Resumo de saldos, receitas e despesas mensais, com layout responsivo.
* **Gestão de Workspaces (Profiles):** Alternância dinâmica entre diferentes perfis financeiros (ex: Pessoal vs. Freelance).
* **CRUD Completo e Reativo:** Gestão de Contas, Categorias e Transações utilizando formulários reativos do Angular (`ReactiveFormsModule`).
* **Filtros Avançados:** Barra de pesquisa universal e filtragem por mês, ano, conta, categoria e tipo.
* **UX/UI Consistente:** * Modais de confirmação globais (`ConfirmModalService`) para ações destrutivas.
  * *Loading Indicators* para feedback visual durante as chamadas HTTP.
  * Tratamento de navegação fluida preservando o estado da aplicação.
* **Settings:** Gestão de preferências do utilizador.

## Roadmap e Próximas Implementações

A aplicação foi desenhada com escalabilidade em mente. O código já contém os alicerces visuais e estruturais para as seguintes *features* (atualmente bloqueadas na UI para garantir a estabilidade do MVP):

* **Planeamento Financeiro:** Implementação dos módulos de Orçamentos (`budgets`), Metas (`goals`) e Previsões (`forecast`).
* **Transações Complexas:** Suporte para Compras Parceladas (`installments`) e Despesas Recorrentes (`recurring`).
* **Análise de Dados:** Módulo de análise histórica dos últimos 12 meses.
* **Hierarquia de Categorias:** Suporte nativo para categorias-pai e subcategorias para relatórios mais granulares.
* **UX Avançada:** Implementação de um sistema global de tratamento de erros no Dashboard com mensagens contextualizadas e robustas.

## Como Executar Localmente

### Pré-requisitos

* Ter o Node.js (v18+) instalado.
* Ter o Angular CLI instalado globalmente (`npm install -g @angular/cli`).

### Passos de Execução

#### 1. Clona o repositório e acede à pasta do frontend

```bash
git clone [teu-link-do-repo]
cd frontend
```

#### 2. Instala as dependências do projeto

```bash
npm install
```

#### 3. (Opcional) Verifica a configuração do ambiente

Garante que o ficheiro `src/environments/environment.development.ts` aponta para o teu backend local (ex: `http://localhost:3000/api/v1`).

#### 4. Inicia o servidor de desenvolvimento

```bash
ng serve
```

#### 5. Acede à aplicação

Abre o teu navegador em **`http://localhost:4200`**.
