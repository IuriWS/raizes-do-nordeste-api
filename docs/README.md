# Documentacao do Projeto

Esta pasta concentra a documentacao tecnica da API back-end do estudo de caso de restaurante universitario.

## Indice

- `documentacao.md`: politica de documentacao, comentarios e atualizacao tecnica.
- `sintaxe.md`: padrao de escrita para rotas, exemplos e comentarios.
- `fluxo-pratico-ia.md`: fluxo pratico para apoio de IA sem expor detalhes internos.
- `endpoints.md`: catalogo de endpoints e padrao de erro.
- `api.md`: regras operacionais da API.
- `auth.md`: autenticacao, autorizacao, tokens e posse de recurso.
- `database.md`: comandos e cuidados de banco.
- `deploy.md`: deploy local com Docker Compose.
- `env.md`: variaveis de ambiente da API e do Compose.
- `rollback.md`: recuperacao local apos falha de deploy, banco ou seed.
- `entrega.md`: geracao do pacote limpo para envio.
- `persistencia-vendor-first.md`: persistencia, migrations e transacoes criticas.
- `testes.md`: testes automatizados, checks e validacao manual.
- `checklist-final.md`: conferencia final antes de entregar ou apresentar.
- `lgpd-seguranca.md`: seguranca, dados pessoais e consentimento.
- `seguranca.md`: controles tecnicos de seguranca.
- `plano-testes.md`: cenarios positivos e negativos.
- `trabalho-academico.md`: estrutura pronta para entrega academica.
- `pdf/trabalho-final.pdf`: trabalho academico renderizado em PDF.
- `diagramas/`: diagramas Mermaid do projeto.
- `diagramas/renderizados/`: imagens e PDF gerados a partir dos diagramas.

## Regras gerais

- A documentacao deve explicar o funcionamento da API de forma suficiente para desenvolvimento, teste e manutencao.
- Comentários no código devem explicar regras de negócio, validações e decisões técnicas relevantes.
- Documentos públicos, README, exemplos e comentários não devem citar ferramentas internas nem processos internos.
- Alteracoes de comportamento devem atualizar documentacao e exemplos na mesma mudanca.
