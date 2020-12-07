<template>
<!-- Course create page -->
  <ContainerCard>
    <v-form class="full-width" v-model="isValid" ref="form" lazy-validation>
        <p class="headline">Create New Course</p>
        <v-text-field
        v-model="courseName"
        label="Course Name"
        autofocus
        required
        :rules="requireRules"
        />
        <v-text-field
        v-model="CRN"
        label="CRN"
        autofocus
        required
        :rules="requireRules"
        />
        <v-text-field
        v-model="description"
        label="Description"
        autofocus
        />
        <v-text-field
        v-model="credit"
        label="Credit Hours"
        autofocus
        />
        <v-text-field
        v-model="department"
        label="Department"
        autofocus
        />
        <v-select
          v-model="instructor"
          :items="instructorList"
          label="Instructor"
          :rules="requireRules"
        ></v-select>
        <v-select
          v-model="semester"
          :items="semesterList"
          label="Semester"
          :rules="requireRules"
        ></v-select>
        <!-- Registered users list -->
        <RegisteredUsers :userList="userList" @onSelectChange="onUserSelectChange"/>
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
        <v-btn v-else @click="createCourse" color="primary">
          Create
          <v-icon right>mdi-checkbox-marked-circle-outline</v-icon>
        </v-btn>
      </v-row>
    </v-form>
  </ContainerCard>
</template>

<script>
import ContainerCard from "../../components/Cards/ContainerCard";
import { createCourse, getSemesterList } from '../../requests/course';
import { getUserList } from '../../requests/auth';
import RegisteredUsers from "./RegisteredUsers";

export default {
  name: "CourseCreate",
  components: {
    ContainerCard,
    RegisteredUsers
  },
  data() {
    return {
      courseName: "",
      CRN: "",
      credit:null,
      department:null,
      description: null,
      instructor: "",
      semester: "",
      status: "pending",
      isValid: true,
      requireRules: [
        v => !!v || 'The field is required'
      ],
      userList: [],
      selectedUserList: [],
      instructorList: [],
      semesterList: []
    }
  },
  mounted: function() {
    /**
     * Initialize the semester list in the form
     */
    getSemesterList().then(res => {
      this.semesterList = res.data.map(semester => semester.semesterId.toString() + " " + semester.semester);
    });
    /**
     * Initialize the user list
     */
    getUserList().then(res => {
      const users = res.data;
      this.userList = users;
      this.instructorList = users
      .filter(instructor => instructor.roleName === "instructor" || instructor.roleName === "admin")
      .map(item => item.userId + " " + item.userName);
    })
  },
  methods: {
    /**
     * Return the previous page 
     */
    goBack() {
      this.$router.go(-1);
    },
    /**
     * Update the selected user list
     */
    onUserSelectChange(userList) {
      this.selectedUserList = userList;
    },
    /**
     * Validate the form
     */
    validate() {
      return this.$refs.form.validate();
    },
    /**
     * Create the course
     */
    createCourse(){
      if(!this.validate()){
        return;
      }
      // Create the course only if the input is valid
      createCourse({
        courseName: this.courseName,
        courseNo: this.CRN,
        credit: this.credit,
        department: this.department,
        description: this.description,
        instructorId: parseInt(this.instructor.split(" ")[0]),
        semesterId: parseInt(this.semester.split(" ")[0]),
        userList: this.selectedUserList.map(user => user.userId)
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
</style>
