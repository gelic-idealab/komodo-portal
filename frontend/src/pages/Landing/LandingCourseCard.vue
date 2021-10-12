<template>
  <router-link
    :to="{ name: 'Course Detail', params: { courseId: course.courseId } }"
    class="landing-course-card-container pa-4 radius-2 full-height"
  >
    <div class="subtitle-1 text--primary pb-2">
      {{ `${course.courseNo}: ${course.courseName}` }}
    </div>
    <div class="text--secondary">{{ course.department }}</div>
    <p class="text--secondary">{{ `Instructor: ${course.instructorName}` }}</p>
    <div v-if="user.role == `admin` || user.role == `instructor`">
    </div>
  </router-link>
</template>

<script>
export default {
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
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .landing-course-card-container:hover {
    box-shadow: inset 0 0 10px -2px rgba(0, 0, 0, 0.1);
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
