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
// import Notifications from "./components/NotificationPlugin";

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

function setTitle (to, from, next) {
  // J. Bemenderfer, “How To Update Page Title and Metadata with Vue.js and vue-router,” 
  //  Digitalocean.com, 2018. 
  //  https://www.digitalocean.com/community/tutorials/vuejs-vue-router-modify-head (accessed Apr. 01, 2022).

  // This goes through the matched routes from last to first, finding the closest route with a title.
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if(nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  } else if(previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title;
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if(!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    // We use this to track which meta tags we create so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
  // Add the meta tags to the document head.
  .forEach(tag => document.head.appendChild(tag));

  next();
}

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

  setTitle(to, from, next);
});

Vue.prototype.moment = moment;
Vue.use(VueRouter);
Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
// Vue.use(Notifications);
Vue.component('file-upload', VueUploadComponent);
Vue.component('ApexChart', VueApexCharts);

Vue.config.devtools = true;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  router,
  store,
  vuetify,
});
