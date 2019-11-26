import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";
import store from "../store";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isLoggedIn;
  const requiresAuth = record => record.meta.requiresAuth;
  if (to.matched.some(requiresAuth)) {
    if (!isLoggedIn) {
      next({ name: "auth" });
    } else {
      next(true);
    }
  } else {
    next();
  }
});

export default router;
