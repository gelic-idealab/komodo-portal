<template>
    <iframe allow="xr-spatial-tracking" :src="clientPath" style="position: relative; height: 100%; width: 100%; border:none;"></iframe>
</template>

<script>
export default {
  name: "VrClient",
  props: {
    clientPath: String
  }
}
</script>

<style>

</style>