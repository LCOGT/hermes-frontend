import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    main_data: [],
    extra_data: [],
    name: '',
    header: '',
    profile: {
      'email': '',
      'writable_topics': ['hermes.test']
    },
    hermesUrl: '',
    csrf_token: '',
    tns_options: {},
    mid_login: false
  },
  getters: {
    getTnsOptions(state) {
      return state.tns_options;
    },
    getProfile(state) {
      return state.profile;
    },
    getHermesUrl(state) {
      return state.hermesUrl;
    },
    getCsrfToken(state) {
      return state.csrf_token;
    },
    getMidLogin(state) {
      return state.mid_login;
    },
    isLoggedIn(state) {
      return state.profile.email != '';
    }
  },
  plugins: [createPersistedState()],
  mutations: {
    SET_TNS_OPTIONS(state, tns_options) {
      state.tns_options = tns_options;
    },
    SET_PROFILE(state, profile) {
      state.profile = profile;
    },
    SET_HERMES_URL(state, url) {
      state.hermesUrl = url;
    },
    SET_CSRF_TOKEN(state, csrf_token) {
      state.csrf_token = csrf_token;
    },
    SET_MID_LOGIN(state, mid_login) {
      state.mid_login = mid_login;
    }
  },
  actions: {
    getTnsOptionsData(context) {
      return axios.get(context.state.hermesUrl + "api/v0/tns_options/", {
        withCredentials: true,
      })
      .then((response) => {
        context.commit("SET_TNS_OPTIONS", response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 401){
          context.commit("SET_MID_LOGIN", false);
          context.commit("SET_PROFILE", {
            "email": "",
            "writable_topics": ["hermes.test"]
          });
        }
      })
    },
    getProfileData(context) {
      return axios.get(context.state.hermesUrl + "api/v0/profile/", {
          withCredentials: true,
        })
        .then((response) => {
          context.commit("SET_PROFILE", response.data);
          context.commit("SET_MID_LOGIN", false);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == 401){
            context.commit("SET_MID_LOGIN", false);
            context.commit("SET_PROFILE", {
              "email": "",
              "writable_topics": ["hermes.test"]
            });
          }
        });
    }
  },
  modules: {
  }
})
