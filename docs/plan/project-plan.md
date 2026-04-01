# Documento 4: Planeamento Estratégico Passo a Passo

## Fase 1: Backend e Base de Dados (Sessões 1 a 4) - `CONCLUÍDO`

`Objetivo: Entrega TP1 (20% da nota) - Foco em Infraestrutura e Arquitetura`

* **Passo 1:** Criar o repositório no GitHub (Monorepo). Configurar a estrutura base do projeto com Node.js + Express, integralmente tipado com **TypeScript**.
* **Passo 2:** Criar o projeto no Supabase (PostgreSQL). Executar os scripts SQL definitivos contemplando 11 tabelas relacionais com chaves estrangeiras rigorosas e estratégia global de retenção de dados (*Soft Delete* via coluna `deleted_at`).
* **Passo 3:** Implementar o padrão *Controller-Service* para separar rotas da lógica de negócio. Desenvolver o CRUD completo para as 11 tabelas, validando regras de negócio e capturando erros com tipagem estrita (`error: unknown`).
* **Passo 4:** Configurar a orquestração local com **Docker e Docker Compose**, contentorizando o backend e preparando o terreno para o frontend com suporte a *hot-reload*.
* **Passo 5:** Documentar a API (Esquema SQL, Endpoints e Decisões de Arquitetura em `/docs`). Fazer o deploy da API no Render.com através do `Dockerfile` e recolher *screenshots* do Postman. **(Submeter TP1)**.

## Fase 2: Frontend MVP (Sessões 5 a 8) - `EM PROGRESSO`

`Objetivo: Entrega TP2 (20% da nota) - Foco na Interface e Consumo de Dados`

* **Passo 1:** Inicializar o projeto **Angular 21+** no monorepo. Configurar o *routing* para as páginas principais: Autenticação (Login/Registo), Dashboard (Visão Geral), Transactions (Listagem/Filtros) e Settings (Gestão de Tabelas Auxiliares).
* **Passo 2:** Construir a interface utilizando **CSS nativo** (Flexbox/Grid), garantindo um design responsivo, limpo e focado no utilizador (ODS 1).
* **Passo 3:** Criar os *Services* no Angular utilizando `HttpClient` para consumir a API contentorizada/em produção, garantindo que as Interfaces TypeScript do Frontend coincidem exatamente com as respostas do Backend.
* **Passo 4:** Implementar formulários reativos (*Reactive Forms*) dinâmicos com validações visuais instantâneas (ex: ocultar campos desnecessários consoante o tipo de transação selecionada).
* **Passo 5:** Fazer o deploy do frontend (Vercel). Gravar o vídeo de 30 segundos de demonstração. **(Submeter TP2)**.

## Fase 3: Integração, Polimento e Defesa (Sessões 9 a 12)

`Objetivo: Defesa Final (60% da nota) - Foco na Qualidade e CI/CD`

* **Passo 1:** Finalizar a autenticação (Supabase Auth - JWT) no frontend. O backend passará a extrair o `profile_id` dinamicamente do token do utilizador autenticado, garantindo isolamento total de dados.
* **Passo 2:** Escrever 3 testes unitários focados na validação lógica (ex: testar cálculos de parcelas ou formatação de dados) para cumprir o requisito de testes (`npm test`).
* **Passo 3:** Configurar o GitHub Actions para CI/CD (Lint + Build) garantindo a *badge* verde no repositório `main`.
* **Passo 4:** Fazer testes completos *end-to-end* com as versões do Frontend (Vercel) e Backend (Render) a comunicarem em ambiente de produção.
* **Passo 5:** Preparar a defesa técnica presencial. Formular respostas sólidas justificando a utilização do TypeScript, do Docker, do padrão de Soft Delete, e explicar como a escalabilidade futura lidaria com transações recorrentes (ex: *Cron Jobs* no Node.js).
