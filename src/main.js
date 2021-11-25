import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import moment from 'moment'
import {store} from './store/store'

Vue.config.productionTip = false
Vue.prototype.moment = moment

new Vue({
  store: store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')


