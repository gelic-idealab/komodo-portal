<template>
  <div>
    <v-row>
      <v-col>
        <p class="display-1">
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
            <router-link :to="{ name: 'Asset Create' }">
              <v-btn text small color="primary">
                <v-icon small left>mdi-plus</v-icon>
                Upload
              </v-btn>
            </router-link>
          </template>
          <router-link :to="{ name: 'UserProfilePage' }">
            <v-btn text small color="primary">
              Your Assets
            </v-btn>
          </router-link>
          <router-link :to="{name: 'Assets' }">
            <v-btn class="mr-1" text small color="primary">
              All Assets
            </v-btn>
          </router-link>
        </SectionCard>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SectionCard from "../../components/Cards/SectionCard";
import LandingCourseCard from "./LandingCourseCard";
import { getAssetList } from "../../requests/asset"

export default {
  name: "LandingPage",
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
    }
  },
  methods: {
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
