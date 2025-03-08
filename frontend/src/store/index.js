import { createStore } from 'vuex'
import auth from './modules/auth'
import invoice from './modules/invoice'

export default createStore({
  modules: {
    auth,
    invoice
  }
})