import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

const app = createApp(App);

app.use(vuetify);
app.use(pinia);
app.use(router);
app.component('VueDatePicker', VueDatePicker);

app.mount('#app');
