import { defineConfig } from 'vitepress'
import { courses } from './courses'

/** 根据 courses 生成各课程侧栏 */
const sidebar = Object.fromEntries(
  courses.map((c) => [
    `/${c.folder}/`,
    [
      {
        text: c.name,
        collapsed: false,
        items:
          c.chapters.length > 0
            ? c.chapters.map((ch) => ({ text: ch.text, link: ch.link }))
            : [{ text: '（暂无章节，见课程首页）', link: `/${c.folder}/` }],
      },
    ],
  ]),
)

const nav = [
  { text: '首页', link: '/' },
  { text: '使用说明', link: '/guide' },
  { text: '部署', link: '/deploy' },
  ...courses.map((c) => ({
    text: c.name,
    link: c.chapters[0]?.link ?? `/${c.folder}/`,
  })),
]

export default defineConfig({
  lang: 'zh-CN',
  title: '集美笔记',
  description: '集美大学 · 本机课程笔记',
  /**
   * GitHub Pages 项目站必须为 /仓库名/（末尾有斜杠）
   * Actions 构建时会设置环境变量 VP_BASE；本地预览一般为 /
   */
  base: process.env.VP_BASE || '/',
  cleanUrls: true,
  lastUpdated: false,
  srcExclude: ['**/templates/**', 'cursor_.md', 'README.md'],

  themeConfig: {
    logo: '📒',
    outline: { level: [2, 3, 4] },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '无结果',
            resetButtonTitle: '清除',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
    nav,
    sidebar,
    docFooter: { prev: '上一篇', next: '下一篇' },
  },
})
