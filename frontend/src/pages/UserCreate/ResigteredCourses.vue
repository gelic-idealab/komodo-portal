<template>
<!-- Registered course list section -->
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="courseList"
    :items-per-page="5"
    item-key="courseId"
    @input="onChange"
    show-select
  >
    <template v-slot:top>
      <div class="d-flex justify-space-between">
        <span class="subtitle-1">Registered Courses</span>
      </div>
    </template>
    <template v-slot:no-data>
      No asset available now.
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "RegisteredCourses",
  props: {
    courseList: {
      type: Array,
      default: () => []
    },
    selectedCourseList:{
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      headers: [
        { text: "CourseNo", value: "courseNo" },
        { text: "Name", value: "courseName" },
        { text: "Description", value: "description" }
      ],
      selected: this.selectedCourseList
    }
  },
  watch:{
    selectedCourseList: function(val){
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
