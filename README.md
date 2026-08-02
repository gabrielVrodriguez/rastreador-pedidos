# Rastreador de Pedidos

Projeto pessoal para praticar Java e Spring Boot, vindo de uma experiência
prévia com Node.js e NestJS. Sistema simplificado de rastreamento de pedidos de
delivery: cadastro/login de usuário, criação de pedidos e acompanhamento do
status de entrega.

Backend concluído. Front-end (React + Vite + TypeScript + MUI) em
desenvolvimento.

## Stack

| Camada | Escolha |
|---|---|
| Linguagem | Java 21 |
| Framework | Spring Boot 4.1 |
| Build | Maven (via `mvnw`) |
| Persistência | SQLite + Spring Data JPA (Hibernate) |
| Segurança | Spring Security 7 + JWT |
| Testes | JUnit 5 + Mockito + JaCoCo |

## Pré-requisitos

- Java 21
- Variável de ambiente `JWT_SECRET` — uma string de pelo menos 32 caracteres,
  usada para assinar os tokens JWT.

## Como rodar

```bash
export JWT_SECRET="uma-chave-secreta-de-pelo-menos-32-caracteres"
./mvnw spring-boot:run
```

A API sobe em `http://localhost:8080`.

## Rodando os testes

```bash
./mvnw test
```

Gera relatório de cobertura em `target/site/jacoco/index.html`.

## Endpoints

**Públicos**

```
POST   /api/auth/register     cadastro de usuário
POST   /api/auth/login        login, devolve o token JWT
```

**Autenticados** (header `Authorization: Bearer <token>`)

```
POST   /api/orders              cria pedido
GET    /api/orders              lista todos os pedidos
GET    /api/orders/{id}         busca pedido por ID
PATCH  /api/orders/{id}/status  atualiza o status do pedido
```

## Máquina de status do pedido

```
RECEBIDO ──────► EM_PREPARO ──────► SAIU_PARA_ENTREGA ──────► ENTREGUE
   │                  │                     │
   └──────────────────┴─────────► CANCELADO ┘
```

`ENTREGUE` e `CANCELADO` são estados terminais — nenhuma transição é permitida
a partir deles.

## Decisões técnicas

- **Organização por feature** (`order/`, `auth/`, `security/`, `common/`) em
  vez de por camada técnica — reduz a navegação entre pastas para entender uma
  funcionalidade completa.
- **Máquina de transição de status no domínio** (`OrderStatus`), não na camada
  de service — mantém a regra de negócio mais importante do projeto isolada e
  testável sem depender de infraestrutura.
- **Autenticação stateless com JWT** em vez de sessão — API sem estado no
  servidor, mais simples de escalar horizontalmente.
- **SQLite** como banco — elimina a necessidade de infraestrutura externa para
  rodar o projeto localmente; a camada de persistência usa Spring Data JPA, o
  que tornaria a troca para outro banco relacional uma mudança de
  configuração, não de código.
