<template>
  <div class="min-h-screen bg-[var(--color-bg)]">
    <!-- 顶部 -->
    <div class="bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] px-6 pt-6 pb-8 rounded-b-[2rem]">
      <div class="flex items-center justify-between mb-4">
        <button @click="router.back()" class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <i class="fas fa-arrow-left text-white"></i>
        </button>
        <div class="text-center">
          <h1 class="text-white font-bold text-lg" style="font-family: var(--font-display)">闪卡学习</h1>
          <p class="text-white/70 text-xs mt-0.5">{{ currentIndex + 1 }} / {{ words.length }}</p>
        </div>
        <div class="w-10"></div>
      </div>
      
      <!-- 进度条 -->
      <div class="bg-white/20 rounded-full h-2 overflow-hidden">
        <div class="bg-white rounded-full h-2 transition-all duration-500" 
             :style="{ width: `${progress}%` }">
        </div>
      </div>
    </div>

    <!-- 主内容 -->
    <div class="px-6 -mt-6 pb-32">
      <!-- 闪卡卡片 - 可翻转 -->
      <div class="flashcard-container perspective-1000" @click="flipCard">
        <div class="flashcard-inner relative w-full transition-transform duration-500"
             :style="{ transform: isFlipped ? 'rotateY(180deg)' : '' }">
          
          <!-- 正面 - 英文 -->
          <div class="flashcard-face flashcard-front bg-white rounded-3xl p-8 shadow-lg absolute inset-0 backface-hidden">
            <div class="flex flex-col items-center justify-center h-full min-h-[300px]">
              <div class="text-7xl mb-6 animate-float">{{ currentWord?.image }}</div>
              <h2 class="text-4xl font-bold text-[var(--color-text)] mb-2" style="font-family: var(--font-display)">
                {{ currentWord?.word }}
              </h2>
              <p class="text-base text-[var(--color-text-light)]">{{ currentWord?.phonetic }}</p>
              
              <div class="mt-8 flex items-center gap-2 text-sm text-[var(--color-text-light)]">
                <i class="fas fa-hand-pointer"></i>
                <span>点击卡片查看含义</span>
              </div>
            </div>
          </div>
          
          <!-- 背面 - 中文 + 操作 -->
          <div class="flashcard-face flashcard-back bg-gradient-to-br from-[#FFF9F0] to-[#FFE8E8] rounded-3xl p-6 shadow-lg absolute inset-0 backface-hidden"
               :style="{ transform: 'rotateY(180deg)' }">
            <div class="flex flex-col items-center justify-center h-full min-h-[300px]">
              <div class="text-5xl mb-4">{{ currentWord?.image }}</div>
              <h2 class="text-2xl font-bold text-[var(--color-text)] mb-3" style="font-family: var(--font-display)">
                {{ currentWord?.word }}
              </h2>
              <div class="bg-white/80 rounded-2xl px-6 py-3 shadow-sm mb-4">
                <p class="text-2xl font-medium text-[var(--color-text)]">{{ currentWord?.meaning }}</p>
              </div>
              
              <!-- 操作按钮 -->
              <div class="flex items-center gap-3 mb-4">
                <button @click.stop="playSound" :disabled="speaking"
                        class="w-12 h-12 bg-gradient-to-br from-[#4ECDC4] to-[#44B5AD] rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-transform disabled:opacity-50">
                  <i v-if="speaking" class="fas fa-spinner fa-spin text-white"></i>
                  <i v-else class="fas fa-volume-up text-white text-lg"></i>
                </button>
                
                <button @click.stop="toggleRecording"
                        :class="recording ? 'from-[#E17055] to-[#D63031]' : 'from-[#FFE66D] to-[#FFD93D]'"
                        class="w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-transform">
                  <i v-if="recording" class="fas fa-stop text-white text-lg"></i>
                  <i v-else class="fas fa-microphone text-white text-lg"></i>
                </button>
                
                <button v-if="audioBlob" @click.stop="playRecording"
                        class="w-12 h-12 bg-gradient-to-br from-[#A29BFE] to-[#6C5CE7] rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-transform">
                  <i class="fas fa-play text-white text-lg"></i>
                </button>
              </div>
              
              <!-- 评分显示 -->
              <div v-if="score" class="mb-4">
                <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                      :class="score >= 80 ? 'bg-[#E8F8F5] text-[#00B894]' : score >= 60 ? 'bg-[#FFF8E8] text-[#FDCB6E]' : 'bg-[#FFE8E8] text-[#E17055]'">
                  <i class="fas fa-star"></i>
                  {{ score }}分
                </span>
              </div>
              
              <!-- 分隔线 -->
              <div class="w-full border-t border-dashed border-[var(--color-text-light)]/30 my-2"></div>
              
              <!-- 认识/不认识按钮 - 只在背面显示 -->
              <div class="grid grid-cols-2 gap-4 w-full mt-2">
                <button @click.stop="markWord(false)"
                        class="h-14 bg-white rounded-xl shadow-sm border-2 border-[#FFE8E8] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                  <i class="fas fa-times-circle text-xl text-[var(--color-danger)]"></i>
                  <span class="font-bold text-[var(--color-danger)]">不认识</span>
                </button>
                <button @click.stop="markWord(true)"
                        class="h-14 bg-white rounded-xl shadow-sm border-2 border-[#E8F8F5] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                  <i class="fas fa-check-circle text-xl text-[var(--color-success)]"></i>
                  <span class="font-bold text-[var(--color-success)]">认识</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="words.length === 0" class="bg-white rounded-3xl p-8 shadow-lg text-center mt-4">
        <div class="text-6xl mb-4">📚</div>
        <h3 class="text-lg font-bold text-[var(--color-text)] mb-2">暂无待学单词</h3>
        <p class="text-sm text-[var(--color-text-light)] mb-4">请去设置中导入单词库</p>
        <button @click="router.push('/settings')"
                class="px-6 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] rounded-xl text-white font-medium text-sm">
          导入单词
        </button>
      </div>
    </div>

    <!-- 完成弹窗 -->
    <div v-if="showComplete" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
      <div class="bg-white rounded-3xl p-8 w-full max-w-sm text-center animate-card-bounce">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-xl font-bold text-[var(--color-text)] mb-2" style="font-family: var(--font-display)">学习完成！</h3>
        <p class="text-sm text-[var(--color-text-light)] mb-4">
          今日完成 {{ learnedCount }} 个单词
        </p>
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-[#E8F8F5] rounded-xl p-3">
            <div class="text-2xl font-bold text-[var(--color-success)]">{{ knownCount }}</div>
            <div class="text-xs text-[var(--color-text-light)]">已认识</div>
          </div>
          <div class="bg-[#FFE8E8] rounded-xl p-3">
            <div class="text-2xl font-bold text-[var(--color-danger)]">{{ unknownCount }}</div>
            <div class="text-xs text-[var(--color-text-light)]">需复习</div>
          </div>
        </div>
        <button @click="finishLearning"
                class="w-full h-12 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] rounded-xl text-white font-bold text-sm">
          完成
        </button>
      </div>
    </div>

    <NavBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import { speak } from '../utils/tts'
import { startRecording, stopRecording, playRecording, scoreRecording } from '../utils/recorder'
import { getNextReview } from '../utils/spaced-repetition'

const router = useRouter()

const words = ref([])
const currentIndex = ref(0)
const isFlipped = ref(false)
const speaking = ref(false)
const recording = ref(false)
const audioBlob = ref(null)
const score = ref(null)
const recorder = ref(null)
const startTime = ref(null)
const showComplete = ref(false)
const knownCount = ref(0)
const unknownCount = ref(0)
const learnedCount = ref(0)

const currentWord = computed(() => words.value[currentIndex.value])

const progress = computed(() => {
  if (words.value.length === 0) return 0
  return ((currentIndex.value + 1) / words.value.length) * 100
})

const flipCard = () => {
  isFlipped.value = !isFlipped.value
}

const playSound = async () => {
  if (!currentWord.value || speaking.value) return
  speaking.value = true
  try {
    await speak(currentWord.value.word)
  } catch (e) {
    console.error('发音失败', e)
  }
  speaking.value = false
}

const toggleRecording = async () => {
  if (recording.value) {
    try {
      audioBlob.value = await stopRecording(recorder.value)
      score.value = await scoreRecording(audioBlob.value)
    } catch (e) {
      console.error('录音失败', e)
    }
    recording.value = false
  } else {
    recorder.value = await startRecording()
    recording.value = true
  }
}

const playMyRecording = async () => {
  if (audioBlob.value) {
    await playRecording(audioBlob.value)
  }
}

const markWord = (known) => {
  if (!currentWord.value) return
  
  // 记录学习
  const user = JSON.parse(localStorage.getItem('candy_user'))
  const records = JSON.parse(localStorage.getItem('candy_records') || '[]')
  const duration = startTime.value ? Math.round((Date.now() - startTime.value) / 1000) : 5
  
  const wordScore = known ? 80 : 40
  
  records.push({
    user_id: user.id,
    word_id: currentWord.value.word,
    type: 'flashcard',
    duration,
    score: wordScore,
    known,
    recorded_at: Date.now(),
    next_review: getNextReview(currentWord.value.reviewCount || 0, wordScore)
  })
  
  localStorage.setItem('candy_records', JSON.stringify(records))
  
  // 更新单词状态
  const userWords = JSON.parse(localStorage.getItem(`candy_words_${user.id}`) || '[]')
  const wordIndex = userWords.findIndex(w => w.word === currentWord.value.word)
  if (wordIndex !== -1) {
    userWords[wordIndex].last_studied = Date.now()
    userWords[wordIndex].reviewCount = (userWords[wordIndex].reviewCount || 0) + 1
    userWords[wordIndex].known = known
    userWords[wordIndex].next_review = getNextReview(userWords[wordIndex].reviewCount, wordScore)
    localStorage.setItem(`candy_words_${user.id}`, JSON.stringify(userWords))
  }
  
  if (known) {
    knownCount.value++
  } else {
    unknownCount.value++
  }
  learnedCount.value++
  
  // 下一个单词
  if (currentIndex.value < words.value.length - 1) {
    currentIndex.value++
    isFlipped.value = false
    score.value = null
    audioBlob.value = null
    startTime.value = Date.now()
  } else {
    showComplete.value = true
  }
}

const finishLearning = () => {
  router.push('/')
}

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('candy_user'))
  if (!user) return
  
  const userWords = JSON.parse(localStorage.getItem(`candy_words_${user.id}`) || '[]')
  const settings = JSON.parse(localStorage.getItem(`candy_settings_${user.id}`) || '{"dailyFlashcardCount":10}')
  const limit = settings.dailyFlashcardCount || 10
  
  // 选择需要学习的单词
  const now = Date.now()
  const needsReview = userWords.filter(w => w.next_review && w.next_review <= now)
  const newWords = userWords.filter(w => !w.next_review && !w.last_studied)
  
  words.value = [...needsReview, ...newWords].slice(0, limit)
  startTime.value = Date.now()
})
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flashcard-inner {
  transform-style: preserve-3d;
}

.flashcard-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flashcard-back {
  transform: rotateY(180deg);
}
</style>