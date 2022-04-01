<template>
<!-- Login page -->
  <v-row align="center" justify="center" class="all-container" style="height: 100vh">
    <v-card class="radius-3" elevation="15" width="70%" height="70%">
      <v-container class="pa-0 full-height radius-3">
        <v-row class="full-height" no-gutters>
          <!-- Login section -->
          <v-col class="pa-6 card-content-wrapper">
            <v-card-title class="headline">
              Login
            </v-card-title>
            <v-card-text class="text-container">
              <v-text-field 
                :autofocus="true"
                v-model="email"
                label="Email"
                v-on:keyup.enter="login"
              />
              <v-text-field
                v-model="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                @click:append="() => showPassword = !showPassword"
                :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                v-on:keyup.enter="login"
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
              <v-btn class="mx-6 full-width" color="primary" @click="login" large>Login</v-btn>
            </v-card-actions>
            <p class="register-text">
              Don't have an account? Please click "Learn More" and fill out the Interest form to indicate that you are interested in getting an account, or contact the Project Komodo team if you are supposed to have access.
            </p>
          </v-col>
          <!-- Image section -->
          <v-col class="landing-img-container">
            <div class="landing-img">
              <div class="landing-logo">
                <p class="title1 display-2 white--text">
                  Welcome to Komodo
                </p>
                <p class="title2 headline white--text font-italic">
                  A new way of learning with VR
                </p>
                <p class="white--text">
                  Developed at the University of Illinois Urbana-Champaign
                </p>
                <router-link :to="{ name: 'About' }">
                  <v-btn 
                    small 
                    color="primary" 
                    class="ma-1">
                    Learn More →
                  </v-btn>
                </router-link>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-row>
</template>
<script>
import sha1 from "crypto-js/sha1";
import { login } from "../../requests/auth";
import { getCourseList } from "../../requests/course";

export default {
  name: "LoginPage",
  data: () => ({
    showPassword: false,
    password: "",
    email: "",
    showDialog: false,
    message: "",
    messageType: "info"
  }),
  mounted() {
    // Initialize the login user
    if (this.$store.getters.user) {
      this.$router.push({ name: "Landing" });
    }
  },
  created(){ },
  methods: {
    showInfo(message, type) {
      this.message = message;
      this.messageType = type;
      this.showDialog = true;
    },
    login() {
      if (!this.email.length || !this.password.length) {
        this.showInfo("Invalid Input!", "warning");
        return;
      }
      login({
        email: this.email,
        password: sha1(this.password).toString(),
      })
        .then(res => {
          // Cached the user data if the user logged in seccessfully
          if (res.status === 200) {
            const { userId, email, firstName, lastName, roleName: role } = res.data.user;
            this.showInfo("Login Succeeded! Redirecting ...", "success");
            this.$store.commit("setUser", { userId, email, firstName, lastName, role });
            return getCourseList(userId);
          }
        })
        .then(res => {
          // Redirect to the dashboard page
          this.$store.commit("setCourses", res.data);
          setTimeout(() => {
            this.$router.push({
              path: "/dashboard"
            });
          }, 1000);
        })
        .catch(err => {
          this.showInfo(err.response.data.message || "Login Failed!", "error");
        });
    },
    register() {
    }
  }
}
</script>
<style>
  .register-text{
    padding: 0 10px;
  }
  label.v-label.theme--light {
    font-size: 14px;
    color: black;
  }
  .v-input--selection-controls{
    margin-top: 0!important;
    padding-top: 0!important;
  }
  .card-content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .landing-img-container {
    height: 100%;
    width: 100%;
  }

  .landing-img {
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    background: linear-gradient(0.125turn, var(--v-primary), var(--v-accent) 65%, var(--v-tertiary));
    height: 100%;
    width: 100%;
  }

  .landing-logo {
    border-bottom-right-radius: inherit;
    background-image: url("../../assets/img/komodo-logo-white.svg");
    background-position: bottom right -1px;
    background-size: 75%;
    padding: 48px;
    height: 100%;
    width: 100%;
  }

  .title1 {
    font-size: 3rem;
    line-height: 3.125rem;
    letter-spacing: normal;
    margin-top: 24px;
    font-weight: 900;
  }

  .title2 {
    font-size: 1.5rem;
    font-weight: 400;
    letter-spacing: normal;
  }
  @media screen and (max-width: 800px){
    .landing-logo {
      background-size: 50%!important;
    }

    p.title1.display-2.white--text {
      font-size: 2rem!important;
      line-height: 2.5rem!important;
      margin-top: -30px!important;
    }

    p.title2.headline.white--text.font-italic {
      font-size: 1.25rem!important;
    }

    .v-text-field {
      padding-top: 0;
    }
    .v-alert {
      margin-bottom: 0;
    }
  }

  @media screen and (max-width: 400px){
    .landing-logo {
      padding: 48px!important;
    }

    .all-container {
      height: auto!important;
      padding-top: 10%!important;
      padding-bottom: 10%!important;
    }

    .row.full-height.no-gutters {
      flex-wrap: wrap-reverse;
    }

    .landing-img {
    border-top-left-radius: 12px;
    } 
  }

  @media screen and (max-width: 600px) and (min-width: 401px){
    .landing-img .landing-logo{
      padding: 25px;
    }

    p.title1.display-2.white--text {
      font-size: 2rem!important;
      line-height: 2rem!important;
      margin-top: -10px!important;
    }

    p.white--text {
      font-size: 11px;
    }

    .v-card__subtitle, .v-card__text, .v-card__title {
      padding: 0 10px!important;
    }

  }

  @media screen and (max-width: 800px) and (min-width: 601px){
    p.title1.display-2.white--text {
      font-size: 2rem!important;
      line-height: 2.5rem!important;
      margin-top: -5px!important;
      margin-bottom: -9px;
    }

    .v-card__title.headline {
      font-size: 20px!important;
    }

    .v-input__slot {
      margin-bottom: 0;
    }

    .radius-3.v-card.v-sheet.theme--light.elevation-15 {
      height: auto!important;
    }

    .card-content-wrapper {
      height: auto;
    }

    .landing-img-container {
      height: auto;
    }
  
}
</style>
