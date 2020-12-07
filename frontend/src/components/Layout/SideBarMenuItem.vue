<template>
  <router-link :to="to">
    <v-list-item :class="$route.path === to ? ' active' : ''" class="mb-1" link>
      <v-list-item-icon>
        <v-icon>{{ iconName }}</v-icon>
      </v-list-item-icon>
      <v-list-item-title>{{ title }}</v-list-item-title>
      <v-list-item-icon v-if="appendIconName">
        <v-icon>{{ appendIconName }}</v-icon>
      </v-list-item-icon>
    </v-list-item>
  </router-link>
</template>

<script>
export default {
  name: "SideBarMenuItem",
  props: {
    title: {
      type: String,
      required: true
    },
    iconName: {
      type: String,
      required: true
    },
    appendIconName: {
      type: String,
      required: false
    },
    to: {
      type: String,
      default: ""
    }
  }
}
</script>
