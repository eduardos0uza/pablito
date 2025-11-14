#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando deploy para GitHub Pages...\n');

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
  let repoUrl = '';
  
  try {
    repoUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
    hasRemote = true;
    console.log(`✅ Remote encontrado: ${repoUrl}`);
  } catch (e) {
    hasRemote = false;
    console.log('⚠️  Nenhum remote configurado');
  }
  
  if (!hasRemote) {
    console.log('\n📋 Para configurar o deploy, você precisa:');
    console.log('1. Criar um repositório em: https://github.com/new');
    console.log('2. Nome do repositório: sugestão "3meses-namoro"');
    console.log('3. Não inicialize com README');
    console.log('4. Depois execute um dos comandos abaixo:\n');
    
    console.log('🔧 Opção 1 - HTTPS (mais simples):');
    console.log('   git remote add origin https://github.com/SEU-USUARIO/3meses-namoro.git');
    console.log('\n🔧 Opção 2 - SSH (mais seguro):');
    console.log('   git remote add origin git@github.com:SEU-USUARIO/3meses-namoro.git');
    console.log('\n📖 Para instruções completas, veja: DEPLOY.md');
    process.exit(0);
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
    execSync('git config user.email "action@github.com"', { stdio: 'ignore' });
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
  
  // Detectar username e repo do URL
  let username, repoName;
  if (repoUrl.includes('github.com')) {
    const match = repoUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
    if (match) {
      username = match[1];
      repoName = match[2].replace('.git', '');
    }
  }
  
  // Push para o branch atual
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  console.log(`\n📤 Enviando para o GitHub (branch: ${currentBranch})...`);
  
  try {
    execSync('git push origin HEAD', { stdio: 'inherit' });
  } catch (error) {
    console.log('\n⚠️  Tentando push com upstream...');
    execSync(`git push --set-upstream origin ${currentBranch}`, { stdio: 'inherit' });
  }
  
  console.log('\n🎉 Deploy concluído com sucesso!');
  
  if (username && repoName) {
    console.log(`\n🌐 URL do GitHub Pages:`);
    console.log(`   https://${username}.github.io/${repoName}/`);
    console.log(`\n📍 URL direta do site:`);
    console.log(`   https://${username}.github.io/${repoName}/main.html`);
    console.log('\n✨ Para ativar o GitHub Pages:');
    console.log(`   1. Acesse: https://github.com/${username}/${repoName}/settings/pages`);
    console.log('   2. Selecione "Deploy from a branch"');
    console.log(`   3. Escolha o branch "${currentBranch}"`);
    console.log('   4. Clique em Save');
  }
  
  console.log('\n⏰ Nota: Pode levar alguns minutos para as mudanças aparecerem online.');
  console.log('📖 Para mais detalhes, veja: DEPLOY.md');
  
} catch (error) {
  console.error('\n❌ Erro durante o deploy:', error.message);
  console.log('\n💡 Verifique:');
  console.log('   - Se você está logado no Git');
  console.log('   - Se o remote origin está configurado corretamente');
  console.log('   - Se você tem permissões para push');
  console.log('   - Se o repositório existe no GitHub');
  console.log('\n🔧 Comandos úteis:');
  console.log('   git remote -v');
  console.log('   git remote add origin https://github.com/USUARIO/REPO.git');
  console.log('\n📖 Para instruções completas, veja: DEPLOY.md');
  process.exit(1);
}