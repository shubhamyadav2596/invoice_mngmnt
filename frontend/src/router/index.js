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
    redirect: 'https://invoice-mngmnt-1.onrender.com/login'
  },
  {
    path: 'https://invoice-mngmnt-1.onrender.com/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: 'https://invoice-mngmnt-1.onrender.com/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: 'https://invoice-mngmnt-1.onrender.com/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: 'https://invoice-mngmnt-1.onrender.com/invoices',
    name: 'InvoiceList',
    component: InvoiceList,
    meta: { requiresAuth: true }
  },
  {
    path: 'https://invoice-mngmnt-1.onrender.com/invoices/create',
    name: 'CreateInvoice',
    component: CreateInvoice,
    meta: { requiresAuth: true }
  },
  // In your routes array
  {
    path: 'https://invoice-mngmnt-1.onrender.com/invoices/edit/:id',
    name: 'InvoiceEdit',
    component: InvoiceEdit,
    meta: { requiresAuth: true }
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
    next('https://invoice-mngmnt-1.onrender.com/dashboard')
  } else {
    next()
  }
})

export default router