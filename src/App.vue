<template>
  <div id="app">
    <!-- Toast 通知 -->
    <div v-if="toast.show" class="fixed top-4 left-1/2 -translate-x-1/2 z-50 toast-enter">
      <div class="px-6 py-3 rounded-2xl shadow-lg text-white font-semibold text-sm"
           :class="{
             'bg-[var(--color-success)]': toast.type === 'success',
             'bg-[var(--color-danger)]': toast.type === 'error',
             'bg-[var(--color-warning)]': toast.type === 'warning',
             'bg-[var(--color-primary)]': toast.type === 'info'
           }">
        <i class="fas mr-2" :class="{
          'fa-check-circle': toast.type === 'success',
          'fa-exclamation-circle': toast.type === 'error',
          'fa-exclamation-triangle': toast.type === 'warning',
          'fa-info-circle': toast.type === 'info'
        }"></i>
        {{ toast.message }}
      </div>
    </div>

    <router-view v-slot="{ Component, route }">
      <transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { reactive, provide } from 'vue'

const toast = reactive({ show: false, message: '', type: 'info', timer: null })

const showToast = (message, type = 'info', duration = 2500) => {
  if (toast.timer) clearTimeout(toast.timer)
  toast.show = true
  toast.message = message
  toast.type = type
  toast.timer = setTimeout(() => { toast.show = false }, duration)
}

provide('toast', showToast)
</script>
