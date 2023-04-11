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
      'email': 'HERMES Guest',
      'writable_topics': ['hermes.test']
    },
    hermesUrl: '',
    csrf_token: '',
    mid_login: false
  },
  getters: {
    getMainData(state) {
      return state.main_data;
    },
    getExtraData(state) {
      return state.extra_data;
    },
    getMainTableName(state) {
      return state.name;
    },
    getMainTableHeader(state) {
      return state.header;
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
      return state.profile.email != 'HERMES Guest';
    }
  },
  plugins: [createPersistedState()],
  mutations: {
    SET_MAIN_DATA(state, main_data) {
      state.main_data = main_data;
    },
    SET_EXTRA_DATA(state, extra_data) {
      state.extra_data = extra_data;
    },
    SET_MAIN_TABLE_NAME(state, name) {
      state.name = name;
    },
    SET_MAIN_TABLE_HEADER(state, header) {
      state.header = header;
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
              "email": "HERMES Guest",
              "writable_topics": ["hermes.test"]
            });
          }
        });
    }
  },
  modules: {
  }
})
