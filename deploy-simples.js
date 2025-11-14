#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Deploy simplificado para GitHub Pages...\n');

// Configurações - você pode editar estas variáveis
const CONFIG = {
  username: process.env.GITHUB_USER || 'seu-usuario', // Substitua pelo seu username
  repoName: '3meses-namoro',
  token: process.env.GITHUB_TOKEN || '', // Token do GitHub (opcional)
  branch: 'main'
};

console.log(`📋 Configuração:`);
console.log(`   Username: ${CONFIG.username}`);
console.log(`   Repositório: ${CONFIG.repoName}`);
console.log(`   Branch: ${CONFIG.branch}`);

try {
  // Verificar se é um repositório git
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Este não é um repositório Git. Por favor, inicialize um repositório primeiro.');
  console.log('💡 Execute: git init');
  process.exit(1);
}

try {
  // Verificar se existe remote
  let hasRemote = false;
  try {
    execSync('git config --get remote.origin.url', { stdio: 'ignore' });
    hasRemote = true;
  } catch (e) {
    hasRemote = false;
  }
  
  if (!hasRemote) {
    console.log('\n🔗 Configurando remote origin...');
    const remoteUrl = CONFIG.token 
      ? `https://${CONFIG.username}:${CONFIG.token}@github.com/${CONFIG.username}/${CONFIG.repoName}.git`
      : `https://github.com/${CONFIG.username}/${CONFIG.repoName}.git`;
    
    execSync(`git remote add origin ${remoteUrl}`, { stdio: 'inherit' });
  }
  
  // Configurar Git (se necessário)
  try {
    execSync('git config user.name', { stdio: 'ignore' });
  } catch {
    console.log('⚙️  Configurando Git user.name...');
    execSync('git config user.name "GitHub Actions"', { stdio: 'ignore' });
  }
  
  try {
    execSync('git config user.email', { stdio: 'ignore' });
  } catch {
    console.log('⚙️  Configurando Git user.email...');
    execSync(`git config user.email "${CONFIG.username}@users.noreply.github.com"`, { stdio: 'ignore' });
  }
  
  // Verificar se há mudanças
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status) {
    console.log('\n📋 Mudanças detectadas:');
    console.log(status);
    
    // Adicionar todas as mudanças
    console.log('\n📥 Adicionando mudanças...');
    execSync('git add .', { stdio: 'inherit' });
    
    // Commit
    console.log('\n💾 Fazendo commit...');
    const commitMessage = `Deploy: atualização em ${new Date().toLocaleString('pt-BR')}`;
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  } else {
    console.log('\n✅ Nenhuma mudança detectada.');
  }
  
  // Verificar se o branch existe
  let branchExists = false;
  try {
    execSync(`git rev-parse --verify ${CONFIG.branch}`, { stdio: 'ignore' });
    branchExists = true;
  } catch {
    branchExists = false;
  }
  
  if (!branchExists) {
    console.log(`\n🌿 Criando branch ${CONFIG.branch}...`);
    execSync(`git branch -M ${CONFIG.branch}`, { stdio: 'ignore' });
  }
  
  // Push
  console.log('\n📤 Enviando para o GitHub...');
  try {
    execSync(`git push -u origin ${CONFIG.branch}`, { stdio: 'inherit' });
  } catch (error) {
    console.log('\n⚠️  Tentando push sem -u flag...');
    execSync(`git push origin ${CONFIG.branch}`, { stdio: 'inherit' });
  }
  
  console.log('\n🎉 Deploy concluído com sucesso!');
  console.log(`\n🌐 URL do GitHub Pages:`);
  console.log(`   https://${CONFIG.username}.github.io/${CONFIG.repoName}/`);
  console.log(`\n📍 URL direta do site:`);
  console.log(`   https://${CONFIG.username}.github.io/${CONFIG.repoName}/main.html`);
  console.log('\n✨ Para ativar o GitHub Pages:');
  console.log(`   1. Acesse: https://github.com/${CONFIG.username}/${CONFIG.repoName}/settings/pages`);
  console.log('   2. Selecione "Deploy from a branch"');
  console.log(`   3. Escolha o branch "${CONFIG.branch}"`);
  console.log('   4. Clique em Save');
  
} catch (error) {
  console.error('\n❌ Erro durante o deploy:', error.message);
  console.log('\n💡 Verifique:');
  console.log('   - Se você está logado no Git');
  console.log('   - Se o repositório existe no GitHub');
  console.log('   - Suas permissões no repositório');
  console.log('\n🔧 Para configurar manualmente:');
  console.log(`   git remote add origin https://github.com/${CONFIG.username}/${CONFIG.repoName}.git`);
  console.log(`   git push -u origin ${CONFIG.branch}`);
  process.exit(