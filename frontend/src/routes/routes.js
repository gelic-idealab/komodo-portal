import MainLayout from "../components/Layout/MainLayout";
import LoginPage from "../pages/Login/Login";
import LogoutPage from "../pages/Logout/Logout";
import LandingPage from "../pages/Landing/Landing";
import CourseDetail from "../pages/CourseDetail/CourseDetail";
import AssetCreate from "../pages/AssetCreate/AssetCreate";
import AssetDetail from "../pages/AssetDetail/AssetDetail";
import LabCreate from "../pages/LabCreate/LabCreate";
import LabEdit from "../pages/LabEdit/LabEdit";
import LabDetail from "../pages/LabDetail/LabDetail";
import MetricsPage from "../pages/Metric/Metric";
import AssetsPage from "../pages/Assets.vue";
import resetUser from "../pages/Account/ResetUser";
import AboutPage from "../pages/About.vue";
import AdminPage from "../pages/Admin/Admin.vue";
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
    component: LoginPage,
    meta: {
      title: "Log In — Komodo"
    }
  },
  // User logout
  {
    path: "/logout",
    name: "Logout",
    component: LogoutPage,
    meta: {
      requireLogin: true,
      title: "Logging out... (Komodo)"
    }
  },
  // Go to about page
  {
    path: "/about",
    name: "About",
    component: AboutPage,
    meta: {
      title: "About — Komodo"
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
        component: LandingPage,
        meta: {
          requireLogin: true,
          title: "Dashboard — Komodo"
        }
      },
      // Get course details
      {
        path: "courses/:courseId",
        name: "Course Detail",
        component: CourseDetail,
        meta: {
          requireLogin: true,
          title: "Course — Komodo"
        }
      },
      // Create new lab
      {
        path: "courses/:courseId/labs/create",
        name: "Lab Create",
        component: LabCreate,
        meta: {
          requireLogin: true,
          title: "Create Lab — Komodo"
        }
      },
      // Edit lab by lab id
      {
        path: "courses/:courseId/labs/:labId/edit",
        name: "Lab Edit",
        component: LabEdit,
        meta: {
          requireLogin: true,
          title: "Edit Lab — Komodo"
        }
      },
      // Go to the lab detail page by course id and lab id
      {
        path: "courses/:courseId/labs/:labId",
        name: "Lab Detail",
        component: LabDetail,
        meta: {
          requireLogin: true,
          title: "Lab — Komodo"
        }
      },
      // Go to the assets page
      {
        path: "/assets",
        name: "Assets",
        component: AssetsPage,
        meta: {
          requireLogin: true,
          title: "All Assets — Komodo"
        }
      },
      // Go to the admin view page
      {
        path: "/admin",
        name: "Admin",
        component: AdminPage,
        meta: {
          requireLogin: true,
          title: "Admin — Komodo"
        }
      },
      // Create new user
      {
        path: "/admin/create/user",
        name: "User Create",
        component: UserCreate,
        meta: {
          requireLogin: true,
          title: "Create User — Komodo"
        }
      },
      // Edit user by user id
      {
        path: "/admin/edit/user",
        name: "User Edit",
        component: UserEdit,
        meta: {
          requireLogin: true,
          title: "Edit Users — Komodo"
        }
      },
      // Edit multiple users in admin page
      {
        path: "/admin/edit/multiple/user",
        name: "Multiple Users Edit",
        component: MultipleUsersEdit,
        meta: {
          requireLogin: true,
          title: "Edit Users — Komodo"
        }
      },
      // Create new course in admin page
      {
        path: "/admin/create/course",
        name: "Course Create",
        component: CourseCreate,
        meta: {
          requireLogin: true,
          title: "Create Course — Komodo"
        }
      },
      // Edit course by course id
      {
        path: "/admin/edit/course",
        name: "Course Edit",
        component: CourseEdit,
        meta: {
          requireLogin: true,
          title: "Edit Course — Komodo"
        }
      },
      // Edit multiple course in admin page
      {
        path: "/admin/edit/multiple/course",
        name: "Multiple Courses Edit",
        component: MultipleCoursesEdit,
        meta: {
          requireLogin: true,
          title: "Edit Courses — Komodo"
        }
      },
      // Create new asset
      {
        path: "assets/create",
        name: "Asset Create",
        component: AssetCreate,
        meta: {
          requireLogin: true,
          title: "Upload Asset — Komodo"
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
        component: MetricsPage,
        meta: {
          requireLogin: true,
          title: "Metrics — Komodo"
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
        name: "Edit Account",
        component: resetUser,
        meta: {
          requireLogin: true,
          title: "Account — Komodo"
        },
      },
      // User Profile page
      {
        path: "/account",
        name: "UserProfilePage",
        component: UserProfilePage,
        meta: {
          requireLogin: true,
          title: "Account — Komodo"
        }
      },
    ]
  }
];

export default routes;
