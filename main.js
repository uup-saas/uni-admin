import Vue from 'vue'
import App from './App'
import store from './store'
import plugin from './js_sdk/uni-admin/plugin'
import JsonExcel from 'vue-json-excel'

Vue.component("downloadExcel", JsonExcel)
Vue.config.productionTip = false

Vue.use(plugin)

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
