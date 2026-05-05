<template>
  <div class="min-h-screen bg-[var(--color-bg)]">
    <!-- 顶部 -->
    <div class="bg-gradient-to-br from-[#FFE66D] to-[#FFD93D] px-6 pt-6 pb-8 rounded-b-[2rem]">
      <div class="flex items-center justify-between mb-4">
        <button @click="router.back()" class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <i class="fas fa-arrow-left text-white"></i>
        </button>
        <h1 class="text-white font-bold text-lg" style="font-family: var(--font-display)">看视频</h1>
        <div class="w-10"></div>
      </div>
      <p class="text-white/80 text-sm text-center">看动画学英语，寓教于乐</p>
    </div>

    <!-- 主内容 -->
    <div class="px-6 -mt-6 pb-24">
      <!-- 视频列表 -->
      <div class="bg-white rounded-3xl p-4 shadow-sm">
        <h3 class="font-bold text-sm mb-4">视频资源</h3>
        
        <div v-if="videoList.length > 0" class="space-y-3">
          <div v-for="video in videoList" :key="video.id"
               @click="playVideo(video)"
               class="flex items-center gap-3 p-3 rounded-xl bg-[#FFF9F0] cursor-pointer active:scale-[0.98] transition-transform">
            <div class="w-12 h-12 bg-gradient-to-br from-[#FFE66D] to-[#FFD93D] rounded-xl flex items-center justify-center">
              <i class="fas fa-play text-white"></i>
            </div>
            <div class="flex-1">
              <p class="font-medium text-sm">{{ video.title }}</p>
              <p class="text-xs text-[var(--color-text-light)]">{{ video.duration || '未知时长' }}</p>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <div class="text-4xl mb-3">🎬</div>
          <p class="text-sm text-[var(--color-text-light)]">暂无视频资源</p>
          <p class="text-xs text-[var(--color-text-light)] mt-1">请去设置中上传视频文件</p>
        </div>
      </div>
    </div>

    <!-- 视频播放器模态框 -->
    <div v-if="showPlayer" class="fixed inset-0 bg-black z-50 flex flex-col">
      <div class="flex items-center justify-between p-4 bg-black/50">
        <button @click="closePlayer" class="w-10 h-10 rounded-xl flex items-center justify-center">
          <i class="fas fa-times text-white"></i>
        </button>
        <span class="text-white font-medium text-sm">{{ playingVideo?.title }}</span>
        <div class="w-10"></div>
      </div>
      <div class="flex-1 flex items-center justify-center">
        <video ref="videoRef" 
               :src="playingVideo?.url"
               controls
               autoplay
               class="w-full h-full object-contain"
               @ended="closePlayer">
        </video>
      </div>
    </div>

    <NavBar />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'

const router = useRouter()

const videoList = ref([])
const showPlayer = ref(false)
const playingVideo = ref(null)
const videoRef = ref(null)

const playVideo = (video) => {
  playingVideo.value = video
  showPlayer.value = true
  
  // 记录观看
  const user = JSON.parse(localStorage.getItem('candy_user'))
  const records = JSON.parse(localStorage.getItem('candy_records') || '[]')
  records.push({
    user_id: user.id,
    type: 'video',
    title: video.title,
    recorded_at: Date.now()
  })
  localStorage.setItem('candy_records', JSON.stringify(records))
}

const closePlayer = () => {
  showPlayer.value = false
  playingVideo.value = null
}

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('candy_user'))
  if (!user) return
  
  videoList.value = JSON.parse(localStorage.getItem(`candy_video_${user.id}`) || '[]')
})

onUnmounted(() => {
  if (videoRef.value) {
    videoRef.value.pause()
  }
})
</script>