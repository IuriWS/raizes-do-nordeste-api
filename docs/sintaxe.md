# Sintaxe

Este documento define o padrão de escrita técnica usado na documentação da API.

## Padrão de nomes

- Rotas devem ser descritas com método HTTP, caminho e objetivo.
- Entidades devem usar nomes claros do domínio do restaurante.
- Campos de entrada e saída devem manter o mesmo nome usado no código.
- Exemplos JSON devem ser pequenos, válidos e diretamente executáveis em testes manuais.

## Comentários no código

- Comente regras de negócio, validações e decisões que não sejam óbvias pela leitura do método.
- Evite comentários que apenas repetem o nome da função ou da variável.
- Explique limites, filtros, cálculos e efeitos colaterais.
- Quando houver tratamento de erro, descreva o motivo do erro esperado.

## Documentação de rotas

Cada rota documentada deve informar:

- Objetivo da rota.
- Parâmetros de path, query e body.
- Exemplo de requisição.
- Exemplo de resposta de sucesso.
- Erros esperados.
- Regras de negócio aplicadas.

## Atualização

Sempre que uma rota, entidade, regra de negócio ou resposta mudar, atualize a documentação correspondente na mesma alteração.
