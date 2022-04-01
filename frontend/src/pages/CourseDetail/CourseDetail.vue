<template>
<!-- Course detail page  -->
  <div>
    <v-row>
      <p class="mb-1">
        <router-link :to="{ name: 'Landing' }">
          <v-btn color="secondary" depressed small>{{ `Courses > ` }}</v-btn>
        </router-link>
      </p>
    </v-row>
    <!-- course basic information  -->
    <v-row class="course-basic-info">
      <v-col class="col-auto">
        <div class="course-avatar-placeholder radius-2">
          <p class="display-1 white--text font-weight-bold" align="center">{{ course.courseNo.replace(/([a-zA-Z])([0-9])/g, '$1\n$2') }}</p>
        </div>
      </v-col>
      <v-col class="col-auto">
        <h1>
          {{ course.courseName }}
        </h1>
      </v-col>
    </v-row>
    <v-row class="course-basic-info">
      <v-col>
        <v-chip class="mr-1" label>
          <v-icon>mdi-account-circle</v-icon>{{ ` ${course.instructorName}` || " None (Instructor)" }}
        </v-chip>
        <v-chip class="mr-1" label>{{ course.semester || "None (Semester)" }}</v-chip>
        <v-chip class="mr-1" label>{{ course.department || "None (Department)" }}</v-chip>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-auto" v-if="user.role == `admin` || user.role == `instructor`">
        <v-menu offset-y>
          <v-list dense>
            <v-list-item-group color="secondary">
              <!-- Redirect to the lab create page -->
              <router-link :to="{ name: 'Lab Create', params: { courseId: course.courseId } }">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-cast-education</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Lab</v-list-item-title>
                </v-list-item>
              </router-link>
              <v-list-item disabled>
                <v-list-item-icon>
                  <v-icon>mdi-teach</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Capture</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <!-- course details section -->
      <v-col class="course-details">
        <SectionCard title="Labs">
          <CourseDetailLab :course-id="course.courseId" :lab-list="labList" />
        </SectionCard>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
      <!-- student list section -->
        <SectionCard title="Roster">
          <v-list three-line>
            <template v-for="user in course.userList" >
              <v-list-item :key="user.email">
                <v-list-item-content>
                  <v-list-item-title> {{ `${user.firstName.substr(0, 3)}. ${user.lastName.substr(0, 1)}.` }} </v-list-item-title>
                  <v-list-item-subtitle>{{ getAbbreviatedEmail(user.email) }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </SectionCard>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getCourseDetail, getLabList } from "../../requests/course";

import SectionCard from "../../components/Cards/SectionCard";
import CourseDetailLab from "./CourseDetailLab";

export default {
  name: "CourseDetail",
  components: {
    SectionCard,
    CourseDetailLab
  },
  data() {
    return {
      user: this.$store.getters.user,
      course: {
        courseId: 0,
        courseNo: "",
        courseName: "",
        department: "",
        instructorName: "",
        semester: "",
        description: "",
      },
      currentTab: 1,
      labList: [],
      captures: []
    }
  },
  mounted: function() {
    this.course.courseId = this.$route.params.courseId;
    this.getData();
  },
  watch: {
    "$route.path": "getData"
  },
  methods: {
    /**
     * Initialize the data of the page
     */
    getData() {
      // Get course id from the url
      Promise.all([
        // Get course detailed information and lab list
        getCourseDetail({ courseId: this.$route.params.courseId }),
        getLabList({ courseId: this.$route.params.courseId }),
        // getCaptures({ courseId: this.course.courseId })
        // TODO(rob): need to fetch captures by lab id
      ])
        .then(values => {
          this.course = {
            courseId: this.course.courseId,
            ...values[0].data
          };
          this.labList = values[1].data.map(lab => {
            return {
              id: lab.sessionId,
              labName: lab.sessionName,
              date: lab.startTime,
              time: lab.endTime,
              duration: "--"
            }
          });
          if(typeof values[2] !== "undefined"){
            this.captures = values[2].data.map(capture => {
              return {
                id: capture.sessionId,
                captureId: capture.captureId,
                labName: capture.sessionName,
                date: capture.start,
                time: capture.end,
                duration: "--"
              }
            });
          }
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
  .v-menu__content {
    box-shadow: none !important;
    /*box-shadow: 5px 10px 10px var(--v-success) !important;*/
  }

  .course-avatar-placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    background: linear-gradient(0.375turn, var(--v-primary), var(--v-accent), var(--v-tertiary));
  }

  .v-tab--active > .v-chip {
    color: var(--v-primary) !important;
    border-color: var(--v-primary) !important;
  }

  @media screen {

    .course-details {
      flex-grow: 3!important;
    }

    .student-details {
      flex-grow: 1!important;
    }
  }

</style>
