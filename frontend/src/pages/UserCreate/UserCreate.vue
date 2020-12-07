<template>
<!-- User create page -->
  <ContainerCard>
    <v-form class="full-width" v-model="isValid" ref="form" lazy-validation>
        <p class="headline">Create New User</p>
        <v-text-field
        v-model="firstName"
        label="First Name"
        autofocus
        required
        :rules="requireRules"
        />
        <v-text-field
        v-model="lastName"
        label="Last Name"
        autofocus
        required
        :rules="requireRules"
        />
        <v-text-field
        v-model="email"
        label="Email"
        :rules="requireRules"
        autofocus
        required
        />
        <v-text-field
        v-model="password"
        label="Default Password"
        :rules="requireRules"
        autofocus
        required
        />
        <v-radio-group
              v-model="role"
              row
              madndatory
            >
            <v-radio
            label="Admin"
            color="primary"
            value="1"
            ></v-radio>
            <v-radio
            label="Instructor"
            color="primary"
            value="2"
            ></v-radio>
            <v-radio
            label="Student"
            color="primary"
            value="3"
            ></v-radio>
        </v-radio-group>
        <!-- Registered courses list -->
        <RegisteredCourses :courseList="courseList" @onSelectChange="onCourseSelectChange"/>
      <v-row justify="center">
        <v-btn class="mr-3" color="accent" @click="goBack">
          Cancel
          <v-icon right>mdi-close-circle-outline</v-icon>
        </v-btn>
        <v-btn v-if="status === 'processing'" disabled>
          Processing
          <v-progress-circular class="ml-2" indeterminate size="14" width="2" />
        </v-btn>
        <v-btn v-else-if="status === 'success'" color="success">
          Create
          <v-icon right>mdi-checkbox-marked-circle-outline</v-icon>
        </v-btn>
        <v-btn v-else @click="createUser" color="primary">
          Create
          <v-icon right>mdi-checkbox-marked-circle-outline</v-icon>
        </v-btn>
      </v-row>
    </v-form>
  </ContainerCard>
</template>

<script>
import ContainerCard from "../../components/Cards/ContainerCard";
import { getAllCourses } from '../../requests/course';
import { createUser } from '../../requests/auth';
import RegisteredCourses from "./ResigteredCourses";
import sha1 from "crypto-js/sha1";

export default {
  name: "LabCreate",
  components: {
    ContainerCard,
    RegisteredCourses
  },
  data() {
    return {
      lastName: "",
      firstName: "",
      email: "",
      password: "",
      role: "3",
      courseList:[],
      selectedCourseList: [],
      status: "pending",
      isValid: true,
      requireRules: [
        v => !!v || 'The field is required'
      ]
    }
  },
  mounted: function() {
    // Initialize the course list
    getAllCourses()
    .then(res => {
      const courses = res.data;
      this.courseList = courses.map(course => {
        return {
          ...course
        }
      })
    })
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // Update the selected course list
    onCourseSelectChange(courseList) {
      this.selectedCourseList = courseList;
    },
    validate() {
      return this.$refs.form.validate();
    },
    createUser(){
      if(!this.validate()){
        return;
      }
      createUser({
        lastName: this.lastName,
        firstName: this.firstName,
        email: this.email,
        password: sha1(this.password).toString(),
        roleId: parseInt(this.role),
        courseList: this.selectedCourseList.map(course => course.courseId)
      })
      .then(() => {
        this.status = 'success';
        setTimeout(() => {
          this.$router.push({
            name: "Admin"
          })
        }, 1000);
      })
    }
  }
}
</script>

<style>
</style>
