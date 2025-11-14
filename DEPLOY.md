# 🚀 Deploy do Site "3 Meses de Namoro"

## 📋 Pré-requisitos

1. **Conta no GitHub** - [Criar conta](https://github.com/join)
2. **Git instalado** - [Baixar Git](https://git-scm.com/downloads)
3. **Node.js instalado** - [Baixar Node.js](https://nodejs.org/)

## 🔧 Configuração Inicial

### 1. Criar Repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Nome do repositório: `3meses-namoro` (ou o nome que preferir)
3. Deixe público para usar GitHub Pages gratuitamente
4. Não inicialize com README (vamos usar os arquivos existentes)
5. Clique em "Create repository"

### 2. Configurar Git Local

No terminal, execute:

```bash
# Configurar seu nome e email
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"
```

### 3. Conectar ao GitHub

Escolha uma das opções:

#### Opção A: HTTPS (Mais simples)
```bash
git remote add origin https://github.com/SEU-USUARIO/3meses-namoro.git
```

#### Opção B: SSH (Mais seguro)
```bash
git remote add origin git@github.com:SEU-USUARIO/3meses-namoro.git
```

**Substitua `SEU-USUARIO` pelo seu username do GitHub!**

## 📤 Deploy

### Método 1: Script Automatizado

Edite o arquivo `deploy-simples.js` e substitua:
- `seu-usuario` pelo seu username do GitHub

Depois execute:
```bash
node deploy-simples.js
```

### Método 2: Comandos Manuais

```bash
# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit - Site de 3 meses de namoro"

# Enviar para o GitHub
git push -u origin main
```

## 🌐 Ativar GitHub Pages

1. Vá para: `https://github.com/SEU-USUARIO/3meses-namoro/settings/pages`
2. Em "Source", selecione: **Deploy from a branch**
3. Escolha o branch: **main**
4. Clique em **Save**

## 🔗 URLs do Site

- **Página principal**: `https://SEU-USUARIO.github.io/3meses-namoro/`
- **Site direto**: `https://SEU-USUARIO.github.io/3meses-namoro/main.html`

## ⚠️ Problemas Comuns

### 1. Erro de autenticação
- Use token do GitHub ao invés de senha
- Crie um token em: Settings > Developer settings > Personal access tokens

### 2. Site não aparece
- Verifique se o GitHub Pages está ativado
- Aguarde 5-10 minutos após o push
- Certifique-se de que o repositório é público

### 3. Imagens não carregam
- Verifique se os arquivos de imagem foram enviados
- Teste localmente antes do deploy

## 🆘 Precisa de Ajuda?

Se tiver problemas:
1. Verifique o console do navegador (F12)
2. Confira os logs do GitHub Actions (se ativado)
3. Teste localmente com: `npx http-server -p 8080`

---

**Boa sorte! 🎉 O site ficará disponível em alguns minutos.**