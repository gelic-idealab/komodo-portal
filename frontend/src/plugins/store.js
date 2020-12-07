import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const getDefaultState = () => ({
  user: null,
  courses: null
});

const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    })
  ],
  state: getDefaultState(),
  getters: {
    user: state => {
      return state.user;
    },
    courses: state => {
      return state.courses;
    },
    isLoggedIn: state => {
      return !!state.user;
    }
  },
  mutations: {
    reset(state) {
      Object.assign(state, getDefaultState());
    },
    setUser(state, user) {
      state.user = user;
    },
    setCourses(state, courses) {
      state.courses = courses;
    }
  },
});

export default store;
