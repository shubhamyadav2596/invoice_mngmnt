import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import InvoiceList from '../views/InvoiceList.vue'
import CreateInvoice from '../views/CreateInvoice.vue'
import InvoiceEdit from '../views/InvoiceEdit.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices',
    name: 'InvoiceList',
    component: InvoiceList,
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices/create',
    name: 'CreateInvoice',
    component: CreateInvoice,
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices/edit/:id',
    name: 'InvoiceEdit',
    component: InvoiceEdit,
    meta: { requiresAuth: true }
  },
  // Add a catch-all route to handle 404s
  {
    path: '/:pathMatch(.*)*',
    redirect: to => {
      // Check if user is authenticated
      const isAuthenticated = localStorage.getItem('token');
      return isAuthenticated ? '/dashboard' : '/login';
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (!to.meta.requiresAuth && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router