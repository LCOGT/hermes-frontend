import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue, { VNode } from "vue";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import './plugins/bootstrap-vue';
import App from "./App.vue";
import router from "./router";
import vuetify from './plugins/vuetify';
import store from './store';
import 'ocs-component-lib/dist/ocs-component-lib.css';
import { OCSComponentLib } from 'ocs-component-lib';

Vue.use(BootstrapVue);
Vue.use(OCSComponentLib);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  store,
  render: (h): VNode => h(App)
}).$mount("#app");
