import Vue, { VNode } from "vue";
import App from "./App.vue";
import VueCompositionAPI from "@vue/composition-api";
import "@jsonforms/vue2-vanilla/vanilla.css";
import vuetify from './plugins/vuetify'

Vue.use(VueCompositionAPI);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h): VNode => h(App)
}).$mount("#app");
