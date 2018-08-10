import Vue from 'vue'
import './plugins/vuetify'
import VueSocketio from 'vue-socket.io'
import VueScrollTo from 'vue-scrollto'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VueScrollTo)
Vue.use(VueSocketio, 'http://localhost:3000')

var vm = new Vue({
  render: h => h(App)
}).$mount('#app')
