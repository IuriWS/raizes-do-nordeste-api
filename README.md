# Raízes do Nordeste API

API REST em Node.js com NestJS para uma rede de lanchonetes. O projeto implementa autenticação JWT, perfis de acesso, unidades, produtos, cardápio, estoque, pedidos multicanal, pagamento mock, fidelidade, promoções e auditoria.

## Contexto de negócio

A rede atende pedidos por APP, TOTEM, BALCÃO, PICKUP e WEB. Cada pedido registra obrigatoriamente o campo `canalPedido`, permitindo rastrear a origem e filtrar consultas como `GET /pedidos?canalPedido=TOTEM`.

## Tecnologias

- Node.js
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- Bcrypt
- Swagger/OpenAPI
- Jest
- Docker Compose

## Arquitetura

O projeto organiza cada área em camadas:

- `api`: controllers HTTP e DTOs.
- `application`: regras de aplicação e orquestração.
- `domain`: regras puras do domínio quando aplicável.
- `prisma`: acesso ao banco via Prisma.
- `common`: guards, decorators e filtro global de erro.

## Requisitos funcionais

- Cadastro e login de usuários.
- Controle de perfis: ADMIN, GERENTE, COZINHA, ATENDENTE e CLIENTE.
- Gestão de unidades, produtos, cardápio e estoque.
- Criação de pedidos com `canalPedido` obrigatório.
- Filtro de pedidos por canal.
- Pagamento mock aprovado ou recusado.
- Atualização de status do pedido.
- Restauração de estoque quando o pagamento é recusado ou o pedido é cancelado antes da entrega.
- Programa de fidelidade com consentimento.
- Promoções e auditoria.

## Requisitos não funcionais

- Senhas com hash bcrypt.
- Endpoints protegidos por JWT.
- Autorização por perfil.
- Cadastro público limitado ao perfil CLIENTE.
- Erros padronizados em JSON.
- Documentação Swagger em `/api/docs`.
- Seed inicial para testes manuais.
- Cuidados básicos com dados pessoais.

## Configuração

### Docker no WSL

Para subir banco e API juntos pelo WSL:

```bash
docker compose up --build -d
docker compose exec api npm run prisma:seed
```

A API fica disponível em `http://localhost:3000` e o Swagger em `http://localhost:3000/api/docs`.

### Execução local

1. Copie `.env.example` para `.env`.
2. Suba o banco:

```bash
docker compose up -d
```

3. Instale dependências:

```bash
npm install
```

4. Gere o Prisma Client:

```bash
npm run prisma:generate
```

5. Rode migrations:

```bash
npm run prisma:migrate -- --name init
```

6. Rode o seed:

```bash
npm run prisma:seed
```

7. Inicie a API:

```bash
npm run start:dev
```

## Swagger

Com a API em execução, acesse:

```text
http://localhost:3000/api/docs
```

## Usuários seedados

| Perfil | Email | Senha |
| --- | --- | --- |
| ADMIN | admin@raizes.com | Admin@123 |
| GERENTE | gerente@raizes.com | Gerente@123 |
| COZINHA | cozinha@raizes.com | Cozinha@123 |
| ATENDENTE | atendente@raizes.com | Atendente@123 |
| CLIENTE | cliente@raizes.com | Cliente@123 |

## Fluxo principal para testar

1. Fazer login em `POST /auth/login` com `cliente@raizes.com`.
2. Criar pedido em `POST /pedidos` com `canalPedido`, `unidadeId`, `formaPagamento` e itens.
3. Processar pagamento em `POST /pagamentos/mock/:pedidoId` com resultado `APROVADO` ou `RECUSADO`.
4. Consultar pedidos em `GET /pedidos`.
5. Filtrar pedidos por canal em `GET /pedidos?canalPedido=TOTEM`.
6. Atualizar status com GERENTE ou COZINHA em `PATCH /pedidos/:id/status`.
7. Consultar auditoria com ADMIN ou GERENTE em `GET /auditoria`.

## Collection Postman

Arquivos:

- `postman/raizes-do-nordeste.postman_collection.json`
- `postman/raizes-do-nordeste.postman_environment.json`

Importe os dois no Postman, rode o login e use o token retornado na variável `accessToken`.

## Documentação

- Documentação técnica: `docs/`.
- Endpoints: `docs/endpoints.md`.
- Plano de testes: `docs/plano-testes.md`.
- Checklist final: `docs/checklist-final.md`.
- Diagramas Mermaid: `docs/diagramas/`.
- Diagramas renderizados: `docs/diagramas/renderizados/`.
- DER em imagem/PDF: `docs/diagramas/renderizados/der.png` e `docs/diagramas/renderizados/der.pdf`.
- PDF final: `docs/pdf/trabalho-final.pdf`.

## Testes

```bash
npm test
npm run test:e2e
```

Os testes unitários cobrem regras puras de fidelidade. Os testes e2e cobrem autenticação, cadastro público, autorização, criação de pedido, posse de pagamento, cancelamento, estoque, filtro por canal e saldo de fidelidade.

## Pacote de entrega

Para gerar um zip limpo sem dependências instaladas, build local ou arquivos de uso local:

```bash
npm run package:delivery
```

O arquivo será gerado em `entrega/raizes-do-nordeste-api-entrega.zip`.

## Decisões técnicas

- O pagamento é mockado e não chama provedor externo.
- A criação do pedido reserva estoque imediatamente.
- Se o pagamento for recusado ou o pedido for cancelado antes da entrega, o estoque reservado é restaurado.
- Pagamento mock só processa pedidos em `AGUARDANDO_PAGAMENTO` com pagamento `PENDENTE`.
- Clientes só podem consultar ou processar pagamentos dos próprios pedidos.
- A fidelidade só pontua clientes com consentimento ativo.
- O desconto de fidelidade é conceitual: 100 pontos equivalem a R$ 10,00. A regra pode evoluir para cupom real.
- Respostas nunca retornam `senhaHash`.

## Segurança e LGPD

- Senhas são armazenadas com bcrypt.
- JWT protege endpoints autenticados.
- Perfis controlam permissões por rota.
- Cadastro público não aceita perfil administrativo.
- Dados pessoais são mínimos para o estudo de caso.
- Fidelidade exige consentimento explícito.
- Auditoria registra ações sensíveis.
- Payloads sensíveis não são expostos em endpoints públicos.
- Retenção e anonimização devem ser ajustadas conforme política real da empresa.

## Estrutura de pastas

```text
src/
  common/
  modules/
    auth/
    usuarios/
    unidades/
    produtos/
    estoque/
    pedidos/
    pagamentos/
    fidelidade/
    promocoes/
    auditoria/
  prisma/
prisma/
  schema.prisma
  seed.ts
docs/
postman/
```

## Propostas futuras

- Pagamento real com provedor externo.
- Cupons e benefícios reais para fidelidade.
- Painel administrativo.
- Relatórios por canal de venda.
- Testes e2e com banco isolado.
