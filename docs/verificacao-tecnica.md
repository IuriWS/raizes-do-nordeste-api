# Verificação Técnica

Use esta lista para validar execução local, testes, documentação e empacotamento do projeto.

## Ambiente

- [ ] Copiar `.env.example` para `.env`, quando rodar fora do Docker Compose.
- [ ] Executar `npm install`.
- [ ] Executar `npm run prisma:generate`.
- [ ] Subir banco e API com `docker compose up --build -d`.
- [ ] Rodar seed com `docker compose exec api npm run prisma:seed`.
- [ ] Abrir Swagger em `http://localhost:3000/api/docs`.

## Validação técnica

- [ ] Executar `npm run lint`.
- [ ] Executar `npm run build`.
- [ ] Executar `npm test`.
- [ ] Executar `docker compose exec api npm run test:e2e`.
- [ ] Conferir login válido em `POST /auth/login`.
- [ ] Conferir que cadastro público não aceita `role`.
- [ ] Conferir criação de pedido com `canalPedido`.
- [ ] Conferir pagamento aprovado.
- [ ] Conferir pagamento recusado com estoque restaurado.
- [ ] Conferir cancelamento com estoque restaurado.
- [ ] Conferir bloqueio de pagamento de pedido de outro cliente.

## Documentação

- [ ] Ler `README.md`.
- [ ] Conferir `docs/endpoints.md`.
- [ ] Conferir `docs/api.md`.
- [ ] Conferir `docs/auth.md`.
- [ ] Conferir `docs/seguranca.md`.
- [ ] Conferir `docs/plano-testes.md`.
- [ ] Conferir `docs/relatorio-tecnico.md`.
- [ ] Conferir Swagger/OpenAPI em `/api/docs`.

## Postman

- [ ] Importar `postman/raizes-do-nordeste.postman_environment.json`.
- [ ] Importar `postman/raizes-do-nordeste.postman_collection.json`.
- [ ] Rodar T01 para salvar `accessToken`.
- [ ] Rodar T04 para salvar `pedidoId`.
- [ ] Rodar T09 para pagamento aprovado.
- [ ] Rodar T10A e T10B para pagamento recusado em pedido separado.

## Diagramas e relatório

- [ ] Conferir imagens em `docs/diagramas/renderizados`.
- [ ] Conferir DER em `docs/diagramas/renderizados/der.png`.
- [ ] Conferir DER em `docs/diagramas/renderizados/der.pdf`.
- [ ] Conferir PDF técnico em `docs/pdf/relatorio-tecnico.pdf`.

## Pacote

- [ ] Executar `npm run package:delivery`.
- [ ] Conferir `pacote/raizes-do-nordeste-api.zip`.
- [ ] Verificar que o pacote não inclui `node_modules`, `dist`, `.env`, temporários ou arquivos locais de validação.
