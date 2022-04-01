<template>
<!-- User edit page -->
  <ContainerCard>
    <v-form class="full-width" v-model="isValid" ref="form" lazy-validation>
        <p class="headline">Edit User</p>
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
        <v-row class="password">
        <v-text-field
        v-model="newPassword"
        label="Password (Leave blank to keep existing password)"
        autofocus
        />
        </v-row>
        <v-radio-group
              v-model="role"
              row
              mandatory
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
        <!-- Registered course list section -->
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
        <v-btn v-else @click="editUser" color="primary">
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
import { editUser, getUserDetail } from '../../requests/auth';
import RegisteredCourses from "../UserCreate/ResigteredCourses";
import sha1 from "crypto-js/sha1";

export default {
  name: "LabEdit",
  components: {
    ContainerCard,
    RegisteredCourses
  },
  data() {
    return {
      userId: this.$route.params.item.userId,
      lastName: "",
      firstName: "",
      newPassword: "",
      editPassword: false,
      email: "",
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
    getAllCourses()
    .then(res => {
      this.courseList = res.data;
    })
    let userId = this.userId;
    Promise.all([getUserDetail({userId})])
    .then(values => {
      const user = values[0].data;
      console.dir(user)
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.email = user.email;
      this.role = user.roleId.toString();
      this.selectedCourseList = user.courseList;
    })
  },
  computed:{
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    onCourseSelectChange(courseList) {
      this.selectedCourseList = courseList;
    },
    validate() {
      return this.$refs.form.validate();
    },
    editUser(){
      if(!this.validate()){
        return;
      }

      console.log(this.newPassword);
      console.log(this.newPassword == "");
      console.log(sha1(this.newPassword).toString());

      editUser({
        lastName: this.lastName,
        firstName: this.firstName,
        email: this.email,
        // Update the password only when the password was changed/
        // We expect the back end userEdit service to accept an
        // empty string to indicate that the password should not be //// changed.
        password: this.newPassword == "" ? "" : sha1(this.newPassword).toString(),
        roleId: parseInt(this.role),
        courseList: this.selectedCourseList.map(course => course.courseId),
        userId: this.userId
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
