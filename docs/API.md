# Previsão da API

## 1. Configurações Globais (Nível Utilizador)

* `GET /settings` - Retorna as preferências do utilizador autenticado (moeda, tema).
* `PUT /settings` - Atualiza as preferências do utilizador.

## 2. Domínio e Contexto (Hierarquia do Perfil)

* `GET /profiles` - Lista os perfis do utilizador (ex: Pessoal, Casal).
* `POST /profiles` - Cria um novo perfil.
* `GET /profiles/:profileId/accounts` - Lista as contas de um perfil específico.
* `POST /profiles/:profileId/accounts` - Adiciona uma nova conta bancária.
* `GET /profiles/:profileId/categories` - Lista a árvore de categorias do perfil.
* `POST /profiles/:profileId/categories` - Cria uma categoria (com validação de loop `A != B -> A`).
* `GET /profiles/:profileId/tags` - Lista as tags do perfil.

## 3. O Motor Transacional (Foco do TP1 - Requisitos Obrigatórios)

Estas rotas contêm a lógica de negócio pesada e são a prioridade absoluta para a avaliação.

* `GET /profiles/:profileId/transactions`
  * Lista transações com suporte a filtros na query string (ex: `?accountId=123&type=EXPENSE&month=2026-03`).
* `GET /transactions/:id`
  * Retorna os detalhes de uma transação, incluindo as suas tags e informação de parcelamento.
* `POST /profiles/:profileId/transactions`
  * **Cria uma transação. Regras obrigatórias a programar neste endpoint:**
        1. Verificar se `account_id` e `category_id` pertencem ao mesmo `profileId`.
        2. Garantir que o valor recebido (`amount`) é convertido para número absoluto (positivo).
        3. Se o tipo for `TRANSFER`, validar se a conta de origem é diferente da conta de destino.
        4. Se pertencer a um plano de parcelas, validar se `installment_number <= total_parts`.
* `PUT /transactions/:id`
  * Atualiza a transação (re-aplicando todas as validações de segurança do `POST`).
* `DELETE /transactions/:id`
  * Remove a transação e as suas tags associadas (em cascata).

## 4. Funcionalidades Avançadas e Automação (Fase Pós-Curso / V2)

* `POST /profiles/:profileId/installments` - Cria o plano mestre e gera as N transações (parcelas) correspondentes na tabela de transações num único bloco (*transaction process*).
* `GET /profiles/:profileId/recurring` - Lista as assinaturas e contas fixas.
* `POST /profiles/:profileId/recurring` - Regista uma nova despesa recorrente.
* `GET /profiles/:profileId/budgets` - Lista os orçamentos e cruza com os gastos reais do mês atual.
* `POST /profiles/:profileId/budgets` - Define um teto de gastos (forçando o dia 1 do mês).
* `GET /profiles/:profileId/goals` - Lista as metas e calcula dinamicamente o `current_amount` somando as transferências feitas para a conta/categoria da meta.
