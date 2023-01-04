import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    main_data: [],
    extra_data: [],
    name: '',
    header: '',
    username: 'HERMES Guest',
    writable_topics: ['hermes.test'],
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
    getUserName(state) {
      return state.username;
    },
    getWritableTopics(state) {
      return state.writable_topics;
    },
    getCsrfToken(state) {
      return state.csrf_token;
    },
    getMidLogin(state) {
      return state.mid_login;
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
    SET_USER_NAME(state, username) {
      state.username = username;
    },
    SET_WRITABLE_TOPICS(state, writable_topics) {
      state.writable_topics = writable_topics;
    },
    SET_CSRF_TOKEN(state, csrf_token) {
      state.csrf_token = csrf_token;
    },
    SET_MID_LOGIN(state, mid_login) {
      state.mid_login = mid_login;
    }
  },
  actions: {
  },
  modules: {
  }
})
