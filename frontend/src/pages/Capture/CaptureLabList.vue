<template>
<!-- course details section -->
  <v-tab-item>
    <v-data-table
      :headers="tableHeaders"
      :items="captures"
      :items-per-page="10"
      :sort-by="['date']"
      :sort-desc="[true]"
      @click:row="onRowClick"
      show-select
    >
      <!-- Edit and delete the lab -->
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2">mdi-play</v-icon>
        <v-icon small class="mr-2">mdi-camera</v-icon>
        <v-icon small class="mr-2" v-if="user.role == `admin` || user.role == `instructor`">edit</v-icon>
        <v-icon small v-if="user.role == `admin` || user.role == `instructor`" @click="deleteLabClick(item)">delete</v-icon>
      </template>
    </v-data-table>
  </v-tab-item>
</template>

<script>
export default {
  name: "CaptureLabList",
  props: {
    courseId: {
      type: [String, Number],
      required: true
    },
    captures: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      user: this.$store.getters.user,
      tableHeaders: [
        { text: "ID", value: "captureId"},
        { text: "Name", value: "labName" },
        { text: "Date", value: "date" },
        { text: "Time", value: "time" },
        { text: "Duration", value: "duration", sortable: false },
        { text: "Actions", value: "action", sortable: false }
      ],
      updatedList: []
    }
  },
  methods: {
    /**
     * Redirect to the lab deteail page for the selected lab
     */
    onRowClick(item) {
      this.$router.push({
        name: "Lab Detail",
        params: { courseId: this.courseId, labId: item.id, captureId: item.captureId }
      });
    }
    }
}
</script>

<style>
.v-data-table__wrapper > table > tbody > tr {
  cursor: pointer;
}
</style>
