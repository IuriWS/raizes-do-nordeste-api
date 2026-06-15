# API

Este documento resume as regras operacionais de rotas, autenticação, payloads e erros da API.

## Base URL local

```text
http://localhost:3000
```

## Autenticação

Use `POST /auth/login` para obter `accessToken`. Nos endpoints protegidos, envie:

```text
Authorization: Bearer <accessToken>
```

## Perfis

- ADMIN: acesso administrativo completo.
- GERENTE: gerencia catálogo, estoque, pedidos, promoções e auditoria.
- COZINHA: consulta pedidos e atualiza preparo.
- ATENDENTE: cria pedidos de balcão e consulta pedidos.
- CLIENTE: cria e consulta os próprios pedidos e fidelidade.

## Pedido multicanal

`canalPedido` é obrigatório na criação de pedido. Valores válidos:

- APP
- TOTEM
- BALCAO
- PICKUP
- WEB

Filtro por canal:

```text
GET /pedidos?canalPedido=TOTEM
```

## Status de pedido

Fluxo principal:

```text
AGUARDANDO_PAGAMENTO -> PAGO -> EM_PREPARO -> PRONTO -> ENTREGUE
```

Fluxos alternativos:

```text
AGUARDANDO_PAGAMENTO -> PAGAMENTO_RECUSADO
AGUARDANDO_PAGAMENTO/PAGO/EM_PREPARO/PRONTO -> CANCELADO
```

Pagamento mock só processa pedidos em `AGUARDANDO_PAGAMENTO` com pagamento `PENDENTE`.

## Erros

Todas as falhas usam o formato:

```json
{
  "error": "ERROR_NAME",
  "message": "Mensagem legivel.",
  "details": [],
  "timestamp": "2026-02-05T12:00:00.000Z",
  "path": "/rota",
  "requestId": "uuid-opcional"
}
```

## Documentação interativa

Swagger fica em:

```text
/api/docs
```
