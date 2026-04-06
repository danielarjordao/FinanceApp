# Documento de Decisões de Arquitetura

Este documento justifica as escolhas tecnológicas e estruturais estabelecidas na infraestrutura do backend e frontend para garantir segurança, escalabilidade e manutenibilidade, cumprindo rigorosamente os requisitos do sistema financeiro.

## 1. Estrutura de Repositório (Monorepo)
* **Decisão:** Manter as pastas `backend` e `frontend` na mesma raiz do repositório Git.
* **Justificação:** Reduz a fricção na gestão de dependências. Permite que um único *commit* ou *Pull Request* represente a entrega de uma funcionalidade completa (front + back), simplificando a configuração do pipeline de CI/CD e a revisão de código.

## 2. Motor de Execução e Linguagem (TypeScript Full-Stack)
* **Decisão:** Utilização de TypeScript tanto no Frontend (Angular 21) como no Backend (Node.js 24+ com Express).
* **Justificação:** O TypeScript garante tipagem estática e elimina erros em tempo de execução (*runtime errors*). Ao partilhar a mesma linguagem, os contratos de dados (Interfaces/DTOs) entre a API e a UI são 100% compatíveis, acelerando o desenvolvimento. O Express garante a entrega rápida dos endpoints RESTful sem o excesso de *boilerplate*.

## 3. Padrão de Arquitetura (Controller-Service Pattern)
* **Decisão:** Separação estrita de responsabilidades no backend utilizando Rotas (`routes`), Controladores (`controllers`) e Serviços (`services`).
* **Justificação:** Aplicação direta do princípio *Single Responsibility* (SOLID). Os *Controllers* são responsáveis por intercetar a requisição HTTP e devolver respostas padronizadas. Os *Services* contêm exclusivamente a lógica de negócio e as *queries* à base de dados. Isto torna o código altamente modular e testável.

## 4. Estratégia de Retenção e Compensação (Soft Delete e Compensating Transactions)
* **Decisão:** Adoção de *Soft Delete* (coluna `deleted_at`) em vez de *Hard Delete* (`DELETE FROM`), combinada com atualizações de saldo compensatórias.
* **Justificação:** Em sistemas financeiros, a integridade do histórico é crítica. O *Soft Delete* previne a perda irreversível de dados. Para garantir que os saldos das contas batem sempre certo ao editar ou apagar uma transação passada, a API reverte matematicamente o saldo antigo e aplica o novo (Estratégia de Compensação), garantindo a verdade do dado sem necessidade de recalcular todo o histórico da conta.

## 5. Divisão de Responsabilidades UI vs. API
* **Decisão:** O Frontend trata exclusivamente da Experiência do Utilizador (UX) e validações visuais (Fail-fast via Reactive Forms), enquanto o Backend é a única fonte da verdade e de segurança.
* **Justificação:** Nunca se deve confiar no cliente. O frontend agrupa chamadas (*debounce* nos filtros) e esconde elementos apagados para uma navegação fluida, mas as regras de domínio (ex: impedir transferências para a mesma conta ou forçar recalculo de saldos) são trancadas no backend.

## 6. Base de Dados e Segurança de Dados (Supabase / PostgreSQL)
* **Decisão:** Uso do SDK `@supabase/supabase-js` ligado a um PostgreSQL relacional com isolamento de queries por `profile_id`.
* **Justificação:** Finanças exigem integridade transacional rigorosa (ACID). A nível de segurança na V1, o isolamento dos utilizadores é garantido pela filtragem estrita via `profile_id` nas rotas. *Roadmap:* A evolução natural desta arquitetura (V2) prevê o *enforcement* total de JWT no middleware do Express e a ativação de *Row Level Security* (RLS) diretamente no banco de dados.

## 7. Padronização de Interfaces e Tratamento de Erros
* **Decisão:** Uso do padrão `Create...DTO` para entrada, respostas padronizadas em JSON (`{ "status": "...", "data": "..." }`) e tratamento de erros rigoroso utilizando `error: unknown`.
* **Justificação:** O uso de `unknown` obriga à inspeção do erro. Em vez de o servidor quebrar ou devolver uma *stack trace* perigosa, a API devolve *payloads* higienizados. Isto evita a quebra de contrato e garante estabilidade no *parsing* do Angular.

## 8. Integração e Entrega Contínuas (CI/CD via GitHub Actions)
* **Decisão:** Implementação de workflows de CI/CD automatizados para validar cada *Push* e *Pull Request* na branch `main` e `develop`.
* **Justificação:** O pipeline de CI garante a qualidade do código correndo automaticamente `npm install`, `lint`, `build` e `test`. Evita a introdução de regressões no repositório. O CD (Continuous Deployment) permite que qualquer código validado no `main` seja publicado automaticamente e sem *downtime* no Vercel (Frontend) e Render (Backend).

## 9. Estratégia de Versionamento (GitFlow)
* **Decisão:** Adoção de um fluxo estruturado em *branches*: `main` (Produção), `develop` (Testes/Integração) e `feat/*` / `fix/*` (Desenvolvimento).
* **Justificação:** Garante estabilidade total da aplicação apresentada ao público. Funcionalidades inacabadas nunca afetam a *release* de produção, facilitando a revisão e a colaboração profissional.
