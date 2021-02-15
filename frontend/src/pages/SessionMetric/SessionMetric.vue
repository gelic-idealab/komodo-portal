<template>
  <v-container class="px-10 py-6">
    <v-row>
      <v-col>
        <p class="display-1">Lab Metric</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <BarChart />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import BarChart from "../../components/Charts/BarChart";

export default {
  name: "Session Metric",
  components: {
    BarChart,
  },
  data() {
    return {}
  }
}
</script>
