import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/flashcard',
    name: 'Flashcard',
    component: () => import('../views/Flashcard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/audio',
    name: 'Audio',
    component: () => import('../views/AudioPlayer.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/video',
    name: 'Video',
    component: () => import('../views/VideoPlayer.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/book',
    name: 'Book',
    component: () => import('../views/BookReader.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('candy_user')
  if (to.meta.requiresAuth && !user) {
    next('/login')
  } else if ((to.name === 'Login' || to.name === 'Register') && user) {
    next('/')
  } else {
    next()
  }
})

export default router
