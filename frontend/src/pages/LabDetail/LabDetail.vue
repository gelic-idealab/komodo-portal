<template>
  <div>
    <v-row v-if="!clientPath" class="lab-basic-info mb-4 flex-column no-gutters">
      <p class="display-1 text-capitalize">{{ labName }}</p>
      <p v-if="captureId"> CAPTURE ID: {{ captureId }}</p>
      <p class="mb-0">
        
          <v-btn color="secondary" depressed small @click="goToCourse">{{ `${courseNo}: ${courseName}` }}</v-btn>
      </p>
    </v-row>
    <!-- Start the lab view -->
    <!-- Embedded VR Client and Cha t -->
    <v-row v-if="clientPath">
      <v-col>
        <v-card height="95vh" class="vr-container">
          <vr-client :src="clientPath"></vr-client>
        </v-card>
        <br>
        <p>
          Press the blue [VR] button to enter VR.
        </p>
        <p>
          In this version, Voice and Text chat are unavailable.
        </p>
      </v-col>
    </v-row>
    <!-- Initial view -->
    <v-row v-if="!clientPath">
      <v-col>
        <!-- Lab details section -->
        <SectionCard title="Lab Details">
          <template v-slot:actions>
            <v-menu
              bottom
              left
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="grey"
                  dark
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item-group>
                  <!-- Redirect to the lab edit page -->
                  <router-link :to="{ name: 'Lab Edit', params: { courseId, labId } }">
                  <v-list-item v-if="user.role == `admin` || user.role == `instructor`">
                      <v-icon left x-small >mdi-calendar</v-icon>Edit
                  </v-list-item>
                  </router-link>
                  <v-list-item v-if="user.role == `admin` || user.role == `instructor`" @click="deleteLabClick">
                    <v-icon left x-small >mdi-delete</v-icon>Delete
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </template>
          <v-btn color="primary" @click.stop="startSession">
            <v-icon left x-small>mdi-play</v-icon> Start
          </v-btn>
          <v-row>
            <v-col>
              {{ description }}
            </v-col>
          </v-row>
          <v-row>
            <v-col :col=2>
              {{ schedule.duration }} long
            </v-col>
            <v-col :col=2>
            {{ schedule.timeLeft }} 
            </v-col>
            <v-col :col=2>
              {{ schedule.startTime }} (Start) 
            </v-col>
            <v-col :col=2>
              {{ schedule.endTime }} (End)
            </v-col>
          </v-row>
        </SectionCard>
        </v-col>
      </v-row>
      <v-row v-if="!clientPath">
        <v-col v-if="user.role == `admin`">
          <!-- Settings section -->
          <SectionCard title="Settings (Admin Only)">
            <v-row>
              <v-col>
                Temporarily change the app and build version, for your view only. To change the build for everyone, edit the settings.
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-select
                  v-model="buildScope"
                  :items="buildScopes"
                  dense
                  persistent-hint
                  hint="App"
                  @change="getBuilds"
                ></v-select>
                <v-select
                  v-model="build"
                  :value="build"
                  :items="builds"
                  hint="Build / Version"
                  persistent-hint
                  dense
                ></v-select>
              </v-col>
            </v-row>
          </SectionCard>
        </v-col>
      </v-row>
    <v-row v-if="!clientPath">
      <v-col>
        <!-- Asset section -->
        <SectionCard title="Assets">
          <template v-slot:actions v-if="user.role == `admin` || user.role == `instructor`">
            <router-link :to="{ name: 'Lab Edit', params: { courseId, labId } }">
              <v-btn text small color="grey">
                <v-icon left x-small>mdi-pencil</v-icon>Edit
              </v-btn>
            </router-link>
          </template>
          <v-data-table
            :headers="assetTableHeaders"
            :items="assetList"
            @click:row="onAssetClick"
            item-key="assetId"
            no-data-text="No assets added. Please edit the lab."
          />
        </SectionCard>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { getCourseDetail, getLabDetail, deleteLab } from "../../requests/course";
import SectionCard from "../../components/Cards/SectionCard";
import VrClient from "../../components/VR/VrClient";

export default {
  name: "LabDetail",
  components: {
    SectionCard,
    VrClient
  },
  data() {
    return {
      user: this.$store.getters.user,
      userId: 0, // TODO(rob): redundant
      sessionId: 0,
      teacher: 0,
      firstName: "",
      lastName: "",
      labName: "",
      labId: "",
      captureId:"",
      courseId: "",
      courseNo: "",
      courseName: "",
      description: "",
      schedule: {
        startTime: "",
        endTime: "",
        duration: "",
        timeLeft: ""
      },
      assetList: [],
      assetTableHeaders: [
        { text: "Name", value: "assetName" },
        { text: "Description", value: "description", sortable: false }
      ],
      clientPath: null,
      build: "stable",
      builds: [""],
      buildScope: "base",
      buildScopes: [],
      inCall: false,
      openChat: false, 
      tabs: []
    }
  },
  mounted: function() {

    const { courseId, labId, captureId } = this.$route.params;
    this.courseId = courseId;
    this.labId = labId;
    this.captureId = captureId;
    const { userId, role, firstName, lastName } = this.$store.getters.user;
    this.teacher = role === "student" ? 0 : 1;
    this.userId = userId;
    this.sessionId = Number(this.$route.params.labId);
    this.firstName = firstName;
    this.lastName = lastName;
    // Initialize the course details and lab details
    Promise.all([
      getCourseDetail({ courseId }),
      getLabDetail({ labId })
    ])
    .then(values => {
      const course = values[0].data;
      const lab = values[1].data;
      this.courseNo = course.courseNo;
      this.courseName = course.courseName;
      this.labName = lab.sessionName;
      this.description = lab.description || "(No description added)";
      const startTime = moment.utc(lab.startTime).local();
      const endTime = moment.utc(lab.endTime).local();
      this.schedule.startTime = startTime.format("L LT");
      this.schedule.endTime = endTime.format("L LT");
      this.schedule.duration = moment.duration(startTime.diff(endTime)).humanize();
      this.schedule.timeLeft = startTime.fromNow();
      this.assetList = lab.assetList;
      if (lab.build) { // set build as configured or else leave as base/stable
        this.buildScope = lab.build.split('/')[0];
        this.build = lab.build.split('/')[1];

        // get build scopes from buildserver
        axios.get(`${process.env.VUE_APP_VR_CLIENT_BASE_URL}`).then( res => {
          res.data.forEach(scope => {
            this.buildScopes.push(scope.name)
          });
          this.getBuilds();
        });
      }
    });
  },
  // Navigation handler
  beforeRouteLeave(to, from, next){
    if (this.captureId) {
      if (!window.confirm("Are you sure you want to leave?")) {
        return;
      }
      if (this.$refs.textchat) { this.$refs.textchat.cleanup(); }
    }
    next();
  },
  methods: {
    getBuilds() {
      this.builds = [];
      // get scopes and builds from buildserver
      axios.get(`${process.env.VUE_APP_VR_CLIENT_BASE_URL}/${this.buildScope}/`).then( res => {
        res.data.forEach(build => {
          this.builds.push(build.name)
        });
      });
    },
    // Go to the selected course details page
    goToCourse() {
      this.$router.push({
        name: "Course Detail",
        params: { courseId: this.$route.params.courseId }
      });
    },
    // Start the session
    startSession() {
      // TODO(rob): construct client path on mounted, and trigger update if build is changed
      // TODO(rob): set global flag when session started
      if(this.captureId) {
        this.sessionId = 9999+this.sessionId;
        this.clientPath = `${process.env.VUE_APP_VR_CLIENT_BASE_URL}/${this.buildScope}/${this.build}/?client=${this.userId}&session=${this.sessionId}&teacher=${this.teacher}&playback=${this.captureId}`;
      } else {
        this.clientPath = `${process.env.VUE_APP_VR_CLIENT_BASE_URL}/${this.buildScope}/${this.build}/?client=${this.userId}&session=${this.sessionId}&teacher=${this.teacher}`;
      }
      console.log('Starting session with client:', this.clientPath);
    },
    // Redirect to the asset detail page
    onAssetClick({ assetId }) {
      this.$router.push({
        name: "Asset Detail",
        params: { assetId }
      });
    },
    // Delete the lab 
    deleteLabClick() {
      let res = confirm('Are you sure you want to delete this lab?');
      if (res) {
        deleteLab({labId: this.labId})
        .then(() => {
          this.status = "success";
          setTimeout(() => {
          // Redirec to the course details page
          this.$router.push({
            name: "Course Detail",
            params: { courseId: this.courseId }
          })
        }, 1000);
        })
      }
    }
  }
}
</script>
<style>
  .lab-detail {
    overflow-y: scroll;
    max-height: 764px;
  }

  span.body-1.pointer {
    padding-left: 2px;
  }

  .v-tab{
    font-size: 12px!important;
  }

  .v-btn:not(.v-btn--round).v-size--small {
    height: 20px!important;
    padding: 10px!important;
  }

  .v-application--is-ltr .v-data-footer__select .v-select {
    margin: 13px 0 13px 13px!important;
  }

  .v-data-footer {
    padding: 0 5px!important;
    margin-left: -14px;
    margin-right: -14px;
  }

  .v-application--is-ltr .v-data-footer__pagination {
    margin: 0 15px 0 15px!important;
  }

  @media screen and (max-width: 800px) and (max-height: 450px){
    .col.col-4.setting-label{
      max-width: 100%!important;
    }

    .col.col-2 {
      flex: 1;
      max-width: 100%;
    }

    .col.col-3 {
      max-width: 38%;
    }

    .col.col-9 {
      flex: 1;
      max-width: 100%;
    }

    .v-application--is-ltr .v-data-footer__pagination {
    margin: 0 15px 0 15px;
    }

    .details-content {
      padding-left: 0!important;
      padding-right: 0!important;
    }
    .vr-container {
      height:350px!important;
    }
  }
</style>

