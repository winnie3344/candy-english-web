<template>
  <div class="min-h-screen bg-[var(--color-bg)]">
    <!-- 密码验证模态框 -->
    <div v-if="!verified" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
      <div class="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-br from-[#FF6B6B] to-[#E17055] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <i class="fas fa-lock text-white text-2xl"></i>
          </div>
          <h3 class="font-bold text-lg" style="font-family: var(--font-display)">家长验证</h3>
          <p class="text-sm text-[var(--color-text-light)] mt-1">请输入家长密码进入设置</p>
        </div>
        
        <input v-model="parentPasswordInput" type="password"
               class="w-full h-12 px-4 rounded-xl bg-[#FFF9F0] border-2 border-transparent focus:border-[var(--color-primary)] focus:outline-none text-center text-lg mb-4"
               placeholder="家长密码">
        
        <button @click="verifyPassword" :disabled="verifying"
                class="w-full h-12 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] rounded-xl text-white font-bold text-sm">
          <i v-if="verifying" class="fas fa-spinner fa-spin mr-2"></i>
          <span v-else>验证</span>
        </button>
        
        <button @click="router.replace('/')" class="w-full mt-4 text-sm text-[var(--color-text-light)]">
          返回首页
        </button>
      </div>
    </div>

    <!-- 设置主界面 -->
    <div v-if="verified" class="pb-24">
      <!-- 顶部 -->
      <div class="bg-gradient-to-br from-[#FF6B6B] to-[#E17055] px-6 pt-6 pb-8 rounded-b-[2rem]">
        <div class="flex items-center justify-between mb-4">
          <button @click="router.back()" class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <i class="fas fa-arrow-left text-white"></i>
          </button>
          <h1 class="text-white font-bold text-lg" style="font-family: var(--font-display)">设置管理</h1>
          <div class="w-10"></div>
        </div>
        <p class="text-white/80 text-sm text-center">家长管理区域</p>
      </div>

      <!-- 设置内容 -->
      <div class="px-6 -mt-6 space-y-4">
        <!-- 闪卡设置 -->
        <div class="bg-white rounded-3xl p-5 shadow-sm">
          <h3 class="font-bold text-sm mb-4 flex items-center gap-2">
            <i class="fas fa-layer-group text-[var(--color-primary)]"></i>
            闪卡设置
          </h3>
          
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm text-[var(--color-text)]">每日闪卡数量</span>
            <div class="flex items-center gap-2">
              <button @click="dailyCount > 5 && setDailyCount(dailyCount - 5)"
                      class="w-8 h-8 bg-[#FFF9F0] rounded-lg flex items-center justify-center">
                <i class="fas fa-minus text-xs text-[var(--color-text)]"></i>
              </button>
              <span class="w-12 text-center font-bold text-lg">{{ dailyCount }}</span>
              <button @click="dailyCount < 50 && setDailyCount(dailyCount + 5)"
                      class="w-8 h-8 bg-[#FFF9F0] rounded-lg flex items-center justify-center">
                <i class="fas fa-plus text-xs text-[var(--color-text)]"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 单词库导入 -->
        <div class="bg-white rounded-3xl p-5 shadow-sm">
          <h3 class="font-bold text-sm mb-4 flex items-center gap-2">
            <i class="fas fa-book text-[var(--color-secondary)]"></i>
            单词库导入
          </h3>
          
          <div class="grid grid-cols-2 gap-3 mb-4">
            <button v-for="bank in wordBanks" :key="bank.key"
                    @click="importWordBank(bank.key)"
                    class="p-3 rounded-xl bg-[#FFF9F0] text-left active:scale-[0.98] transition-transform">
              <i :class="bank.icon" class="text-[var(--color-secondary)] mr-2"></i>
              <span class="text-xs font-medium">{{ bank.name }}</span>
              <span class="block text-xs text-[var(--color-text-light)] mt-1">{{ bank.words.length }}词</span>
            </button>
          </div>
          
          <!-- 已导入单词统计 -->
          <div class="bg-[#E8F8F5] rounded-xl p-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-[var(--color-success)]">已导入单词</span>
              <span class="font-bold text-[var(--color-success)]">{{ importedCount }}个</span>
            </div>
          </div>
        </div>

        <!-- 资源管理 -->
        <div class="bg-white rounded-3xl p-5 shadow-sm">
          <h3 class="font-bold text-sm mb-4 flex items-center gap-2">
            <i class="fas fa-folder text-[var(--color-warning)]"></i>
            资源管理
          </h3>
          
          <!-- 上传按钮 -->
          <div class="grid grid-cols-3 gap-3 mb-4">
            <button @click="uploadFile('audio')"
                    class="p-3 rounded-xl bg-gradient-to-br from-[#4ECDC4] to-[#44B5AD] text-white text-center">
              <i class="fas fa-music mb-1"></i>
              <span class="block text-xs">上传音频</span>
            </button>
            <button @click="uploadFile('video')"
                    class="p-3 rounded-xl bg-gradient-to-br from-[#FFE66D] to-[#FFD93D] text-white text-center">
              <i class="fas fa-video mb-1"></i>
              <span class="block text-xs">上传视频</span>
            </button>
            <button @click="uploadFile('book')"
                    class="p-3 rounded-xl bg-gradient-to-br from-[#A29BFE] to-[#6C5CE7] text-white text-center">
              <i class="fas fa-book mb-1"></i>
              <span class="block text-xs">上传绘本</span>
            </button>
          </div>
          
          <!-- 隐藏的文件上传 -->
          <input ref="fileInput" type="file" accept="*" @change="handleFileUpload" class="hidden">
          
          <!-- 资源列表 -->
          <div v-if="resources.length > 0" class="space-y-2">
            <div v-for="resource in resources" :key="resource.id"
                 class="flex items-center gap-3 p-2 rounded-xl bg-[#FFF9F0]">
              <i class="fas text-sm" :class="{
                'fa-music text-[var(--color-secondary)]': resource.type === 'audio',
                'fa-video text-[var(--color-warning)]': resource.type === 'video',
                'fa-book text-[#A29BFE]': resource.type === 'book'
              }"></i>
              <span class="flex-1 text-sm truncate">{{ resource.title }}</span>
              <button @click="deleteResource(resource)" class="w-8 h-8 rounded-lg flex items-center justify-center">
                <i class="fas fa-trash text-[var(--color-danger)] text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 学习记录 -->
        <div class="bg-white rounded-3xl p-5 shadow-sm">
          <h3 class="font-bold text-sm mb-4 flex items-center gap-2">
            <i class="fas fa-chart-line text-[var(--color-success)]"></i>
            今日学习情况
          </h3>
          
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-[#FFF0F0] rounded-xl p-3 text-center">
              <div class="text-2xl font-bold text-[var(--color-primary)]">{{ todayStats.flashcards }}</div>
              <div class="text-xs text-[var(--color-text-light)]">闪卡次数</div>
            </div>
            <div class="bg-[#E8F8F5] rounded-xl p-3 text-center">
              <div class="text-2xl font-bold text-[var(--color-success)]">{{ todayStats.audio }}</div>
              <div class="text-xs text-[var(--color-text-light)]">音频播放</div>
            </div>
            <div class="bg-[#FFF8E8] rounded-xl p-3 text-center">
              <div class="text-2xl font-bold text-[var(--color-warning)]">{{ todayStats.minutes }}</div>
              <div class="text-xs text-[var(--color-text-light)]">学习分钟</div>
            </div>
          </div>
        </div>

        <!-- 退出登录 -->
        <button @click="logout"
                class="w-full h-12 bg-[#FFF9F0] rounded-xl text-[var(--color-danger)] font-medium text-sm flex items-center justify-center gap-2">
          <i class="fas fa-sign-out-alt"></i>
          退出登录
        </button>
      </div>
    </div>

    <NavBar v-if="verified" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import { wordBanks } from '../data/word-banks.js'

const router = useRouter()
const toast = inject('toast')

const verified = ref(false)
const verifying = ref(false)
const parentPasswordInput = ref('')
const dailyCount = ref(10)
const importedCount = ref(0)
const resources = ref([])
const uploadType = ref('')
const fileInput = ref(null)
const todayStats = ref({ flashcards: 0, audio: 0, minutes: 0 })

const verifyPassword = () => {
  verifying.value = true
  
  const user = JSON.parse(localStorage.getItem('candy_user'))
  const users = JSON.parse(localStorage.getItem('candy_users') || '[]')
  const userInfo = users.find(u => u.id === user.id)
  
  if (userInfo && userInfo.parentPassword === parentPasswordInput.value) {
    verified.value = true
    toast('验证成功', 'success')
  } else {
    toast('密码错误', 'error')
  }
  
  verifying.value = false
}

const setDailyCount = (count) => {
  dailyCount.value = count
  const user = JSON.parse(localStorage.getItem('candy_user'))
  const settings = JSON.parse(localStorage.getItem(`candy_settings_${user.id}`) || '{}')
  settings.dailyFlashcardCount = count
  localStorage.setItem(`candy_settings_${user.id}`, JSON.stringify(settings))
  toast('设置已保存', 'success')
}

const importWordBank = (key) => {
  const user = JSON.parse(localStorage.getItem('candy_user'))
  const bank = wordBanks[key]
  if (!bank) return
  
  const userWords = JSON.parse(localStorage.getItem(`candy_words_${user.id}`) || '[]')
  
  // 添加新词（避免重复）
  bank.words.forEach(word => {
    if (!userWords.some(w => w.word === word.word)) {
      userWords.push({
        ...word,
        id: `${user.id}_${word.word}_${Date.now()}`,
        user_id: user.id,
        createdAt: Date.now(),
        reviewCount: 0
      })
    }
  })
  
  localStorage.setItem(`candy_words_${user.id}`, JSON.stringify(userWords))
  importedCount.value = userWords.length
  toast(`已导入 ${bank.words.length} 个单词`, 'success')
}

const uploadFile = (type) => {
  uploadType.value = type
  fileInput.value.accept = type === 'audio' ? 'audio/*' : type === 'video' ? 'video/*' : '.pdf'
  fileInput.value.click()
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  
  const user = JSON.parse(localStorage.getItem('candy_user'))
  const key = `candy_${uploadType.value}_${user.id}`
  const list = JSON.parse(localStorage.getItem(key) || '[]')
  
  // 创建本地 URL（实际部署时上传到云存储）
  const url = URL.createObjectURL(file)
  
  list.push({
    id: Date.now().toString(),
    type: uploadType.value,
    title: file.name,
    url,
    createdAt: Date.now()
  })
  
  localStorage.setItem(key, JSON.stringify(list))
  loadResources()
  toast('上传成功', 'success')
}

const deleteResource = (resource) => {
  const user = JSON.parse(localStorage.getItem('candy_user'))
  const key = `candy_${resource.type}_${user.id}`
  const list = JSON.parse(localStorage.getItem(key) || '[]')
  const index = list.findIndex(r => r.id === resource.id)
  
  if (index !== -1) {
    list.splice(index, 1)
    localStorage.setItem(key, JSON.stringify(list))
    loadResources()
    toast('已删除', 'success')
  }
}

const loadResources = () => {
  const user = JSON.parse(localStorage.getItem('candy_user'))
  if (!user) return
  
  const audio = JSON.parse(localStorage.getItem(`candy_audio_${user.id}`) || '[]')
  const video = JSON.parse(localStorage.getItem(`candy_video_${user.id}`) || '[]')
  const book = JSON.parse(localStorage.getItem(`candy_book_${user.id}`) || '[]')
  
  resources.value = [...audio, ...video, ...book]
}

const logout = () => {
  localStorage.removeItem('candy_user')
  router.replace('/login')
  toast('已退出登录', 'success')
}

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('candy_user'))
  if (!user) {
    router.replace('/login')
    return
  }
  
  // 加载设置
  const settings = JSON.parse(localStorage.getItem(`candy_settings_${user.id}`) || '{"dailyFlashcardCount":10}')
  dailyCount.value = settings.dailyFlashcardCount || 10
  
  // 加载单词数量
  const words = JSON.parse(localStorage.getItem(`candy_words_${user.id}`) || '[]')
  importedCount.value = words.length
  
  // 加载资源
  loadResources()
  
  // 加载今日统计
  const records = JSON.parse(localStorage.getItem('candy_records') || '[]')
  const today = new Date().toDateString()
  const todayRecords = records.filter(r => new Date(r.recorded_at).toDateString() === today)
  
  todayStats.value = {
    flashcards: todayRecords.filter(r => r.type === 'flashcard').length,
    audio: todayRecords.filter(r => r.type === 'audio').length,
    minutes: Math.round(todayRecords.reduce((sum, r) => sum + (r.duration || 60), 0) / 60)
  }
})
</script>