<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-50 safe-area-bottom">
    <div class="max-w-md mx-auto flex items-center justify-around py-2">
      <button v-for="item in navItems" :key="item.path"
              @click="router.push(item.path)"
              class="flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all"
              :class="isActive(item.path) ? 'text-[var(--color-primary)]' : 'text-gray-400'">
        <div class="w-6 h-6 flex items-center justify-center">
          <i :class="item.icon" class="text-lg"></i>
        </div>
        <span class="text-[10px] font-medium">{{ item.label }}</span>
        <div v-if="isActive(item.path)" class="w-1 h-1 bg-[var(--color-primary)] rounded-full"></div>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navItems = [
  { path: '/', label: '首页', icon: 'fas fa-home' },
  { path: '/flashcard', label: '闪卡', icon: 'fas fa-layer-group' },
  { path: '/audio', label: '磨耳朵', icon: 'fas fa-headphones' },
  { path: '/video', label: '视频', icon: 'fas fa-play-circle' },
  { path: '/settings', label: '设置', icon: 'fas fa-cog' }
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>
