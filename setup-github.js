#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🐙 Configurando repositório GitHub...\n');

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupGitHub() {
  try {
    // Verificar se o Git está instalado
    execSync('git --version', { stdio: 'ignore' });
    
    // Obter informações do usuário
    const username = await question('👤 Digite seu username do GitHub: ');
    const repoName = await question('📁 Digite o nome do repositório (ex: 3meses-namoro): ');
    const token = await question('🔑 Digite seu token do GitHub (ou senha, mas token é mais seguro): ');
    
    console.log('\n📋 Resumo:');
    console.log(`   Username: ${username}`);
    console.log(`   Repositório: ${repoName}`);
    console.log(`   URL: https://github.com/${username}/${repoName}`);
    
    const confirm = await question('\n✅ Confirma? (s/n): ');
    
    if (confirm.toLowerCase() !== 's' && confirm.toLowerCase() !== 'sim') {
      console.log('❌ Operação cancelada.');
      rl.close();
      return;
    }
    
    // Configurar Git
    console.log('\n⚙️  Configurando Git...');
    execSync('git config user.name "GitHub Actions"', { stdio: 'ignore' });
    execSync(`git config user.email "${username}@users.noreply.github.com"`, { stdio: 'ignore' });
    
    // Adicionar remote
    console.log('🔗 Adicionando remote origin...');
    const remoteUrl = `https://${username}:${token}@github.com/${username}/${repoName}.git`;
    execSync(`git remote add origin ${remoteUrl}`, { stdio: 'ignore' });
    
    // Criar branch main e fazer primeiro commit
    console.log('📂 Criando branch main...');
    execSync('git branch -M main', { stdio: 'ignore' });
    
    // Adicionar arquivos e fazer commit inicial
    console.log('💾 Fazendo commit inicial...');
    execSync('git add .', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit - Site de 3 meses de namoro"', { stdio: 'ignore' });
    
    // Push inicial
    console.log('📤 Enviando para o GitHub...');
    execSync('git push -u origin main', { stdio: 'inherit' });
    
    console.log('\n🎉 Sucesso! Repositório configurado e código enviado!');
    console.log(`\n🌐 URL do GitHub Pages:`);
    console.log(`   https://${username}.github.io/${repoName}/`);
    console.log(`\n📍 URL direta do site:`);
    console.log(`   https://${username}.github.io/${repoName}/main.html`);
    console.log('\n✨ Ative o GitHub Pages em:');
    console.log(`   https://github.com/${username}/${repoName}/settings/pages`);
    console.log('   Selecione "Deploy from a branch" e escolha "main"');
    
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
    console.log('\n💡 Dicas:');
    console.log('   - Verifique se o repositório já existe no GitHub');
    console.log('   - Verifique seu token/senha');
    console.log('   - Certifique-se de ter permissões no repositório');
  } finally {
    rl.close();
  }
}

setupGitHub();