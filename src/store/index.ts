import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    candidates: [],
    extra_data: [],
  },
  getters: {
    getCandidates(state) {
      return state.candidates;
    },
    getExtraData(state) {
      return state.extra_data;
    }
  },
  mutations: {
    SET_CANDIDATES(state, candidates) {
      state.candidates = candidates;
    },
    SET_EXTRA_DATA(state, extra_data) {
      state.extra_data = extra_data;
    }
  },
  actions: {
  },
  modules: {
  }
})
