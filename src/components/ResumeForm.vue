<template>
  <div class="resume-form">
    <el-scrollbar height="100%">
      <div class="form-content">
        <!-- 个人信息 -->
        <el-card class="section-card" shadow="never">
          <template #header>
            <div class="section-header">
              <el-icon>
                <User />
              </el-icon>
              <span>个人信息</span>
            </div>
          </template>

          <el-form :model="resumeData.personalInfo" label-width="80px" size="small">
            <el-form-item label="姓名">
              <el-input v-model="resumeData.personalInfo.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="职位">
              <el-input v-model="resumeData.personalInfo.title" placeholder="请输入职位" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="resumeData.personalInfo.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="resumeData.personalInfo.phone" placeholder="请输入电话" />
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="resumeData.personalInfo.address" placeholder="请输入地址" />
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input v-model="resumeData.personalInfo.summary" type="textarea" :rows="3" placeholder="请输入个人简介" />
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 工作经历 -->
        <el-card class="section-card" shadow="never">
          <template #header>
            <div class="section-header">
              <el-icon>
                <Briefcase />
              </el-icon>
              <span>工作经历</span>
              <el-button type="primary" size="small" @click="addExperience" :icon="Plus">
                添加
              </el-button>
            </div>
          </template>

          <div v-if="resumeData.experience.length === 0" class="empty-state">
            <el-empty description="暂无工作经历" :image-size="80" />
          </div>

          <div v-else>
            <div v-for="(exp, index) in resumeData.experience" :key="exp.id" class="experience-item">
              <div class="item-header">
                <span class="item-title">工作经历 {{ index + 1 }}</span>
                <div class="item-actions">
                  <el-button size="small" @click="moveExperience(index, -1)" :disabled="index === 0" :icon="ArrowUp" />
                  <el-button size="small" @click="moveExperience(index, 1)"
                    :disabled="index === resumeData.experience.length - 1" :icon="ArrowDown" />
                  <el-button size="small" type="danger" @click="removeExperience(index)" :icon="Delete" />
                </div>
              </div>

              <el-form :model="exp" label-width="80px" size="small">
                <el-form-item label="公司名称">
                  <el-input v-model="exp.company" placeholder="请输入公司名称" />
                </el-form-item>
                <el-form-item label="职位">
                  <el-input v-model="exp.position" placeholder="请输入职位" />
                </el-form-item>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="开始时间">
                      <el-input v-model="exp.startDate" placeholder="2022-01" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="结束时间">
                      <el-input v-model="exp.endDate" placeholder="至今" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="工作描述">
                  <el-input v-model="exp.description" type="textarea" :rows="3" placeholder="请输入工作描述" />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-card>

        <!-- 教育经历 -->
        <el-card class="section-card" shadow="never">
          <template #header>
            <div class="section-header">
              <el-icon>
                <School />
              </el-icon>
              <span>教育经历</span>
              <el-button type="primary" size="small" @click="addEducation" :icon="Plus">
                添加
              </el-button>
            </div>
          </template>

          <div v-if="resumeData.education.length === 0" class="empty-state">
            <el-empty description="暂无教育经历" :image-size="80" />
          </div>

          <div v-else>
            <div v-for="(edu, index) in resumeData.education" :key="edu.id" class="education-item">
              <div class="item-header">
                <span class="item-title">教育经历 {{ index + 1 }}</span>
                <div class="item-actions">
                  <el-button size="small" @click="moveEducation(index, -1)" :disabled="index === 0" :icon="ArrowUp" />
                  <el-button size="small" @click="moveEducation(index, 1)"
                    :disabled="index === resumeData.education.length - 1" :icon="ArrowDown" />
                  <el-button size="small" type="danger" @click="removeEducation(index)" :icon="Delete" />
                </div>
              </div>

              <el-form :model="edu" label-width="80px" size="small">
                <el-form-item label="学校名称">
                  <el-input v-model="edu.school" placeholder="请输入学校名称" />
                </el-form-item>
                <el-form-item label="学历">
                  <el-input v-model="edu.degree" placeholder="学士/硕士/博士" />
                </el-form-item>
                <el-form-item label="专业">
                  <el-input v-model="edu.major" placeholder="请输入专业" />
                </el-form-item>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <el-form-item label="开始时间">
                      <el-input v-model="edu.startDate" placeholder="2018-09" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="结束时间">
                      <el-input v-model="edu.endDate" placeholder="2022-06" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
        </el-card>

        <!-- 技能 -->
        <el-card class="section-card" shadow="never">
          <template #header>
            <div class="section-header">
              <el-icon>
                <Tools />
              </el-icon>
              <span>技能</span>
              <el-button type="primary" size="small" @click="addSkill" :icon="Plus">
                添加
              </el-button>
            </div>
          </template>

          <div v-if="resumeData.skills.length === 0" class="empty-state">
            <el-empty description="暂无技能" :image-size="80" />
          </div>

          <div v-else>
            <div v-for="(skill, index) in resumeData.skills" :key="skill.id" class="skill-item">
              <el-row :gutter="16" align="middle">
                <el-col :span="8">
                  <el-input v-model="skill.name" placeholder="技能名称" size="small" />
                </el-col>
                <el-col :span="12">
                  <el-slider v-model="skill.level" :min="0" :max="100" :step="5" show-input size="small" />
                </el-col>
                <el-col :span="4">
                  <el-button size="small" type="danger" @click="removeSkill(index)" :icon="Delete" />
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>

        <!-- 项目经历 -->
        <el-card class="section-card" shadow="never">
          <template #header>
            <div class="section-header">
              <el-icon>
                <Folder />
              </el-icon>
              <span>项目经历</span>
              <el-button type="primary" size="small" @click="addProject" :icon="Plus">
                添加
              </el-button>
            </div>
          </template>

          <div v-if="resumeData.projects.length === 0" class="empty-state">
            <el-empty description="暂无项目经历" :image-size="80" />
          </div>

          <div v-else>
            <div v-for="(project, index) in resumeData.projects" :key="project.id" class="project-item">
              <div class="item-header">
                <span class="item-title">项目 {{ index + 1 }}</span>
                <div class="item-actions">
                  <el-button size="small" @click="moveProject(index, -1)" :disabled="index === 0" :icon="ArrowUp" />
                  <el-button size="small" @click="moveProject(index, 1)"
                    :disabled="index === resumeData.projects.length - 1" :icon="ArrowDown" />
                  <el-button size="small" type="danger" @click="removeProject(index)" :icon="Delete" />
                </div>
              </div>

              <el-form :model="project" label-width="80px" size="small">
                <el-form-item label="项目名称">
                  <el-input v-model="project.name" placeholder="请输入项目名称" />
                </el-form-item>
                <el-form-item label="项目描述">
                  <el-input v-model="project.description" type="textarea" :rows="3" placeholder="请输入项目描述" />
                </el-form-item>
                <el-form-item label="技术栈">
                  <el-select v-model="project.technologies" multiple filterable allow-create placeholder="请选择或输入技术栈"
                    style="width: 100%">
                    <el-option v-for="tech in commonTechnologies" :key="tech" :label="tech" :value="tech" />
                  </el-select>
                </el-form-item>
                <el-form-item label="项目链接">
                  <el-input v-model="project.url" placeholder="https://github.com/..." />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-card>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useResumeStore } from '@/stores/resume'
import {
  User,
  Briefcase,
  School,
  Tools,
  Folder,
  Plus,
  Delete,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const resumeStore = useResumeStore()
const resumeData = computed(() => resumeStore.resumeData)

// 常用技术栈选项
const commonTechnologies = [
  'Vue.js', 'React', 'Angular', 'JavaScript', 'TypeScript',
  'Node.js', 'Express', 'Koa', 'Nest.js',
  'HTML', 'CSS', 'Sass', 'Less', 'Tailwind CSS',
  'Webpack', 'Vite', 'Rollup', 'Parcel',
  'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'Python', 'Java', 'C++', 'Go', 'Rust'
]

// 生成唯一ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

// 工作经历操作
const addExperience = () => {
  resumeData.value.experience.push({
    id: generateId(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  })
  ElMessage.success('已添加工作经历')
}

const removeExperience = (index: number) => {
  resumeData.value.experience.splice(index, 1)
  ElMessage.success('已删除工作经历')
}

const moveExperience = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < resumeData.value.experience.length) {
    const item = resumeData.value.experience.splice(index, 1)[0]
    resumeData.value.experience.splice(newIndex, 0, item)
    ElMessage.success('已移动工作经历')
  }
}

// 教育经历操作
const addEducation = () => {
  resumeData.value.education.push({
    id: generateId(),
    school: '',
    degree: '',
    major: '',
    startDate: '',
    endDate: ''
  })
  ElMessage.success('已添加教育经历')
}

const removeEducation = (index: number) => {
  resumeData.value.education.splice(index, 1)
  ElMessage.success('已删除教育经历')
}

const moveEducation = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < resumeData.value.education.length) {
    const item = resumeData.value.education.splice(index, 1)[0]
    resumeData.value.education.splice(newIndex, 0, item)
    ElMessage.success('已移动教育经历')
  }
}

// 技能操作
const addSkill = () => {
  resumeData.value.skills.push({
    id: generateId(),
    name: '',
    level: 0
  })
  ElMessage.success('已添加技能')
}

const removeSkill = (index: number) => {
  resumeData.value.skills.splice(index, 1)
  ElMessage.success('已删除技能')
}

// 项目经历操作
const addProject = () => {
  resumeData.value.projects.push({
    id: generateId(),
    name: '',
    description: '',
    technologies: [],
    url: ''
  })
  ElMessage.success('已添加项目经历')
}

const removeProject = (index: number) => {
  resumeData.value.projects.splice(index, 1)
  ElMessage.success('已删除项目经历')
}

const moveProject = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < resumeData.value.projects.length) {
    const item = resumeData.value.projects.splice(index, 1)[0]
    resumeData.value.projects.splice(newIndex, 0, item)
    ElMessage.success('已移动项目经历')
  }
}
</script>

<style scoped>
.resume-form {
  padding: 20px;
}

.section-card {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.empty-state {
  text-align: center;
  margin: 20px 0;
}
</style>