## Rodar Localmente com Docker

Este e o caminho mais estavel para validar o SaaS sem depender de Vercel, Render ou Railway.

### 1. Subir backend + banco

No diretorio raiz do projeto:

```bash
cd /Users/getulio/workspace/system
docker compose -f docker-compose.prod.yml up --build
```

Isso sobe:

- PostgreSQL em container
- API Spring Boot em `http://localhost:8080`

### 2. Validar a API

Teste no navegador:

```text
http://localhost:8080/actuator/health
```

O esperado e uma resposta com status `UP`.

### 3. Rodar o frontend

Em outro terminal:

```bash
cd /Users/getulio/workspace/system/frontend
npm run dev
```

Abra:

```text
http://localhost:5173
```

### 4. Login inicial

Use:

- tenant: `cliente-local`
- usuario: `admin`
- senha: `admin123`

### 5. Depois do primeiro acesso

Se quiser simular ambiente mais seguro, altere no arquivo [.env](/Users/getulio/workspace/system/.env):

```env
APP_BOOTSTRAP_ADMIN_ENABLED=false
```

Depois reinicie os containers:

```bash
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up --build
```
