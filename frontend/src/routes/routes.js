import MainLayout from "../components/Layout/MainLayout";
import Login from "../pages/Login/Login";
import Logout from "../pages/Logout/Logout";
import Landing from "../pages/Landing/Landing";
import CourseDetail from "../pages/CourseDetail/CourseDetail";
import AssetCreate from "../pages/AssetCreate/AssetCreate";
import AssetDetail from "../pages/AssetDetail/AssetDetail";
import LabCreate from "../pages/LabCreate/LabCreate";
import LabEdit from "../pages/LabEdit/LabEdit";
import LabDetail from "../pages/LabDetail/LabDetail";
import Metric from "../pages/Metric/Metric";
import Assets from "../pages/Assets.vue";
import resetUser from "../pages/Account/ResetUser";
import About from "../pages/About.vue";
import Admin from "../pages/Admin/Admin.vue";
import UserCreate from "../pages/UserCreate/UserCreate.vue";
import UserEdit from "../pages/UserEdit/UserEdit.vue";
import MultipleUsersEdit from "../pages/MultipleUsersEdit/MultipleUsersEdit.vue";
import CourseCreate from "../pages/CourseCreate/CourseCreate.vue";
import CourseEdit from "../pages/CourseEdit/CourseEdit.vue";
import MultipleCoursesEdit from "../pages/MultipleCoursesEdit/MultipleCoursesEdit.vue";
import UserProfilePage from "../pages/UserProfile/UserProfile.vue";
const routes = [
  // User login
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  // User logout
  {
    path: "/logout",
    name: "Logout",
    component: Logout,
    meta: {
      requireLogin: true
    }
  },
  // Go to about page
  {
    path: "/about",
    name: "About",
    component: About,
    meta: {
      requireLogin: false
    }
  },
  // Go to dashboard page
  {
    path: "/",
    component: MainLayout,
    redirect: "/dashboard",
    children: [
      // Initialize the dashboard page
      {
        path: "dashboard",
        name: "Landing",
        component: Landing,
        meta: {
          requireLogin: true
        }
      },
      // Get course details
      {
        path: "courses/:courseId",
        name: "Course Detail",
        component: CourseDetail,
        meta: {
          requireLogin: true
        }
      },
      // Create new lab
      {
        path: "courses/:courseId/labs/create",
        name: "Lab Create",
        component: LabCreate,
        meta: {
          requireLogin: true
        }
      },
      // Edit lab by lab id
      {
        path: "courses/:courseId/labs/:labId/edit",
        name: "Lab Edit",
        component: LabEdit,
        meta: {
          requireLogin: true
        }
      },
      // Go to the lab detail page by course id and lab id
      {
        path: "courses/:courseId/labs/:labId",
        name: "Lab Detail",
        component: LabDetail,
        meta: {
          requireLogin: true
        }
      },
      // Go to the assets page
      {
        path: "/assets",
        name: "Assets",
        component: Assets,
        meta: {
          requireLogin: true
        }
      },
      // Go to the admin view page
      {
        path: "/admin",
        name: "Admin",
        component: Admin,
        meta: {
          requireLogin: true
        }
      },
      // Create new user
      {
        path: "/admin/create/user",
        name: "User Create",
        component: UserCreate,
        meta: {
          requireLogin: true
        }
      },
      // Edit user by user id
      {
        path: "/admin/edit/user",
        name: "User Edit",
        component: UserEdit,
        meta: {
          requireLogin: true
        }
      },
      // Edit multiple users in admin page
      {
        path: "/admin/edit/multiple/user",
        name: "Multiple Users Edit",
        component: MultipleUsersEdit,
        meta: {
          requireLogin: true
        }
      },
      // Create new course in admin page
      {
        path: "/admin/create/course",
        name: "Course Create",
        component: CourseCreate,
        meta: {
          requireLogin: true
        }
      },
      // Edit course by course id
      {
        path: "/admin/edit/course",
        name: "Course Edit",
        component: CourseEdit,
        meta: {
          requireLogin: true
        }
      },
      // Edit multiple course in admin page
      {
        path: "/admin/edit/multiple/course",
        name: "Multiple Courses Edit",
        component: MultipleCoursesEdit,
        meta: {
          requireLogin: true
        }
      },
      // Create new asset
      {
        path: "assets/create",
        name: "Asset Create",
        component: AssetCreate,
        meta: {
          requireLogin: true
        }
      },
      // Get assets details by asset id
      {
        path: "assets/:assetId",
        name: "Asset Detail",
        component: AssetDetail,
        meta: {
          requireLogin: true
        }
      },
      // Go to metric page
      {
        path: "metrics",
        name: "Metric",
        component: Metric,
        meta: {
          requireLogin: true
        }
      },
      // {
      //   path: "metrics/:sessionId",
      //   name: "Session Metric",
      //   component: SessionMetric,
      //   meta: {
      //     requireLogin: true
      //   }
      // },
      {
        path: "/account/reset",
        name: "Account",
        component: resetUser,
        meta: {
          requireLogin: true
        },
      },
      // User Profile page
      {
        path: "/account",
        name: "UserProfilePage",
        component: UserProfilePage,
        meta: {
          requireLogin: true
        }
      },
    ]
  }
];

export default routes;
