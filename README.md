# API Score Client - Node.js

Este projeto implementa um cliente para consumir uma API de consulta de crédito com limite de requisições. A implementação segue o padrão Decorator para adicionar comportamentos de controle de requisições e cache de respostas, lidando com as restrições da API.

## Estrutura do Projeto

```bash
├── src
│   ├── clients
│   │   ├── APIClient.js         # Cliente que consulta a API diretamente
│   │   ├── CachedClient.js      # Cliente que adiciona caching às consultas
│   │   ├── ControlledClient.js  # Cliente que controla a taxa de requisições
│   │   ├── DecoratorClient.js   # Classe abstrata para o padrão Decorator
│   ├── config.js                # Arquivo de configuração
│   └── app.js                   # Script principal de execução
├── tests
│   ├── scoreApi.test.js         # Testes automatizados para a API
├── package.json                 # Gerenciamento de dependências e scripts
├── README.md                    # Documentação do projeto
```

## Como Usar

### Requisitos
- Node.js >= 14.x
- npm ou pnpm

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/jeuchaves/padrao-decorator-na-pratica.git
```

2. Instale as dependências:

```bash
npm install
```

## Execução

Para rodar o script principal que faz consultas à API, utilize o comando:

```bash
node run start
```
Esse script faz requisições para a API de score usando uma lista de CPFs falsos e aplica controle de requisições e cache, evitando múltiplas requisições para o mesmo CPF em um curto intervalo de tempo.

## Testes

Para rodar os testes automatizados:

```bash
npm run test
```

Os testes verificam a funcionalidade da API e o comportamento correto para CPFs válidos, inválidos e o tratamento de limite de requisições da API.

## Padrão de Design: Decorator
O padrão Decorator foi utilizado para adicionar funcionalidades de controle de requisições e cache sem modificar diretamente a lógica do cliente base (APIClient). Isso permite que as funcionalidades adicionais sejam acopladas dinamicamente ao cliente, oferecendo uma solução modular e expansível.

### Componentes Principais
- **ScoreClient (Interface):** Define o contrato que todas as classes clientes devem seguir, ou seja, implementar um método getScore(cpf) que retorna o score de um usuário com base no CPF.

- **APIClient:** Implementa o cliente básico que consulta diretamente a API de score.

- **DecoratorClient:** Classe abstrata que implementa a interface ScoreClient e serve como base para decorar outros comportamentos. Recebe um cliente base para ser decorado.

- **CachedClient:** Estende DecoratorClient e adiciona cache às consultas de CPF, evitando chamadas repetidas desnecessárias para o mesmo CPF.

- **ControlledClient:** Estende DecoratorClient e implementa controle de taxa de requisições, garantindo que apenas uma requisição seja feita por segundo para evitar o erro 429 da API.

## Exemplo de Configuração Completa
A seguir está um exemplo de como configurar e instanciar um cliente completo, que usa controle de requisições e caching:

```javascript
const APIClient = require('./clients/APIClient');
const CachedClient = require('./clients/CachedClient');
const ControlledClient = require('./clients/ControlledClient');

const fullClient = new CachedClient(new ControlledClient(new APIClient()));
```
Essa configuração combina todos os decoradores: CachedClient para caching e ControlledClient para controle de requisições, em cima do cliente base APIClient que consulta a API diretamente.

## Casos de Testes
Os testes automatizados cobrem os seguintes cenários:

1. Consulta de CPF válido:
    - Verifica se a API retorna o score corretamente para um CPF válido.
    - Checa se o status da resposta é 200 e o score está entre 0 e 1000.

2. Consulta de CPF inválido:
     - Verifica se a API retorna o status 429 para um CPF inválido ou ausente.

3. Limite de requisições:
    - Verifica se, ao fazer duas requisições em menos de 1 segundo, a API retorna o erro 429 (Too Many Requests).
    - Garante que a classe ControlledClient respeita o limite de requisições por segundo.

## Bibliotecas Usadas

- **axios:** Para fazer requisições HTTP à API de score.
- **jest:** Framework de testes para rodar e validar os testes automatizados.
- **supertest:** Utilizado para simular requisições HTTP durante os testes.
- **Node.js:** Ambiente de execução para o código JavaScript no backend.

## Instalação das Dependências

```bash
npm install axios jest supertest
```

## Benefícios de Usar o Padrão Decorator

1. **Modularidade:** O padrão Decorator permite adicionar funcionalidades de forma incremental sem modificar a classe base. No caso deste projeto, funcionalidades como cache e controle de requisições foram adicionadas de forma independente.

2. **Expansibilidade:** Novos comportamentos podem ser facilmente adicionados através de novos decorators. Por exemplo, podemos adicionar um NormalizerClient que ajusta o score retornado.

3. **Reusabilidade:** Componentes como CachedClient e ControlledClient podem ser usados em outras partes do sistema, ou com outros clientes que implementem a mesma interface.

4. **Responsabilidade Única:** Cada classe no padrão Decorator tem uma responsabilidade clara e isolada, facilitando a manutenção e evolução do sistema.