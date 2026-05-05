<template>
  <div class="min-h-screen bg-[var(--color-bg)]">
    <!-- 顶部 -->
    <div class="bg-gradient-to-br from-[#A29BFE] to-[#6C5CE7] px-6 pt-6 pb-8 rounded-b-[2rem]">
      <div class="flex items-center justify-between mb-4">
        <button @click="router.back()" class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <i class="fas fa-arrow-left text-white"></i>
        </button>
        <h1 class="text-white font-bold text-lg" style="font-family: var(--font-display)">看绘本</h1>
        <div class="w-10"></div>
      </div>
      <p class="text-white/80 text-sm text-center">读绘本学英语，培养阅读习惯</p>
    </div>

    <!-- 主内容 -->
    <div class="px-6 -mt-6 pb-24">
      <!-- 绘本列表 -->
      <div class="bg-white rounded-3xl p-4 shadow-sm">
        <h3 class="font-bold text-sm mb-4">绘本资源</h3>
        
        <div v-if="bookList.length > 0" class="space-y-3">
          <div v-for="book in bookList" :key="book.id"
               @click="openBook(book)"
               class="flex items-center gap-3 p-3 rounded-xl bg-[#FFF9F0] cursor-pointer active:scale-[0.98] transition-transform">
            <div class="w-12 h-12 bg-gradient-to-br from-[#A29BFE] to-[#6C5CE7] rounded-xl flex items-center justify-center">
              <i class="fas fa-book-open text-white"></i>
            </div>
            <div class="flex-1">
              <p class="font-medium text-sm">{{ book.title }}</p>
              <p class="text-xs text-[var(--color-text-light)]">PDF绘本</p>
            </div>
            <i class="fas fa-chevron-right text-[var(--color-text-light)]"></i>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <div class="text-4xl mb-3">📖</div>
          <p class="text-sm text-[var(--color-text-light)]">暂无绘本资源</p>
          <p class="text-xs text-[var(--color-text-light)] mt-1">请去设置中上传PDF绘本</p>
        </div>
      </div>
    </div>

    <!-- PDF阅读模态框 -->
    <div v-if="showReader" class="fixed inset-0 bg-white z-50 flex flex-col">
      <div class="flex items-center justify-between p-4 bg-[var(--color-bg)]">
        <button @click="closeBook" class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
          <i class="fas fa-times text-[var(--color-text)]"></i>
        </button>
        <span class="font-medium text-sm">{{ readingBook?.title }}</span>
        <div class="w-10"></div>
      </div>
      <div class="flex-1 overflow-auto">
        <iframe v-if="readingBook?.url" 
                :src="readingBook.url"
                class="w-full h-full">
        </iframe>
      </div>
    </div>

    <NavBar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'

const router = useRouter()

const bookList = ref([])
const showReader = ref(false)
const readingBook = ref(null)

const openBook = (book) => {
  readingBook.value = book
  showReader.value = true
  
  // 记录阅读
  const user = JSON.parse(localStorage.getItem('candy_user'))
  const records = JSON.parse(localStorage.getItem('candy_records') || '[]')
  records.push({
    user_id: user.id,
    type: 'book',
    title: book.title,
    recorded_at: Date.now()
  })
  localStorage.setItem('candy_records', JSON.stringify(records))
}

const closeBook = () => {
  showReader.value = false
  readingBook.value = null
}

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('candy_user'))
  if (!user) return
  
  bookList.value = JSON.parse(localStorage.getItem(`candy_book_${user.id}`) || '[]')
})
</script>