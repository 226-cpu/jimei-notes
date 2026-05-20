/**
 * 课程注册表：新增课程时在此添加一项，并创建对应文件夹与笔记 .md
 * category 用于首页分组展示
 */
export type CourseCategory = '思政' | '数学' | '英语' | '专业课' | '其他'

export interface CourseChapter {
  text: string
  /** 路径不含 .md，以 / 开头，如 /高等数学/第一章-极限 */
  link: string
}

export interface Course {
  /** 文件夹名，与磁盘上的目录一致 */
  folder: string
  /** 显示名称 */
  name: string
  category: CourseCategory
  chapters: CourseChapter[]
}

export const courses: Course[] = [
  {
    folder: '习近平新时代中国特色社会主义思想概论',
    name: '习近平新时代中国特色社会主义思想概论',
    category: '思政',
    chapters: [
      {
        text: '第一讲 马克思主义中国化时代化新的飞跃',
        link: '/习近平新时代中国特色社会主义思想概论/第一讲-马克思主义中国化时代化新的飞跃',
      },
    ],
  },
  {
    folder: '高等数学',
    name: '高等数学',
    category: '数学',
    chapters: [],
  },
  {
    folder: '大学英语',
    name: '大学英语',
    category: '英语',
    chapters: [],
  },
]

/** 按分类分组，供首页使用 */
export function coursesByCategory(): Record<CourseCategory, Course[]> {
  const map: Record<string, Course[]> = {
    思政: [],
    数学: [],
    英语: [],
    专业课: [],
    其他: [],
  }
  for (const c of courses) {
    map[c.category].push(c)
  }
  return map as Record<CourseCategory, Course[]>
}
