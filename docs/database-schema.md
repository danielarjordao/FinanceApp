# Esquema da Base de Dados (Database Schema)

O sistema utiliza PostgreSQL (gerido via Supabase) e é composto por 11 tabelas principais. 

A arquitetura foi desenhada com três pilares fundamentais:
1. **Segurança e Isolamento:** A entidade de autenticação principal (`auth.users`) é gerida internamente pelo Supabase Auth. Na nossa estrutura pública, o isolamento de dados ocorre através da tabela `profiles` (Workspaces), garantindo que cada query é filtrada pelo perfil ativo do utilizador.
2. **Soft Delete:** Implementado em quase todas as entidades (através da coluna `deleted_at`) para evitar a perda de rastreabilidade financeira e permitir auditoria (Estratégia de Compensação de Saldos).
3. **Rastreabilidade:** Utilização consistente das colunas `created_at` e `updated_at`.

## 1. Entidades Base e Configurações

### `profiles`
Gere os perfis ou "workspaces" associados a um utilizador autenticado (1 utilizador no Supabase Auth pode ter N perfis no sistema, ex: "Pessoal" e "Freelance").

| Coluna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | `uuid` | Chave Primária |
| `user_id` | `uuid` | Chave Estrangeira (Referência ao `auth.users` do Supabase) |
| `name` | `varchar` | Nome do perfil |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Última atualização |
| `deleted_at` | `timestamptz` | Soft delete (Nulo se ativo) |

### `user_settings`
Configurações globais e preferências do utilizador (Relação 1:1).

| Coluna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | `uuid` | Chave Primária |
| `user_id` | `uuid` | Chave Estrangeira (Auth) |
| `theme` | `varchar` | Ex: 'light', 'dark' |
| `currency` | `varchar` | Ex: 'EUR', 'BRL' |
| `language` | `varchar` | Ex: 'pt-PT', 'en-US' |
| `receive_notifications` | `boolean` | Notificações ativas |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Última atualização |

## 2. Cadastros Estruturais

### `accounts`
Contas bancárias, carteiras ou cartões de crédito. O saldo (`balance`) é recalculado e protegido pelo backend em cada operação de transação.

| Coluna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | `uuid` | Chave Primária |
| `profile_id` | `uuid` | Chave Estrangeira (Garante isolamento de dados) |
| `name` | `varchar` | Nome da conta |
| `type` | `text` | Ex: 'CHECKING', 'CREDIT' |
| `initial_balance` | `numeric` | Saldo inicial configurado |
| `balance` | `numeric` | Saldo atualizado automaticamente pelo sistema |
| `is_main_featured` | `boolean` | Conta principal em destaque |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Última atualização |
| `deleted_at` | `timestamptz` | Soft delete |

### `categories`
Categorias para classificar as transações. Suporta hierarquia e personalização visual da UI (coletada diretamente pelo Frontend).

| Coluna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | `uuid` | Chave Primária |
| `profile_id` | `uuid` | Chave Estrangeira |
| `name` | `varchar` | Nome da categoria |
| `type` | `varchar` | Ex: 'INCOME', 'EXPENSE' |
| `icon` | `text` | Identificador visual/ícone (Material Symbols) |
| `color` | `text` | Cor da categoria na UI em HEX |
| `parent_id` | `uuid` | Referência *Self-Join* para subcategorias |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Última atualização |
| `deleted_at` | `timestamptz` | Soft delete |

### `tags`
Etiquetas personalizadas para cruzamento de dados de forma não hierárquica.

| Coluna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | `uuid` | Chave Primária |
| `profile_id` | `uuid` | Chave Estrangeira |
| `name` | `varchar` | Nome da etiqueta |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Última atualização |
| `deleted_at` | `timestamptz` | Soft delete |

## 3. Operações Financeiras

### `transactions`
A entidade principal do sistema. Suporta operações simples e complexas (Transferências e Parcelamentos).

| Coluna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | `uuid` | Chave Primária |
| `account_id` | `uuid` | Chave Estrangeira (Conta afetada ou Origem) |
| `transfer_account_id` | `uuid` | Chave Estrangeira (Conta Destino - apenas para `TRANSFER`) |
| `category_id` | `uuid` | Chave Estrangeira |
| `installment_plan_id` | `uuid` | Refere a compra parcelada (se aplicável) |
| `installment_number` | `int4` | Número da parcela da transação |
| `type` | `varchar` | 'INCOME', 'EXPENSE', 'TRANSFER' |
| `amount` | `numeric` | Valor absoluto da transação |
| `date` | `date` | Data de competência da transação |
| `effective_date` | `date` | Data de liquidação (Opcional) |
| `description` | `text` | Descrição/Nota |
| `status` | `varchar` | 'COMPLETED', 'PENDING' |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Última atualização |
| `deleted_at` | `timestamptz` | Soft delete (Despoleta reversão de saldo) |

### `transaction_tags`
Tabela de junção (N:N) que liga Transações às suas Etiquetas.

| Coluna | Tipo | Notas |
| :--- | :--- | :--- |
| `transaction_id` | `uuid` | Chave Estrangeira (`CASCADE` Delete) |
| `tag_id` | `uuid` | Chave Estrangeira (`CASCADE` Delete) |

### `installment_plans`
Gestão de compras parceladas. Atua como o "pai" de múltiplas transações geradas no futuro.

| Coluna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | `uuid` | Chave Primária |
| `profile_id` | `uuid` | Chave Estrangeira |
| `description` | `text` | Descrição agregadora do plano |
| `total_parts` | `int4` | Número total de parcelas contratadas |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Última atualização |
| `deleted_at` | `timestamptz` | Soft delete |

### `recurring_transactions`
Configuração de assinaturas e contas fixas para automação de lançamentos futuros.

| Coluna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | `uuid` | Chave Primária |
| `profile_id` | `uuid` | Chave Estrangeira |
| `account_id` | `uuid` | Chave Estrangeira |
| `category_id` | `uuid` | Chave Estrangeira |
| `type` | `varchar` | 'INCOME', 'EXPENSE' |
| `amount` | `numeric` | Valor recorrente esperado |
| `frequency` | `varchar` | Ex: 'MONTHLY', 'WEEKLY' |
| `interval_value` | `int4` | Ex: A cada '1' mês |
| `start_date` | `date` | Data inicial do contrato/assinatura |
| `next_run_date` | `date` | Data da próxima geração de transação |
| `end_date` | `date` | Data limite (Opcional) |
| `description` | `text` | Descrição da assinatura |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Última atualização |
| `deleted_at` | `timestamptz` | Soft delete |

## 4. Planeamento Financeiro

### `budgets`
Orçamentos dinâmicos estabelecidos como limites de gastos por categoria e por mês.

| Coluna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | `uuid` | Chave Primária |
| `profile_id` | `uuid` | Chave Estrangeira |
| `category_id` | `uuid` | Chave Estrangeira |
| `limit_amount` | `numeric` | Valor máximo orçamentado |
| `month_date` | `date` | Mês/Ano de referência |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Última atualização |
| `deleted_at` | `timestamptz` | Soft delete |

### `goals`
Objetivos financeiros de médio/longo prazo (ex: "Fundo de Emergência", "Viagem").

| Coluna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | `uuid` | Chave Primária |
| `profile_id` | `uuid` | Chave Estrangeira |
| `title` | `varchar` | Nome da meta |
| `target_amount` | `numeric` | Valor financeiro a atingir |
| `deadline` | `date` | Prazo limite estipulado |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Última atualização |
| `deleted_at` | `timestamptz` | Soft delete |
