<template>
  <div class="min-h-screen bg-[var(--color-bg)]">
    <!-- 顶部 -->
    <div class="bg-gradient-to-br from-[#4ECDC4] to-[#44B5AD] px-6 pt-6 pb-8 rounded-b-[2rem]">
      <div class="flex items-center justify-between mb-4">
        <button @click="router.back()" class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <i class="fas fa-arrow-left text-white"></i>
        </button>
        <h1 class="text-white font-bold text-lg" style="font-family: var(--font-display)">磨耳朵</h1>
        <div class="w-10"></div>
      </div>
      <p class="text-white/80 text-sm text-center">听音乐学英语，随时随地磨耳朵</p>
    </div>

    <!-- 主内容 -->
    <div class="px-6 -mt-6 pb-24">
      <!-- 当前播放 -->
      <div v-if="currentAudio" class="bg-white rounded-3xl p-6 shadow-lg mb-6">
        <div class="text-center mb-4">
          <div class="w-16 h-16 bg-gradient-to-br from-[#4ECDC4] to-[#44B5AD] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <i class="fas fa-music text-white text-2xl"></i>
          </div>
          <h3 class="font-bold text-base">{{ currentAudio.title }}</h3>
        </div>

        <!-- 播放控制 -->
        <div class="flex items-center justify-center gap-4 mb-4">
          <button @click="prevTrack" class="w-12 h-12 bg-[#FFF9F0] rounded-xl flex items-center justify-center">
            <i class="fas fa-backward text-[var(--color-text)]"></i>
          </button>
          <button @click="togglePlay" 
                  class="w-16 h-16 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] rounded-2xl flex items-center justify-center shadow-md active:scale-95 transition-transform">
            <i v-if="playing" class="fas fa-pause text-white text-xl"></i>
            <i v-else class="fas fa-play text-white text-xl"></i>
          </button>
          <button @click="nextTrack" class="w-12 h-12 bg-[#FFF9F0] rounded-xl flex items-center justify-center">
            <i class="fas fa-forward text-[var(--color-text)]"></i>
          </button>
        </div>

        <!-- 进度条 -->
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs text-[var(--color-text-light)]">{{ formatTime(currentTime) }}</span>
          <div class="flex-1 h-2 bg-[#FFE8E8] rounded-full overflow-hidden relative">
            <div class="bg-[var(--color-primary)] h-2 rounded-full transition-all" 
                 :style="{ width: `${(currentTime / duration) * 100}%` }">
            </div>
          </div>
          <span class="text-xs text-[var(--color-text-light)]">{{ formatTime(duration) }}</span>
        </div>

        <!-- 速度调节 -->
        <div class="flex items-center justify-center gap-2">
          <span class="text-xs text-[var(--color-text-light)]">速度:</span>
          <button v-for="rate in [0.5, 0.75, 1, 1.25, 1.5, 2]" :key="rate"
                  @click="setRate(rate)"
                  class="px-3 py-1 rounded-full text-xs font-medium transition-all"
                  :class="playbackRate === rate ? 'bg-[var(--color-primary)] text-white' : 'bg-[#FFF9F0] text-[var(--color-text-light)]'">
            {{ rate }}x
          </button>
        </div>
      </div>

      <!-- 音频列表 -->
      <div class="bg-white rounded-3xl p-4 shadow-sm">
        <h3 class="font-bold text-sm mb-4">音频资源</h3>
        
        <div v-if="audioList.length > 0" class="space-y-3">
          <div v-for="(audio, index) in audioList" :key="audio.id"
               @click="playAudio(index)"
               class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
               :class="currentIndex === index ? 'bg-[#FFF0F0]' : 'bg-[#FFF9F0]'">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                 :class="currentIndex === index ? 'bg-[var(--color-primary)]' : 'bg-[#E0E0E0]'">
              <i class="fas fa-music text-white text-sm"></i>
            </div>
            <div class="flex-1">
              <p class="font-medium text-sm">{{ audio.title }}</p>
              <p class="text-xs text-[var(--color-text-light)]">{{ audio.duration || '--:--' }}</p>
            </div>
            <i v-if="currentIndex === index && playing" class="fas fa-volume-up text-[var(--color-primary)]"></i>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <div class="text-4xl mb-3">🎧</div>
          <p class="text-sm text-[var(--color-text-light)]">暂无音频资源</p>
          <p class="text-xs text-[var(--color-text-light)] mt-1">请去设置中上传音频文件</p>
        </div>
      </div>
    </div>

    <NavBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'

const router = useRouter()

const audioList = ref([])
const currentIndex = ref(-1)
const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const playbackRate = ref(1)
const audioElement = ref(null)

const currentAudio = computed(() => currentIndex.value >= 0 ? audioList.value[currentIndex.value] : null)

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const togglePlay = () => {
  if (!audioElement.value) return
  if (playing.value) {
    audioElement.value.pause()
  } else {
    audioElement.value.play()
  }
  playing.value = !playing.value
}

const setRate = (rate) => {
  playbackRate.value = rate
  if (audioElement.value) {
    audioElement.value.playbackRate = rate
  }
}

const prevTrack = () => {
  if (currentIndex.value > 0) {
    playAudio(currentIndex.value - 1)
  }
}

const nextTrack = () => {
  if (currentIndex.value < audioList.value.length - 1) {
    playAudio(currentIndex.value + 1)
  }
}

const playAudio = (index) => {
  if (!audioList.value[index]) return
  
  currentIndex.value = index
  
  if (audioElement.value) {
    audioElement.value.src = audioList.value[index].url
    audioElement.value.playbackRate = playbackRate.value
    audioElement.value.play()
    playing.value = true
    
    // 记录播放
    const user = JSON.parse(localStorage.getItem('candy_user'))
    const records = JSON.parse(localStorage.getItem('candy_records') || '[]')
    records.push({
      user_id: user.id,
      type: 'audio',
      title: audioList.value[index].title,
      recorded_at: Date.now()
    })
    localStorage.setItem('candy_records', JSON.stringify(records))
  }
}

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('candy_user'))
  if (!user) return
  
  audioList.value = JSON.parse(localStorage.getItem(`candy_audio_${user.id}`) || '[]')
  
  audioElement.value = new Audio()
  audioElement.value.ontimeupdate = () => {
    currentTime.value = audioElement.value.currentTime
  }
  audioElement.value.onloadedmetadata = () => {
    duration.value = audioElement.value.duration
  }
  audioElement.value.onended = () => {
    nextTrack()
  }
})

onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value = null
  }
})
</script>