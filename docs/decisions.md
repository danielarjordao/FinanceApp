# Documento de Decisões de Arquitetura (Backend)

**Projeto:** Gestor de Finanças Pessoais (SaaS)
**Foco:** ODS 1 (Erradicação da Pobreza)
**Fase:** V1 (MVP)

Este documento justifica as escolhas tecnológicas e estruturais estabelecidas na infraestrutura do backend para garantir segurança, escalabilidade e velocidade de desenvolvimento dentro do prazo estipulado para a entrega do TP2.

## 1. Estrutura de Repositório (Monorepo)

* **Decisão:** Manter as pastas `backend` e `frontend` (e respetiva documentação) na mesma raiz do repositório Git.
* **Justificação:** Reduz a fricção na gestão de dependências de integração. Permite que um único *commit* represente o estado completo da aplicação (front + back). Facilita substancialmente a configuração futura de *pipelines* de CI/CD.

## 2. Motor de Execução e Linguagem (Node.js + Express + TypeScript)

* **Decisão:** Utilização do Node.js (v24+) com o framework Express, integralmente tipado com TypeScript.
* **Justificação:** O TypeScript foi introduzido para garantir tipagem estática, eliminando erros em tempo de execução (*runtime errors*) e garantindo que os contratos de dados (Interfaces) entre o Backend e o Angular (Frontend) sejam 100% compatíveis. O Express garante a entrega rápida dos endpoints RESTful sem o excesso de configuração ou *boilerplate* de frameworks mais pesados.

## 3. Padrão de Arquitetura (Controller-Service Pattern)

* **Decisão:** Separação estrita de responsabilidades utilizando Rotas (`routes`), Controladores (`controllers`) e Serviços (`services`).
* **Justificação:** Aplicação direta do princípio *Single Responsibility* (do SOLID). Os *Controllers* são responsáveis apenas por receber a requisição HTTP e validar dados (*fail-fast*), enquanto os *Services* contêm exclusivamente a lógica de negócio e as *queries* à base de dados. Isto torna o código altamente modular, testável e fácil de manter.

## 4. Padronização de Interfaces e DTOs

* **Decisão:** Utilização do padrão `Create...DTO` para dados de entrada e `...Response` para dados de saída, com proibição absoluta do tipo `any`.
* **Justificação:** Garante previsibilidade estrita. O Frontend sabe exatamente que propriedades enviar e o que vai receber. Evita que o TypeScript falhe ao mapear os dados devolvidos pelo Supabase, assegurando a integridade dos objetos (ex: garantindo que um `InstallmentPlanResponse` nunca se mistura com um `TransactionResponse`).

## 5. Estratégia de Retenção de Dados (Soft Delete)

* **Decisão:** Nenhuma entidade principal é apagada fisicamente da base de dados (`DELETE FROM`). Em vez disso, utiliza-se a coluna `deleted_at` com *timestamps*.
* **Justificação:** Sendo um sistema financeiro, o histórico de dados é crítico. O *Soft Delete* previne a perda acidental de dados em cascata, mantém a integridade dos relatórios e cálculos passados (Dashboard) e permite a recuperação de informações caso o utilizador cometa um erro destrutivo.

## 6. Base de Dados e Integração (Supabase / PostgreSQL)

* **Decisão:** Uso do SDK `@supabase/supabase-js` para ligar a API diretamente a uma base de dados relacional PostgreSQL gerida com 11 tabelas.
* **Justificação:** Finanças exigem integridade transacional rigorosa (ACID). A base de dados foi desenhada com chaves estrangeiras (*Foreign Keys*) fortes para garantir a consistência relacional. Na fase MVP, optou-se por focar na lógica relacional através do backend, planeando a ativação de políticas de segurança ao nível da linha (*Row Level Security* - RLS) diretamente no Supabase para a fase de produção.

## 7. Padronização de Nomenclatura CRUD

* **Decisão:** Todas as funções internas de *Services* e *Controllers* partilham a mesma taxonomia: `create`, `read`, `update` e `delete`.
* **Justificação:** Melhora drasticamente a *Developer Experience* (DX) e a legibilidade do código. Qualquer *developer* que entre no projeto sabe imediatamente como invocar uma operação, independentemente do domínio (seja `profiles`, `budgets` ou `transactions`).

## 8. Segurança e Tratamento de Erros (Tratamento Limpo)

* **Decisão:** Uso de variáveis de ambiente (`dotenv`) para ocultar chaves, e tratamento de erros rigoroso utilizando `error: unknown` no TypeScript.
* **Justificação:** 1. **Proteção de Segredos (`dotenv`):** A *Service Role Key* do Supabase funciona como a "chave do cofre" do projeto. O uso do `.env` (ignorado pelo Git) garante que credenciais de produção nunca sejam expostas no GitHub.
  2. **Tratamento de Erros:** O uso de `unknown` em vez de `any` obriga o código a inspecionar a natureza do erro. Em vez de o servidor quebrar ou enviar uma *stack trace* perigosa para o cliente, o backend devolve *payloads* higienizados (ex: `{ "status": "error", "message": "Missing required fields" }`), garantindo uma excelente UX no Frontend.

## 9. Sistema de Módulos (ES Modules)

* **Decisão:** Adoção do standard moderno ES Modules (`"type": "module"` utilizando sintaxe `import`/`export`).
* **Justificação:** Alinha perfeitamente a sintaxe do ecossistema backend com a sintaxe exigida nativamente pelo Angular no frontend, oferecendo melhor isolamento de escopo temporal e resolução assíncrona de dependências nativa no Node.js v24.

## 10. Estratégia de Versionamento (GitFlow)

* **Decisão:** Adoção do fluxo de trabalho *GitFlow* estruturado em três níveis de *branches*: `main`, `develop` e branches de funcionalidade (`feat/...`).
* **Justificação:** Demonstra maturidade profissional na gestão do ciclo de vida do código:
  * A branch `main` atua exclusivamente como o espelho do ambiente de **Produção**.
  * A branch `develop` serve como o ambiente de **Integração/Testes**, garantindo estabilidade antes de *releases*.
  * As branches `feat/` encapsulam o desenvolvimento de novas funcionalidades, permitindo isolamento de falhas e revisão através de *Pull Requests*.
