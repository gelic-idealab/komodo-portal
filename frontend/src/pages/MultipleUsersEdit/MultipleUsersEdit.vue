<template>
<!-- Multiple Users edit page -->
  <ContainerCard>
    <v-form class="full-width" v-model="isValid" ref="form" lazy-validation>
        <p class="headline">Edit Multiple Users</p>
        <v-text-field
        v-model="name"
        label="Name"
        disabled
        />
        <v-row class="password">
        <v-text-field
        v-model="password"
        label="Default Password"
        :rules="requireRules"
        autofocus
        required
        :disabled="passwordDisabled"
        />
        <p class="edit-password" @click="updatePassword">Edit</p>
        </v-row>
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
        <RegisteredCourses :courseList="courseList" :selectedCourseList="selectedCourseList" @onSelectChange="onCourseSelectChange"/>
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
          Update
          <v-icon right>mdi-checkbox-marked-circle-outline</v-icon>
        </v-btn>
        <v-btn @click="editMultipleUsers" v-else color="primary">
          Update
          <v-icon right>mdi-checkbox-marked-circle-outline</v-icon>
        </v-btn>
      </v-row>
    </v-form>
  </ContainerCard>
</template>

<script>
import ContainerCard from "../../components/Cards/ContainerCard";
import { getAllCourses } from '../../requests/course';
import { editMultipleUsers } from '../../requests/auth';
import RegisteredCourses from "../UserCreate/ResigteredCourses";
import sha1 from "crypto-js/sha1";

export default {
  name: "MultipleUsersEdit",
  components: {
    ContainerCard,
    RegisteredCourses
  },
  data() {
    return {
      users: this.$route.params.selectedUser,
      name: "",
      password: "********",
      editPassword: false,
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
    this.name = this.users.map(user => user.userName).join(", ");
    // Initialize the courses
    getAllCourses()
    .then(res => {
      this.courseList = res.data;
    })
  },
  computed:{
    passwordDisabled(){
      return !this.editPassword;
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    // Updated selected course list
    onCourseSelectChange(courseList) {
      this.selectedCourseList = courseList;
    },
    // Let the password to be empty for setting a new password
    updatePassword(){
      this.editPassword = true;
      this.password = "";
    },
    validate() {
      return this.$refs.form.validate();
    },
    editMultipleUsers(){
      if(!this.validate()){
        return;
      }
      editMultipleUsers({
        users: this.users.map(user => user.userId),
        // Updated the password only if the password was changed
        password: this.updatePassword ? sha1(this.password).toString() : this.password,
        roleId: parseInt(this.role),
        courseList: this.selectedCourseList.map(course => course.courseId),
      })
      .then(() => {
        // Redirect to the admin view page
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
.row.password{
  margin: 0;
}
p.edit-password {
  line-height: 3;
  color: #7f5de9;
}

.edit-password:hover {
  cursor: pointer;
}
</style>
