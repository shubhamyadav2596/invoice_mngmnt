import axios from 'axios'
import router from '../../router'

// Get the token for authenticated requests
const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Keep the mock data for fallback
const mockInvoices = [
  // {
  //   _id: '1',
  //   invoiceNumber: 'INV-123456-1',
  //   companyDetails: {
  //     name: 'Tech Solutions Inc.',
  //     mobile: '9876543210',
  //     email: 'info@techsolutions.com',
  //     gstin: '09AAACH7409R1ZZ',
  //     address: '123 Tech Park, Silicon Valley'
  //   },
  //   invoiceToDetails: {
  //     date: new Date('2024-04-05'),
  //     name: 'Abhishek Dewangan',
  //     mobile: '9877746789',
  //     email: 'abhishek@example.com',
  //     pincode: '110001',
  //     city: 'New Delhi',
  //     state: 'Delhi',
  //     address: '456 Main Street, New Delhi'
  //   },
  //   transactionDetails: [
  //     {
  //       product: 'Web Development',
  //       rate: 5000,
  //       quantity: 1,
  //       discount: 500,
  //       total: 4500
  //     },
  //     {
  //       product: 'SEO Services',
  //       rate: 2000,
  //       quantity: 2,
  //       discount: 200,
  //       total: 3800
  //     }
  //   ],
  //   total: 8300,
  //   generatedBy: 'User',
  //   createdAt: new Date('2024-04-05')
  // },
  // {
  //   _id: '2',
  //   invoiceNumber: 'INV-123457-2',
  //   companyDetails: {
  //     name: 'Tech Solutions Inc.',
  //     mobile: '9876543210',
  //     email: 'info@techsolutions.com',
  //     gstin: '09AAACH7409R1ZZ',
  //     address: '123 Tech Park, Silicon Valley'
  //   },
  //   invoiceToDetails: {
  //     date: new Date('2024-04-04'),
  //     name: 'Narayan Dewangan',
  //     mobile: '9876789765',
  //     email: 'narayan@example.com',
  //     pincode: '400001',
  //     city: 'Mumbai',
  //     state: 'Maharashtra',
  //     address: '789 Business Hub, Mumbai'
  //   },
  //   transactionDetails: [
  //     {
  //       product: 'Mobile App Development',
  //       rate: 10000,
  //       quantity: 1,
  //       discount: 1000,
  //       total: 9000
  //     }
  //   ],
  //   total: 9000,
  //   generatedBy: 'Panel',
  //   createdAt: new Date('2024-04-04')
  // }
];

const state = {
  invoices: mockInvoices,
  currentInvoice: {
    companyDetails: {
      name: '',
      mobile: '',
      email: '',
      gstin: '',
      address: ''
    },
    invoiceToDetails: {
      date: '',
      name: '',
      mobile: '',
      email: '',
      pincode: '',
      city: '',
      state: '',
      address: ''
    },
    transactionDetails: [],
    total: 0
  },
  currentStep: 1,
  loading: false,
  error: null,
  filter: 'all',
  searchQuery: '',
  dateRange: {
    start: '',
    end: ''
  },
  priceRange: {
    min: '',
    max: ''
  },
  selectedStates: []
}

const getters = {
  allInvoices: state => state.invoices,
  currentFilter: state => state.filter,
  filteredInvoices: state => {
    let filtered = [...state.invoices]

    // Filter by type (user/panel)
    if (state.filter !== 'all') {
      filtered = filtered.filter(invoice => 
        invoice.generatedBy === (state.filter === 'user' ? 'User' : 'Panel')
      )
    }

    // Search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      filtered = filtered.filter(invoice => 
        invoice.invoiceToDetails.name.toLowerCase().includes(query) ||
        invoice.invoiceToDetails.email.toLowerCase().includes(query) ||
        invoice.invoiceToDetails.mobile.includes(query) ||
        invoice.invoiceNumber.toLowerCase().includes(query)
      )
    }

    // Date range
    if (state.dateRange.start && state.dateRange.end) {
      const start = new Date(state.dateRange.start)
      const end = new Date(state.dateRange.end)
      filtered = filtered.filter(invoice => {
        const date = new Date(invoice.createdAt)
        return date >= start && date <= end
      })
    }

    // Price range
    if (state.priceRange.min !== '') {
      filtered = filtered.filter(invoice => invoice.total >= Number(state.priceRange.min))
    }
    if (state.priceRange.max !== '') {
      filtered = filtered.filter(invoice => invoice.total <= Number(state.priceRange.max))
    }

    // States
    if (state.selectedStates.length > 0) {
      filtered = filtered.filter(invoice => 
        state.selectedStates.includes(invoice.invoiceToDetails.state)
      )
    }

    return filtered
  },
  currentInvoice: state => state.currentInvoice,
  currentStep: state => state.currentStep,
  loading: state => state.loading,
  error: state => state.error,
  invoiceTotal: state => {
    return state.currentInvoice.transactionDetails.reduce((total, item) => {
      return total + (item.total || 0)
    }, 0)
  },
  availableStates: state => {
    const states = new Set(state.invoices.map(invoice => invoice.invoiceToDetails.state))
    return Array.from(states)
  },
  searchQuery: state => state.searchQuery,
  dateRange: state => state.dateRange,
  priceRange: state => state.priceRange,
  selectedStates: state => state.selectedStates
}

const actions = {
  async fetchInvoices({ commit }) {
    commit('setLoading', true)
    commit('setError', null)
    
    try {
      console.log('Fetching invoices...')
      // Make API call to fetch invoices from backend
      const response = await axios.get('http://localhost:3000/api/invoices', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      console.log('API response:', response.data)
      
      if (response.data && Array.isArray(response.data)) {
        commit('setInvoices', response.data)
      } else {
        // Fallback to mock data if API returns invalid data
        console.warn('API returned invalid data, using mock data instead')
        commit('setInvoices', mockInvoices)
      }
      
      return response.data
    } catch (error) {
      console.error('Error fetching invoices:', error)
      commit('setError', error.response?.data?.message || 'Failed to fetch invoices')
      
      // Fallback to mock data if API fails
      commit('setInvoices', mockInvoices)
      
      throw error
    } finally {
      commit('setLoading', false)
    }
  },
  async fetchInvoice({ commit }, id) {
    commit('setLoading', true)
    commit('setError', null)
    
    try {
      // Make API call to fetch a specific invoice
      const response = await axios.get(`http://localhost:3000/api/invoices/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Error fetching invoice:', error)
      commit('setError', error.response?.data?.message || 'Failed to fetch invoice')
      throw error
    } finally {
      commit('setLoading', false)
    }
  },
  
  async createInvoice({ commit, state }, invoiceData) {
    commit('setLoading', true)
    commit('setError', null)
    
    try {
      // Use the provided invoiceData or the current invoice from state
      const data = invoiceData || state.currentInvoice
      
      // Make API call to create invoice - using full URL path
      const response = await axios.post('http://localhost:3000/api/invoices/', data, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      })
      
      // Add the new invoice to the state
      commit('addInvoice', response.data)
      
      // Reset the current invoice
      commit('resetInvoice')
      
      return true
    } catch (error) {
      console.error('Error creating invoice:', error)
      
      // Set error message
      commit('setError', error.response?.data?.message || 'Server error while creating invoice')
      
      return false
    } finally {
      commit('setLoading', false)
    }
  },
  
  async updateInvoice({ commit }, { id, invoiceData }) {
    commit('setLoading', true)
    
    try {
      // Make API call to update invoice in backend
      const response = await axios.put(`http://localhost:3000/api/invoices/${id}`, invoiceData, {
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        }
      })
      
      // Update the invoice in the state
      commit('updateInvoice', response.data)
      
      // Show success message
      alert('Invoice updated successfully!')
      
      // Navigate back to invoice list
      router.push('/invoices')
      
      return response.data
    } catch (error) {
      console.error('Error updating invoice:', error)
      commit('setError', error.response?.data?.message || 'Failed to update invoice')
      
      // Show error message
      alert('Failed to update invoice: ' + (error.response?.data?.message || 'Unknown error'))
      
      throw error
    } finally {
      commit('setLoading', false)
    }
  },
  
  async deleteInvoice({ commit }, id) {
    commit('setLoading', true)
    
    try {
      // Make API call to delete invoice from backend
      await axios.delete(`http://localhost:3000/api/invoices/${id}`, {
        headers: getAuthHeader()
      })
      
      // Remove the invoice from the state
      commit('deleteInvoice', id)
      
      // Show success message
      alert('Invoice deleted successfully!')
      
      return true
    } catch (error) {
      console.error('Error deleting invoice:', error)
      commit('setError', error.response?.data?.message || 'Failed to delete invoice')
      
      // Show error message
      alert('Failed to delete invoice: ' + (error.response?.data?.message || 'Unknown error'))
      
      return false
    } finally {
      commit('setLoading', false)
    }
  },
  
  setFilter({ commit }, filter) {
    commit('setFilter', filter)
  },

  setSearchQuery({ commit }, query) {
    commit('setSearchQuery', query)
  },

  setDateRange({ commit }, range) {
    commit('setDateRange', range)
  },

  setPriceRange({ commit }, range) {
    commit('setPriceRange', range)
  },

  toggleState({ commit }, state) {
    commit('toggleState', state)
  },

  clearFilters({ commit }) {
    commit('clearFilters')
  },
  
  setCurrentStep({ commit }, step) {
    commit('setCurrentStep', step)
  },
  
  updateCompanyDetails({ commit }, details) {
    commit('updateCompanyDetails', details)
  },
  
  updateInvoiceToDetails({ commit }, details) {
    commit('updateInvoiceToDetails', details)
  },
  
  updateTransactionDetails({ commit }, details) {
    commit('updateTransactionDetails', details)
  },
  
  addTransactionItem({ commit }, item) {
    commit('addTransactionItem', item)
  },
  
  removeTransactionItem({ commit }, index) {
    commit('removeTransactionItem', index)
  },
  
  updateTransactionItem({ commit }, { index, item }) {
    commit('updateTransactionItem', { index, item })
  },
  
  resetInvoice({ commit }) {
    commit('resetInvoice')
  }
}

const mutations = {
  setInvoices(state, invoices) {
    state.invoices = invoices
  },
  
  addInvoice(state, invoice) {
    state.invoices.unshift(invoice)
  },
  
  setFilter(state, filter) {
    state.filter = filter
  },

  setSearchQuery(state, query) {
    state.searchQuery = query
  },

  setDateRange(state, range) {
    state.dateRange = range
  },

  setPriceRange(state, range) {
    state.priceRange = range
  },

  toggleState(state, stateName) {
    const index = state.selectedStates.indexOf(stateName)
    if (index === -1) {
      state.selectedStates.push(stateName)
    } else {
      state.selectedStates.splice(index, 1)
    }
  },

  clearFilters(state) {
    state.searchQuery = ''
    state.dateRange = { start: '', end: '' }
    state.priceRange = { min: '', max: '' }
    state.selectedStates = []
    state.filter = 'all'
  },
  
  setCurrentStep(state, step) {
    state.currentStep = step
  },
  
  updateCompanyDetails(state, details) {
    state.currentInvoice.companyDetails = { ...state.currentInvoice.companyDetails, ...details }
  },
  
  updateInvoiceToDetails(state, details) {
    state.currentInvoice.invoiceToDetails = { ...state.currentInvoice.invoiceToDetails, ...details }
  },
  
  updateTransactionDetails(state, details) {
    state.currentInvoice.transactionDetails = details
  },
  
  addTransactionItem(state, item) {
    state.currentInvoice.transactionDetails.push(item)
    state.currentInvoice.total = state.currentInvoice.transactionDetails.reduce((total, item) => {
      return total + (item.total || 0)
    }, 0)
  },
  
  removeTransactionItem(state, index) {
    state.currentInvoice.transactionDetails.splice(index, 1)
    state.currentInvoice.total = state.currentInvoice.transactionDetails.reduce((total, item) => {
      return total + (item.total || 0)
    }, 0)
  },
  
  updateTransactionItem(state, { index, item }) {
    state.currentInvoice.transactionDetails[index] = item
    state.currentInvoice.total = state.currentInvoice.transactionDetails.reduce((total, item) => {
      return total + (item.total || 0)
    }, 0)
  },
  
  resetInvoice(state) {
    state.currentInvoice = {
      companyDetails: {
        name: '',
        mobile: '',
        email: '',
        gstin: '',
        address: ''
      },
      invoiceToDetails: {
        date: new Date().toISOString().substr(0, 10),
        name: '',
        mobile: '',
        email: '',
        pincode: '',
        city: '',
        state: '',
        address: ''
      },
      transactionDetails: [],
      total: 0
    }
    state.currentStep = 1
  },
  
  setLoading(state, loading) {
    state.loading = loading
  },
  
  setError(state, error) {
    state.error = error
  },
  
  // Add these new mutations
  updateInvoice(state, updatedInvoice) {
    const index = state.invoices.findIndex(invoice => invoice._id === updatedInvoice._id)
    if (index !== -1) {
      state.invoices.splice(index, 1, updatedInvoice)
    }
  },
  
  deleteInvoice(state, id) {
    state.invoices = state.invoices.filter(invoice => invoice._id !== id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
