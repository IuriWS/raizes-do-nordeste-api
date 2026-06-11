# Persistencia

O projeto usa PostgreSQL como banco principal e Prisma ORM como camada de acesso a dados.

## Regras

- Alteracoes estruturais devem partir de `prisma/schema.prisma`.
- Migrations ficam em `prisma/migrations`.
- O seed fica em `prisma/seed.ts`.
- Relacionamentos e enums devem ser mantidos no schema antes de uso nos services.
- Consultas de escrita critica devem usar transacao quando houver mais de uma tabela envolvida.

## Tabelas principais

- `usuarios`
- `clientes`
- `unidades`
- `produtos`
- `cardapios_unidade`
- `estoque`
- `movimentos_estoque`
- `pedidos`
- `itens_pedido`
- `pagamentos`
- `fidelidade`
- `movimentos_fidelidade`
- `promocoes`
- `auditoria`

## Transacoes criticas

- Criacao de pedido com itens, pagamento pendente, reserva de estoque e auditoria.
- Processamento de pagamento aprovado com pontuacao de fidelidade.
- Processamento de pagamento recusado com restauracao de estoque.
- Movimento manual de estoque com auditoria.

## Validacao

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
```
