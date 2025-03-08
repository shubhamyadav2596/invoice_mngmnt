<template>
  <div class="col-4 col-sm-3 col-md-2 bg-white d-flex flex-column justify-content-between sidebar p-0 py-2 h-100 ">
    <div class="d-flex flex-column ">
      <div class="mb-3 mb-md-4 w-100 logo mt-5 mt-md-0 text-center px-2">
        <img src="../assets/logo1.png" class="mx-auto" alt="Logo" width="120">
      </div>
      
      <ul class="nav flex-column">
        <li class="nav-item" v-for="(item, index) in menuItems" :key="index">
          <router-link :to="item.path" class="nav-link" :class="{ active: isActive(item.path) }">
             {{ item.title }}
          </router-link>
        </li>
      </ul>
      
    </div>
    <div class="w-75 mx-auto">
      <button @click="logout" class="btn logout-btn btn-outline-danger w-100">
        Logout
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideBar',
  props: {
    // Allow customizing menu items from parent component
    customMenuItems: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // Default menu items
      defaultMenuItems: [
        {
          title: 'Team',
          path: '/dashboard',
          icon: 'bi-speedometer2'
        },
        {
          title: 'Invoices',
          path: '/invoices',
          icon: 'bi-receipt'
        }
      ]
    }
  },
  computed: {
    // Use custom menu items if provided, otherwise use defaults
    menuItems() {
      return this.customMenuItems.length > 0 ? this.customMenuItems : this.defaultMenuItems
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout')
    },
    isActive(path) {
      // Check if current route matches the menu item path
      return this.$route.path === path || this.$route.path.startsWith(`${path}/`)
    }
  }
}
</script>

<style scoped>
.sidebar {
  min-height: 100vh;
  box-shadow: 5px 0px 10px 0px #d1d1d161;
  z-index: 1;
  position: sticky;
  top: 0

}

.sidebar .nav-link {
  color: black;
  padding: 0.7rem 1rem;
  margin-bottom: 0.25rem;
  border-radius: 0.25rem;
  font-size: 13px;
}
.logout-btn {
  font-size: 13px;
}

.sidebar .nav-link:hover {
  color: white;
  background-color: #438cfa;
}

.sidebar .nav-link.active {
  color: white;
  background-color: #0d6efd;
}
@media screen  and (max-width: 767.98px) {
   .sidebar {
    position: fixed;
   }
   .logo img {
    width: 90px !important
   }
}
</style>