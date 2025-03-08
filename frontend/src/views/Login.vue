<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="text-center mb-4">
        <img src="../assets/logoo.png" alt="Logo" class="logo">
        <h2 class="mb-3">Authentication</h2>
      </div>
      
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input 
            type="email" 
            class="form-control" 
            id="email" 
            v-model="email"
            placeholder="Enter your email"
            required
          >
          <div v-if="emailError" class="text-danger mt-1">{{ emailError }}</div>
        </div>
        
        <div class="mb-4">
          <label for="password" class="form-label">Password</label>
          <input 
            type="password" 
            class="form-control" 
            id="password" 
            v-model="password"
            placeholder="Enter your password"
            required
          >
          <div v-if="passwordError" class="text-danger mt-1">{{ passwordError }}</div>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary w-100 py-2"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Login
        </button>
        
        <div class="text-center mt-3">
          <p>Don't have an account? <router-link to="/register">Register</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      emailError: '',
      passwordError: ''
    }
  },
  computed: {
    ...mapGetters({
      loading: 'auth/loading',
      error: 'auth/error'
    })
  },
  methods: {
    validateForm() {
      let isValid = true
      
      // Reset errors
      this.emailError = ''
      this.passwordError = ''
      
      // Email validation
      if (!this.email) {
        this.emailError = 'Email is required'
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(this.email)) {
        this.emailError = 'Please enter a valid email address'
        isValid = false
      }
      
      // Password validation
      if (!this.password) {
        this.passwordError = 'Password is required'
        isValid = false
      } else if (this.password.length < 6) {
        this.passwordError = 'Password must be at least 6 characters'
        isValid = false
      }
      
      return isValid
    },
    
    login() {
      if (this.validateForm()) {
        // Clear any previous errors
        this.$store.commit('auth/clearError');
        
        this.$store.dispatch('auth/login', {
          email: this.email,
          password: this.password
        }).then(() => {
          // Handle successful login
          this.$router.push('/dashboard');
        }).catch(error => {
          // Error is already handled in the store action
          console.error('Login error:', error);
        });
      }
    }
  }
}
</script>
