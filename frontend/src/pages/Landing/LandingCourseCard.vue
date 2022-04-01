<template>
  <div class="landing-course-card-container pa-4 radius-2 full-height">
    <div class="subtitle-1 text--primary pb-2">
      {{ `${course.courseNo}: ${course.courseName}` }}
    </div>
    <div class="text--secondary">{{ course.department || "No Dept."}}</div>
    <p class="text--secondary">{{ `${course.instructorName || "No Instr."}` }}</p>
    <router-link
      :to="{ name: 'Course Detail', params: { courseId: course.courseId } }"
    >
      <v-btn color="primary" depressed>{{ `Go` }}</v-btn>
    </router-link>
    <div v-if="user.role == `admin` || user.role == `instructor`">
    </div>
  </div>
</template>

<script>
export default {
  components: { },
  name: "LandingCourseCard",
  data() {
    return {
      user: this.$store.getters.user
    }
  },
  props: {
    course: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style>
  .landing-course-card-container {
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: left;
    text-align: left;
  }
  .landing-course-card-container {
    background-color: #eee;
  }

  @media screen and (max-width: 400px){
    .col.col-4 {
    max-width: 100%!important;
    flex: 1;
    }

    .col.col-8 {
    max-width: 100%!important;
    flex: 1;
    }
  }   
</style>
