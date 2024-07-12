import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import axiosPlugin from './plugins/axios'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()

app.use(axiosPlugin)
pinia.use(({ store }) => {
  store.$http = app.config.globalProperties.$http
})
app.use(pinia)
app.use(router)

app.mount('#app')
