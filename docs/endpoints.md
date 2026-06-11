# Endpoints

Todos os endpoints, exceto login e registro, exigem `Authorization: Bearer <token>`.

## Auth

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/auth/login` | Autentica usuário e retorna JWT. |
| POST | `/auth/register` | Cadastra usuário. |

## Usuários

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/usuarios/me` | Retorna usuário autenticado. |
| GET | `/usuarios` | Lista usuários. Apenas ADMIN. |
| PATCH | `/usuarios/:id/status` | Ativa ou inativa usuário. Apenas ADMIN. |

## Unidades e cardápio

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/unidades` | Cria unidade. ADMIN ou GERENTE. |
| GET | `/unidades` | Lista unidades. |
| GET | `/unidades/:id` | Busca unidade. |
| PATCH | `/unidades/:id` | Atualiza unidade. ADMIN ou GERENTE. |
| GET | `/unidades/:unidadeId/cardapio` | Lista cardápio da unidade. |
| POST | `/unidades/:unidadeId/cardapio` | Adiciona produto ao cardápio. ADMIN ou GERENTE. |

## Produtos

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/produtos` | Cria produto. ADMIN ou GERENTE. |
| GET | `/produtos` | Lista produtos. |
| GET | `/produtos/:id` | Busca produto. |
| PATCH | `/produtos/:id` | Atualiza produto. ADMIN ou GERENTE. |

## Estoque

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/estoque?unidadeId=1` | Lista estoque da unidade. |
| POST | `/estoque/movimentos` | Registra entrada, saida ou estorno. |
| GET | `/estoque/:unidadeId/:produtoId` | Consulta estoque de um produto. |

## Pedidos

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/pedidos` | Cria pedido com canal obrigatorio. |
| GET | `/pedidos` | Lista pedidos. |
| GET | `/pedidos?canalPedido=TOTEM` | Lista pedidos filtrados por canal. |
| GET | `/pedidos/:id` | Busca pedido. |
| PATCH | `/pedidos/:id/status` | Atualiza status de preparo. |
| DELETE | `/pedidos/:id/cancelar` | Cancela pedido. |

## Pagamentos

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/pagamentos/mock/:pedidoId` | Processa pagamento mock aprovado ou recusado. |
| GET | `/pagamentos/:pedidoId` | Busca pagamento do pedido. |

## Fidelidade

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/fidelidade/saldo` | Consulta saldo do cliente autenticado. |
| GET | `/fidelidade/historico` | Consulta histórico de movimentos de fidelidade. |
| POST | `/fidelidade/resgatar` | Registra resgate conceitual de pontos. |

## Promoções e auditoria

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/promocoes` | Cria promoção. ADMIN ou GERENTE. |
| GET | `/promocoes` | Lista promoções. |
| PATCH | `/promocoes/:id` | Atualiza promoção. ADMIN ou GERENTE. |
| GET | `/auditoria` | Lista registros de auditoria. ADMIN ou GERENTE. |

## Erro padrao

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Dados inválidos.",
  "details": [
    {
      "field": "canalPedido",
      "issue": "canalPedido must be a valid enum value"
    }
  ],
  "timestamp": "2026-02-05T12:00:00.000Z",
  "path": "/pedidos",
  "requestId": "uuid-opcional"
}
```
