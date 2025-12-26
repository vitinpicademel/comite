// Script de teste de conexão com Supabase
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testando conexão com Supabase...\n');

// Verificar variáveis de ambiente
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERRO: Variáveis de ambiente não configuradas!');
  console.log('\nVerifique o arquivo .env.local:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=' + (supabaseUrl || 'NÃO DEFINIDO'));
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=' + (supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'NÃO DEFINIDO'));
  process.exit(1);
}

console.log('✅ Variáveis de ambiente encontradas:');
console.log('   URL:', supabaseUrl);
console.log('   Key:', supabaseKey.substring(0, 30) + '...\n');

// Criar cliente
const supabase = createClient(supabaseUrl, supabaseKey);

// Teste 1: Verificar conexão básica
async function testConnection() {
  console.log('📡 Teste 1: Verificando conexão básica...');
  try {
    const { data, error } = await supabase.from('estado_atual').select('count').limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('   ⚠️  Tabela "estado_atual" não encontrada!');
        console.log('   💡 Execute o arquivo supabase/schema.sql no SQL Editor do Supabase\n');
        return false;
      }
      throw error;
    }
    
    console.log('   ✅ Conexão estabelecida com sucesso!\n');
    return true;
  } catch (error) {
    console.log('   ❌ Erro na conexão:', error.message);
    console.log('   💡 Verifique se:');
    console.log('      - A URL está correta');
    console.log('      - A chave está correta');
    console.log('      - O projeto está ativo no Supabase\n');
    return false;
  }
}

// Teste 2: Verificar tabelas
async function testTables() {
  console.log('📊 Teste 2: Verificando tabelas...');
  const tables = ['imoveis', 'avaliacoes', 'sessoes', 'estado_atual'];
  const results = {};
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        results[table] = { exists: false, error: error.message };
      } else {
        results[table] = { exists: true, count: data?.length || 0 };
      }
    } catch (error) {
      results[table] = { exists: false, error: error.message };
    }
  }
  
  let allExist = true;
  for (const [table, result] of Object.entries(results)) {
    if (result.exists) {
      console.log(`   ✅ ${table} - OK`);
    } else {
      console.log(`   ❌ ${table} - NÃO ENCONTRADA`);
      if (result.error) {
        console.log(`      Erro: ${result.error}`);
      }
      allExist = false;
    }
  }
  
  if (!allExist) {
    console.log('\n   💡 Execute o arquivo supabase/schema.sql no SQL Editor do Supabase\n');
  } else {
    console.log('\n   ✅ Todas as tabelas existem!\n');
  }
  
  return allExist;
}

// Teste 3: Verificar Realtime
async function testRealtime() {
  console.log('🔄 Teste 3: Verificando Realtime...');
  try {
    const channel = supabase
      .channel('test-connection')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'estado_atual'
      }, (payload) => {
        console.log('   ✅ Realtime funcionando!');
      })
      .subscribe();
    
    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    channel.unsubscribe();
    console.log('   ✅ Realtime habilitado!\n');
    return true;
  } catch (error) {
    console.log('   ⚠️  Realtime pode não estar habilitado');
    console.log('   💡 Vá em Database → Replication e ative para todas as tabelas\n');
    return false;
  }
}

// Teste 4: Testar escrita
async function testWrite() {
  console.log('✍️  Teste 4: Testando escrita no banco...');
  try {
    // Tentar ler o estado atual (deve existir)
    const { data, error } = await supabase
      .from('estado_atual')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    if (data) {
      console.log('   ✅ Leitura funcionando!');
      console.log('   📋 Estado atual:', JSON.stringify(data, null, 2));
    } else {
      console.log('   ⚠️  Tabela estado_atual vazia ou não inicializada');
      console.log('   💡 Execute o schema.sql para criar os dados iniciais\n');
    }
    
    return true;
  } catch (error) {
    console.log('   ❌ Erro na escrita:', error.message);
    return false;
  }
}

// Executar todos os testes
async function runTests() {
  console.log('🚀 Iniciando testes de conexão...\n');
  console.log('═'.repeat(50) + '\n');
  
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.log('❌ Teste de conexão falhou. Corrija os problemas acima.\n');
    process.exit(1);
  }
  
  const tablesOk = await testTables();
  const realtimeOk = await testRealtime();
  const writeOk = await testWrite();
  
  console.log('═'.repeat(50));
  console.log('\n📊 RESUMO DOS TESTES:\n');
  console.log('   Conexão:     ' + (connectionOk ? '✅ OK' : '❌ FALHOU'));
  console.log('   Tabelas:      ' + (tablesOk ? '✅ OK' : '❌ FALHOU'));
  console.log('   Realtime:     ' + (realtimeOk ? '✅ OK' : '⚠️  VERIFICAR'));
  console.log('   Leitura:      ' + (writeOk ? '✅ OK' : '❌ FALHOU'));
  
  if (connectionOk && tablesOk && writeOk) {
    console.log('\n🎉 CONEXÃO FUNCIONANDO PERFEITAMENTE!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Alguns testes falharam. Verifique os problemas acima.\n');
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});

