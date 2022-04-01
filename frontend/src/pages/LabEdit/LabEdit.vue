<template>
<!-- Lab edit page -->
  <ContainerCard>
    <v-form class="full-width" v-model="isValid" ref="form" lazy-validation>
      <p class="headline">Edit Lab Details</p>
      <v-text-field
        v-model="course"
        label="Course"
        required
        disabled
      />
      <v-text-field
        v-model="title"
        label="Title"
        :rules="titleRules"
        :counter="100"
        autofocus
        required
      />
      <v-textarea
        v-model="description"
        label="Description"
        hint="We recommend adding some description to your lab session, but you can leave it blank :)"
        rows="3"
        :rules="descriptionRules"
        :counter="255"
        auto-grow
      />
      <v-row>
        <v-col cols="4">
          <v-menu
            ref="date"
            v-model="showDatePicker"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="date"
                label="Date"
                :rules="dateRules"
                prepend-icon="event"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="date"
              @input="$refs.date.save(date)"
              :min="moment().format('YYYY-MM-DD')"
              no-title
              scrollable
            >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="4">
          <v-menu
            ref="startTime"
            v-model="showStartTimePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="startTime"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="startTime"
                label="Start Time"
                :rules="startTimeRules"
                prepend-icon="access_time"
                readonly
                v-on="on"
              />
            </template>
            <v-time-picker
              v-if="showStartTimePicker"
              v-model="startTime"
              format="24hr"
              full-width
              @click:minute="$refs.startTime.save(startTime)"
            />
          </v-menu>
        </v-col>
        <v-col cols="4">
          <v-menu
            ref="endTime"
            v-model="showEndTimePicker"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="endTime"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="endTime"
                label="End Time"
                :rules="endTimeRules"
                prepend-icon="access_time"
                readonly
                v-on="on"
              />
            </template>
            <v-time-picker
              v-if="showEndTimePicker"
              v-model="endTime"
              format="24hr"
              full-width
              @click:minute="$refs.endTime.save(endTime)"
            />
          </v-menu>
        </v-col>
      </v-row>
      <!-- Asset list section -->
      <LabEditAsset :assetList="assetList" :selectedAssetList="selectedAssetList" @onSelectChange="onAssetSelectChange" @uploadNewAsset="uploadNewAsset" />
      <v-row>
        <v-col>
          <v-expansion-panels
            :accordion="true"
            :flat="true"
          >
          <v-expansion-panel>
            <v-expansion-panel-header>Advanced Settings</v-expansion-panel-header>
              <v-expansion-panel-content>
                <SectionCard title="Settings">
                  <template v-slot:actions>
                      <v-icon small>mdi-hammer-wrench</v-icon>
                  </template>
                  <v-row>
                    <v-col>
                      <v-select
                      v-model="buildScope"
                      :items="buildScopes"
                      dense
                      @change="getBuilds"
                      ></v-select>
                      <v-select
                        v-model="build"
                        :value="build"
                        :items="builds"
                        hint="Set the Komodo version for this lab"
                        persistent-hint
                        dense
                      ></v-select>
                    </v-col>
                  </v-row>
                </SectionCard>
              </v-expansion-panel-content>
          </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-btn class="mr-3" color="accent" @click="goBack">
          Cancel
          <v-icon right>mdi-close-circle-outline</v-icon>
        </v-btn>
        <v-btn v-if="status === 'processing'" disabled>
          Scheduling
          <v-progress-circular class="ml-2" indeterminate size="14" width="2" />
        </v-btn>
        <v-btn v-else-if="status === 'success'" color="success">
          Scheduled
          <v-icon right>mdi-checkbox-marked-circle-outline</v-icon>
        </v-btn>
        <v-btn v-else @click="editLabClick" color="primary">
          Schedule
          <v-icon right>mdi-checkbox-marked-circle-outline</v-icon>
        </v-btn>
      </v-row>
    </v-form>
  </ContainerCard>
</template>

<script>
import moment from "moment";
import axios from "axios";

import { getCourseDetail, getLabDetail, editLab } from "../../requests/course";
import { getAssetList } from "../../requests/asset";

import ContainerCard from "../../components/Cards/ContainerCard";
import LabEditAsset from "./LabEditAsset";

export default {
  name: "EditCreate",
  components: {
    ContainerCard,
    LabEditAsset
  },
  data() {
    return {
      labId: this.$route.params.labId,
      courseId: 0,
      course: "",
      title: "",
      titleRules: [
        v => !!v || "Title is required",
        v => v.length <= 100 || 'Title must be less than 100 characters',
      ],
      description: "",
      descriptionRules: [
        v => v.length <= 255 || "Description must be less than 255 characters",
      ],
      date: null,
      dateRules: [
        v => !!v || "Date is required",
      ],
      startTime: null,
      startTimeRules: [
        v => !!v || "Start time is required",
      ],
      endTime: null,
      endTimeRules: [
        v => !!v || "End time is required",
      ],
      assetList: [],
      selectedAssetList: [],
      showDatePicker: false,
      showStartTimePicker: false,
      showEndTimePicker: false,
      status: "pending",
      isValid: true,
      build: "stable",
      builds: [""],
      buildScope: "base",
      buildScopes: [],
    }
  },
  mounted: function() {
    let labId = this.labId;
    // Get lab details 
    Promise.all([
      getLabDetail( { labId } )
    ])
    .then(values => {
      const lab = values[0].data;
      this.title = lab.sessionName;
      this.description = lab.description || "(No description added)";
      const startTime = moment.utc(lab.startTime);
      const endTime = moment.utc(lab.endTime);
      this.date = moment.utc(lab.startTime).format("YYYY-MM-DD");
      this.startTime = startTime.format("HH:MM");
      this.endTime = endTime.format("HH:MM");
      this.assetList = lab.assetList;
      this.selectedAssetList = lab.assetList;
      if (lab.build) { // set build as configured or else leave as base/stable
        this.buildScope = lab.build.split('/')[0];
        this.build = lab.build.split('/')[1];
      }
    });
    // get build scopes from buildserver
    axios.get(`${process.env.VUE_APP_VR_CLIENT_BASE_URL}`).then( res => {
      res.data.forEach(scope => {
        this.buildScopes.push(scope.name)
      });
      this.getBuilds();
    });

    this.courseId = this.$route.params.courseId;
    // Get course details
    getCourseDetail({ courseId: this.courseId })
      .then(res => {
        const course = res.data;
        this.course = `${course.courseNo} - ${course.courseName}`;
        return getAssetList();
      })
      .then(res => {
        const assetList = res.data;
        this.assetList = assetList.map(asset => {
          return {
            ...asset,
            updatedOn: (asset.updateAt || asset.createAt),
          }
        });
      })
      .then(() => {
        if (localStorage.getItem('newLab')) {
          try {
            const cached = JSON.parse(localStorage.getItem('newLab'));
            this.title = cached.title;
            this.description = cached.description;
            this.date = cached.date;
            this.startTime = cached.startTime;
            this.endTime = cached.endTime;
          } catch(e) {
            localStorage.removeItem('newLab');
          }
        }
      })
  },
  methods: {
    getBuilds() {
      this.builds = [];
      // get scopes and builds from buildserver
      axios.get(`${process.env.VUE_APP_VR_CLIENT_BASE_URL}/${this.buildScope}/`).then( res => {
        res.data.forEach(build => {
          this.builds.push(build.name)
        })
      })
    },
    goBack() {
      this.$router.go(-1);
    },
    // Update selected asset list
    onAssetSelectChange(assetList) {
      this.selectedAssetList = assetList;
    },
    uploadNewAsset() {
      const cached = {
        title: this.title,
        description: this.description,
        date: this.date,
        startTime: this.startTime,
        endTime: this.endTime,
        build: this.buildScope + '/' + this.build
      };
      // Cached the asset information and redirect to the asset create page
      localStorage.setItem('newLab', JSON.stringify(cached));
      this.$router.push({ name: "Asset Create" });
    },
    // Validate the input of the form
    validate() {
      return this.$refs.form.validate();
    },
    editLabClick() {
      if (!this.validate()) {
        return;
      }
      // Update the edit info only if the input is valid
      this.status = "processing";
      editLab({
        title: this.title,
        description: this.description,
        startTime: moment.utc(this.date + " " + this.startTime).local(),
        endTime: moment.utc(this.date + " " + this.endTime).local(),
        assetList: this.selectedAssetList.map(asset => asset.assetId),
        build: this.buildScope + '/' + this.build,
        labId: this.labId
      })
      .then(() => {
        this.status = "success";
        localStorage.removeItem('newLab');
        setTimeout(() => {
          // Redirect to the lab detail page
          this.$router.push({
            name: "Lab Detail",
            params: { courseId: this.courseId, labId: this.labId }
          })
        }, 1000);
      })
    }
  }
}
</script>

<style>
</style>
