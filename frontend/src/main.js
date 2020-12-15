// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from "vue-router";
import store from "./plugins/store";
import App from "./App";
import VueUploadComponent from 'vue-upload-component'

// router setup
import routes from "./routes/routes";

// Plugins
import GlobalComponents from "./plugins/globalComponents";
import GlobalDirectives from "./plugins/globalDirectives";
import Notifications from "./components/NotificationPlugin";
// MaterialDashboard plugin

import MaterialDashboard from "./plugins/material-dashboard";
import vuetify from "./plugins/vuetify.js";

import moment from "moment";
import VueApexCharts from "vue-apexcharts";

import { initial } from "./requests/auth";
import { getCourseList } from "./requests/course";


// configure router
const router = new VueRouter({
  mode: 'history',
  routes, // short for routes: routes
  linkExactActiveClass: "nav-item active"
});

// Configure navigation guard to determine the routes
router.beforeEach((to, from, next) => {
  // If the target url required login, we need to check whether there is valid cookie
  // We will navigate the target routes if the cookie is valid. 
  // Otherwise, we will navigate the login page
  if (to.matched.some(record => record.meta.requireLogin)) {
    // Verify the cookie
    initial()
    .then(res => {
      // The cookie is valid and then we will get user data and course data
      if (res.status === 200) {
        const { userId, email, firstName, lastName, roleName: role } = res.data.user;
        store.commit("setUser", { userId, email, firstName, lastName, role });
        return getCourseList(userId);
      }
    })
    .then(res => {
      store.commit("setCourses", res.data);
      next();
    })
    .catch(() => {
      // There isn't valid cookie so we will navigate to the login page
      store.commit("setUser", null);
      store.commit("setCourses", null);
      next({ name: "Login" });
    })
  } else {
    next();
  }
});

Vue.prototype.moment = moment;
Vue.use(VueRouter);
Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
Vue.use(Notifications);
Vue.component('file-upload', VueUploadComponent);
Vue.component('apexchart', VueApexCharts);

Vue.config.devtools = true;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  router,
  store,
  vuetify,
});
