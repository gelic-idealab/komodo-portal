<template>
  <div class="">
    <v-row>
      <v-col>
        <p class="display-1 my-2">
          Welcome, {{ $store.getters.user.firstName }}
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- Course section -->
        <SectionCard title="Courses">
          <v-row dense>
            <v-col v-for="course in courseList" :key="course.courseId" :cols="4">
              <!-- Initialize the course card-->
              <LandingCourseCard :course="course" />
            </v-col>
          </v-row>
        </SectionCard>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- Assets section -->
        <SectionCard title="Assets">
          <template v-slot:actions>
            <router-link :to="{name: 'Assets' }">
              <v-btn class="mr-1" text small color="info">
                <v-icon small left color="info">mdi-earth</v-icon>
                Browse
              </v-btn>
            </router-link>
            <router-link :to="{ name: 'Asset Create' }">
              <v-btn text small color="success">
                <v-icon small left>mdi-plus</v-icon>
                Upload
              </v-btn>
            </router-link>
          </template>
          <v-container>
            <v-data-table
              :headers="assetTableHeaders"
              :items="assetList"
              :sort-by="['updateAt']"
              :sort-desc="[true]"
              @click:row="onAssetClick"
              item-key="assetId"
              no-data-text="No asset added"
            >
            <template v-slot:item.updateAt="{ item }">
              <span>{{moment(item.updateAt).format("L LT")}}</span>
            </template>
            </v-data-table>
          </v-container>
        </SectionCard>
      </v-col>
      <!-- Metrics section -->
      <v-col v-if="user.role == `instructor` || user.role == `admin`">
        <SectionCard title="Metrics">
          <v-container :fluid="true">
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
                    <v-avatar
                      class="ma-3"
                      tile
                    >
                      <v-icon x-large v-html="metric.icon"></v-icon>
                    </v-avatar>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </SectionCard>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SectionCard from "../../components/Cards/SectionCard";
import LandingCourseCard from "./LandingCourseCard";
import { getInteractionData } from "../../requests/data"
import { getAssetList } from "../../requests/asset"

export default {
  name: "Landing",
  components: {
    SectionCard,
    LandingCourseCard,
  },
  mounted() {
    this.courseList = this.$store.getters.courses;
    // Initialize the asset list 
    getAssetList().then(data => {
      this.assetList = data.data;
    })
    // Initialize the metrics data
    if (this.user.role == 'instructor' || this.user.role == 'admin') {
      this.getMetrics();
    }
  },
  data() {
    return {
      user: this.$store.getters.user,
      courseList: [],
      assetList: [],
      assetTableHeaders: [
        { text: "Name", value: "assetName" },
        { text: "Description", value: "description", sortable: false },
        { text: "Updated", value: "updateAt"}
      ],
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
  methods: {
    getMetrics() {
      // Get metrics data
      getInteractionData().then( data => {
        let interactions = data.data;
        let captureIds = [];
        let sessionIds = [];
        let clientIds = [];
        let assetIds = [];
        interactions.forEach(row => {
          if (!captureIds.includes(row.captureId)) {
            captureIds.push(row.captureId);
          }
          if (!sessionIds.includes(row.sessionId)) {
            sessionIds.push(row.sessionId);
          }
          if (!clientIds.includes(row.clientId)) {
            clientIds.push(row.clientId);
          }
          if (!assetIds.includes(row.sourceId)) {
            assetIds.push(row.sourceId);
          }
          if (!assetIds.includes(row.targetId)) {
            assetIds.push(row.targetId);
          }
          this.metrics.interactions.value += row.count;
        });
        this.metrics.captures.value = captureIds.length;
        this.metrics.sessions.value = sessionIds.length;
        this.metrics.clients.value = clientIds.length;
        this.metrics.assets.value = assetIds.length;
      })
    },
    // Redirect to the selected asset 
    onAssetClick({ assetId }) {
      this.$router.push({
        name: "Asset Detail",
        params: { assetId }
      });
    }
  }
}
</script>
<style>
  @media screen and (max-width: 800) {
    header.section-card__header{
      flex-wrap: wrap;
    }

    span.section-card__title {
      margin-top: 3vh;
    }

    label.v-label.v-label--active.theme--light {
      top: 2px;
    }

    .v-data-table__mobile-row__header {
    font-size: small;
    font-weight: 600;
    }
  }
</style>
