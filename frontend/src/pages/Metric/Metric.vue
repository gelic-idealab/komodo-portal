<template>
  <v-container fluid>
    <!-- <v-row dense align="center" justify="center">
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
    </v-row> -->
    
    <v-row>
      <v-col>
        <v-select
        label="Select Course"
        :items="courses"
        item-text="courseName"
        item-value="courseId"
        v-model="courseSelected"
        v-on:change="getLabsByCourseId"
        dense 
        class="ml-3"
        clearable
        >
        </v-select>
      </v-col>
      <v-col>
        <v-select
        v-if="courseSelected"
        label="Select Lab"
        :items="labs"
        item-text="sessionName"
        item-value="sessionId"
        v-model="labSelected"
        v-on:change="getCapturesByLabId"
        dense 
        class="ml-3"
        clearable
        >
        </v-select>
        <v-select
        v-else
        disabled
        dense class="ml-3">
        </v-select>
      </v-col>
      <v-col>
        <v-select 
        v-if="labSelected"
        label="Select Capture"
        :items="captures"
        item-text="captureId"
        item-value="captureId"
        v-model="captureSelected"
        v-on:change="loadData"
        dense class="ml-3"
        clearable
        >
        </v-select>
        <v-select
        v-else
        disabled
        dense class="ml-3">
        </v-select>
      </v-col>

      <v-btn 
      v-if="courseSelected" 
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
          <v-container fluid>
            <v-data-table
                  :headers="interactionTableHeaders"
                  :items="interactions"
                  :sort-by="['captureStart']"
                  :sort-desc="[true]"
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

    <v-row>
      <v-col>
        <v-select
        label="Select Course"
        :items="courses"
        item-text="courseName"
        item-value="courseId"
        v-model="csvCourseSelected"
        v-on:change="getcsvLabsByCourseId"
        dense 
        class="ml-3"
        clearable
        >
        </v-select>
      </v-col>
      <v-col>
        <v-select
        v-if="csvCourseSelected"
        label="Select Lab"
        :items="csvlabs"
        item-text="sessionName"
        item-value="sessionId"
        v-model="csvLabSelected"
        v-on:change="getCsvCapturesByLabId"
        dense 
        class="ml-3"
        clearable
        >
        </v-select>
        <v-select
        v-else
        disabled
        dense class="ml-3">
        </v-select>
      </v-col>
      <v-col>
        <v-select 
        v-if="csvLabSelected"
        label="type"
        :items="type"
        v-model="typeSelected"
        dense class="ml-3"
        clearable
        >
        </v-select>
        <v-select
        v-else
        disabled
        dense class="ml-3">
        </v-select>
      </v-col>
      <v-col>
        <v-select 
        v-if="csvLabSelected"
        label="Select Capture"
        :items="captures"
        item-text="captureId"
        item-value="captureId"
        v-model="csvCaptureSelected"
        dense class="ml-3"
        clearable
        >
        </v-select>
        <v-select
        v-else
        disabled
        dense class="ml-3">
        </v-select>      
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-select
        v-if="typeSelected"
        label="Select interaction type"
        :items="interaction_type"
        item-text="text"
        item-value="value"
        v-model="interactionSelected"
        dense class="ml-3"
        clearable
        >
        </v-select>
        <v-select
        v-else
        disabled
        dense class="ml-3">
        </v-select>
      </v-col>
      <v-col>
        <v-select
        v-if="typeSelected='user energy'"
        label="Select entity type"
        :items="entity_type"
        item-text="text"
        item-value="value"
        v-model="entitySelected"
        dense 
        class="ml-3"
        clearable
        >
        </v-select>
        <v-select
        v-else
        disabled
        dense class="ml-3">
        </v-select>
      </v-col>
      <v-btn 
      color="primary" 
      v-on:click="getCsv">
        Export csv file
      </v-btn>
    </v-row>
    <v-row>
    <v-col>
      <SectionCard title="data request history">
        <v-container fluid>
        <v-data-table
          :headers="csvHeaders"
          :items="csvRecord"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="download(item)"
            >
              mdi-pencil
            </v-icon>
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
import { getInteractionData, getAllRawCourse, getAllRawLab, getAllRawCapture, getAllDataRequest, exportMetricCsv } from "../../requests/data";
import { getCourseListByInstructor, getLabList, getCaptureList } from "../../requests/course";
import { Parser } from "json2csv";

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
      csvCourseSelected: null,
      labs: [],
      csvlabs: [],
      labSelected: null,
      csvLabSelected: null,
      captures: [],
      captureSelected: null,
      csvCaptureSelected: null,
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
      },
      type:["aggregate interaction", "aggregate user", "user energy"],
      typeSelected:null,
      interaction_type:[
        {text:"look",value:0},
        {text:"look end",value:1},
        {text:"render",value:2},
        {text:"render end",value:3},
        {text:"grab",value:4},
        {text:"grab end",value:5},
        {text:"scene change",value:6},
        {text:"unset",value:7},
        {text:"lock",value:8},
        {text:"lock end",value:9}
      ],
      interactionSelected: null,
      entity_type:[
        {text:"head",value:0},
        {text:"left hand",value:1},
        {text:"right hand",value:2},
        {text:"spawned entity",value:3},
        {text:"main player",value:5}
      ],
      entitySelected:null,
      csvHeaders: [
        { text: 'course', value: 'course_name' },
        { text: 'lab', value: 'session_name' },
        { text: 'aggregation type', value: 'aggregation_function' }
      ],
      csvRecord: [],
    }
  },
  created() {
    this.userId = this.$store.getters.user.userId;
    this.getInstructorCourses();
  },
  mounted() {
    getAllDataRequest({"userId":this.userId}).then(res => {
      console.log(res);
    })
  },
  methods: {
    getInstructorCourses() {
      getCourseListByInstructor(this.userId).then(data => {
        this.courses = data.data;
      })
    },
    getLabsByCourseId() {
      this.labSelected = null;
      getLabList({ courseId: this.courseSelected }).then(res => {
        console.log(res);
        if (res.status == 200) {
          this.labs = res.data;
        } else {
          console.log(res);
        }
      })
    },
    getcsvLabsByCourseId() {
      this.csvlabSelected = null;
      getLabList({ courseId: this.csvCourseSelected }).then(res => {
        console.log(res);
        if (res.status == 200) {
          this.csvlabs = res.data;
        } else {
          console.log(res);
        }
      })
    },
    getCapturesByLabId() {
      this.captureSelected = null;
      getCaptureList({ labId: this.labSelected }).then(res => {
        console.log(res);
        if (res.status == 200) {
          this.csvCaptures = res.data;
        } else {
          console.log(res);
        }
      })
    },
    getCsvCapturesByLabId() {
      this.csvCaptureSelected = null;
      getCaptureList({ labId: this.csvLabSelected }).then(res => {
        console.log(res);
        if (res.status == 200) {
          this.captures = res.data;
        } else {
          console.log(res);
        }
      })      
    },
    loadData(e) {
      this.dataLoaded = true;
    },
    exportData() {
      let courseId = this.courseSelected;
      let labId = this.labSelected;
      let captureId = this.captureSelected;

      if (courseId && labId && captureId) {
        getAllRawCapture({ captureId }).then(res => {
          if (res.status == 200) {
            console.log(res.data)
            this.formatAndDownload(res);
          } else {
            console.log(res);
          }
        });
      } else if (courseId && labId) {
        getAllRawLab({ labId }).then(res => {
          if (res.status == 200) {
            console.log(res.data)
            this.formatAndDownload(res);
          } else {
            console.log(res);
          }
        });
      } else if (courseId) {
        getAllRawCourse({ courseId }).then(res => {
          if (res.status == 200) {
            console.log(res.data)
            this.formatAndDownload(res);
          } else {
            console.log(res);
          }
        });
      }
    },
    formatAndDownload(res) {
      let intData = res.data.int;
      let posData = res.data.pos;

      let intFields = [];
      intData[1].forEach(field => {
        intFields.push(field.name)
      });
      const intOpts = { intFields };
      
      let posFields = [];
      posData[1].forEach(field => {
        posFields.push(field.name)
      });
      const posOpts = { posFields };

      try {
        const encoding = "data:text/csv;charset=utf-8,";

        // interactions csv
        if (intData[0].length) {
          const intParser = new Parser(intOpts);
          const intCsv = encoding+intParser.parse(intData[0]);
          let encodedUri = encodeURI(intCsv);
          let link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `${this.captureSelected || this.labSelected || this.courseSelected}_interactions.csv`);
          document.body.appendChild(link); // Required for FF
          link.click();
        }

        // positions csv
        if (posData[0].length) {
          const posParser = new Parser(posOpts);
          const posCsv = encoding+posParser.parse(posData[0]);
          let encodedUri = encodeURI(posCsv);
          let link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `${this.captureSelected || this.labSelected || this.courseSelected}_positions.csv`);
          document.body.appendChild(link); // Required for FF
          link.click();
        }
      } catch (err) {
        console.error(err);
      }
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
    },
    getCsv() {
      let data = {
        "sessionId": this.csvLabSelected,
        "clientId": this.userId,
        "captureId": this.csvCaptureSelected,
        "type": this.typeSelected,
        "interactionType": this.interactionSelected,
        "entityType": this.entitySelected
      }
      console.log(data);
      exportMetricCsv(data);
    }
  }
}
</script>
