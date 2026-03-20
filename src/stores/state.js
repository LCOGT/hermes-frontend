import { defineStore } from 'pinia'

/*
  This store manages user data and preferences.
  Persisted between reloads using pinia-plugin-persistedstate.
  It includes authentication details, user profile information, and UI preferences.
*/

export const useStateStore = defineStore('state', {
  state: () => ({
    main_data: [],
    extra_data: [],
    name: '',
    header: '',
    profile: {
      'email': '',
      'writable_topics': ['hermes.test']
    },
    hermesUrl: 'http://127.0.0.1:8000/',
    csrf_token: '',
    tns_options: {},
    mid_login: false,
    topic_options: []
  }),
  persist: true,
  getters: {
    userIsAuthenticated: (state) => {
      return 'api_token' in state.profile
    },
    isProd: (state) => {
      return state.hermesUrl == "https://hermes.lco.global/"
    },
    tnsBot: (state) => {
      return state.profile.tns_bot_name ? state.profile.tns_bot_name + " Bot" : 'Hermes Bot'
    },
    isHermesBot: (state) => {
      return !state.profile.tns_bot_name
    },
    canSubmitToGcn: (state) => {
      return state.profile.can_submit_to_gcn ? state.profile.can_submit_to_gcn : false
    },
  },
  actions: {
    async getProfileData() {
      fetch(this.hermesUrl + "api/v0/profile/", {
        credentials: 'include',
        method: 'get'
      })
      .then((response) => {
        if (!response.ok) {
          let error = new Error("HTTP " + response.status);
          error.response = response;
          error.status = response.status;
          throw error;
        }
        return response.json();
      })
      .then(data => {
          this.profile = data
          this.mid_login = false
        })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 401){
          this.mid_login = false
          this.clearProfile()
        }
      });
    },
    async getTopicOptions() {
      fetch(this.hermesUrl + "api/v0/topics/", {
        credentials: 'include',
        method: 'get',
      })
      .then((response) => {
        if (!response.ok) {
          let error = new Error("HTTP " + response.status);
          error.response = response;
          error.status = response.status;
          throw error;
        }
        return response.json();
      })
      .then(data => {
        this.topic_options = data.topics;
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 401){
          logout()
        }
      });
    },
    async getTNSOptions() {
      fetch(this.hermesUrl + "api/v0/tns_options/", {
        credentials: 'include',
        method: 'get',
      })
      .then((response) => {
        if (!response.ok) {
          let error = new Error("HTTP " + response.status);
          error.response = response;
          error.status = response.status;
          throw error;
        }
        return response.json();
      })
      .then(data => {
        this.tns_options = data;
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 401){
          logout()
        }
      });
    },
    clearProfile() {
      this.profile = {'email': '', 'writable_topics': ['hermes.test']}
    }
  }
})
