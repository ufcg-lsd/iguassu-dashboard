import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import jobs from "./modules/jobs";
import queues from "./modules/queues";
import nodes from "./modules/nodes";
import getters from "./getters";

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: true,
  getters,
  modules: {
    auth,
    jobs,
    queues,
    nodes
  }
});

export default store;
