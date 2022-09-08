<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand to="/"><img :src="require('@/assets/images/hermes_logo_white.png')" height="32px" width="32px"></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/">HERMES</b-nav-item>
          <b-nav-item to="/report-events">Submit New Non-localized Event</b-nav-item>
          <b-nav-item to="/report-candidates">Submit Candidates</b-nav-item>
          <b-nav-item to="/report-non-detections">Submit Non-Detections</b-nav-item>
          <b-nav-item to="/report-search">Submit Search Pointings</b-nav-item>
          <b-nav-item to="/report-photometry">Report Photometry</b-nav-item>
          <b-nav-item to="/report-spectroscopy">Report Spectroscopy</b-nav-item>
          <b-nav-item to="/report-availability">Report Observatory Availability</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
           <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>{{username}}</em>
          </template>
          <b-dropdown-item v-if="username === 'HERMES Guest'" @click="authenticate">Log In</b-dropdown-item>
          <b-dropdown-item v-else @click="deauthenticate">Log Out</b-dropdown-item>
          <b-dropdown-item v-if="username === 'HERMES Guest'" href="https://hop.scimma.org/" target="_blank" rel="noopener noreferrer">Register</b-dropdown-item>
        </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
//import axios from "axios";
import getEnv from "@/utils/env.js";
import { mapGetters } from "vuex";
export default {
  computed: {
      ...mapGetters(["getUserName"])
  },
  mounted() {
    // get CSRF token and store it for submission
    axios
      .get(getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "get-csrf-token")
      .then((response) => this.$store.commit('SET_CSRF_TOKEN', response.data['token']))
      .catch((error) => console.log(error));

    // Get username
    if (this.$route.query.user){
      this.$store.commit('SET_USER_NAME', this.$route.query.user)
      this.$router.replace({'query.user':null})
    }
    this.username = this.getUserName;
  },
  methods: {
    authenticate() {
      location.href = getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "auth/authenticate/"
    },

    deauthenticate() {
      this.$store.commit('SET_USER_NAME', 'HERMES Guest');
      this.username = 'HERMES Guest';

      location.href = getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "auth/logout/"
    }
  },
  data() {
    return {
      username: null
    };
  }
};
</script>

<style lang="scss" scoped>
#nav {a.router-link-exact-active {
  color: white;
};
width: 100%;
}

</style>
