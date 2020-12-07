<template>
<!-- Registered users list section  -->
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="userList"
    :items-per-page="5"
    item-key="userId"
    @input="onChange"
    show-select
  >
    <template v-slot:top>
      <div class="d-flex justify-space-between">
        <span class="subtitle-1">Registered Users</span>
      </div>
    </template>
    <template v-slot:no-data>
      No asset available now.
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "RegisteredUsers",
  props: {
    userList: {
      type: Array,
      default: () => []
    },
    selectedUserList: {
      type: Array,
      default: () => []    
    }
  },
  data() {
    return {
      headers: [
        { text: "Name", value: "userName" },
        { text: "Email", value: "email" },
        { text: "Role", value: "roleName" }
      ],
      selected: this.selectedUserList
    }
  },
  watch:{
    selectedUserList: function(val){
      this.selected = val
    }
  },
  methods: {
    onChange() {
      this.$emit("onSelectChange", this.selected);
    }
  }
}
</script>
