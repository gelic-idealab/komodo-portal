<template>
  <div class="web-page" @mouseover="handle=true" @mouseleave="handle=false">
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-text>
            <v-text-field clearable v-model="url" label="Component URL"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-on:click="onUpdate">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-toolbar transition="fade-transition" v-show="handle" color="blue">
        <v-icon color="white">drag_handle</v-icon>
        <v-btn icon @click="dialog= !dialog"><v-icon color="white">edit</v-icon></v-btn>
      </v-toolbar>
      <embed v-bind:src="localUrl" frameborder=0 width="100%" :height="h"/>
  </div>
</template>

<script>
export default {
  name: 'WebPage',
  props: {
    url: String,
    title: String,
    h: Number,
    spawn: Boolean
  },
  data() {
    return {
      localUrl: this.url,
      dialog: false,
      handle: true
    }
  },
  methods: {
      onUpdate() {
        this.dialog = false;
        this.localUrl=this.url
        this.$emit('update:url', this.localUrl);
      }
  },
  mounted() {
    this.dialog = this.spawn
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
