<template>
  <v-navigation-drawer
    class="side-bar"
    width="230"
    permanent
    expand-on-hover
    fixed
    dark
  >
    <v-list>
      <v-list-item @click="goToProfilePage">
        <v-list-item-content :tabindex="8" @focus.native="focusProfileLink"  style="cursor: pointer; margin-bottom: 10px;">
          <v-list-item-title class="title" >
            {{ `${user.firstName} ${user.lastName.substr(0,1)}.` }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ getAbbreviatedEmail(user.email) }}</v-list-item-subtitle>
          <v-list-item-subtitle>Go to Account</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <SideBarMenuItem title="Log Out" icon-name="mdi-logout-variant" to="/logout"/>
    </v-list>

    <v-divider></v-divider>

    <v-list nav dense>
      <SideBarMenuItem title="Dashboard" icon-name="mdi-view-dashboard" to="/dashboard" />
      <SideBarMenuItem
        title="Courses"
        icon-name="mdi-school"
        :append-icon-name="showCourses ? 'mdi-menu-down' : 'mdi-menu-left'"
        @click.native="switchShowCourses"
      />
      <!-- TODO -- wrap the following so that menu items only show if showCourses is true -->
      <SideBarMenuItem
        v-show="showSideBarCourseList"
        v-for="course in courseList"
        :key="course.courseId"
        :title="course.courseNo"
        icon-name="mdi-circle-small"
        :to="`/courses/${course.courseId}`"
      />
      <SideBarMenuItem title="Assets" icon-name="mdi-cube-outline" to="/assets" />
      <SideBarMenuItem v-if="user.role == `instructor` || user.role == `admin`" title="Metrics" icon-name="mdi-poll" to="/metrics" />
      <SideBarMenuItem title="Admin" icon-name="fa-edit" v-if="user.role == `admin`" to="/admin"/>
    </v-list>

    <v-list class="side-bar-bottom-wrapper" nav dense>
      <v-list-item>
        1.2.2 <!-- TODO -- update this manually with every version -->
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import SideBarMenuItem from "./SideBarMenuItem";

export default {
  name: "SideBar",
  components: {
    SideBarMenuItem,
  },
  data() {
    return {
      user: this.$store.getters.user,
      logoPath: require("../../assets/img/komodo-logo-white.svg"),
      courseList: this.$store.getters.courses.sort((a, b) => (a.courseNo > b.courseNo) ? 1 : -1),
      showCourses: false,
      showSideBarCourseList: false
    }
  },
  methods: {
    switchShowCourses() {
      this.showCourses = !this.showCourses;
      this.showSideBarCourseList = !this.showSideBarCourseList;
    },
    goToProfilePage() {
      this.$router.push({
        name: "UserProfilePage"
      });
    },
    getAbbreviatedEmail(email) {
      let splitEmail = email.split('@');

      if (splitEmail.length != 2) {
        return "Invalid email format.";
      }

      let beforeAt = splitEmail[0];

      let afterAt = splitEmail[1].split('.');

      if (afterAt.length != 2) {
        return "Invalid email format.";
      }

      let betweenAtAndDot = afterAt[0];

      let afterDot = afterAt[1];

      return `${beforeAt.substr(0,1)}...@${betweenAtAndDot.substr(0,1)}....${afterDot}`
    }
  }
}
</script>

<style>
  .side-bar {
    background: linear-gradient(0.6turn, var(--v-primary) 5%, var(--v-accent) 75%, var(--v-tertiary) 115%);
  }

  .side-bar > .v-navigation-drawer__content {
    box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.1);
  }

  .side-bar-bottom-wrapper {
    position: absolute !important;
    bottom: 0;
    width: 100%;
  }

  .v-list-item.active:before {
    opacity: .24;
  }

  .v-list-item.active > .v-list-item__title {
    font-weight: 800 !important;
  }
</style>
