<template>
<!-- course details section -->
  <v-tab-item>
    <v-data-table
      :headers="tableHeaders"
      :items="labList"
      :items-per-page="10"
      :sort-by="['date']"
      :sort-desc="[true]"
      @click:row="onRowClick"
      show-select
    >
      <template v-slot:top>
        <!-- Redirect to the lab create page -->
        <div class="clear-fix" v-if="user.role == `admin` || user.role == `instructor`">
          <router-link :to="{ name: 'Lab Create', params: { courseId } }">
            <v-btn class="float-right" color="success" depressed small>
              <v-icon left small>mdi-plus</v-icon>
              New Lab
            </v-btn>
          </router-link>
        </div>
      </template>
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
  name: "CourseDetailLab",
  props: {
    courseId: {
      type: [String, Number],
      required: true
    },
    labList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      user: this.$store.getters.user,
      tableHeaders: [
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
        params: { courseId: this.courseId, labId: item.id }
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
