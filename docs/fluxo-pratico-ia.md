# Fluxo Pratico da IA

Este documento orienta como a IA deve apoiar a manutencao tecnica da API sem expor detalhes internos nos artefatos publicos do projeto.

## Antes de alterar

- Entenda o objetivo da mudanca e o modulo afetado.
- Leia os arquivos relacionados antes de propor edicoes.
- Preserve o estilo existente do projeto.
- Identifique documentacao que precisa acompanhar a mudanca.

## Durante a alteracao

- Mantenha mudancas pequenas e verificaveis.
- Adicione comentários explicativos apenas onde ajudam a entender regra de negócio, validação, fluxo de dados ou tratamento de erro.
- Nao inclua referencias a ferramentas internas, processos internos ou metadados operacionais em README, docs publicas, codigo-fonte ou comentarios.
- Use exemplos concretos quando documentar endpoints, payloads e respostas.

## Validacao

- Execute os testes ou checks disponiveis no projeto.
- Quando não houver suíte automatizada, registre a verificação manual feita.
- Confirme que a busca textual não encontra termos internos proibidos em documentação pública ou comentários de código.

## Entrega

- Informe arquivos alterados.
- Informe comandos executados.
- Informe qualquer validação que não foi possível executar.
