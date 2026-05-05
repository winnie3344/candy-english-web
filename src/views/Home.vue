<template>
  <div class="min-h-screen bg-[var(--color-bg)]">
    <!-- 顶部装饰 -->
    <div class="relative overflow-hidden bg-gradient-to-br from-[#FF6B6B] via-[#FF8E8E] to-[#4ECDC4] px-6 pt-8 pb-16 rounded-b-[2rem]">
      <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
      <div class="absolute top-12 left-4 w-16 h-16 bg-white/10 rounded-full"></div>
      
      <!-- Logo 和欢迎 -->
      <div class="relative z-10 flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center">
            <span class="text-2xl">🍬</span>
          </div>
          <div>
            <h1 class="text-white font-bold text-xl" style="font-family: var(--font-display)">糖果学英语</h1>
            <p class="text-white/70 text-xs">让学习像吃糖果一样甜蜜</p>
          </div>
        </div>
        <button @click="goTo('/settings')" class="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
          <i class="fas fa-cog text-white text-sm"></i>
        </button>
      </div>

      <!-- 今日学习统计 -->
      <div class="relative z-10 grid grid-cols-3 gap-3 mb-2">
        <div class="bg-white/20 backdrop-blur rounded-2xl p-3 text-center">
          <div class="text-white text-2xl font-bold" style="font-family: var(--font-display)">{{ todayStats.words }}</div>
          <div class="text-white/80 text-xs">今日闪卡</div>
        </div>
        <div class="bg-white/20 backdrop-blur rounded-2xl p-3 text-center">
          <div class="text-white text-2xl font-bold" style="font-family: var(--font-display)">{{ todayStats.minutes }}</div>
          <div class="text-white/80 text-xs">学习分钟</div>
        </div>
        <div class="bg-white/20 backdrop-blur rounded-2xl p-3 text-center">
          <div class="text-white text-2xl font-bold" style="font-family: var(--font-display)">{{ todayStats.streak }}</div>
          <div class="text-white/80 text-xs">连续天数</div>
        </div>
      </div>
    </div>

    <!-- 快速入口 -->
    <div class="px-6 -mt-8 relative z-20">
      <div class="grid grid-cols-2 gap-4">
        <!-- 闪卡 -->
        <button @click="goTo('/flashcard')" class="bg-white rounded-3xl p-5 shadow-lg active:scale-95 transition-transform">
          <div class="w-14 h-14 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] rounded-2xl flex items-center justify-center mb-3 shadow-md">
            <i class="fas fa-layer-group text-white text-xl"></i>
          </div>
          <h3 class="text-[var(--color-text)] font-bold text-base" style="font-family: var(--font-display)">闪卡学习</h3>
          <p class="text-[var(--color-text-light)] text-xs mt-1">艾宾浩斯记忆法</p>
        </button>

        <!-- 磨耳朵 -->
        <button @click="goTo('/audio')" class="bg-white rounded-3xl p-5 shadow-lg active:scale-95 transition-transform">
          <div class="w-14 h-14 bg-gradient-to-br from-[#4ECDC4] to-[#44B5AD] rounded-2xl flex items-center justify-center mb-3 shadow-md">
            <i class="fas fa-headphones text-white text-xl"></i>
          </div>
          <h3 class="text-[var(--color-text)] font-bold text-base" style="font-family: var(--font-display)">磨耳朵</h3>
          <p class="text-[var(--color-text-light)] text-xs mt-1">听音乐学英语</p>
        </button>

        <!-- 看视频 -->
        <button @click="goTo('/video')" class="bg-white rounded-3xl p-5 shadow-lg active:scale-95 transition-transform">
          <div class="w-14 h-14 bg-gradient-to-br from-[#FFE66D] to-[#FFD93D] rounded-2xl flex items-center justify-center mb-3 shadow-md">
            <i class="fas fa-play text-white text-xl"></i>
          </div>
          <h3 class="text-[var(--color-text)] font-bold text-base" style="font-family: var(--font-display)">看视频</h3>
          <p class="text-[var(--color-text-light)] text-xs mt-1">看动画学英语</p>
        </button>

        <!-- 看绘本 -->
        <button @click="goTo('/book')" class="bg-white rounded-3xl p-5 shadow-lg active:scale-95 transition-transform">
          <div class="w-14 h-14 bg-gradient-to-br from-[#A29BFE] to-[#6C5CE7] rounded-2xl flex items-center justify-center mb-3 shadow-md">
            <i class="fas fa-book-open text-white text-xl"></i>
          </div>
          <h3 class="text-[var(--color-text)] font-bold text-base" style="font-family: var(--font-display)">看绘本</h3>
          <p class="text-[var(--color-text-light)] text-xs mt-1">读绘本学英语</p>
        </button>
      </div>
    </div>

    <!-- 学习进度 -->
    <div class="px-6 mt-6 pb-24">
      <div class="bg-white rounded-3xl p-5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-base" style="font-family: var(--font-display)">本周学习</h3>
          <span class="text-xs text-[var(--color-text-light)]">{{ weekRange }}</span>
        </div>
        <div class="flex items-end justify-between gap-2 h-24">
          <div v-for="(day, index) in weekData" :key="index" class="flex-1 flex flex-col items-center gap-1">
            <div class="w-full rounded-lg transition-all" 
                 :class="day.today ? 'bg-[var(--color-primary)]' : 'bg-[#FFE8E8]'"
                 :style="{ height: day.height + '%' }">
            </div>
            <span class="text-[10px] text-[var(--color-text-light)]" :class="{ 'text-[var(--color-primary)] font-bold': day.today }">
              {{ day.label }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <NavBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'

const router = useRouter()
const goTo = (path) => router.push(path)

const todayStats = ref({
  words: 0,
  minutes: 0,
  streak: 1
})

const weekData = ref([])

const weekRange = computed(() => {
  const now = new Date()
  const dayOfWeek = now.getDay() || 7
  const start = new Date(now)
  start.setDate(now.getDate() - dayOfWeek + 1)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}`
})

onMounted(() => {
  // 加载今日统计
  const records = JSON.parse(localStorage.getItem('candy_records') || '[]')
  const today = new Date().toDateString()
  const todayRecords = records.filter(r => new Date(r.recorded_at).toDateString() === today)
  
  todayStats.value.words = todayRecords.filter(r => r.type === 'flashcard').length
  todayStats.value.minutes = Math.round(todayRecords.reduce((sum, r) => sum + (r.duration || 0), 0) / 60)
  
  // 计算连续天数
  let streak = 0
  const checkDate = new Date()
  while (true) {
    const dateStr = checkDate.toDateString()
    const hasRecord = records.some(r => new Date(r.recorded_at).toDateString() === dateStr)
    if (hasRecord || streak === 0) {
      if (hasRecord) streak++
      checkDate.setDate(checkDate.getDate() - 1)
      if (!hasRecord && streak > 0) break
    } else {
      break
    }
  }
  todayStats.value.streak = streak || 1

  // 加载周数据
  const days = ['一', '二', '三', '四', '五', '六', '日']
  const currentDayOfWeek = new Date().getDay() || 7
  const maxMinutes = 30
  
  weekData.value = days.map((label, i) => {
    const dayNum = i + 1
    const date = new Date()
    date.setDate(date.getDate() - (currentDayOfWeek - dayNum))
    const dateStr = date.toDateString()
    const dayRecords = records.filter(r => new Date(r.recorded_at).toDateString() === dateStr)
    const minutes = Math.round(dayRecords.reduce((sum, r) => sum + (r.duration || 0), 0) / 60)
    
    return {
      label,
      height: Math.min(Math.max(minutes / maxMinutes * 100, 8), 100),
      today: dayNum === currentDayOfWeek
    }
  })
})
</script>
