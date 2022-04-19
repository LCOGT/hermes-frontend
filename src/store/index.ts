import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    candidates: [],
    candidate_extra_data: [],
  },
  getters: {
    getCandidates(state) {
      return state.candidates;
    },
    getCandidateExtraData(state) {
      return state.candidate_extra_data;
    }
  },
  mutations: {
    SET_CANDIDATES(state, candidates) {
      state.candidates = candidates;
    },
    SET_CANDIDATE_EXTRA_DATA(state, candidate_extra_data) {
      state.candidate_extra_data = candidate_extra_data;
    }
  },
  actions: {
  },
  modules: {
  }
})
