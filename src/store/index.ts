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
    username: ''
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
  },
  actions: {
  },
  modules: {
  }
})
