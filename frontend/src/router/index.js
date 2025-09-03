import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import Settings from '../views/Settings.vue'

const routes = [
  { 
    path: '/', 
    redirect: '/login' 
  },
  { 
    path: '/home', 
    component: Home,
    meta: { requiresAuth: false }
  },
  { 
    path: '/login', 
    component: Login,
    meta: { requiresAuth: false }
  },
  { 
    path: '/register',
    component: Register,
    meta: { requiresAuth: false }
  },
  { 
    path: '/profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  { 
    path: '/settings',
    component: Settings,
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory('/FindTest/'),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
