<template>
  <div class="wrapper full-height" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/courses/1">
        <md-icon>school</md-icon>
        <p>Course</p>
      </sidebar-link>
      <sidebar-link to="/metrics">
        <md-icon>poll</md-icon>
        <p>Metric</p>
      </sidebar-link>
      <sidebar-link to="/assets/create">
        <md-icon>cloud_upload</md-icon>
        <p>Upload Asset</p>
      </sidebar-link>
      <sidebar-link to="/help">
        <md-icon>help</md-icon>
        <p>Help</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel full-height">
      <dashboard-content style="height: calc(100% - 66px);"></dashboard-content>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
  .wrapper {
    width: 100%;
  }
</style>
<script>
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";

export default {
  components: {
    DashboardContent,
    ContentFooter,
    MobileMenu
  }
};
</script>
