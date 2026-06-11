# Sintaxe

Este documento define o padrao de escrita tecnica usado na documentacao da API.

## Padrao de nomes

- Rotas devem ser descritas com método HTTP, caminho e objetivo.
- Entidades devem usar nomes claros do dominio do restaurante universitario.
- Campos de entrada e saida devem manter o mesmo nome usado no codigo.
- Exemplos JSON devem ser pequenos, válidos e diretamente executáveis em testes manuais.

## Comentarios no codigo

- Comente regras de negócio, validações e decisões que não sejam óbvias pela leitura do método.
- Evite comentarios que apenas repetem o nome da funcao ou da variavel.
- Explique limites, filtros, calculos e efeitos colaterais.
- Quando houver tratamento de erro, descreva o motivo do erro esperado.

## Documentacao de rotas

Cada rota documentada deve informar:

- Objetivo da rota.
- Parametros de path, query e body.
- Exemplo de requisicao.
- Exemplo de resposta de sucesso.
- Erros esperados.
- Regras de negócio aplicadas.

## Atualizacao

Sempre que uma rota, entidade, regra de negócio ou resposta mudar, atualize a documentação correspondente na mesma alteração.
