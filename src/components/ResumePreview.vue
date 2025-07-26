<template>
  <div class="resume-preview" :class="{ 'edit-mode': viewMode === 'edit' }">
    <div class="resume-container" ref="resumeContainer">
      <!-- 个人信息区域 -->
      <div class="personal-section">
        <div class="personal-header">
          <h1 class="name" :contenteditable="viewMode === 'edit'" @blur="updatePersonalInfo('name', $event)">
            {{ resumeData.personalInfo.name }}
          </h1>
          <h2 class="title" :contenteditable="viewMode === 'edit'" @blur="updatePersonalInfo('title', $event)">
            {{ resumeData.personalInfo.title }}
          </h2>
        </div>

        <div class="contact-info">
          <div class="contact-item">
            <el-icon>
              <Message />
            </el-icon>
            <span :contenteditable="viewMode === 'edit'" @blur="updatePersonalInfo('email', $event)">
              {{ resumeData.personalInfo.email }}
            </span>
          </div>
          <div class="contact-item">
            <el-icon>
              <Phone />
            </el-icon>
            <span :contenteditable="viewMode === 'edit'" @blur="updatePersonalInfo('phone', $event)">
              {{ resumeData.personalInfo.phone }}
            </span>
          </div>
          <div class="contact-item">
            <el-icon>
              <Location />
            </el-icon>
            <span :contenteditable="viewMode === 'edit'" @blur="updatePersonalInfo('address', $event)">
              {{ resumeData.personalInfo.address }}
            </span>
          </div>
        </div>

        <div class="summary">
          <p :contenteditable="viewMode === 'edit'" @blur="updatePersonalInfo('summary', $event)">
            {{ resumeData.personalInfo.summary }}
          </p>
        </div>
      </div>

      <!-- 工作经历 -->
      <div v-if="resumeData.experience.length > 0" class="section">
        <h3 class="section-title">
          <el-icon>
            <Briefcase />
          </el-icon>
          工作经历
        </h3>
        <div class="section-content">
          <div v-for="(exp, index) in resumeData.experience" :key="exp.id" class="experience-item"
            :class="{ 'draggable': viewMode === 'edit' }" :draggable="viewMode === 'edit'"
            @dragstart="handleDragStart($event, 'experience', index)" @dragover="handleDragOver"
            @drop="handleDrop($event, 'experience', index)">
            <div class="item-header">
              <h4 class="position" :contenteditable="viewMode === 'edit'"
                @blur="updateExperience(index, 'position', $event)">
                {{ exp.position }}
              </h4>
              <span class="date-range">
                <span :contenteditable="viewMode === 'edit'" @blur="updateExperience(index, 'startDate', $event)">
                  {{ exp.startDate }}
                </span>
                -
                <span :contenteditable="viewMode === 'edit'" @blur="updateExperience(index, 'endDate', $event)">
                  {{ exp.endDate }}
                </span>
              </span>
            </div>
            <h5 class="company" :contenteditable="viewMode === 'edit'"
              @blur="updateExperience(index, 'company', $event)">
              {{ exp.company }}
            </h5>
            <p class="description" :contenteditable="viewMode === 'edit'"
              @blur="updateExperience(index, 'description', $event)">
              {{ exp.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- 教育经历 -->
      <div v-if="resumeData.education.length > 0" class="section">
        <h3 class="section-title">
          <el-icon>
            <School />
          </el-icon>
          教育经历
        </h3>
        <div class="section-content">
          <div v-for="(edu, index) in resumeData.education" :key="edu.id" class="education-item"
            :class="{ 'draggable': viewMode === 'edit' }" :draggable="viewMode === 'edit'"
            @dragstart="handleDragStart($event, 'education', index)" @dragover="handleDragOver"
            @drop="handleDrop($event, 'education', index)">
            <div class="item-header">
              <h4 class="degree" :contenteditable="viewMode === 'edit'"
                @blur="updateEducation(index, 'degree', $event)">
                {{ edu.degree }} - {{ edu.major }}
              </h4>
              <span class="date-range">
                <span :contenteditable="viewMode === 'edit'" @blur="updateEducation(index, 'startDate', $event)">
                  {{ edu.startDate }}
                </span>
                -
                <span :contenteditable="viewMode === 'edit'" @blur="updateEducation(index, 'endDate', $event)">
                  {{ edu.endDate }}
                </span>
              </span>
            </div>
            <h5 class="school" :contenteditable="viewMode === 'edit'" @blur="updateEducation(index, 'school', $event)">
              {{ edu.school }}
            </h5>
          </div>
        </div>
      </div>

      <!-- 技能 -->
      <div v-if="resumeData.skills.length > 0" class="section">
        <h3 class="section-title">
          <el-icon>
            <Tools />
          </el-icon>
          技能
        </h3>
        <div class="section-content">
          <div class="skills-grid">
            <div v-for="(skill, index) in resumeData.skills" :key="skill.id" class="skill-item">
              <div class="skill-info">
                <span class="skill-name" :contenteditable="viewMode === 'edit'"
                  @blur="updateSkill(index, 'name', $event)">
                  {{ skill.name }}
                </span>
                <span class="skill-level">{{ skill.level }}%</span>
              </div>
              <div class="skill-bar">
                <div class="skill-progress" :style="{ width: skill.level + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 项目经历 -->
      <div v-if="resumeData.projects.length > 0" class="section">
        <h3 class="section-title">
          <el-icon>
            <Folder />
          </el-icon>
          项目经历
        </h3>
        <div class="section-content">
          <div v-for="(project, index) in resumeData.projects" :key="project.id" class="project-item"
            :class="{ 'draggable': viewMode === 'edit' }" :draggable="viewMode === 'edit'"
            @dragstart="handleDragStart($event, 'projects', index)" @dragover="handleDragOver"
            @drop="handleDrop($event, 'projects', index)">
            <h4 class="project-name" :contenteditable="viewMode === 'edit'"
              @blur="updateProject(index, 'name', $event)">
              {{ project.name }}
            </h4>
            <p class="project-description" :contenteditable="viewMode === 'edit'"
              @blur="updateProject(index, 'description', $event)">
              {{ project.description }}
            </p>
            <div class="project-technologies">
              <span v-for="tech in project.technologies" :key="tech" class="tech-tag">
                {{ tech }}
              </span>
            </div>
            <div v-if="project.url" class="project-url">
              <el-icon>
                <Link />
              </el-icon>
              <a :href="project.url" target="_blank" :contenteditable="viewMode === 'edit'"
                @blur="updateProject(index, 'url', $event)">
                {{ project.url }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useResumeStore } from '@/stores/resume'
import {
  Message,
  Phone,
  Location,
  Briefcase,
  School,
  Tools,
  Folder,
  Link
} from '@element-plus/icons-vue'

interface Props {
  viewMode: 'edit' | 'preview'
}

const props = defineProps<Props>()
const resumeStore = useResumeStore()
const resumeData = computed(() => resumeStore.resumeData)
const resumeContainer = ref<HTMLElement>()

// 拖拽相关
let draggedItem: { type: string; index: number } | null = null

// 更新个人信息
const updatePersonalInfo = (field: string, event: Event) => {
  const target = event.target as HTMLElement
  const value = target.textContent || ''
  resumeData.value.personalInfo[field as keyof typeof resumeData.value.personalInfo] = value
}

// 更新工作经历
const updateExperience = (index: number, field: string, event: Event) => {
  const target = event.target as HTMLElement
  const value = target.textContent || ''
  resumeData.value.experience[index][field as keyof typeof resumeData.value.experience[0]] = value
}

// 更新教育经历
const updateEducation = (index: number, field: string, event: Event) => {
  const target = event.target as HTMLElement
  const value = target.textContent || ''
  resumeData.value.education[index][field as keyof typeof resumeData.value.education[0]] = value
}

// 更新技能
const updateSkill = (index: number, field: string, event: Event) => {
  const target = event.target as HTMLElement
  const value = target.textContent || ''
  resumeData.value.skills[index][field as keyof typeof resumeData.value.skills[0]] = value
}

// 更新项目
const updateProject = (index: number, field: string, event: Event) => {
  const target = event.target as HTMLElement
  const value = target.textContent || ''
  resumeData.value.projects[index][field as keyof typeof resumeData.value.projects[0]] = value
}

// 拖拽开始
const handleDragStart = (event: DragEvent, type: string, index: number) => {
  if (props.viewMode !== 'edit') return

  draggedItem = { type, index }
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

// 拖拽悬停
const handleDragOver = (event: DragEvent) => {
  if (props.viewMode !== 'edit') return

  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

// 拖拽放置
const handleDrop = (event: DragEvent, type: string, targetIndex: number) => {
  if (props.viewMode !== 'edit' || !draggedItem) return

  event.preventDefault()

  if (draggedItem.type === type && draggedItem.index !== targetIndex) {
    const sourceIndex = draggedItem.index
    const items = resumeData.value[type as keyof typeof resumeData.value] as any[]

    // 移动项目
    const [movedItem] = items.splice(sourceIndex, 1)
    items.splice(targetIndex, 0, movedItem)
  }

  draggedItem = null
}

// 导出预览容器引用（用于PDF生成）
defineExpose({
  resumeContainer
})
</script>

<style scoped>
.resume-preview {
  height: 100%;
  overflow-y: auto;
  background: #f5f5f5;
  padding: 20px;
}

.resume-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
}

/* 个人信息区域 */
.personal-section {
  border-bottom: 2px solid #409eff;
  padding-bottom: 20px;
  margin-bottom: 30px;
}

.personal-header {
  text-align: center;
  margin-bottom: 20px;
}

.name {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 8px 0;
}

.title {
  font-size: 18px;
  font-weight: 400;
  color: #606266;
  margin: 0;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  font-size: 14px;
}

.contact-item .el-icon {
  color: #409eff;
}

.summary {
  text-align: center;
  color: #606266;
  font-style: italic;
}

/* 章节样式 */
.section {
  margin-bottom: 30px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
  margin-bottom: 20px;
}

.section-title .el-icon {
  color: #409eff;
}

.section-content {}

/* 工作经历样式 */
.experience-item,
.education-item,
.project-item {
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 6px;
  transition: all 0.2s;
}

.edit-mode .experience-item:hover,
.edit-mode .education-item:hover,
.edit-mode .project-item:hover {
  background: #f0f9ff;
  border: 1px dashed #409eff;
}

.draggable {
  cursor: move;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.position,
.degree,
.project-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.date-range {
  font-size: 14px;
  color: #909399;
  white-space: nowrap;
}

.company,
.school {
  font-size: 14px;
  font-weight: 500;
  color: #409eff;
  margin: 0 0 8px 0;
}

.description,
.project-description {
  color: #606266;
  margin: 0;
  font-size: 14px;
}

/* 技能样式 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.skill-item {
  margin-bottom: 12px;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.skill-name {
  font-weight: 500;
  color: #303133;
}

.skill-level {
  font-size: 12px;
  color: #909399;
}

.skill-bar {
  height: 6px;
  background: #e4e7ed;
  border-radius: 3px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, #409eff, #67c23a);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* 项目样式 */
.project-technologies {
  margin: 10px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-tag {
  background: #f0f2f5;
  color: #606266;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid #e4e7ed;
}

.project-url {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}

.project-url a {
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
}

.project-url a:hover {
  text-decoration: underline;
}

.project-url .el-icon {
  color: #409eff;
  font-size: 14px;
}

/* 编辑模式样式 */
.edit-mode [contenteditable="true"] {
  border: 1px dashed transparent;
  padding: 2px 4px;
  border-radius: 3px;
  transition: all 0.2s;
}

.edit-mode [contenteditable="true"]:hover {
  border-color: #409eff;
  background: #f0f9ff;
}

.edit-mode [contenteditable="true"]:focus {
  outline: none;
  border-color: #409eff;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resume-container {
    padding: 20px;
    margin: 10px;
  }

  .contact-info {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }
}

/* 打印样式 */
@media print {
  .resume-preview {
    background: white;
    padding: 0;
  }

  .resume-container {
    box-shadow: none;
    border-radius: 0;
    max-width: none;
    margin: 0;
    padding: 20px;
  }

  .edit-mode [contenteditable="true"] {
    border: none !important;
    background: transparent !important;
  }
}
</style>
padding-left: 20px;