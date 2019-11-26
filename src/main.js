import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueTimers from "./plugins/vue-timers.js";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import "@babel/polyfill";

Vue.config.productionTip = false;

new Vue({
  VueTimers,
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#App");
