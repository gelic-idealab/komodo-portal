<template>
  <v-app>
    <v-content class="grey lighten-4">
      <v-container class="full-height pa-0" fluid>
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {};
</script>

<style>
  :root {
    --v-primary: #7f5de9;
    --v-accent: #AB68CA;
    --v-secondary: #377ED4;
    --v-tertiary: #DE67A3;
    --v-success: #4DC08C;
    --v-warning: #FFA91B;
    --v-error: #FF3D8B;
  }
  .container {
    display: block !important;
  }
  .full-width {
    width: 100%;
  }
  .full-height {
    height: 100%;
  }
  .radius-2 {
    border-radius: 8px !important;
  }
  .radius-3 {
    border-radius: 12px !important;
  }
  .background-white {
    background: white;
  }
  .clear-fix:after {
    display: block;
    clear: both;
    content: ".";
    height: 0;
  }
  .pointer {
    cursor: pointer;
  }
  .shadow-section {
    box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.1) !important;
  }
  .text-overflow-ellipsis {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
