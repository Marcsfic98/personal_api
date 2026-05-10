# Guia de Implementação - Login com Google

## 📋 Resumo das Mudanças

Foram implementados os seguintes componentes para autenticação com Google:

1. **GoogleStrategy** - Estratégia OAuth 2.0 do Google
2. **GoogleOAuthGuard** - Guard para proteger rotas do Google
3. **Novos métodos no AuthService** - `googleLogin()` para processar usuários do Google
4. **Novos métodos no UserService** - `createGoogleUser()` e `updateWithoutPassword()` 
5. **Novos endpoints no AuthController** - Rotas para iniciar e completar o fluxo OAuth

## 🔧 Configuração

### 1. Obter Credenciais Google

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto
3. Ative a API **Google+ API**
4. Acesse **Credenciais** → **Criar Credenciais** → **ID do Cliente OAuth 2.0**
5. Escolha **Aplicação da Web** como tipo
6. Adicione URIs autorizados:
   - **URIs de origem autorizadas**: `http://localhost:3000`
   - **URIs de redirecionamento autorizadas**: `http://localhost:3000/users/auth/google/callback`
7. Copie o **ID do Cliente** e **Senha do Cliente**

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Existing variables...
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
GOOGLE_CALLBACK_URL=http://localhost:3000/users/auth/google/callback
```

## 🚀 Usar a Autenticação com Google

### Frontend (Exemplo com JavaScript)

```javascript
// Redirecionar para a página de login do Google
window.location.href = 'http://localhost:3000/users/auth/google';

// Após autorização, o usuário será redirecionado para:
// http://localhost:3000/users/auth/google/callback?code=...
// O backend processará automaticamente e retornará o JWT
```

### Endpoints Disponíveis

#### 1. Iniciar Login com Google
```
GET /users/auth/google
```
Redireciona o usuário para a tela de login do Google.

#### 2. Callback do Google (Automático)
```
GET /users/auth/google/callback
```
Processado automaticamente pelo Passport. Retorna:
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "image": "https://...",
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 📝 Como Funciona

1. **Usuário clica em "Login com Google"**
   - Frontend redireciona para `/users/auth/google`

2. **Google OAuth Flow**
   - Passport intercepta a requisição
   - Redireciona para Google
   - Usuário autoriza a aplicação

3. **Google retorna autorização**
   - Passport valida o token
   - Extrai dados do perfil (email, name, picture)

4. **Backend processa o usuário**
   - Se existe: atualiza imagem (se necessário) e retorna token
   - Se não existe: cria novo usuário e retorna token

5. **Frontend recebe o JWT**
   - Armazena token (localStorage/sessionStorage)
   - Usa para futuras requisições autenticadas

## 🔐 Autenticação Local vs Google

- **Login Local**: Usa email + password
- **Login Google**: Não requer password (fica como `null`)

Ambos retornam um JWT que pode ser usado normalmente.

## ⚙️ Alterações em Entidades

### User Entity
- Campo `password` agora é **nullable** (`nullable: true`)
- Usuarios do Google não possuem senha

## 📦 Pacotes Instalados

```
passport-google-oauth20: Estratégia OAuth 2.0 do Google
@types/passport-google-oauth20: Tipos TypeScript
```

## ✅ Checklist de Implementação

- [x] Instalar dependências do Passport Google
- [x] Criar GoogleStrategy
- [x] Criar GoogleOAuthGuard
- [x] Atualizar AuthService
- [x] Atualizar UserService
- [x] Atualizar AuthController
- [x] Atualizar AuthModule
- [x] Tornar campo password nullable
- [ ] Adicionar variáveis de ambiente no `.env`
- [ ] Testar fluxo completo

## 🧪 Testando Localmente

1. Configure as variáveis de ambiente
2. Inicie o servidor: `npm run start:dev`
3. Acesse em seu navegador: `http://localhost:3000/users/auth/google`
4. Complete o fluxo de autenticação do Google
5. Você será redirecionado com o token JWT

## 📌 Próximos Passos (Opcional)

1. **Adicionar Refresh Token do Google**
   - Salvar `refreshToken` na BD para renovar acesso
   
2. **Logout com Google**
   - Revogar token de acesso do Google
   
3. **Vinculação de Contas**
   - Permitir usuário vincular Google com conta local existente

4. **Armazenar ID do Google**
   - Adicionar `googleId` na entidade User para melhor rastreamento

## ❓ Troubleshooting

### "Invalid client id"
- Verifique se o `GOOGLE_CLIENT_ID` está correto
- Confirme que a aplicação está registrada no Google Cloud Console

### "Redirect URI mismatch"
- As URIs no Google Cloud Console devem corresponder exatamente às do `.env`
- Inclua protocolo (http/https) e porta

### "Email não encontrado"
- O usuário pode ter negado acesso ao email
- Verifique os escopos solicitados em `google.strategy.ts`
