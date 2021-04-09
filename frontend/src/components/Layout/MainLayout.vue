<template>
  <div class="main-layout-container">
    <SideBar />
    <div class="main-content full-height">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import SideBar from "./SideBar";

export default {
  name: "MainLayout",
  components: {
    SideBar,
  },
  data() {
    return {}
  },
  mounted() {

  },
  methods: {}
}
</script>

<style>
  .main-layout-container {
  }

  .main-content {
    /* overflow-y: scroll; */
    padding: 2.5vh 2.5vw;
    transition-duration: .2s;
    transition-timing-function: cubic-bezier(.4,0,.2,1);
  }

  .v-navigation-drawer--mini-variant + .main-content {
    margin-left: 56px;
  }

  .v-navigation-drawer--is-mouseover + .main-content {
    margin-left: 230px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.1s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  @media screen {
    .v-navigation-drawer--is-mouseover + .main-content {
    margin-left: 56px!important;
  }
  }
</style>
