<template>
  <div class="monaco-editor">
    <div class="editor-header">
      <div class="editor-actions">
        <el-button size="small" @click="formatJson" :icon="MagicStick">
          格式化
        </el-button>
        <el-button size="small" @click="validateJson" :icon="CircleCheck">
          验证
        </el-button>
        <el-button size="small" @click="resetJson" :icon="RefreshLeft">
          重置
        </el-button>
      </div>
      <div class="editor-status">
        <el-tag v-if="validationStatus" :type="validationStatus.type" size="small">
          {{ validationStatus.message }}
        </el-tag>
      </div>
    </div>

    <div ref="editorContainer" class="editor-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useResumeStore } from '@/stores/resume'
import { MagicStick, CircleCheck, RefreshLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as monaco from 'monaco-editor'

const resumeStore = useResumeStore()
const editorContainer = ref<HTMLElement>()
const validationStatus = ref<{ type: 'success' | 'warning' | 'danger', message: string } | null>(null)

let editor: monaco.editor.IStandaloneCodeEditor | null = null
let isUpdatingFromStore = false

// 初始化编辑器
const initEditor = async () => {
  if (!editorContainer.value) return

  // 配置Monaco Editor
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    allowComments: false,
    schemas: [{
      uri: 'http://myserver/resume-schema.json',
      fileMatch: ['*'],
      schema: {
        type: 'object',
        properties: {
          personalInfo: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              title: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
              address: { type: 'string' },
              summary: { type: 'string' }
            },
            required: ['name', 'title', 'email']
          },
          experience: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                company: { type: 'string' },
                position: { type: 'string' },
                startDate: { type: 'string' },
                endDate: { type: 'string' },
                description: { type: 'string' }
              },
              required: ['id', 'company', 'position']
            }
          },
          education: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                school: { type: 'string' },
                degree: { type: 'string' },
                major: { type: 'string' },
                startDate: { type: 'string' },
                endDate: { type: 'string' }
              },
              required: ['id', 'school', 'degree']
            }
          },
          skills: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                level: { type: 'number', minimum: 0, maximum: 100 }
              },
              required: ['id', 'name', 'level']
            }
          },
          projects: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
                technologies: { type: 'array', items: { type: 'string' } },
                url: { type: 'string' }
              },
              required: ['id', 'name', 'description']
            }
          }
        },
        required: ['personalInfo']
      }
    }]
  })

  // 创建编辑器实例
  editor = monaco.editor.create(editorContainer.value, {
    value: resumeStore.jsonString,
    language: 'json',
    theme: 'vs',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto'
    },
    wordWrap: 'on',
    formatOnPaste: true,
    formatOnType: true,
    tabSize: 2,
    insertSpaces: true
  })

  // 监听编辑器内容变化
  editor.onDidChangeModelContent(() => {
    if (!isUpdatingFromStore && editor) {
      const value = editor.getValue()
      debounceUpdateStore(value)
    }
  })

  // 添加快捷键
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    formatJson()
  })

  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
    validateJson()
  })
}

// 防抖更新store
let updateTimer: NodeJS.Timeout | null = null
const debounceUpdateStore = (value: string) => {
  if (updateTimer) {
    clearTimeout(updateTimer)
  }

  updateTimer = setTimeout(() => {
    try {
      JSON.parse(value) // 验证JSON格式
      if (resumeStore.updateFromJson(value)) {
        validationStatus.value = { type: 'success', message: 'JSON格式正确' }
      }
    } catch (error) {
      validationStatus.value = { type: 'danger', message: 'JSON格式错误' }
    }

    // 3秒后清除状态
    setTimeout(() => {
      validationStatus.value = null
    }, 3000)
  }, 500)
}

// 监听store变化，更新编辑器内容
watch(
  () => resumeStore.jsonString,
  (newValue) => {
    if (editor && !isUpdatingFromStore) {
      isUpdatingFromStore = true
      const currentValue = editor.getValue()
      if (currentValue !== newValue) {
        editor.setValue(newValue)
      }
      nextTick(() => {
        isUpdatingFromStore = false
      })
    }
  }
)

// 格式化JSON
const formatJson = () => {
  if (!editor) return

  try {
    const value = editor.getValue()
    const parsed = JSON.parse(value)
    const formatted = JSON.stringify(parsed, null, 2)
    editor.setValue(formatted)
    ElMessage.success('JSON格式化成功')
    validationStatus.value = { type: 'success', message: 'JSON格式化成功' }
  } catch (error) {
    ElMessage.error('JSON格式错误，无法格式化')
    validationStatus.value = { type: 'danger', message: 'JSON格式错误' }
  }

  setTimeout(() => {
    validationStatus.value = null
  }, 3000)
}

// 验证JSON
const validateJson = () => {
  if (!editor) return

  try {
    const value = editor.getValue()
    JSON.parse(value)
    ElMessage.success('JSON格式正确')
    validationStatus.value = { type: 'success', message: 'JSON格式正确' }
  } catch (error) {
    ElMessage.error('JSON格式错误')
    validationStatus.value = { type: 'danger', message: `JSON格式错误: ${(error as Error).message}` }
  }

  setTimeout(() => {
    validationStatus.value = null
  }, 3000)
}

// 重置JSON
const resetJson = () => {
  if (!editor) return

  editor.setValue(resumeStore.jsonString)
  ElMessage.success('已重置为当前数据')
  validationStatus.value = { type: 'success', message: '已重置' }

  setTimeout(() => {
    validationStatus.value = null
  }, 3000)
}

// 组件挂载
onMounted(async () => {
  await nextTick()
  initEditor()
})

// 组件卸载
onUnmounted(() => {
  if (updateTimer) {
    clearTimeout(updateTimer)
  }
  if (editor) {
    editor.dispose()
  }
})
</script>

<style scoped>
.monaco-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e4e7ed;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-actions {
  display: flex;
  gap: 8px;
}

.editor-status {
  min-width: 120px;
  text-align: right;
}

.editor-container {
  flex: 1;
  min-height: 0;
}

/* Monaco Editor 样式覆盖 */
:deep(.monaco-editor) {
  border: none !important;
}

:deep(.monaco-editor .margin) {
  background-color: #f8f9fa !important;
}

:deep(.monaco-editor .monaco-editor-background) {
  background-color: #ffffff !important;
}

:deep(.monaco-editor .current-line) {
  background-color: #f0f9ff !important;
}

:deep(.monaco-editor .line-numbers) {
  color: #9ca3af !important;
}
</style>