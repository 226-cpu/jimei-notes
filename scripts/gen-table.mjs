#!/usr/bin/env node
/**
 * 按指定列数、行数生成 Markdown 表格
 * 用法: node scripts/gen-table.mjs <列数> [数据行数]
 * 示例: npm run table -- 5 3
 */
import { spawnSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const cols = parseInt(process.argv[2], 10)
const dataRows = parseInt(process.argv[3], 10) || 2

if (!Number.isFinite(cols) || cols < 1 || cols > 30) {
  console.error('列数请填写 1～30 的整数')
  console.error('用法: npm run table -- <列数> [数据行数，默认 2]')
  process.exit(1)
}

if (!Number.isFinite(dataRows) || dataRows < 1 || dataRows > 50) {
  console.error('数据行数请填写 1～50 的整数')
  process.exit(1)
}

function buildTable(columnCount, rowCount) {
  const headers = Array.from({ length: columnCount }, (_, i) => `列${i + 1}`)
  const lines = [
    `| ${headers.join(' | ')} |`,
    `| ${Array(columnCount).fill('---').join(' | ')} |`,
  ]
  for (let r = 0; r < rowCount; r++) {
    lines.push(`| ${Array(columnCount).fill(' ').join(' | ')} |`)
  }
  return lines.join('\n')
}

const table = buildTable(cols, dataRows)

function copyToClipboard(text) {
  if (process.platform === 'win32') {
    const tmp = join(tmpdir(), 'vitepress-table.md')
    writeFileSync(tmp, text, 'utf8')
    const ps = `Get-Content -LiteralPath '${tmp.replace(/'/g, "''")}' -Raw -Encoding UTF8 | Set-Clipboard`
    const r = spawnSync('powershell', ['-NoProfile', '-Command', ps], { encoding: 'utf8' })
    return r.status === 0
  }
  return false
}

const copied = copyToClipboard(table)
console.log(table)
console.log('')
if (copied) {
  console.log(`已生成 ${cols} 列 × ${dataRows} 行数据，并复制到剪贴板，在 .md 里 Ctrl+V 粘贴即可。`)
} else {
  console.log('（未能自动复制）请手动复制上方表格内容。')
}
