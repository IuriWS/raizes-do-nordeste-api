# Plano de Testes

| ID | Cenário | Endpoint | Método | Pré-condição | Entrada | Saída esperada | Evidência na collection |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T01 | Login válido | `/auth/login` | POST | Seed executado | Email e senha do CLIENTE | 200 com `accessToken` | T01 Login válido |
| T02 | Acesso sem token | `/pedidos` | GET | API online | Sem header Authorization | 401 com erro padrão | T02 Acesso sem token |
| T03 | Perfil sem permissão | `/produtos` | POST | Token CLIENTE | Produto válido | 403 com erro padrão | T03 Acesso com perfil sem permissão |
| T04 | Criar pedido válido | `/pedidos` | POST | Token CLIENTE e estoque disponível | Unidade, canal, itens e MOCK | 201 com pedido criado | T04 Criar pedido válido |
| T05 | Criar pedido sem canal | `/pedidos` | POST | Token CLIENTE | Body sem `canalPedido` | 422 com erro padrão | T05 Criar pedido sem canalPedido |
| T06 | Criar pedido com canal inválido | `/pedidos` | POST | Token CLIENTE | `canalPedido` inválido | 422 com erro padrão | T06 Criar pedido com canalPedido inválido |
| T07 | Produto inexistente | `/pedidos` | POST | Token CLIENTE | Produto inexistente | 404 | T07 Criar pedido com produto inexistente |
| T08 | Estoque insuficiente | `/pedidos` | POST | Token CLIENTE | Quantidade alta | 409 | T08 Criar pedido com estoque insuficiente |
| T09 | Pagamento aprovado | `/pagamentos/mock/:pedidoId` | POST | Pedido pendente | Resultado APROVADO | Pagamento APROVADO e pedido PAGO | T09 Pagamento mock aprovado |
| T10A | Preparar pagamento recusado | `/pedidos` | POST | Token CLIENTE e estoque disponível | Pedido APP separado | 201 com `pedidoRecusadoId` | T10A Preparar pedido para pagamento recusado |
| T10B | Pagamento recusado | `/pagamentos/mock/:pedidoRecusadoId` | POST | Pedido pendente distinto do aprovado | Resultado RECUSADO | Pagamento RECUSADO e estoque restaurado | T10B Pagamento mock recusado |
| T11 | Atualizar status | `/pedidos/:id/status` | PATCH | Token COZINHA ou GERENTE | Status EM_PREPARO | 200 com novo status | T11 Atualizar status para EM_PREPARO |
| T12 | Filtrar por canal | `/pedidos?canalPedido=TOTEM` | GET | Token válido | Query canalPedido | 200 com lista filtrada | T12 Consultar pedidos por canal |
| T13 | Consultar auditoria | `/auditoria` | GET | Token ADMIN ou GERENTE | Sem body | 200 com registros | T13 Consultar auditoria |
| T14 | Cadastro público sem perfil administrativo | `/auth/register` | POST | API online | Body sem `role` | 201 com usuário CLIENTE | Automatizado e2e |
| T15 | Cadastro público com perfil administrativo | `/auth/register` | POST | API online | Body com `role` | 422 com erro padrão | Automatizado e2e |
| T16 | Pagamento de pedido alheio | `/pagamentos/mock/:pedidoId` | POST | Dois clientes cadastrados | Cliente tenta pagar pedido de outro | 403 com erro padrão | Automatizado e2e |
| T17 | Cancelamento restaura estoque | `/pedidos/:id/cancelar` | DELETE | Pedido aguardando pagamento | Token do dono do pedido | 200 e estoque restaurado | Automatizado e2e |
| T18 | Pagamento após cancelamento | `/pagamentos/mock/:pedidoId` | POST | Pedido cancelado | Resultado APROVADO | 409 com erro padrão | Automatizado e2e |

## Distribuicao

- Positivos: T01, T04, T09, T10A, T10B, T11, T12, T13, T14, T17.
- Negativos: T02, T03, T05, T06, T07, T08, T15, T16, T18.

## Cobertura automatizada

A suite `npm run test:e2e` automatiza os principais cenários do plano:

- T01: login válido.
- T02: acesso sem token.
- T03: perfil sem permissão.
- T04: criação de pedido válido.
- T05: criação de pedido sem `canalPedido`.
- T09: pagamento mock aprovado.
- T10B: pagamento mock recusado com restauração de estoque em pedido separado.
- T12: filtro de pedidos por canal.
- T14 e T15: cadastro público limitado a CLIENTE.
- T16: bloqueio de pagamento de pedido alheio.
- T17 e T18: cancelamento restaura estoque e impede pagamento posterior.

Os demais cenários continuam documentados para execução manual via Postman ou futura ampliação da suite.
