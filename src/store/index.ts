import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    candidates: [],
    extra_data: [],
    telescope_events: [],
  },
  getters: {
    getCandidates(state) {
      return state.candidates;
    },
    getExtraData(state) {
      return state.extra_data;
    },
    getTelescopeEvents(state){
      return state.telescope_events;
    }
  },
  mutations: {
    SET_CANDIDATES(state, candidates) {
      state.candidates = candidates;
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
