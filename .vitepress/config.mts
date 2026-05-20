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

/** 顶栏：首页 + 各课程（章节多的课放前面） */
const nav = [
  { text: '首页', link: '/' },
  { text: '使用说明', link: '/guide' },
  { text: '部署', link: '/deploy' },
  ...courses.map((c) => ({
    text: c.name,
    link:
      c.chapters[0]?.link ??
      `/${c.folder}/`,
  })),
]

export default defineConfig({
  lang: 'zh-CN',
  title: '集美笔记',
  description: '集美大学 · 本机课程笔记',
  /** 部署到 GitHub 项目站时设为 /仓库名/；本地或用户站为 / */
  base: process.env.VP_BASE || '/',
  cleanUrls: true,
  /** 未用 git 管理笔记时请保持 false，否则 build 可能异常 */
  lastUpdated: false,
  srcExclude: ['**/templates/**', 'cursor_.md', 'README.md'],

  themeConfig: {
    logo: '📒',
    outline: { level: [2, 3] },
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
