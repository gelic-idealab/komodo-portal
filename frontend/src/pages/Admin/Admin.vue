<template>
  <div>
    <v-row>
      <v-col>
        <p class="display-1">
          ADMIN VIEW
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-tabs
          show-arrows
        >
        <!-- User detailed information -->
        <v-tab>Users</v-tab>
        <v-tab-item>
          <SectionCard>
            <v-data-table
              v-model="selectedUser"
              :headers="userHeaders"
              :items="userList"
              :sort-by="['userName']"
              item-key="userId"
              no-data-text="No user added"
              show-select
            >
              <template v-slot:top>
              <div class="clear-fix">
                <!-- Redirect to the multiple user edit page -->
                <router-link :to="{ name: 'Multiple Users Edit', params: { selectedUser }}">
                  <v-btn :disabled="userDisabled" class="float-right" color="success" depressed small>
                    <v-icon left small>mdi-plus</v-icon>
                    Edit Multiple Users
                  </v-btn>
                </router-link>
                <!-- Redirect to the user create page -->
                <router-link :to="{ name: 'User Create' }">
                  <v-btn class="float-right" color="success" depressed small>
                    <v-icon left small>mdi-plus</v-icon>
                    New User
                  </v-btn>
                </router-link>
              </div>
            </template>
            <template v-slot:item.action="{ item }">
              <!-- Redirect to the user edit page -->
              <router-link :to="{name: 'User Edit', params: {item}}">
                <v-icon small class="mr-2">edit</v-icon>
              </router-link>
              <v-icon small class="mr-2" @click="deleteUser(item)">delete</v-icon>
            </template>
            </v-data-table>
          </SectionCard>
        </v-tab-item>
        <!-- Course detailed information -->
        <v-tab>Courses</v-tab>
        <v-tab-item>
          <SectionCard>
            <v-data-table
              v-model="selectedCourse"
              :headers="courseHeaders"
              :items="courseList"
              :sort-by="['courseName']"
              item-key="courseId"
              no-data-text="No course added"
              show-select
            >
              <template v-slot:top>
              <div class="clear-fix">
                <!-- Redirect to the multiple courses edit page -->
                <router-link :to="{ name: 'Multiple Courses Edit', params: { selectedCourse }}">
                  <v-btn :disabled="courseDisabled" class="float-right" color="success" depressed small>
                    <v-icon left small>mdi-plus</v-icon>
                    Edit Multiple Courses
                  </v-btn>
                </router-link>
                <!-- redirect to the course create page -->
                <router-link :to="{ name: 'Course Create' }">
                  <v-btn class="float-right" color="success" depressed small>
                    <v-icon left small>mdi-plus</v-icon>
                    New Course
                  </v-btn>
                </router-link>
              </div>
            </template>
            <template v-slot:item.action="{ item }">
              <!-- Redirect to the course edit page -->
              <router-link :to="{name: 'Course Edit', params: {item}}">
                <v-icon small class="mr-2">edit</v-icon>
              </router-link>
              <v-icon small class="mr-2" @click="deleteCourse(item)">delete</v-icon>
            </template>
            </v-data-table>
          </SectionCard>
        </v-tab-item>
        </v-tabs>
        
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SectionCard from "../../components/Cards/SectionCard";
import {getUserList,getUserListByCourse, deleteUser} from "../../requests/auth";
import { getCourseList, getAllCourses, deleteCourse } from '../../requests/course';
export default {
    name: "Admin",
    components: {
      SectionCard
    },
    data(){
        return {
            userList: [],
            courseList: [],
            userHeaders: [
                { text: "Name", value: "userName"},
                { text: "Email", value: "email"},
                { text: "Role", value: "roleName"},
                { text: "Course", value: "courses"},
                { text: "Action", value: "action", sortable: false}
            ],
            courseHeaders: [
                { text: "Name", value: "courseName"},
                { text: "CRN", value: "courseNo"},
                { text: "Description", value: "description"},
                { text: "Instructor", value: "instructorName"},
                { text: "Semester", value: "semester"},
                { text: "Students", value: "users"},
                { text: "Action", value: "action", sortable: false}
            ],
            selectedUser: [],
            selectedCourse: [],
            courses:[],
            students:[]
        }
    },
    computed:{
      /**
       * Define the usability of the multiple edit button
       */
      userDisabled(){
        return !this.selectedUser.length;
      },
      courseDisabled(){
        return !this.selectedCourse.length;
      }
    },
    mounted(){
        /**
         * Initialize the user information and the course list of each user
         */
        getUserList().then(res => {
        this.userList = res.data;
        let len = this.userList.length;
        for (let i = 0; i < len; i++) {
            getCourseList(this.userList[i].userId).then(res =>{
              this.userList[i].courses = res.data.map(course => course.courseNo).join(", ");
            })
          }
        });
        /**
         * Initialize the course information and the user list of each course
         */
        getAllCourses().then(res => {
          this.courseList = res.data;
          for(let i = 0; i < this.courseList.length; i++){
            getUserListByCourse(this.courseList[i].courseId).then(res => {
              this.courseList[i].users = res.data.map(user => user.userName).join(", ");
            })
          }
        })
    },
    methods:{
      /**
       * Delete the user from the data table
       */
      deleteUser(item){
        const index = this.userList.indexOf(item)
        if(confirm('Are you sure you want to delete this user?')){
          deleteUser({userId: item.userId}).then(() => {
            this.userList.splice(index, 1);
          })
        }
      },
      /**
       * Delete the course from the data table
       */
      deleteCourse(item){
        const index = this.courseList.indexOf(item)
        if(confirm('Are you sure you want to delete this course?')){
          deleteCourse({courseId: item.courseId}).then(() => {
            this.courseList.splice(index, 1);
          })
        } 
      }

    }
}
</script>
<style>
button {
    margin: 10px;
}
.v-data-table.theme--light {
    padding: 10px 30px;
}
</style>