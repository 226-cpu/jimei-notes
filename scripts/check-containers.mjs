#!/usr/bin/env node
/**
 * 检查 Markdown 里 ::: 提示框是否成对、是否错误缩进
 * 用法: npm run check
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))

const SKIP_DIR = new Set(['node_modules', '.vitepress', 'templates', 'scripts'])
const SKIP_FILE = new Set(['cursor_.md', 'README.md'])

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) {
      if (!SKIP_DIR.has(name)) walk(p, out)
    } else if (name.endsWith('.md') && !SKIP_FILE.has(name)) {
      out.push(p)
    }
  }
  return out
}

function checkFile(file) {
  const rel = relative(root, file)
  const lines = readFileSync(file, 'utf8').split(/\r?\n/)
  const stack = []
  let err = 0
  let inCodeFence = false

  lines.forEach((line, i) => {
    const n = i + 1

    if (line.trimStart().startsWith('```')) {
      inCodeFence = !inCodeFence
      return
    }
    if (inCodeFence) return

    const open = line.match(/^(\s*):::\s+(\S+)/)
    const close = line.match(/^(\s*):::\s*$/)

    if (open) {
      const indent = open[1].length
      if (indent > 0) {
        console.error(`[${rel}:${n}] 提示框行前不能有空格缩进`)
        err++
      }
      stack.push({ type: open[2], line: n })
      return
    }

    if (close) {
      if (close[1].length > 0) {
        console.error(`[${rel}:${n}] 结束行 ::: 前不能有空格缩进`)
        err++
      }
      if (stack.length === 0) {
        console.error(`[${rel}:${n}] 多余的 :::（没有对应的开始）`)
        err++
      } else {
        stack.pop()
      }
    }
  })

  for (const s of stack) {
    console.error(`[${rel}:${s.line}] 未闭合的 ::: ${s.type}`)
    err++
  }
  return err
}

let total = 0
for (const f of walk(root)) {
  total += checkFile(f)
}

if (total > 0) {
  console.error(`\n共 ${total} 处问题，请修正后再 npm run build`)
  process.exit(1)
} else {
  console.log('::: 提示框检查通过，可执行 npm run build')
}
