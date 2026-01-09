import * as XLSX from 'xlsx'
import { obterHistoricoDoDia } from './database'
import type { Sessao } from './supabase'

export interface RelatorioItem {
  data: string
  nomeImovel: string
  valorMedio: number
}

/**
 * Formata um valor numérico como moeda brasileira (R$)
 */
function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

/**
 * Busca os dados do relatório diário e formata para exportação
 */
export async function prepararRelatorioDiario(): Promise<RelatorioItem[]> {
  const sessoes = await obterHistoricoDoDia()
  
  return sessoes.map(sessao => ({
    data: sessao.data_avaliacao,
    nomeImovel: sessao.nome_imovel,
    valorMedio: Number(sessao.media_final)
  }))
}

/**
 * Exporta o relatório diário como arquivo Excel (.xlsx)
 */
export async function exportarRelatorioExcel(): Promise<void> {
  try {
    const dados = await prepararRelatorioDiario()
    
    if (dados.length === 0) {
      throw new Error('Não há votações registradas para hoje. Não é possível gerar o relatório.')
    }
    
    // Preparar dados para Excel
    const dadosFormatados = dados.map(item => ({
      'Data': item.data,
      'Nome do Imóvel': item.nomeImovel,
      'Valor Médio Avaliado': formatarMoeda(item.valorMedio)
    }))
    
    // Criar workbook e worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(dadosFormatados)
    
    // Ajustar largura das colunas
    const colWidths = [
      { wch: 12 }, // Data
      { wch: 30 }, // Nome do Imóvel
      { wch: 20 }  // Valor Médio
    ]
    worksheet['!cols'] = colWidths
    
    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório Diário')
    
    // Gerar nome do arquivo com data atual
    const hoje = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')
    const nomeArquivo = `Relatorio_Diario_${hoje}.xlsx`
    
    // Fazer download do arquivo
    XLSX.writeFile(workbook, nomeArquivo)
  } catch (error: any) {
    throw error
  }
}

/**
 * Exporta o relatório diário como arquivo CSV
 */
export async function exportarRelatorioCSV(): Promise<void> {
  try {
    const dados = await prepararRelatorioDiario()
    
    if (dados.length === 0) {
      throw new Error('Não há votações registradas para hoje. Não é possível gerar o relatório.')
    }
    
    // Criar cabeçalho CSV
    const cabecalho = 'Data,Nome do Imóvel,Valor Médio Avaliado\n'
    
    // Criar linhas de dados
    const linhas = dados.map(item => {
      const data = item.data
      const nome = `"${item.nomeImovel.replace(/"/g, '""')}"` // Escapar aspas
      const valor = formatarMoeda(item.valorMedio)
      return `${data},${nome},${valor}`
    }).join('\n')
    
    // Combinar cabeçalho e dados
    const conteudoCSV = cabecalho + linhas
    
    // Criar blob e fazer download
    const blob = new Blob(['\ufeff' + conteudoCSV], { type: 'text/csv;charset=utf-8;' }) // BOM para Excel reconhecer UTF-8
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // Gerar nome do arquivo com data atual
    const hoje = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')
    link.download = `Relatorio_Diario_${hoje}.csv`
    
    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error: any) {
    throw error
  }
}
