## Render Deploy

Este projeto esta pronto para subir no Render com:

- 1 `Web Service` Docker para a API Spring Boot
- 1 `PostgreSQL` gerenciado

### O que ja esta pronto

- Blueprint em [render.yaml](/Users/getulio/workspace/system/render.yaml)
- Container da API em [backend/Dockerfile](/Users/getulio/workspace/system/backend/Dockerfile)
- Healthcheck em `/actuator/health`
- Variaveis de ambiente externalizadas

### Antes de criar o blueprint

1. Suba o codigo para um repositorio Git acessivel pelo Render.
2. Edite `repo:` em [render.yaml](/Users/getulio/workspace/system/render.yaml) para a URL real do seu repositorio.

### Criacao no Render

1. No Render Dashboard, clique em `New +`.
2. Escolha `Blueprint`.
3. Selecione o repositorio que contem o arquivo `render.yaml`.
4. Na criacao inicial, preencha os campos marcados com `sync: false`:
   - `APP_SECURITY_ALLOWED_ORIGINS`
   - `APP_BOOTSTRAP_ADMIN_TENANT_NAME`
   - `APP_BOOTSTRAP_ADMIN_TENANT_SLUG`
   - `APP_BOOTSTRAP_ADMIN_USERNAME`
   - `APP_BOOTSTRAP_ADMIN_PASSWORD`
5. Para bootstrap inicial, altere temporariamente `APP_BOOTSTRAP_ADMIN_ENABLED` para `true` no service `retread-api`.
6. Depois do primeiro login/admin criado, volte `APP_BOOTSTRAP_ADMIN_ENABLED` para `false`.

### Integracao com o frontend

Depois que a API estiver online no Render:

1. Copie a URL publica da API, por exemplo:
   - `https://retread-api.onrender.com/api`
2. No frontend, defina:
   - `VITE_API_BASE_URL=https://retread-api.onrender.com/api`
3. Rebuild/redeploy o frontend.

### Fontes oficiais usadas

- Blueprints: https://render.com/docs/blueprint-spec
- Docker on Render: https://render.com/docs/docker
- Environment Variables: https://render.com/docs/configure-environment-variables
