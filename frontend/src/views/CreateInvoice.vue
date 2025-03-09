<template>
  <div class="container-fluid bg-transparent">
    <!-- Hamburger button for medium devices -->
    <HemBurger @click="toggleSidebar"/>
    <div class="row">
    
      
      <!-- Sidebar with conditional classes -->
        <SideBar :class="{'d-none': sidebarOpen && isMobile}" />

      <!-- Main Content -->
      <div :class="['main-content', sidebarOpen || !isMobile ? 'col-md-10' : 'col-12', 'p-0 mb-4']">
        <div class="d-md-flex text-center text-md-start align-items-center add-invoice bg-white position-relative invoice-nav mb-3 p-2">
          <router-link to="/invoices" class="btn d-none d-md-block fw-900 me-3">
            <i class="bi bi-arrow-left"></i>
          </router-link>
          <h6 class="mb-0">Add New Invoice</h6>
          <router-link to="/invoices" class="back-btn d-md-none fs-6 fw-900 position-absolute">
            Back
          </router-link>
        </div>

        <!-- Steps Indicator -->
        <div class="card mb-4 bg-transparent border-0">
          <div class="card-body">
            <div class="row justify-content-center text-center position-relative">
              <div class="invoice-step-line" :class="{ 'active': currentStep >= 2, 'completed': currentStep > 2 }">
              </div>
              <div class="invoice-step-line" :class="{ 'active': currentStep >= 3, 'completed': currentStep > 3 }"
                style="left: calc(33.33% + 40px); width: calc(33.33% - 80px);"></div>

              <div class="col-md-3 col-sm-4 col-4">
                <div class="invoice-step mx-auto"
                  :class="{ 'active': currentStep === 1, 'completed': currentStep > 1 }">1</div>
                <p>Invoice Details</p>
              </div>

              <div class="col-md-3 col-sm-4 col-4">
                <div class="invoice-step mx-auto"
                  :class="{ 'active': currentStep === 2, 'completed': currentStep > 2 }">2</div>
                <p>Transaction Details</p>
              </div>

              <div class="col-md-3 col-sm-4 col-4">
                <div class="invoice-step mx-auto"
                  :class="{ 'active': currentStep === 3, 'completed': currentStep > 3 }">3</div>
                <p>Preview</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 1: Invoice Details -->
        <div v-if="currentStep === 1" class="card bg-transparent">
          <div class="card-body">
            <h4 class="mb-4 text-primary">Company Details</h4>
            <div class="row mb-4">
              <div class="col-md-8 me-2 mb-3">
                <label for="companyName" class="form-label">Company Name</label>
                <input type="text" class="form-control" id="companyName" v-model="companyDetails.name"
                  placeholder="Enter Name" :class="{ 'is-invalid': errors.companyName }">
                <div v-if="errors.companyName" class="invalid-feedback">{{ errors.companyName }}</div>
              </div>

              <div class="col-md-4 mb-3">
                <label for="companyMobile" class="form-label">Mobile No.</label>
                <input type="text" class="form-control" id="companyMobile" v-model="companyDetails.mobile"
                  placeholder="Enter Mobile No." :class="{ 'is-invalid': errors.companyMobile }">
                <div v-if="errors.companyMobile" class="invalid-feedback">{{ errors.companyMobile }}</div>
              </div>

              <div class="col-md-4 mb-3 me-2">
                <label for="companyEmail" class="form-label">Email</label>
                <input type="email" class="form-control" id="companyEmail" v-model="companyDetails.email"
                  placeholder="Enter Email" :class="{ 'is-invalid': errors.companyEmail }">
                <div v-if="errors.companyEmail" class="invalid-feedback">{{ errors.companyEmail }}</div>
              </div>

              <div class="col-md-4 mb-3">
                <label for="companyGstin" class="form-label">GSTIN</label>
                <input type="text" class="form-control" id="companyGstin" v-model="companyDetails.gstin"
                  placeholder="Enter GSTIN" :class="{ 'is-invalid': errors.companyGstin }">
                <div v-if="errors.companyGstin" class="invalid-feedback">{{ errors.companyGstin }}</div>
              </div>

              <div class="col-md-12">
                <label for="companyAddress" class="form-label">Company Address</label>
                <textarea class="form-control" id="companyAddress" v-model="companyDetails.address"
                  placeholder="Enter Address" rows="3" :class="{ 'is-invalid': errors.companyAddress }"></textarea>
                <div v-if="errors.companyAddress" class="invalid-feedback">{{ errors.companyAddress }}</div>
              </div>
            </div>

            <h4 class="mb-4 text-primary">Invoice To Details</h4>
            <div class="row">
              <div class="col-md-4 me-2 mb-3">
                <label for="invoiceDate" class="form-label">Payment Date</label>
                <input type="date" class="form-control" id="invoiceDate" v-model="invoiceToDetails.date"
                  :class="{ 'is-invalid': errors.invoiceDate }">
                <div v-if="errors.invoiceDate" class="invalid-feedback">{{ errors.invoiceDate }}</div>
              </div>

              <div class="col-md-18 mb-3">
                <label for="customerName" class="form-label">Name</label>
                <input type="text" class="form-control" id="customerName" v-model="invoiceToDetails.name"
                  placeholder="Enter Name" :class="{ 'is-invalid': errors.customerName }">
                <div v-if="errors.customerName" class="invalid-feedback">{{ errors.customerName }}</div>
              </div>

              <div class="col-md-4 mb-3">
                <label for="customerMobile" class="form-label">Mobile No.</label>
                <input type="text" class="form-control" id="customerMobile" v-model="invoiceToDetails.mobile"
                  placeholder="Enter Mobile No." :class="{ 'is-invalid': errors.customerMobile }">
                <div v-if="errors.customerMobile" class="invalid-feedback">{{ errors.customerMobile }}</div>
              </div>

              <div class="col-md-4 me-2 mb-3">
                <label for="customerEmail" class="form-label">Email ID</label>
                <input type="email" class="form-control" id="customerEmail" v-model="invoiceToDetails.email"
                  placeholder="Enter Email" :class="{ 'is-invalid': errors.customerEmail }">
                <div v-if="errors.customerEmail" class="invalid-feedback">{{ errors.customerEmail }}</div>
              </div>

              <div class="col-md-4 mb-3">
                <label for="customerPincode" class="form-label">Pincode</label>
                <input type="text" class="form-control" id="customerPincode" v-model="invoiceToDetails.pincode"
                  placeholder="Enter Pincode" :class="{ 'is-invalid': errors.customerPincode }"
                  @input="validatePincode" maxlength="6">
                <div v-if="errors.customerPincode" class="invalid-feedback">{{ errors.customerPincode }}</div>
              </div>

              <div class="col-md-4 mb-3">
                <label for="customerCity" class="form-label">City</label>
                <input type="text" class="form-control" id="customerCity" v-model="invoiceToDetails.city"
                  placeholder="Enter City" :class="{ 'is-invalid': errors.customerCity }">
                <div v-if="errors.customerCity" class="invalid-feedback">{{ errors.customerCity }}</div>
              </div>

              <div class="col-md-4 mb-3">
                <label for="customerState" class="form-label">State</label>
                <input type="text" class="form-control" id="customerState" v-model="invoiceToDetails.state"
                  placeholder="Enter State" :class="{ 'is-invalid': errors.customerState }">
                <div v-if="errors.customerState" class="invalid-feedback">{{ errors.customerState }}</div>
              </div>

              <div class="col-md-12">
                <label for="customerAddress" class="form-label">Address</label>
                <textarea class="form-control" id="customerAddress" v-model="invoiceToDetails.address"
                  placeholder="Enter Address" rows="3" :class="{ 'is-invalid': errors.customerAddress }"></textarea>
                <div v-if="errors.customerAddress" class="invalid-feedback">{{ errors.customerAddress }}</div>
              </div>
            </div>

            <div class="d-flex justify-content-end mt-4">
              <button @click="validateStep1" class="btn btn-primary px-4">
                Next
              </button>
            </div>
          </div>
        </div>

        <!-- Step 2: Transaction Details -->
        <div v-if="currentStep === 2" class="card bg-transparent border-0">
          <div class="card-body position-relative">
            <h4 class="mb-4">Transaction Details</h4>

            <div class="table-responsive mb-4">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th style="width: 30%">Product</th>
                    <th style="width: 15%">Rate</th>
                    <th style="width: 15%">Quantity</th>
                    <th style="width: 15%">Discount (in Rs.)</th>
                    <th style="width: 15%">Total</th>
                    <th style="width: 10%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in transactionDetails" :key="index">
                    <td>
                      <input type="text" class="form-control" v-model="item.product"
                        :class="{ 'is-invalid': errors[`product_${index}`] }">
                      <div v-if="errors[`product_${index}`]" class="invalid-feedback">{{ errors[`product_${index}`] }}
                      </div>
                    </td>
                    <td>
                      <input type="number" class="form-control" v-model.number="item.rate"
                        @input="calculateItemTotal(index)" :class="{ 'is-invalid': errors[`rate_${index}`] }">
                      <div v-if="errors[`rate_${index}`]" class="invalid-feedback">{{ errors[`rate_${index}`] }}</div>
                    </td>
                    <td>
                      <input type="number" class="form-control" v-model.number="item.quantity"
                        @input="calculateItemTotal(index)" :class="{ 'is-invalid': errors[`quantity_${index}`] }">
                      <div v-if="errors[`quantity_${index}`]" class="invalid-feedback">{{ errors[`quantity_${index}`] }}
                      </div>
                    </td>
                    <td>
                      <input type="number" class="form-control" v-model.number="item.discount"
                        @input="calculateItemTotal(index)" :class="{ 'is-invalid': errors[`discount_${index}`] }">
                      <div v-if="errors[`discount_${index}`]" class="invalid-feedback">{{ errors[`discount_${index}`] }}
                      </div>
                    </td>
                    <td>
                      <input type="number" class="form-control" v-model.number="item.total" readonly>
                    </td>
                    <td>
                      <button @click="removeItem(index)" class="btn btn-sm btn-outline-danger"
                        :disabled="transactionDetails.length === 1">
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="d-flex justify-content-end mb-4">
              <button @click="addItem" class="btn add-prd-btn btn-primary rounded-circle">
                <i class="bi bi-plus-lg"></i> 
              </button>

              <div class="d-flex col-8 col-md-4 justify-content-between bg-body-secondary px-4 py-2 border align-items-center">
                <h5 class="me-3 mb-0">Total:</h5>
                <h5>|</h5>
                <h5 class="mb-0">₹{{ calculateTotal() }}</h5>
              </div>
            </div>

            <div class="d-flex justify-content-end">
              <button @click="goBack" class="btn btn-outline-primary rounded-pill py-2 me-2 px-4">
                Back
              </button>
              <button @click="validateStep2" class="btn btn-primary rounded-pill py-2 px-4">
                Next
              </button>
            </div>
          </div>
        </div>

        <!-- Step 3: Preview -->
        <div v-if="currentStep === 3" class="card bg-transparent border-0">
          <div class="card-body bg-transparent p-0">

            <div class="invoice-preview">
              <div class="invoice-header">
                <div class="d-flex flex-wrap justify-content-between align-items-center px-5">
                  <h4>{{ companyDetails.name || 'Company Name' }}</h4>
                  <div class="comp-info">
                    <p class="mb-0">Mobile: <span>{{ companyDetails.mobile || '+91-9837589372' }}</span></p>
                  <p class="mb-0">Email: <span>{{ companyDetails.email || 'company.email@gmail.com' }}</span></p>
                  <p class="mb-0">GSTIN: <span>{{ companyDetails.gstin || '09AAACH7409R1ZZ' }}</span></p>
                  </div>
                </div>
                <div class="my-3">
                    <div class="d-flex bg-body-secondary py-3 px-5 justify-content-between">
                      <h2 class="text-success mb-0">Invoice</h2>
                      <h5 class="mb-0 fw-bold">#{{ generateInvoiceNumber() }}</h5>
                    </div>
                
                </div>
              </div>

              <div class="invoice-to px-5 d-flex justify-content-between flex-wrap">
               <div>
                <h5>INVOICE TO:</h5>
                <p class="mb-0">Name: <span>{{ invoiceToDetails.name || 'Customer Name' }}</span></p>
                <p class="mb-0">Mobile: <span>{{ invoiceToDetails.mobile || '+91-9837589372' }}</span></p>
                <p class="mb-0">Email: <span>{{ invoiceToDetails.email || 'customer.email@gmail.com' }}</span></p>
                <p class="mb-0">Address: <span>{{ formatAddress() || 'Customer Address' }}</span></p>
               </div>

                <p class="mb-0">Date: <span>{{ formatDate(invoiceToDetails.date) || '23-04-2024' }}</span></p>
              </div>

              <div class="invoice-table px-5">
                <table class="table table-responsive table-bordered">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Rate</th>
                      <th>Quantity</th>
                      <th>Discount</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in transactionDetails" :key="index">
                      <td>{{ item.product }}</td>
                      <td>{{ item.rate }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ item.discount }}</td>
                      <td>₹{{ item.total }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="invoice-total d-flex justify-content-end px-5">
                <div
                  class="d-flex col-8 col-md-5 justify-content-between bg-body-secondary px-4 py-2 border align-items-center">
                  <h5 class="me-3 mb-0">Total:</h5>
                  <h5>|</h5>
                  <h5 class="mb-0">₹{{ calculateTotal() }}</h5>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-end mt-4 px-5">
              <button @click="goBack" class="btn btn-outline-primary me-3 px-4 rounded-pill py-2">
                Back
              </button>
              <button @click="submitInvoice" class="btn rounded-pill py-2 btn-primary px-4" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                  aria-hidden="true"></span>
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SideBar from '../components/SideBar.vue'
import HemBurger from '../components/Hemburger.vue'

export default {
  name: 'CreateInvoice',
  components: {
    SideBar,
    HemBurger
    
  },
  data() {
    return {
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
      transactionDetails: [
        {
          product: '',
          rate: 0,
          quantity: 0,
          discount: 0,
          total: 0
        }
      ],
      errors: {},
      loading: false,
      sidebarOpen: true,
      isMobile: false
    }
  },
  computed: {
    ...mapGetters({
      currentStep: 'invoice/currentStep'
    })
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
    validatePincode() {
      // Remove any non-numeric characters
      this.invoiceToDetails.pincode = this.invoiceToDetails.pincode.replace(/\D/g, '');
    },
    validateStep1() {
      this.errors = {}
      let isValid = true

      // Company Details Validation
      if (!this.companyDetails.name) {
        this.errors.companyName = 'Company name is required'
        isValid = false
      }

      if (!this.companyDetails.mobile) {
        this.errors.companyMobile = 'Mobile number is required'
        isValid = false
      } else if (!/^\d{10}$/.test(this.companyDetails.mobile)) {
        this.errors.companyMobile = 'Mobile number must be 10 digits'
        isValid = false
      }

      if (!this.companyDetails.email) {
        this.errors.companyEmail = 'Email is required'
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(this.companyDetails.email)) {
        this.errors.companyEmail = 'Please enter a valid email'
        isValid = false
      }

      if (!this.companyDetails.address) {
        this.errors.companyAddress = 'Address is required'
        isValid = false
      }

      // Invoice To Details Validation
      if (!this.invoiceToDetails.date) {
        this.errors.invoiceDate = 'Date is required'
        isValid = false
      }

      if (!this.invoiceToDetails.name) {
        this.errors.customerName = 'Name is required'
        isValid = false
      } else if (/[^a-zA-Z\s]/.test(this.invoiceToDetails.name)) {
        this.errors.customerName = 'Name cannot have special characters'
        isValid = false
      }

      if (!this.invoiceToDetails.mobile) {
        this.errors.customerMobile = 'Mobile number is required'
        isValid = false
      } else if (!/^\d{10}$/.test(this.invoiceToDetails.mobile)) {
        this.errors.customerMobile = 'Mobile number must be 10 digits'
        isValid = false
      }

      if (!this.invoiceToDetails.email) {
        this.errors.customerEmail = 'Email is required'
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(this.invoiceToDetails.email)) {
        this.errors.customerEmail = 'Please enter a valid email'
        isValid = false
      }

      // Add pincode validation
      if (!this.invoiceToDetails.pincode) {
        this.errors.customerPincode = 'Pincode is required'
        isValid = false
      } else if (!/^\d{6}$/.test(this.invoiceToDetails.pincode)) {
        this.errors.customerPincode = 'Pincode must be exactly 6 digits'
        isValid = false
      }

      if (!this.invoiceToDetails.address) {
        this.errors.customerAddress = 'Address is required'
        isValid = false
      }

      if (isValid) {
        this.$store.dispatch('invoice/updateCompanyDetails', this.companyDetails)
        this.$store.dispatch('invoice/updateInvoiceToDetails', this.invoiceToDetails)
        this.$store.dispatch('invoice/setCurrentStep', 2)
      }
    },

    validateStep2() {
      this.errors = {}
      let isValid = true

      this.transactionDetails.forEach((item, index) => {
        if (!item.product) {
          this.errors[`product_${index}`] = 'Product name is required'
          isValid = false
        }

        if (!item.rate || item.rate <= 0) {
          this.errors[`rate_${index}`] = 'Rate must be greater than 0'
          isValid = false
        }

        if (!item.quantity || item.quantity <= 0) {
          this.errors[`quantity_${index}`] = 'Quantity must be greater than 0'
          isValid = false
        }

        if (item.discount < 0) {
          this.errors[`discount_${index}`] = 'Discount cannot be negative'
          isValid = false
        }
      })

      if (isValid) {
        this.$store.dispatch('invoice/updateTransactionDetails', this.transactionDetails)
        this.$store.dispatch('invoice/setCurrentStep', 3)
      }
    },

    addItem() {
      this.transactionDetails.push({
        product: '',
        rate: 0,
        quantity: 0,
        discount: 0,
        total: 0
      })
    },

    removeItem(index) {
      if (this.transactionDetails.length > 1) {
        this.transactionDetails.splice(index, 1)
      }
    },

    calculateItemTotal(index) {
      const item = this.transactionDetails[index]
      item.total = (item.rate * item.quantity) - (item.discount || 0)
      if (item.total < 0) item.total = 0
    },

    calculateTotal() {
      return this.transactionDetails.reduce((total, item) => {
        return total + (item.total || 0)
      }, 0)
    },

    goBack() {
      this.$store.dispatch('invoice/setCurrentStep', this.currentStep - 1)
    },

    submitInvoice() {
      this.loading = true

      const invoiceData = {
        companyDetails: this.companyDetails,
        invoiceToDetails: this.invoiceToDetails,
        transactionDetails: this.transactionDetails,
        total: this.calculateTotal(),
        generatedBy: 'User'
      }

      this.$store.dispatch('invoice/createInvoice', invoiceData)
        .then(() => {
          this.loading = false
          this.$router.push('/invoices')
        })
        .catch(() => {
          this.loading = false
        })
    },

    logout() {
      this.$store.dispatch('auth/logout')
    },

    formatDate(dateString) {
      if (!dateString) return ''

      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },

    formatAddress() {
      const { address, city, state, pincode } = this.invoiceToDetails
      let formattedAddress = address || ''

      if (city) formattedAddress += (formattedAddress ? ', ' : '') + city
      if (state) formattedAddress += (formattedAddress ? ', ' : '') + state
      if (pincode) formattedAddress += (formattedAddress ? ' - ' : '') + pincode

      return formattedAddress
    },

    generateInvoiceNumber() {
      return Math.floor(1000000 + Math.random() * 9000000)
    }
  },
  created() {
    this.$store.dispatch('invoice/resetInvoice')
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
.add-invoice {
  box-shadow: 2px 2px 10px 0px #dbd6d6;
}
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
.invoice-preview p {
  font-size: 15px;
}
.invoice-preview .comp-info p {
  font-size: 14px;
}
.invoice-preview p span {
  font-weight: 600;
}
label {
  font-size: 14px;
  font-weight: 600;
}
 input, textarea {
  background: transparent;
}

.add-prd-btn {
  position: absolute;
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
    font-size: 14px;
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





@media (max-width: 767.98px) {
  .main-content {
    padding-top: 60px;
  }
}
</style>