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

    <!-- 登录表单 -->
    <div class="bg-white rounded-3xl p-8 shadow-lg w-full max-w-sm">
      <h2 class="text-lg font-bold text-center mb-6" style="font-family: var(--font-display)">登录账号</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-xs font-medium text-[var(--color-text-light)] mb-2">邮箱</label>
          <input v-model="email" type="email" required
                 class="w-full h-12 px-4 rounded-xl bg-[#FFF9F0] border-2 border-transparent focus:border-[var(--color-primary)] focus:outline-none transition-colors text-sm"
                 placeholder="请输入邮箱">
        </div>

        <div class="mb-6">
          <label class="block text-xs font-medium text-[var(--color-text-light)] mb-2">密码</label>
          <input v-model="password" type="password" required
                 class="w-full h-12 px-4 rounded-xl bg-[#FFF9F0] border-2 border-transparent focus:border-[var(--color-primary)] focus:outline-none transition-colors text-sm"
                 placeholder="请输入密码">
        </div>

        <button type="submit"
                :disabled="loading"
                class="w-full h-12 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] rounded-xl text-white font-bold text-sm shadow-md active:scale-[0.98] transition-transform disabled:opacity-50">
          <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
          <span v-else>登录</span>
        </button>
      </form>

      <div class="text-center mt-6">
        <router-link to="/register" class="text-sm text-[var(--color-primary)] font-medium">
          没有账号？点击注册
        </router-link>
      </div>
    </div>

    <!-- 底部提示 -->
    <p class="text-xs text-[var(--color-text-light)] mt-8">
      首次使用请注册账号
    </p>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = inject('toast')

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  
  try {
    // 本地模拟登录（后续接入 CloudBase Auth）
    const users = JSON.parse(localStorage.getItem('candy_users') || '[]')
    const user = users.find(u => u.email === email.value)
    
    if (!user) {
      toast('账号不存在', 'error')
      loading.value = false
      return
    }
    
    if (user.password !== password.value) {
      toast('密码错误', 'error')
      loading.value = false
      return
    }
    
    // 保存登录状态
    localStorage.setItem('candy_user', JSON.stringify({ id: user.id, email: user.email, nickname: user.nickname }))
    toast('登录成功！', 'success')
    router.replace('/')
  } catch (e) {
    toast('登录失败，请重试', 'error')
  }
  
  loading.value = false
}
</script>