<template>
<!-- course details section -->
  <div> 
    <v-data-table
      :headers="tableHeaders"
      :items="labList"
      :items-per-page="10"
      :sort-by="['date']"
      :sort-desc="[true]"
      @click:row="onRowClick"
    >
      <!-- Edit and delete the lab -->
      <template v-slot:item.action="{ item }">
        <v-btn class="float-right" color="primary" depressed small @click.stop="onRowClick(item)">
          Go
        </v-btn>
        <v-icon small class="mr-2" v-if="user.role == `admin` || user.role == `instructor`" @click.stop="deleteLabClick(item)">delete</v-icon>
      </template>
    </v-data-table>
    <!-- Redirect to the lab create page -->
    <div class="clear-fix" v-if="user.role == `admin` || user.role == `instructor`">
      <router-link :to="{ name: 'Lab Create', params: { courseId } }">
        <v-btn class="float-right" color="secondary" depressed small>
          <v-icon left small>mdi-plus</v-icon>
          Create New Lab
        </v-btn>
      </router-link>
    </div>
  </div>
</template>

<script>
import { deleteLab } from "../../requests/course";

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
        { text: "Actions", value: "action", sortable: false }
      ],
      updatedList: []
    }
  },
  methods: {
    deleteLabClick(item) {
      let res = confirm('Are you sure you want to delete this lab?');
      if (res) {
        deleteLab({labId: item.id})
        .then(() => {
          this.status = "success";
          setTimeout(() => {
            // Refresh page
            this.$router.go();
          }, 500);
        })
      }
    },
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
