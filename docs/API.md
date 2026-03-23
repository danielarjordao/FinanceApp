# Documentação da API (v1) - Dashboard Finanças SaaS

**Nota de Arquitetura (Fase 1 vs Fase 3):** Atualmente, as rotas recebem o `profile_id` no corpo do pedido (JSON) ou por *query string* para facilitar os testes de desenvolvimento. Na Fase 3, a API será refatorada para extrair o identificador de utilizador de forma segura e invisível através do Token JWT (Supabase Auth) enviado no cabeçalho `Authorization`.

## 1. Configurações Globais (Nível Utilizador)

Alimenta o *Theme Toggle* e as preferências locais do UI.

* `GET /api/v1/settings` - Retorna as preferências do utilizador autenticado (moeda, tema Dark/Light).
* `PUT /api/v1/settings` - Atualiza as preferências do utilizador.

## 2. Domínio e Contexto (Perfis, Contas e Categorias)

Alimenta o *Profile Switcher*, a listagem de contas e as opções do formulário de transação.

* `GET /api/v1/profiles` - Lista os perfis associados ao utilizador (ex: Pessoal, Casal).
* `POST /api/v1/profiles` - Cria um novo espaço de trabalho/perfil.
* `GET /api/v1/accounts` - Lista as contas bancárias. **Retorna a coluna `balance` atualizada para alimentar o elemento tipográfico de destaque (Hero) no Dashboard.**
* `POST /api/v1/accounts` - Adiciona uma nova conta (requer `name` e opcionalmente o `type`, ex: CHECKING).
* `GET /api/v1/categories` - Lista a árvore de categorias. Suporta a identificação de macro/micro categorias através do `parent_id`.
* `POST /api/v1/categories` - Cria uma categoria (requer `name`, suporte a `icon` e restrição de `type` IN 'INCOME', 'EXPENSE').
* `GET /api/v1/tags` - Lista as tags do perfil para os filtros da *playlist-style layout*.
* `POST /api/v1/tags` - Cria uma nova tag.

## 3. O Motor Transacional (Foco do TP1 - Core CRUD)

Estas rotas contêm a lógica de negócio principal e garantem a integridade financeira antes de gravar na base de dados.

* `GET /api/v1/transactions`
  * Lista transações em formato *ledger*. Suporta filtros via *query string* (ex: `?accountId=123&type=EXPENSE&month=2026-03`).
* `GET /api/v1/transactions/:id`
  * Retorna os detalhes de uma transação específica.
* `POST /api/v1/transactions`
  * **Cria uma transação e atualiza o `balance` da conta associada.** Regras de validação ("Fail-Fast"):
    1. Conversão automática de `amount` para valor absoluto.
    2. Conversão automática de `type` para maiúsculas (INCOME, EXPENSE, TRANSFER).
    3. Se `TRANSFER`: rejeita se a origem e o destino forem iguais, e rejeita se incluir um `category_id`.
    4. Se `INCOME/EXPENSE`: exige `category_id` e proíbe `transfer_account_id`.
* `PUT /api/v1/transactions/:id`
  * Atualiza a transação, re-aplicando as validações do `POST` e recalculando os saldos das contas envolvidas.
* `DELETE /api/v1/transactions/:id`
  * Remove a transação e reverte o seu valor no saldo da conta (`balance`). Remove tags associadas em cascata.

## 4. Funcionalidades Avançadas e Automação (Fase 2 / Defesa)

Alimenta as secções de *Forecast*, *Goals*, *Budgets* e *Subscriptions*.

* `POST /api/v1/installments` - Cria o plano mestre e gera as N parcelas na tabela de transações num único bloco transacional.
* `GET /api/v1/recurring` - Lista assinaturas e contas fixas ativas.
* `POST /api/v1/recurring` - Regista uma nova despesa/receita recorrente.
* `GET /api/v1/budgets` - Lista os limites de gastos e cruza com as despesas reais do mês corrente.
* `POST /api/v1/budgets` - Define um novo orçamento para uma categoria específica.
* `GET /api/v1/goals` - Lista as metas de poupança com progresso dinâmico para visualização em gráficos circulares.
* `POST /api/v1/goals` - Cria uma nova meta com valor alvo e data limite.
