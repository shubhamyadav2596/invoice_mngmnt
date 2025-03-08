<template>
  <router-view />
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  created() {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const expiration = localStorage.getItem('tokenExpiration')
    
    if (token) {
      // Check if token is expired
      if (expiration && new Date().getTime() >= parseInt(expiration)) {
        console.log('Token expired, logging out')
        this.$store.dispatch('auth/logout')
        return
      }
      
      // Set token in axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Verify token validity by checking auth status
      this.$store.dispatch('auth/checkAuth')
    }
    
    // Add axios interceptor to handle 401 errors globally
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          console.log('Unauthorized request detected, logging out')
          this.$store.dispatch('auth/logout')
        }
        return Promise.reject(error)
      }
    )
  }
}
</script>