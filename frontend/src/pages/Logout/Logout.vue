<template>
<!-- Logout section -->
  <ContainerCard>
    <v-row>
      <v-col :cols="12" class="text-center headline">
        {{ message }}
      </v-col>
      <v-col>
        <v-progress-linear
          color="primary"
          indeterminate
          rounded
        ></v-progress-linear>
      </v-col>
    </v-row>
  </ContainerCard>
</template>

<script>
import ContainerCard from "../../components/Cards/ContainerCard";
import {logout} from "../../requests/auth";

export default {
  name: "LogoutPage",
  components: {
    ContainerCard
  },
  data() {
    return {
      message: "Logging out ..."
    }
  },
  mounted() {
    this.logout();
  },
  methods: {
    logout() {
      logout();
      this.$store.commit("reset");
      this.message = "Successfully logged you out! Redirecting ...";
      setTimeout(() => {
        this.$router.push({ name: "Login" })
      }, 2000);
    }
  }
}
</script>
