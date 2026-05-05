<template>
  <div class="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-6">
    <!-- Logo -->
    <div class="mb-8 text-center">
      <div class="w-20 h-20 bg-gradient-to-br from-[#FF6B6B] to-[#4ECDC4] rounded-3xl flex items-center justify-center mb-4 shadow-lg mx-auto animate-float">
        <span class="text-4xl">🍬</span>
      </div>
      <h1 class="text-2xl font-bold text-[var(--color-text)]" style="font-family: var(--font-display)">糖果学英语</h1>
      <p class="text-sm text-[var(--color-text-light)] mt-1">让学习像吃糖果一样甜蜜</p>
    </div>

    <!-- 注册表单 -->
    <div class="bg-white rounded-3xl p-8 shadow-lg w-full max-w-sm">
      <h2 class="text-lg font-bold text-center mb-6" style="font-family: var(--font-display)">注册账号</h2>
      
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-xs font-medium text-[var(--color-text-light)] mb-2">昵称</label>
          <input v-model="nickname" type="text" required
                 class="w-full h-12 px-4 rounded-xl bg-[#FFF9F0] border-2 border-transparent focus:border-[var(--color-primary)] focus:outline-none transition-colors text-sm"
                 placeholder="请输入昵称">
        </div>

        <div class="mb-4">
          <label class="block text-xs font-medium text-[var(--color-text-light)] mb-2">邮箱</label>
          <input v-model="email" type="email" required
                 class="w-full h-12 px-4 rounded-xl bg-[#FFF9F0] border-2 border-transparent focus:border-[var(--color-primary)] focus:outline-none transition-colors text-sm"
                 placeholder="请输入邮箱">
        </div>

        <div class="mb-4">
          <label class="block text-xs font-medium text-[var(--color-text-light)] mb-2">密码</label>
          <input v-model="password" type="password" required
                 class="w-full h-12 px-4 rounded-xl bg-[#FFF9F0] border-2 border-transparent focus:border-[var(--color-primary)] focus:outline-none transition-colors text-sm"
                 placeholder="请输入密码（至少6位）">
        </div>

        <div class="mb-6">
          <label class="block text-xs font-medium text-[var(--color-text-light)] mb-2">家长密码</label>
          <input v-model="parentPassword" type="password" required
                 class="w-full h-12 px-4 rounded-xl bg-[#FFF9F0] border-2 border-transparent focus:border-[var(--color-primary)] focus:outline-none transition-colors text-sm"
                 placeholder="家长管理密码">
          <p class="text-xs text-[var(--color-text-light)] mt-1">用于保护设置功能，只有家长可以操作</p>
        </div>

        <button type="submit"
                :disabled="loading"
                class="w-full h-12 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] rounded-xl text-white font-bold text-sm shadow-md active:scale-[0.98] transition-transform disabled:opacity-50">
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          <span v-else>注册</span>
        </button>
      </form>

      <div class="text-center mt-6">
        <router-link to="/login" class="text-sm text-[var(--color-primary)] font-medium">
          已有账号？点击登录
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = inject('toast')

const nickname = ref('')
const email = ref('')
const password = ref('')
const parentPassword = ref('')
const loading = ref(false)

const handleRegister = async () => {
  if (password.value.length < 6) {
    toast('密码至少6位', 'warning')
    return
  }
  
  if (parentPassword.value.length < 4) {
    toast('家长密码至少4位', 'warning')
    return
  }
  
  loading.value = true
  
  try {
    const users = JSON.parse(localStorage.getItem('candy_users') || '[]')
    
    if (users.some(u => u.email === email.value)) {
      toast('邮箱已注册', 'error')
      loading.value = false
      return
    }
    
    const newUser = {
      id: Date.now().toString(),
      email: email.value,
      password: password.value,
      nickname: nickname.value,
      parentPassword: parentPassword.value,
      createdAt: Date.now()
    }
    
    users.push(newUser)
    localStorage.setItem('candy_users', JSON.stringify(users))
    
    // 初始化用户单词库和设置
    localStorage.setItem(`candy_words_${newUser.id}`, JSON.stringify([]))
    localStorage.setItem(`candy_settings_${newUser.id}`, JSON.stringify({
      dailyFlashcardCount: 10
    }))
    
    toast('注册成功！请登录', 'success')
    router.replace('/login')
  } catch (e) {
    toast('注册失败，请重试', 'error')
  }
  
  loading.value = false
}
</script>