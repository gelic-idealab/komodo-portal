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
        <SectionCard title="Raw Export">
          <v-container fluid>
            <template>
              <v-row>
                <div>select lab to get capture:</div>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                  label="Select Course"
                  :items="courses"
                  item-text="courseName"
                  item-value="courseId"
                  v-model="rawExportCourseSelected"
                  v-on:change="getRawExportLabsByCourseId"
                  dense 
                  class="ml-3"
                  clearable
                  >
                  </v-select>
                </v-col>
                <v-col>
                  <v-select
                  v-if="rawExportCourseSelected"
                  label="Select Lab"
                  :items="rawExportLabs"
                  item-text="sessionName"
                  item-value="sessionId"
                  v-model="rawExportLabSelected"
                  v-on:change="getRawExportCapturesByLabId"
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
                  v-if="rawExportLabSelected"
                  label="Select Capture"
                  :items="rawExportCaptures"
                  item-text="captureId"
                  item-value="captureId"
                  v-model="rawExportCaptureSelected"
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
                v-if="rawExportCaptureSelected" 
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
                <v-text-field
                    class="ma-3"
                    clearable
                    dense
                    outlined
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                ></v-text-field>
              </v-row>
            </template>
          </v-container>
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
      <SectionCard title="data request">
        <v-container fluid>
        <template>
          <v-row>
            <div style="padding-left:12;">select all type of data summary to send request:</div>
          </v-row>
          <v-row>
            <v-col>
              <v-select
              label="Select Course"
              :items="courses"
              item-text="courseName"
              item-value="courseId"
              v-model="dataRequestCourseSelected"
              v-on:change="getDataRequestLabsByCourseId"
              dense 
              class="ml-3"
              clearable
              @change="changeRequest"
              >
              </v-select>
            </v-col>
            <v-col>
              <v-select
              v-if="dataRequestCourseSelected"
              label="Select Lab"
              :items="dataRequestLabs"
              item-text="sessionName"
              item-value="sessionId"
              v-model="dataRequestLabSelected"
              v-on:change="getDataRequestCapturesByLabId"
              dense 
              class="ml-3"
              clearable
              @change="changeRequest"
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
              v-if="dataRequestLabSelected && dataRequestCourseSelected"
              label="Select Capture"
              :items="dataRequestCaptures"
              item-text="captureId"
              item-value="captureId"
              v-model="dataRequestCaptureSelected"
              dense class="ml-3"
              clearable
              @change="changeRequest"
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
              v-if="dataRequestLabSelected && dataRequestCourseSelected"
              label="type"
              :items="type"
              v-model="typeSelected"
              dense class="ml-3"
              clearable
              @change="changeFunctionType"
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
              v-if="dataRequestLabSelected && dataRequestCourseSelected && (typeSelected =='user energy' || typeSelected =='aggregate interaction')"
              label="Select interaction type"
              :items="interaction_type"
              item-text="text"
              item-value="value"
              v-model="interactionSelected"
              dense class="ml-3"
              clearable
              @change="changeRequest"
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
              v-if="dataRequestCourseSelected && dataRequestLabSelected && typeSelected =='user energy'"
              label="Select entity type"
              :items="entity_type"
              item-text="text"
              item-value="value"
              v-model="entitySelected"
              dense 
              class="ml-3"
              clearable
              @change="changeRequest"
              ></v-select>
              <v-select
              v-else
              disabled
              dense class="ml-3">
              </v-select>
            </v-col>
            <v-btn
            color="primary" 
            v-on:click="getCsv"
            :disabled="submitDataRequest">
              Export csv file
            </v-btn>
          </v-row>
        <v-data-table
          :headers="csvHeaders"
          :items="csvRecord"
        >
          <template v-slot:item.action="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="download(item)"
            >
              mdi-cloud-download
            </v-icon>
          </template>
          <template v-slot:top>
            <div class="text-center">
              <v-dialog
                v-model="dialog"
                max-width="500"
              >
                <v-card>
                  <v-card-title class="text-h5">
                    file processing, please come back later
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      text
                      @click="dialog = false"
                    >
                      close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </template>
        </v-data-table>
        </template>
        </v-container>
      </SectionCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GlobalBar from "../../components/Charts/GlobalBar";
import SectionCard from "../../components/Cards/SectionCard";
import { getInteractionData, getAllDataRequest, exportMetricCsv, getDownloadLink, downloadCaptureJSONFile } from "../../requests/data";
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
      rawExportCourseSelected: null,
      dataRequestCourseSelected: null,
      rawExportLabs: [],
      dataRequestLabs: [],
      rawExportLabSelected: null,
      dataRequestLabSelected: null,
      rawExportCaptures: [],
      dataRequestCaptures: [],
      rawExportCaptureSelected: null,
      dataRequestCaptureSelected: null,
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
        { text: 'course', value: 'courseName' },
        { text: 'lab', value: 'sessionName' },
        { text: 'aggregation type', value: 'aggregationFunction' },
        { text: 'interaction_type', value: 'interaction_type'},
        { text: 'entity_type', value: 'entity_type'},
        { text: "Actions", value: "action", sortable: false }
      ],
      csvRecord: [],
      dialog: false,
      submitDataRequest: true,
      interactionDisable: true,
      entityDisable: true
    }
  },
  mounted() {
    this.userId = this.$store.getters.user.userId;
    this.getInstructorCourses();
    this.getAllRequest();
  },
  methods: {
    getAllRequest() {
      getAllDataRequest({"userId":this.userId}).then(data => {
        for(let i=0;i<data.data.length;i++){
          if(data.data[i].message.interactionType !== null){
            data.data[i].interaction_type = this.interaction_type.find(o => o.value === data.data[i].message.interactionType).text;
          }
          if(data.data[i].message.entityType !== null){
            data.data[i].entity_type = this.entity_type.find(o => o.value === data.data[i].message.entityType).text;
          }
        }
        this.csvRecord = data.data;
      })
    },
    getInstructorCourses() {
      getCourseListByInstructor(this.userId).then(data => {
        this.courses = data.data;
      })
    },
    getRawExportLabsByCourseId() {
      this.rawExportLabSelected = null;

      if (!this.rawExportCourseSelected) {
        this.rawExportLabSelected = null;
        
        this.rawExportCaptureSelected = null;

        this.rawExportLabs = [];

        return;
      }

      getLabList({ courseId: this.rawExportCourseSelected }).then(res => {
        console.log(res);
        if (res.status == 200) {
          this.rawExportLabs = res.data;
        } else {
          console.log(res);
        }
      })
    },
    getDataRequestLabsByCourseId() {
      this.dataRequestLabSelected = null;
      this.dataRequestCaptureSelected = null;
      this.submitDataRequest = true;
      this.typeSelected = null;
      this.entitySelected = null;
      this.interactionSelected = null;
      if(this.dataRequestCourseSelected!==null && this.dataRequestCourseSelected!==undefined){
        getLabList({ courseId: this.dataRequestCourseSelected }).then(res => {
          console.log(res);
          if (res.status == 200) {
            this.dataRequestLabs = res.data;
          } else {
            console.log(res);
          }
        })
      }
    },
    getRawExportCapturesByLabId() {
      if (!this.rawExportLabSelected) {
        this.rawExportCaptureSelected = null;

        this.rawExportCaptures = [];

        return;
      }
      getCaptureList({ labId: this.rawExportLabSelected }).then(res => {
        if (res.status == 200) {
          this.rawExportCaptures = res.data;
        } else {
          console.log(res);
        }
      })
    },
    getDataRequestCapturesByLabId() {
      this.dataRequestCaptureSelected = null;
      this.submitDataRequest = true;
      getCaptureList({ labId: this.dataRequestLabSelected }).then(res => {
        if (res.status == 200) {
          this.dataRequestCaptures = res.data;
        } else {
          console.log(res);
        }
      })      
    },
    loadData(e) {
      this.dataLoaded = true;
    },
    exportData() {
      let courseId = this.rawExportCourseSelected;

      if (!courseId) {
        return;
      } 
      
      let labId = this.rawExportLabSelected;

      if (!labId) {
        return;
      }
      
      let captureId = this.rawExportCaptureSelected;
        
      if (!captureId) {
        return;
      }
      
      downloadCaptureJSONFile({ captureId });
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
          link.setAttribute("download", `${this.rawExportCaptureSelected || this.rawExportLabSelected || this.rawExportCourseSelected}_interactions.csv`);
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
          link.setAttribute("download", `${this.rawExportCaptureSelected || this.rawExportLabSelected || this.rawExportCourseSelected}_positions.csv`);
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
        "sessionId": this.dataRequestLabSelected,
        "clientId": this.userId,
        "captureId": this.dataRequestCaptureSelected,
        "type": this.typeSelected,
        "interactionType": this.interactionSelected,
        "entityType": this.entitySelected
      }
      exportMetricCsv(data).then(res => {
        if (res.status == 200) {
          location.reload();
        } else {
          console.log(res);
        }
      });
    },
    download(item){
      getDownloadLink(item).then(result =>{
        if(result.data.status == "success"){
          window.open(result.data.url);
        }else{
          this.dialog = true;
        }
      })
    },
    changeFunctionType(){
      this.interactionSelected=null;
      this.entitySelected=null;
      if(this.typeSelected == "aggregate user"){
        this.submitDataRequest = false;
      }
      else{
        this.submitDataRequest = true;
      }
    },
    changeRequest(){
      if((this.dataRequestLabSelected!==null && this.dataRequestLabSelected!==undefined) && (this.dataRequestCaptureSelected!==null && this.dataRequestCaptureSelected!==undefined) && (this.interactionSelected!==null && this.interactionSelected!==undefined) && (this.entitySelected!==null && this.entitySelected!==undefined) && this.typeSelected =='user energy'){
        this.submitDataRequest = false;
      }
      else if((this.dataRequestLabSelected!==null && this.dataRequestLabSelected!==undefined) && this.typeSelected =='aggregate interaction' && this.interactionSelected!==null && (this.dataRequestCaptureSelected!==null && this.dataRequestCaptureSelected!==undefined)){
        this.submitDataRequest = false;
      }
      else if((this.dataRequestLabSelected!==null && this.dataRequestLabSelected!==undefined) && this.typeSelected =='aggregate user' && (this.dataRequestCaptureSelected!==null || this.dataRequestCaptureSelected!==undefined)){
        this.submitDataRequest = false;
      }
      else{
        this.submitDataRequest = true;
      }
    }
  }
}
</script>
