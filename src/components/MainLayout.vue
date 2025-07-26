<template>
  <div class="main-layout">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="header-left">
        <h1 class="title">在线简历生成器</h1>
      </div>
      <div class="header-right">
        <el-button-group>
          <el-button :disabled="!canUndo" @click="handleUndo" :icon="RefreshLeft" size="small">
            撤销
          </el-button>
          <el-button :disabled="!canRedo" @click="handleRedo" :icon="RefreshRight" size="small">
            重做
          </el-button>
        </el-button-group>
        <el-button type="primary" @click="handleSave" :icon="Download" size="small">
          保存
        </el-button>
        <el-button type="success" @click="handleExportPDF" :icon="Document" size="small">
          导出PDF
        </el-button>
      </div>
    </el-header>

    <!-- 主体内容区域 -->
    <el-container class="main-container">
      <!-- 左侧面板 -->
      <el-aside class="left-panel" :width="leftPanelWidth + 'px'">
        <div class="panel-header">
          <el-radio-group v-model="activeTab" size="small">
            <el-radio-button value="form">表单编辑</el-radio-button>
            <el-radio-button value="json">JSON编辑</el-radio-button>
          </el-radio-group>
        </div>

        <div class="panel-content">
          <!-- 表单编辑模式 -->
          <div v-if="activeTab === 'form'" class="form-editor">
            <ResumeForm />
          </div>

          <!-- JSON编辑模式 -->
          <div v-if="activeTab === 'json'" class="json-editor">
            <MonacoEditor />
          </div>
        </div>
      </el-aside>

      <!-- 分割线 -->
      <div class="splitter" @mousedown="startResize" :style="{ cursor: isResizing ? 'col-resize' : 'col-resize' }">
      </div>

      <!-- 右侧预览区域 -->
      <el-main class="right-panel">
        <div class="preview-header">
          <div class="preview-controls">
            <el-button-group size="small">
              <el-button :type="viewMode === 'edit' ? 'primary' : ''" @click="viewMode = 'edit'" :icon="Edit">
                编辑模式
              </el-button>
              <el-button :type="viewMode === 'preview' ? 'primary' : ''" @click="viewMode = 'preview'" :icon="View">
                预览模式
              </el-button>
            </el-button-group>

            <div class="zoom-controls">
              <el-button size="small" @click="zoomOut" :icon="ZoomOut" :disabled="zoomLevel <= 50"></el-button>
              <span class="zoom-level">{{ zoomLevel }}%</span>
              <el-button size="small" @click="zoomIn" :icon="ZoomIn" :disabled="zoomLevel >= 200"></el-button>
            </div>
          </div>
        </div>

        <div class="preview-content" :style="{ transform: `scale(${zoomLevel / 100})` }">
          <ResumePreview :view-mode="viewMode" />
        </div>
      </el-main>
    </el-container>

    <!-- 保存状态指示器 -->
    <div v-if="saveStatus" class="save-indicator" :class="saveStatus">
      <el-icon>
        <Check v-if="saveStatus === 'saved'" />
        <Loading v-else />
      </el-icon>
      {{ saveStatus === 'saving' ? '保存中...' : '已保存' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useResumeStore } from '@/stores/resume'
import {
  RefreshLeft,
  RefreshRight,
  Download,
  Document,
  Edit,
  View,
  ZoomIn,
  ZoomOut,
  Check,
  Loading
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import ResumeForm from './ResumeForm.vue'
import MonacoEditor from './MonacoEditor.vue'
import ResumePreview from './ResumePreview.vue'

const resumeStore = useResumeStore()

// 响应式数据
const activeTab = ref<'form' | 'json'>('form')
const viewMode = ref<'edit' | 'preview'>('edit')
const zoomLevel = ref(100)
const leftPanelWidth = ref(600)
const isResizing = ref(false)
const saveStatus = ref<'saving' | 'saved' | null>(null)

// 计算属性
const { canUndo, canRedo } = resumeStore

// 撤销/重做操作
const handleUndo = () => {
  if (resumeStore.undo()) {
    ElMessage.success('撤销成功')
  }
}

const handleRedo = () => {
  if (resumeStore.redo()) {
    ElMessage.success('重做成功')
  }
}

// 缩放控制
const zoomIn = () => {
  if (zoomLevel.value < 200) {
    zoomLevel.value += 10
  }
}

const zoomOut = () => {
  if (zoomLevel.value > 50) {
    zoomLevel.value -= 10
  }
}

// 面板大小调整
const startResize = (e: MouseEvent) => {
  isResizing.value = true
  const startX = e.clientX
  const startWidth = leftPanelWidth.value

  const handleMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startX
    const newWidth = startWidth + deltaX
    if (newWidth >= 300 && newWidth <= 600) {
      leftPanelWidth.value = newWidth
    }
  }

  const handleMouseUp = () => {
    isResizing.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// 保存功能
const handleSave = () => {
  saveStatus.value = 'saving'

  // 模拟保存过程
  setTimeout(() => {
    // 这里可以实现实际的保存逻辑，比如保存到localStorage或发送到服务器
    localStorage.setItem('resumeData', JSON.stringify(resumeStore.resumeData))
    saveStatus.value = 'saved'
    ElMessage.success('保存成功')

    // 2秒后隐藏保存指示器
    setTimeout(() => {
      saveStatus.value = null
    }, 2000)
  }, 1000)
}

// 导出PDF功能
const handleExportPDF = async () => {
  try {
    ElMessage.info('正在生成PDF...')
    // 这里将在后续实现PDF导出功能
    // 使用jsPDF + html2canvas
    ElMessage.success('PDF导出功能即将实现')
  } catch (error) {
    ElMessage.error('PDF导出失败')
    console.error('PDF导出错误:', error)
  }
}

// 键盘快捷键
const handleKeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'z':
        e.preventDefault()
        if (e.shiftKey) {
          handleRedo()
        } else {
          handleUndo()
        }
        break
      case 's':
        e.preventDefault()
        handleSave()
        break
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)

  // 尝试从localStorage加载数据
  const savedData = localStorage.getItem('resumeData')
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData)
      resumeStore.updateResumeData(parsed)
    } catch (error) {
      console.error('加载保存的数据失败:', error)
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.header-left .title {
  margin: 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.main-container {
  flex: 1;
  width: 100%;
  min-width: 1500px;
  height: calc(100vh - 60px);
}

.left-panel {
  background: #f5f7fa;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  background: #fff;
}

.panel-content {
  flex: 1;
  overflow: hidden;
}

.form-editor,
.json-editor {
  height: 100%;
  overflow-y: auto;
}

.splitter {
  width: 4px;
  background: #e4e7ed;
  cursor: col-resize;
  transition: background-color 0.2s;
}

.splitter:hover {
  background: #409eff;
}

.right-panel {
  background: #fff;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.preview-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  background: #f5f7fa;
}

.preview-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-level {
  font-size: 14px;
  color: #606266;
  min-width: 40px;
  text-align: center;
}

.preview-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
  transform-origin: top left;
  transition: transform 0.2s;
}

.save-indicator {
  position: fixed;
  top: 80px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  z-index: 1000;
  transition: all 0.3s;
}

.save-indicator.saving {
  background: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.save-indicator.saved {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}
</style>