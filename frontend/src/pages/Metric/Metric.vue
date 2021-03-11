<template>
  <v-container fluid>
    <v-row dense align="center" justify="center">
      <v-col 
        v-for="metric in metrics"
        :key="metric.displayName"
      >
        <v-card>
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title
                v-text="metric.value"
              ></v-card-title>
              <v-card-text>
                {{ metric.displayName }}
              </v-card-text>
            </div>
            <v-avatar class="ma-3" tile>
              <v-icon x-large v-html="metric.icon"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col>
        <v-select
        justify-center
        label="Select Course"
        :items="courses"
        item-text="courseName"
        item-value="courseId"
        v-model="courseSelected"
        v-on:change="getCapturesByCourseId"
        dense 
        class="ml-3">
        </v-select>
      </v-col>
      <v-col>
        <v-select 
        v-if="courseSelected"
        :items="captures"
        item-text="captureId"
        item-value="captureId"
        v-model="captureSelected"
        v-on:change="loadData"
        dense class="ml-3"
        >
        </v-select>
        <v-select
        v-else
        disabled
        dense class="ml-3">
        </v-select>
      </v-col>
      <v-spacer>
      </v-spacer>
      <v-btn 
      v-if="dataLoaded" 
      color="primary" 
      v-on:click="exportData">
        Export Data
      </v-btn>
      <v-btn 
      v-else
      disabled
      color="primary" 
      v-on:click="exportData">
        Export Data
      </v-btn>
    </v-row>

    <v-row>
      <v-col v-if="sessionInteractionCountsMax">
        <GlobalBar v-if="sessionInteractionCountsMax > 0"
          :title="`Interactions By Session`"
          :series="[{ name: `Interactions`, data: sessionInteractionCounts }]"
          :xcategories="sessionIds" 
          :xtitle="`Session`" 
          :ytitle="`Count`"
          :ymin="0"
          :ymax="sessionInteractionCountsMax"
        />
      </v-col>

      <v-col v-if="interactionTypeCountsMax">
        <GlobalBar v-if="interactionTypeCountsMax > 0"
          :title="`Interactions By Type`"
          :series="[{ name: `Interactions`, data: interactionTypeCounts }]"
          :xcategories="interactionTypes" 
          :xtitle="`Type`" 
          :ytitle="`Count`"
          :ymin="0"
          :ymax="interactionTypeCountsMax"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <SectionCard title="Capture Data">
          <template v-slot:actions>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </template>
          <v-container>
            <v-data-table
                  :headers="interactionTableHeaders"
                  :items="interactions"
                  :sort-by="['captureStart']"
                  :sort-desc="[true]"
                  no-data-text="No data"
                  dense
                  :search="search"
                >
                <template v-slot:item.captureStart="{ item }">
                  {{ moment(item.captureStart).format("L LT") }}
                </template>
            </v-data-table>
          </v-container>
        </SectionCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GlobalBar from "../../components/Charts/GlobalBar";
import SectionCard from "../../components/Cards/SectionCard";
import { getInteractionData, getAllRaw } from "../../requests/data";
import { getCourseListByInstructor, getCaptures } from "../../requests/course";

export default {
  name: "Metric",
  components: {
    GlobalBar,
    SectionCard
  },
  data() {
    return {
      userId: null,
      courses: [],
      courseSelected: null,
      captures: [],
      captureSelected: null,
      dataLoaded: false,
      search: '',
      interactions: [],
      interactionTableHeaders: [
        { text: "Capture", value: "captureId"},
        { text: "Captured On", value: "captureStart"},
        { text: "Session", value: "sessionId" },
        { text: "User", value: "clientId" },
        { text: "Source", value: "sourceId"},
        { text: "Target", value: "targetId"},
        { text: "Type", value: "type" },
        { text: "Count", value: "count"}
      ],
      captureIds: [],
      sessionIds: [],
      clientIds: [],
      assetIds: [],
      interactionTypes: [],
      sessionInteractionCounts: [],
      sessionInteractionCountsMax: 0,
      interactionTypeCounts: [],
      interactionTypeCountsMax: 0,
      metrics: {
        captures: {
          displayName: 'Captures',
          icon: 'mdi-basket-fill',
          value: 0
        },
        sessions: {
          displayName: 'Sessions',
          icon: 'mdi-calendar-multiple',
          value: 0
        },
        clients: {
          displayName: 'Users',
          icon: 'mdi-account-group',
          value: 0
        },
        assets: {
          displayName: 'Assets',
          icon: 'mdi-cube-outline',
          value: 0
        },
        interactions: {
          displayName: 'Interactions',
          icon: 'mdi-gesture-double-tap',
          value: 0
        }
      }
    }
  },
  created() {
    this.userId = this.$store.getters.user.userId;
    this.getInstructorCourses();
  },
  methods: {
    getInstructorCourses() {
      getCourseListByInstructor(this.userId).then(data => {
        console.log("Instructor courses:", data);
        this.courses = data.data;
      })
    },
    getCapturesByCourseId() {
      getCaptures({ courseId: this.courseSelected }).then(res => {
        console.log(res);
        if (res.status == 200) {
          this.captures = res.data;
        } else {
          console.log(res)
        }
      })
    },
    loadData(e) {
      this.dataLoaded = true;
    },
    exportData() {
      let captureId = this.captureSelected;
      getAllRaw({ captureId }).then(data => {
        console.log(data.data)
      })
    },
    getMetrics() {
      getInteractionData().then(data => {
        if (data.data) {
          this.interactions = data.data;
          this.interactions.forEach(row => {
            if (!this.captureIds.includes(row.captureId)) {
              this.captureIds.push(row.captureId);
            }
            if (!this.sessionIds.includes(row.sessionId)) {
              this.sessionIds.push(row.sessionId);
              this.sessionInteractionCounts.push(0);
            }
            if (!this.clientIds.includes(row.clientId)) {
              this.clientIds.push(row.clientId);
            }
            if (!this.assetIds.includes(row.sourceId)) {
              this.assetIds.push(row.sourceId);
            }
            if (!this.assetIds.includes(row.targetId)) {
              this.assetIds.push(row.targetId);
            }
            if (!this.interactionTypes.includes(row.type)) {
              this.interactionTypes.push(row.type);
              this.interactionTypeCounts.push(0);
            }
            this.metrics.interactions.value += row.count;
          });
          this.metrics.captures.value = this.captureIds.length;
          this.metrics.sessions.value = this.sessionIds.length;
          this.metrics.clients.value = this.clientIds.length;
          this.metrics.assets.value = this.assetIds.length;

          this.calcSessionCounts();
          this.calcTypeCounts();
        }
      });
    },
    calcSessionCounts() {
      this.interactions.forEach(row => {
        for (let i = 0; i < this.sessionIds.length; i++) {
          if (row.sessionId == this.sessionIds[i]) {
            this.sessionInteractionCounts[i] += row.count;
          }
        }
      });
      this.sessionInteractionCountsMax = Math.max(...this.sessionInteractionCounts);
    },
    calcTypeCounts() {
      this.interactions.forEach(row => {
        for (let i = 0; i < this.interactionTypes.length; i++) {
          if (row.type == this.interactionTypes[i]) {
            this.interactionTypeCounts[i] += row.count;
          }
        }
      });
      this.interactionTypeCountsMax = Math.max(...this.interactionTypeCounts);
    }
  }
}
</script>
