import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    main_data: [],
    extra_data: [],
    telescope_events: [],
  },
  getters: {
    getMainData(state) {
      return state.main_data;
    },
    getExtraData(state) {
      return state.extra_data;
    },
    getTelescopeEvents(state){
      return state.telescope_events;
    }
  },
  mutations: {
    SET_MAIN_DATA(state, main_data) {
      state.main_data = main_data;
    },
    SET_EXTRA_DATA(state, extra_data) {
      state.extra_data = extra_data;
    },
    SET_TELESCOPE_EVENTS(state, telescope_events) {
      state.telescope_events = telescope_events;
    }
  },
  actions: {
  },
  modules: {
  }
})
