import axios from 'axios'
import router from '../../router/index.js'

// State
const state = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
  tokenExpiration: null
};

const API_URL = import.meta.env.VUE_APP_API_URL;

// Getters
const getters = {
  isAuthenticated: state => !!state.token,
  user: state => state.user,
  loading: state => state.loading,
  error: state => state.error
};

// Actions
const actions = {
  async login({ commit }, credentials) {
    commit('setLoading', true)
    commit('clearError')
    
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials)
      const { token, user } = response.data
      
      // Save token to localStorage
      localStorage.setItem('token', token)
      
      // Set token in axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      commit('setAuth', { token, user })
      router.push('/dashboard')
      return true
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || 'Login failed')
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      }
      
      commit('setError', errorMessage)
      return false
    } finally {
      commit('setLoading', false)
    }
  },
  
  async register({ commit }, userData) {
    commit('setLoading', true)
    commit('clearError')
    
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, userData)
      const { token, user } = response.data
      
      // Save token to localStorage
      localStorage.setItem('token', token)
      
      // Set token in axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      commit('setAuth', { token, user })
      router.push('/dashboard')
      return true
    } catch (error) {
      console.error('Registration error:', error)
      commit('setError', error.response?.data?.message || 'Registration failed')
      return false
    } finally {
      commit('setLoading', false)
    }
  },
  
  async checkAuth({ commit, dispatch }) {
    const token = localStorage.getItem('token')
    const expiration = localStorage.getItem('tokenExpiration')
    
    if (!token || !expiration) {
      commit('clearAuth')
      return
    }
    
    // Check if token is expired
    if (new Date().getTime() >= parseInt(expiration)) {
      console.log('Token expired, logging out')
      dispatch('logout')
      return
    }
    
    // Token is still valid
    commit('setLoading', true)
    
    try {
      // Set token in axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Fetch user data
      const response = await axios.get(`${API_URL}/api/auth/me`)
      const user = response.data
      
      commit('setAuth', { token, user, expiration })
    } catch (error) {
      console.error('Auth check error:', error)
      dispatch('logout')
    } finally {
      commit('setLoading', false)
    }
  },
  
  setAuthTimer({ dispatch }, expirationTime) {
    setTimeout(() => {
      dispatch('logout')
    }, expirationTime)
  },
  
  logout({ commit }) {
    // Remove token from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('tokenExpiration')
    
    // Remove token from axios defaults
    delete axios.defaults.headers.common['Authorization']
    
    // Clear auth state
    commit('clearAuth')
    
    // Redirect to login
    router.push('/login')
  }
}

// Mutations
const mutations = {
  setAuth(state, { token, user, expiration }) {
    state.token = token
    state.user = user
    state.tokenExpiration = expiration
    state.error = null
  },
  
  clearAuth(state) {
    state.token = ''
    state.user = null
    state.tokenExpiration = null
  },
  
  setLoading(state, status) {
    state.loading = status
  },
  
  setError(state, error) {
    state.error = error
  },
  
  clearError(state) {
    state.error = null
  },
  
  setUser(state, user) {
    state.user = user;
  },
  
  setToken(state, token) {
    state.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}