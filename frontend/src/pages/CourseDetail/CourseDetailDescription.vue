<template>
<!-- course description section -->
  <v-tab-item class="body-1 font-weight-light">
    {{ description }}
  </v-tab-item>
</template>

<script>
export default {
  name: "CourseDetailDescription",
  props: {
    description: {
      type: String,
      default: "No description."
    }
  }
}
</script>
