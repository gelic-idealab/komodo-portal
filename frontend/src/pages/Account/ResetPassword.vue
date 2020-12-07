<template>
<!-- Reset the password page -->
  <v-row align="center" justify="center" style="height: 100vh">
    <v-card class="radius-3" width="70%" height="70%">
      <v-container class="pa-0 full-height radius-3">
        <v-row class="full-height" no-gutters>
          <v-col class="pa-6 card-content-wrapper">
            <v-card-title class="headline">
              Reset Password
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="password"
                label="New Password"
                type="password"
                append-icon="mdi-eye-off"
                required
              />
              <v-text-field
                v-model="passwordConfirm"
                label="Confirm New Password"
                type="password"
                append-icon="mdi-eye-off"
                required
              />
              <v-alert
                v-show="showDialog && message"
                v-text="message"
                :type="messageType"
                dense
                text
              />
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn class="mx-6 full-width" color="primary" @click="reset" large>Reset</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-row>
</template>
<script>
import sha1 from "crypto-js/sha1";
import { resetPassword } from "../../requests/auth";

export default {
  data: () => ({
    user: null,
    password: "",
    passwordConfirm: "",
    showDialog: false,
    message: "",
    messageType: "info"
  }),
  mounted() {
    this.user = this.$store.getters.user;
  },
  methods: {
    showInfo(message, type) {
      this.message = message;
      this.messageType = type;
      this.showDialog = true;
    },
    /**
     * Reset the password
     */
    reset() {
      if (!this.password.length || !this.passwordConfirm.length || !(this.password === this.passwordConfirm)) {
        this.showInfo("Please set and confirm a valid password", "error");
        return;
      }
      resetPassword({
        user_id: this.user.userId,
        password: sha1(this.password).toString()
      })
        .then(res => {
          if (res.status === 200) {
            this.showInfo("Password successfully reset.", "success");
          }
        })
        .then(() => {
          setTimeout(() => {
            this.$router.push({
              path: "/dashboard"
            });
          }, 1000);
        })
        .catch(err => {
          this.showInfo(err.response.data.message || "Password Reset Failed!", "error");
        });
    },
  }
}
</script>
<style>
  .card-content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
