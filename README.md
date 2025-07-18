

# Product Manager API

Este é um projeto de API para gerenciamento de produtos e categorias, construído com [NestJS](https://nestjs.com/), um framework Node.js progressivo para a construção de aplicações server-side eficientes e escaláveis.

## Como Rodar a Aplicação com Docker Compose

Para executar a aplicação localmente utilizando Docker, siga os passos abaixo.

### Pré-requisitos

- Docker e Docker Compose instalados em sua máquina.

### Passos

1.  **Copie o arquivo de variáveis de ambiente:**

    Faça uma cópia do arquivo de exemplo `.env.example` e renomeie para `.env`. Este arquivo contém as variáveis de ambiente necessárias para a aplicação.

    ```bash
    cp .env.example .env
    ```

2.  **Suba os containers Docker:**

    No diretório raiz do projeto, execute o seguinte comando para construir e iniciar os containers da aplicação, banco de dados e cache:

    ```bash
    docker-compose --env-file .env up -d --build
    ```

    Este comando irá:
    * Construir a imagem da aplicação NestJS.
    * Iniciar um container para a aplicação.
    * Iniciar um container para o banco de dados PostgreSQL.
    * Iniciar um container para o cache com Redis.
    * Executar as migrações do banco de dados para criar as tabelas necessárias.

3.  **Acesse a aplicação:**

    Após a inicialização dos containers, a API estará disponível em `http://localhost:3000`.

## Aspectos da Aplicação

A aplicação é estruturada com uma arquitetura limpa, separando as responsabilidades em diferentes camadas:

* **Domain**: Contém as entidades de negócio (`Product`, `Category`) e as regras de negócio.
* **Application**: Orquestra o fluxo de dados e contém os casos de uso (use cases) da aplicação, como criar, atualizar, buscar e deletar produtos e categorias.
* **Infrastructure**: É responsável pelos detalhes de implementação, como o banco de dados, cache e o framework web.
    * **Banco de Dados**: Utiliza o [Prisma](https://www.prisma.io/) como ORM para interagir com um banco de dados PostgreSQL. As migrações do banco de dados são gerenciadas pelo Prisma.
    * **Cache**: Usa [Redis](https://redis.io/) para cacheamento de respostas de endpoints, melhorando a performance. Um interceptor de cache foi implementado para automatizar o processo de cache e invalidação.
    * **Framework**: Construído com [NestJS](https://nestjs.com/), aproveitando seu sistema de módulos, injeção de dependência e decoradores.

A aplicação também inclui:

* **Validação de Dados**: Utiliza `class-validator` e `class-transformer` para validar e transformar os dados de entrada (DTOs).
* **Documentação da API**: Geração automática da documentação com [Swagger (OpenAPI)](https://swagger.io/) em ambiente de desenvolvimento, disponível em `/swagger`.
* **Testes**: O projeto possui testes unitários para os controllers, use cases e repositórios.

## Endpoints da API

A API possui versionamento de rotas, com a versão atual sendo a `v1`.

### Produtos

| Método | Caminho | Descrição |
| :--- | :--- | :--- |
| `GET` | `/products` | Retorna uma lista de todos os produtos. |
| `GET` | `/products/{id}` | Retorna um produto específico pelo seu ID. |
| `POST` | `/products` | Cria um novo produto. |
| `PATCH` | `/products/{id}` | Atualiza as informações de um produto existente. |
| `DELETE` | `/products/{id}` | Remove um produto pelo seu ID. |

### Categorias

| Método | Caminho | Descrição |
| :--- | :--- | :--- |
| `GET` | `/categories` | Retorna uma lista de todas as categorias. |
| `GET` | `/categories/{id}`| Retorna uma categoria específica pelo seu ID. |
| `POST` | `/categories` | Cria uma nova categoria. |
| `PATCH` | `/categories/{id}`| Atualiza as informações de uma categoria existente. |
| `DELETE` | `/categories/{id}`| Remove uma categoria pelo seu ID. |
