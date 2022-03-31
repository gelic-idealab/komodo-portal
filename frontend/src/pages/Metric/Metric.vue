<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <SectionCard title="Metrics">
          The Capture Data and Data Requests components are not available in this version. The data analytics features are in hiatus until further notice. Please contact the Komodo team directly if they have already agreed to manually retrieve your existing and future immersive capture files. You may visit <a href="https://github.com/gelic-idealab/komodo-portal/releases">GitHub</a> to check the Release notes for the status of these features. We apologize for the inconvenience.
        </SectionCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SectionCard from "../../components/Cards/SectionCard";

export default {
  name: "MetricsPage",
  components: {
    SectionCard
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
