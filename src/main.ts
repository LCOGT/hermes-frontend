import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue, { VNode } from "vue";
import './plugins/bootstrap-vue'
import App from "./App.vue";
import router from "./router";
import VueCompositionAPI from "@vue/composition-api";
import "@jsonforms/vue2-vanilla/vanilla.css";
import vuetify from './plugins/vuetify'

Vue.use(VueCompositionAPI);

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: (h): VNode => h(App)
}).$mount("#app");
