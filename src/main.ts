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
import $ from 'jquery';

Vue.use(BootstrapVue);
Vue.use(OCSComponentLib);
Vue.use(IconsPlugin);

Vue.config.productionTip = false;

// Add csrf protection and credentials to requests sent with ajax
$(document).ajaxSend(function(event, xhr, settings) {
  settings.xhrFields = {
    withCredentials: true
  };
});

new Vue({
  router,
  vuetify,
  store,
  render: (h): VNode => h(App)
}).$mount("#app");
