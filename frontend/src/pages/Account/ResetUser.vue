<template>
<!-- Reset the password page -->
  <v-row align="center" justify="center" style="height: 100vh">
    <v-card class="radius-3" width="70%" height="80%">
      <v-container class="pa-0 full-height radius-3">
        <v-form @submit.prevent="submit" ref="form" lazy-validation>
          <validation-observer
            ref="observer"
            v-slot="{ invalid }"
          >
            <v-row class="full-height" no-gutters>
              <v-col class="pa-6 card-content-wrapper">
                <v-card-title class="headline">
                  Edit User information
                </v-card-title>
                <v-card-text>
                  <validation-provider
                    v-slot="{ errors }"
                    name="FirstName"
                    rules="required"
                  >
                    <v-text-field
                      v-model="FirstName"
                      :error-messages="errors"
                      label="First Name"
                      required
                    />
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    name="LastName"
                    rules="required"
                  >
                    <v-text-field
                      v-model="LastName"
                      :error-messages="errors"
                      label="Last Name"
                    />
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    name="Email"
                    rules="required|email"
                  >
                    <v-text-field
                      v-model="Email"
                      :error-messages="errors"
                      label="email"
                    />
                  </validation-provider>
                  <div class="subtitle-2">To change your information without changing your password, please input and confirm your current password:</div>
                  <validation-provider
                    v-slot="{ errors }"
                    name="Password"
                    rules="required"
                  >
                    <v-text-field
                      v-model="Password"
                      label="New Password"
                      :error-messages="errors"
                      type="password"
                      append-icon="mdi-eye-off"
                    />
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    name="PasswordConfirm"
                    rules="required"
                  >
                    <v-text-field
                      v-model="PasswordConfirm"
                      label="Confirm New Password"
                      :error-messages="errors"
                      type="password"
                      append-icon="mdi-eye-off"
                    />
                  </validation-provider>
                  <v-alert
                    v-show="showDialog && message"
                    v-text="message"
                    :type="messageType"
                    dense
                    text
                  />
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-btn class="mr-3" color="accent" @click="goBack" large>Cancel</v-btn>
                  <v-btn class="mr-4 formButton" color="primary" type="submit" :disabled="invalid" large>Submit</v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </validation-observer>
        </v-form>
      </v-container>
    </v-card>
  </v-row>
</template>
<script>
import { extend, ValidationProvider, ValidationObserver} from 'vee-validate'
import sha1 from "crypto-js/sha1";
import { resetUser } from "../../requests/auth";
import { required,email } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
})

extend('email', {
  ...email,
  message: '{_field_} field must be a valid email',
})

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    user: null,
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    PasswordConfirm: "",
    showDialog: false,
    message: "",
    messageType: "info"
  }),
  mounted() {
    this.user = this.$store.getters.user;
    this.FirstName = this.$store.getters.user.firstName;
    this.LastName = this.$store.getters.user.lastName;
    this.Email = this.$store.getters.user.email
  },
  methods: {
    showInfo(message, type) {
      this.message = message;
      this.messageType = type;
      this.showDialog = true;
    },
    goBack() {
      this.$router.go(-1);
    },
    /**
     * Reset the password
     */
    submit() {
      if (!this.Password.length || !this.PasswordConfirm.length || !(this.Password === this.PasswordConfirm)) {
        this.showInfo("Please set and confirm a valid password", "error");
        return;
      }
      resetUser({
        user_id: this.user.userId,
        firstName: this.FirstName,
        lastName: this.LastName,
        email: this.Email,
        password: sha1(this.Password).toString()
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
