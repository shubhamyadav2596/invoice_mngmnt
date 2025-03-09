<template>
  <div class="container-fluid">
    <HemBurger @click="toggleSidebar"/>
    <div class="row">
      <!-- Sidebar -->
      <SideBar :class="{'d-none': sidebarOpen && isMobile}" />
      
      <!-- Main Content -->
      <div :class="['main-content', sidebarOpen || !isMobile ? 'col-md-10' : 'col-12', 'p-0']">
        <div class="d-md-flex justify-content-between text-center text-md-start align-items-center add-invoice bg-white position-relative invoice-nav mb-3 p-2">
          <h5>Edit Invoice</h5>
          <router-link to="/invoices" class="btn d-none d-md-block btn-outline-secondary">
            <i class="bi bi-arrow-left me-2 "></i> Back to Invoices
          </router-link>
          <router-link to="/invoices" class="back-btn d-md-none fs-6 fw-900 position-absolute"> Back
          </router-link>
        </div>
        
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Loading invoice details...</p>
        </div>
        
        <div v-else-if="error" class="alert alert-danger">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ error }}
          <button class="btn btn-sm btn-outline-danger ms-2" @click="fetchInvoice">
            <i class="bi bi-arrow-clockwise"></i> Retry
          </button>
        </div>
        
        <div v-else>
          <!-- Invoice Form -->
          <div class="card bg-transparent">
            <div class="card-header">
              <h4 class="mb-0">Invoice #{{ invoice.invoiceNumber }}</h4>
            </div>
            <div class="card-body">
              <form @submit.prevent="updateInvoice">
                <!-- Company Details -->
                <div class="mb-4">
                  <h5 class="border-bottom pb-2">Company Details</h5>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Company Name</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="invoice.companyDetails.name"
                        required
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Mobile Number</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="invoice.companyDetails.mobile"
                        required
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Email</label>
                      <input 
                        type="email" 
                        class="form-control" 
                        v-model="invoice.companyDetails.email"
                        required
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">GSTIN</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="invoice.companyDetails.gstin"
                      >
                    </div>
                    <div class="col-md-12 mb-3">
                      <label class="form-label">Address</label>
                      <textarea 
                        class="form-control" 
                        v-model="invoice.companyDetails.address"
                        rows="3"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <!-- Invoice To Details -->
                <div class="mb-4">
                  <h5 class="border-bottom pb-2">Invoice To</h5>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Invoice Date</label>
                      <input 
                        type="date" 
                        class="form-control" 
                        v-model="invoiceDate"
                        required
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Customer Name</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="invoice.invoiceToDetails.name"
                        required
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Mobile Number</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="invoice.invoiceToDetails.mobile"
                        required
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Email</label>
                      <input 
                        type="email" 
                        class="form-control" 
                        v-model="invoice.invoiceToDetails.email"
                        required
                      >
                    </div>
                    <div class="col-md-4 mb-3">
                      <label class="form-label">Pincode</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="invoice.invoiceToDetails.pincode"
                        required
                      >
                    </div>
                    <div class="col-md-4 mb-3">
                      <label class="form-label">City</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="invoice.invoiceToDetails.city"
                        required
                      >
                    </div>
                    <div class="col-md-4 mb-3">
                      <label class="form-label">State</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        v-model="invoice.invoiceToDetails.state"
                        required
                      >
                    </div>
                    <div class="col-md-12 mb-3">
                      <label class="form-label">Address</label>
                      <textarea 
                        class="form-control" 
                        v-model="invoice.invoiceToDetails.address"
                        rows="3"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <!-- Transaction Details -->
                <div class="mb-4">
                  <h5 class="border-bottom pb-2">Transaction Details</h5>
                  <div class="mb-3">
                    <button type="button" class="btn btn-outline-primary" @click="addItem">
                      <i class="bi bi-plus-lg me-2"></i> Add Item
                    </button>
                  </div>
                  
                  <div class="table-responsive">
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th>Product/Service</th>
                          <th>Rate</th>
                          <th>Quantity</th>
                          <th>Discount</th>
                          <th>Total</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in invoice.transactionDetails" :key="index">
                          <td>
                            <input 
                              type="text" 
                              class="form-control" 
                              v-model="item.product"
                              required
                            >
                          </td>
                          <td>
                            <input 
                              type="number" 
                              class="form-control" 
                              v-model.number="item.rate"
                              @input="calculateItemTotal(index)"
                              min="0"
                              required
                            >
                          </td>
                          <td>
                            <input 
                              type="number" 
                              class="form-control" 
                              v-model.number="item.quantity"
                              @input="calculateItemTotal(index)"
                              min="1"
                              required
                            >
                          </td>
                          <td>
                            <input 
                              type="number" 
                              class="form-control" 
                              v-model.number="item.discount"
                              @input="calculateItemTotal(index)"
                              min="0"
                            >
                          </td>
                          <td>₹{{ item.total }}</td>
                          <td>
                            <button 
                              type="button" 
                              class="btn btn-sm btn-outline-danger"
                              @click="removeItem(index)"
                            >
                              <i class="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colspan="4" class="text-end fw-bold">Grand Total:</td>
                          <td colspan="2" class="fw-bold">₹{{ invoiceTotal }}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                
                <div class="d-flex justify-content-end">
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :disabled="loading"
                  >
                    <span v-if="loading">
                      <i class="bi bi-arrow-repeat spinner me-2"></i> Updating...
                    </span>
                    <span v-else>
                      <i class="bi bi-check-circle me-2"></i> Update Invoice
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SideBar from '../components/SideBar.vue'
import HemBurger from '../components/Hemburger.vue'

export default {
  name: 'InvoiceEdit',
  components: {
    SideBar, 
    HemBurger
  },
  data() {
    return {
      invoice: {
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
      invoiceDate: '',
      sidebarOpen: true,
      isMobile: false
    }
  },
  computed: {
    ...mapState({
      loading: state => state.invoice.loading,
      error: state => state.invoice.error
    }),
    invoiceTotal() {
      return this.invoice.transactionDetails.reduce((total, item) => {
        return total + (item.total || 0)
      }, 0)
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    checkScreenSize() {
      this.isMobile = window.innerWidth < 768;
      // On larger screens, sidebar should always be visible
      if (!this.isMobile) {
        this.sidebarOpen = true;
      }
    },
    async fetchInvoice() {
      try {
        const id = this.$route.params.id
        const response = await this.$store.dispatch('invoice/fetchInvoice', id)
        
        if (response) {
          this.invoice = { ...response }
          
          // Format date for input
          if (this.invoice.invoiceToDetails && this.invoice.invoiceToDetails.date) {
            const date = new Date(this.invoice.invoiceToDetails.date)
            this.invoiceDate = date.toISOString().substr(0, 10)
          }
        }
      } catch (error) {
        console.error('Error fetching invoice:', error)
      }
    },
    
    async updateInvoice() {
      try {
        // Update date from input
        this.invoice.invoiceToDetails.date = new Date(this.invoiceDate)
        
        // Update total
        this.invoice.total = this.invoiceTotal
        
        await this.$store.dispatch('invoice/updateInvoice', {
          id: this.$route.params.id,
          invoiceData: this.invoice
        })
      } catch (error) {
        console.error('Error updating invoice:', error)
      }
    },
    
    addItem() {
      this.invoice.transactionDetails.push({
        product: '',
        rate: 0,
        quantity: 1,
        discount: 0,
        total: 0
      })
    },
    
    removeItem(index) {
      this.invoice.transactionDetails.splice(index, 1)
      this.invoice.total = this.invoiceTotal
    },
    
    calculateItemTotal(index) {
      const item = this.invoice.transactionDetails[index]
      const subtotal = item.rate * item.quantity
      item.total = subtotal - (item.discount || 0)
      this.invoice.total = this.invoiceTotal
    },
    logout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  },
  created() {
    this.fetchInvoice()
  },
  mounted() {

    
// Check screen size on mount
this.checkScreenSize();

// Add resize event listener
window.addEventListener('resize', this.checkScreenSize);
},
beforeDestroy() {
// Clean up event listener
window.removeEventListener('resize', this.checkScreenSize);
}
}
</script>

<style scoped>
.back-btn {
  font-size: 10px !important;
    border-radius: 10px;
    border: 1px solid #0d6efd;
    right: 6px;
    top: 7px;
    padding: 2px 10px;
    text-decoration: none;
    color: #0d6efd;
}
.back-btn:hover {
  background: #0d6efd;
  color: white;
}
label {
  font-size: 14px;
  font-weight: 600;
}
 input, textarea {
  background: transparent;
}
.table {
  min-width: 800px;
}

.table tr th  {
  background: #FFF6EC;
  font-size: 13px;
  font-weight: bold;
  
}
.table tr td{
  background: transparent;
  font-size: 13px;
  font-weight: bold;
}
.table tr td input {
  font-weight: bold;
  background: transparent;
  font-size: 14px
}

.main-content {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>