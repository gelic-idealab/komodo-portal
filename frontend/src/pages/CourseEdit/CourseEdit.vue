<template>
<!-- course edit page -->
  <ContainerCard>
    <v-form class="full-width" v-model="isValid" ref="form" lazy-validation>
        <p class="headline">Edit Course</p>
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
        disabled
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
        <!-- Registered users list of the course -->
        <RegisteredUsers :userList="userList" :selectedUserList="selectedUserList" @onSelectChange="onUserSelectChange"/>
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
        <v-btn v-else @click="editCourse" color="primary">
          Update
          <v-icon right>mdi-checkbox-marked-circle-outline</v-icon>
        </v-btn>
      </v-row>
    </v-form>
  </ContainerCard>
</template>

<script>
import ContainerCard from "../../components/Cards/ContainerCard";
import { editCourse, getCourseDetail, getSemesterList } from '../../requests/course';
import { getUserList } from '../../requests/auth';
import RegisteredUsers from "../CourseCreate/RegisteredUsers";

export default {
  name: "CourseEdit",
  components: {
    ContainerCard,
    RegisteredUsers
  },
  data() {
    return {
      courseId: this.$route.params.item.courseId,
      courseName: "",
      CRN: "",
      credit: 1,
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
     * Initialize the semester list
     */
    getSemesterList().then(res => {
      this.semesterList = res.data.map(semester => semester.semesterId.toString() + " " + semester.semester);
    });
    /**
     * Initialize the user list of each course
     */
    getUserList().then(res => {
      const users = res.data;
      this.userList = users;
      this.instructorList = users
      .filter(instructor => instructor.roleName === "instructor")
      .map(item => item.userId + " " + item.userName);
    });
    let courseId = this.courseId;
    Promise.all([getCourseDetail({courseId})])
    .then(values => {
      const course = values[0].data;
      this.courseName = course.courseName;
      this.CRN = course.courseNo;
      this.credit = course.creditHours;
      this.department = course.department;
      this.description = course.description;
      this.instructor = course.instructorId.toString() + " " + course.instructorName.split(", ")[1] + " " + course.instructorName.split(", ")[0];
      this.semester = course.semesterId.toString() + " " + course.semester;
      this.selectedUserList = course.userList;
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
     * Update selected user list
     */
    onUserSelectChange(userList) {
      this.selectedUserList = userList;
    },
    /**
     * Validate the input of the form
     */
    validate() {
      return this.$refs.form.validate();
    },
    /**
     * Edit the course 
     */
    editCourse(){
      if(!this.validate()){
        return;
      }
      // Edit the course if the input is valid
      editCourse({
        courseName: this.courseName,
        courseNo: this.CRN,
        credit: this.credit,
        department: this.department,
        description: this.description,
        instructorId: parseInt(this.instructor.split(" ")[0]),
        semesterId: parseInt(this.semester.split(" ")[0]),
        userList: this.selectedUserList.map(user => user.userId),
        courseId: this.courseId
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
