import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ResumeData {
  personalInfo: {
    name: string
    title: string
    email: string
    phone: string
    address: string
    summary: string
  }
  experience: Array<{
    id: string
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
  }>
  education: Array<{
    id: string
    school: string
    degree: string
    major: string
    startDate: string
    endDate: string
  }>
  skills: Array<{
    id: string
    name: string
    level: number
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    url?: string
  }>
}

export const useResumeStore = defineStore('resume', () => {
  // 简历数据
  const resumeData = ref<ResumeData>({
    personalInfo: {
      name: '张三',
      title: '前端开发工程师',
      email: 'zhangsan@example.com',
      phone: '138-0000-0000',
      address: '北京市朝阳区',
      summary: '具有3年前端开发经验，熟练掌握Vue.js、React等现代前端框架。'
    },
    experience: [
      {
        id: '1',
        company: 'ABC科技有限公司',
        position: '前端开发工程师',
        startDate: '2022-01',
        endDate: '至今',
        description: '负责公司主要产品的前端开发工作，使用Vue.js构建用户界面。'
      }
    ],
    education: [
      {
        id: '1',
        school: '北京大学',
        degree: '学士',
        major: '计算机科学与技术',
        startDate: '2018-09',
        endDate: '2022-06'
      }
    ],
    skills: [
      { id: '1', name: 'Vue.js', level: 90 },
      { id: '2', name: 'JavaScript', level: 85 },
      { id: '3', name: 'TypeScript', level: 80 }
    ],
    projects: [
      {
        id: '1',
        name: '在线简历生成器',
        description: '基于Vue 3开发的在线简历生成工具',
        technologies: ['Vue 3', 'TypeScript', 'Element Plus'],
        url: 'https://github.com/example/resume-builder'
      }
    ]
  })

  // JSON字符串
  const jsonString = computed(() => {
    return JSON.stringify(resumeData.value, null, 2)
  })

  // 历史记录用于撤销/重做
  const history = ref<string[]>([jsonString.value])
  const historyIndex = ref(0)

  // 更新简历数据
  const updateResumeData = (newData: ResumeData) => {
    resumeData.value = newData
    saveToHistory()
  }

  // 从JSON更新数据
  const updateFromJson = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr)
      resumeData.value = parsed
      saveToHistory()
      return true
    } catch (error) {
      console.error('JSON解析错误:', error)
      return false
    }
  }

  // 保存到历史记录
  const saveToHistory = () => {
    const currentJson = JSON.stringify(resumeData.value, null, 2)
    if (history.value[historyIndex.value] !== currentJson) {
      // 删除当前位置之后的历史记录
      history.value = history.value.slice(0, historyIndex.value + 1)
      // 添加新的历史记录
      history.value.push(currentJson)
      historyIndex.value = history.value.length - 1

      // 限制历史记录数量
      if (history.value.length > 50) {
        history.value.shift()
        historyIndex.value--
      }
    }
  }

  // 撤销
  const undo = () => {
    if (historyIndex.value > 0) {
      historyIndex.value--
      const prevData = JSON.parse(history.value[historyIndex.value])
      resumeData.value = prevData
      return true
    }
    return false
  }

  // 重做
  const redo = () => {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      const nextData = JSON.parse(history.value[historyIndex.value])
      resumeData.value = nextData
      return true
    }
    return false
  }

  // 检查是否可以撤销/重做
  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  return {
    resumeData,
    jsonString,
    updateResumeData,
    updateFromJson,
    undo,
    redo,
    canUndo,
    canRedo
  }
})