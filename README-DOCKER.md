# Docker Setup - Projeto Fortnite

Este projeto está configurado para rodar com Docker Compose, incluindo:
- **Backend**: Node.js/Express (porta 3000)
- **Frontend**: Angular com Nginx (porta 4200)
- **Banco de Dados**: MySQL 8.0 (porta 3307 externa, 3306 interna)

## Pré-requisitos

- Docker Desktop instalado e rodando
- Docker Compose instalado

## Como executar

### 1. Iniciar todos os serviços

```bash
docker-compose up --build
```

Este comando irá:
- Construir as imagens do backend e frontend
- Iniciar o MySQL
- Criar o banco de dados automaticamente
- Iniciar o backend e frontend

### 2. Acessar a aplicação

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **MySQL**: localhost:3307 (porta externa, para evitar conflito com MySQL local)

### 3. Parar os serviços

```bash
docker-compose down
```

Para remover também os volumes (dados do banco):

```bash
docker-compose down -v
```

## Estrutura dos serviços

### Backend (fortnite-backend)
- **Porta**: 3000
- **Variáveis de ambiente**: Configuradas no docker-compose.yml
- **Banco de dados**: Conecta automaticamente ao MySQL

### Frontend (projeto-fortnite)
- **Porta**: 4200 (mapeada para 80 no container)
- **Proxy**: Requisições `/api` são automaticamente redirecionadas para o backend

### MySQL
- **Porta externa**: 3307 (mapeada para 3306 interna)
- **Usuário root**: root
- **Senha**: 123456
- **Banco**: fortniteprojeto
- **Dados persistentes**: Armazenados no volume `mysql_data`
- **Nota**: A porta externa foi alterada para 3307 para evitar conflito com MySQL local na porta 3306

### Desenvolvimento Local (sem Docker)

Se preferir desenvolver localmente sem Docker:

1. **Backend**: 
   ```bash
   cd fortnite-backend
   npm install
   npm start
   ```
2. **Frontend**:
   ```bash
   cd projeto-fortnite
   npm install
   npm start
   ```
   
3. **MySQL**: Você precisará ter o MySQL instalado localmente e criar o banco `fortniteprojeto`.

### Porta já em uso
Se as portas 3000, 4200 ou 3307 estiverem em uso, você pode alterá-las no arquivo `docker-compose.yml`. A porta do MySQL foi configurada como 3307 externa para evitar conflito com MySQL local na porta 3306.

### Rebuild completo
Para reconstruir tudo do zero:

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```


