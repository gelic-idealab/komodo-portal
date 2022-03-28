<template>
<!-- Course detail page  -->
  <div>
    <!-- course basic information  -->
    <v-row class="course-basic-info">
      <v-col class="col-auto">
        <div class="course-avatar-placeholder radius-2 display-1 white--text font-weight-bold">
          {{ course.courseNo.replace(/[0-9]/g, '') }}
        </div>
      </v-col>
      <v-col>
        <v-chip class="mr-1" color="primary" outlined label>{{ course.semester }}</v-chip>
        <v-chip class="mr-1" color="secondary" outlined label>{{ course.department }}</v-chip>
        <p class="display-1">{{ `${course.courseNo}: ${course.courseName}` }}</p>
        <p class="body-1">
          <v-icon>mdi-account-circle</v-icon>
          Instructor: {{ course.instructorName }}
        </p>
      </v-col>
      <v-col class="col-auto" v-if="user.role == `admin` || user.role == `instructor`">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn color="success" depressed v-on="on">
              New Session
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item-group color="success">
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
        <div class="px-4 pb-4 radius-2 shadow-section background-white">
          <v-tabs v-model="currentTab" class="mb-1">
            <v-tab>
              Description
            </v-tab>
            <v-tab>
              Labs
              <v-chip class="ml-2 px-1" outlined label x-small>
                {{ labList.length }}
              </v-chip>
            </v-tab>
            <v-tab>
              Captures
              <v-chip class="ml-2 px-1" outlined label x-small>
                {{ captures.length }}
              </v-chip>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="currentTab" class="full-width">
            <CourseDetailDescription :description="course.description" />
            <CourseDetailLab :course-id="course.courseId" :lab-list="labList" v-show="currentTab == 1"/>
            <CaptureLabList :course-id="course.courseId" :captures="captures" v-show="currentTab == 2"/>
          </v-tabs-items>
        </div>
      </v-col>
      <!-- student list section -->
      <v-col class="student-details">
        <SectionCard title="Roster">
          <v-list dense>
            <v-list-item-group>
              <v-list-item v-for="user in course.userList" :key="user.email">
                <v-list-item-content>
                  <v-list-item-title> {{ user.firstName + ` ` + user.lastName }} </v-list-item-title>
                  <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </SectionCard>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import moment from "moment";
import { getCourseDetail, getLabList } from "../../requests/course";

import SectionCard from "../../components/Cards/SectionCard";

import CourseDetailDescription from "./CourseDetailDescription";
import CourseDetailLab from "./CourseDetailLab";
import CaptureLabList from "../Capture/CaptureLabList";

export default {
  name: "CourseDetail",
  components: {
    SectionCard,
    CourseDetailDescription,
    CourseDetailLab,
    CaptureLabList
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
            const startTime = moment(lab.startTime);
            const endTime = moment(lab.endTime);
            return {
              id: lab.sessionId,
              labName: lab.sessionName,
              date: startTime.format("L"),
              time: `${startTime.format("LT")} - ${endTime.format("LT")}`,
              duration: moment.duration(startTime.diff(endTime)).humanize()
            }
          });
          if(typeof values[2] !== "undefined"){
            this.captures = values[2].data.map(capture => {
              const start = moment(capture.start);
              const end = moment(capture.end);
              return {
                id: capture.sessionId,
                captureId: capture.captureId,
                labName: capture.sessionName,
                date: start.format("L"),
                time: `${start.format("LT")}`,
                duration: moment.duration(start.diff(end)).humanize()
              }
            });
          }
        });
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
