<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="text-center mb-4">
        <img src="../assets/logoo.png" alt="Logo" class="logo">
        <h2 class="mb-3">Register</h2>
      </div>
      
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      
      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="name" class="form-label">Full Name</label>
          <input 
            type="text" 
            class="form-control" 
            id="name" 
            v-model="name"
            placeholder="Enter your full name"
            required
          >
          <div v-if="nameError" class="text-danger mt-1">{{ nameError }}</div>
        </div>
        
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
        
        <div class="mb-3">
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
        
        <div class="mb-4">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input 
            type="password" 
            class="form-control" 
            id="confirmPassword" 
            v-model="confirmPassword"
            placeholder="Confirm your password"
            required
          >
          <div v-if="confirmPasswordError" class="text-danger mt-1">{{ confirmPasswordError }}</div>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary w-100 py-2"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Register
        </button>
        
        <div class="text-center mt-3">
          <p>Already have an account? <router-link to="/login">Login</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      nameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: ''
    }
  },
  computed: {
    ...mapGetters({
      loading: 'auth/loading',
      error: 'auth/error'
    })
  },
  // In your Register.vue component's methods section:
  methods: {
    validateForm() {
      let isValid = true
      
      // Reset errors
      this.nameError = ''
      this.emailError = ''
      this.passwordError = ''
      this.confirmPasswordError = ''
      
      // Name validation
      if (!this.name) {
        this.nameError = 'Name is required'
        isValid = false
      } else if (/[^a-zA-Z\s]/.test(this.name)) {
        this.nameError = 'Name cannot contain special characters or numbers'
        isValid = false
      }
      
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
      
      // Confirm password validation
      if (!this.confirmPassword) {
        this.confirmPasswordError = 'Please confirm your password'
        isValid = false
      } else if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = 'Passwords do not match'
        isValid = false
      }
      
      return isValid
    },
    
    register() {
      if (this.validateForm()) {
        this.$store.dispatch('auth/register', {
          name: this.name,
          email: this.email,
          password: this.password
        })
      }
    }
  }
}
</script>