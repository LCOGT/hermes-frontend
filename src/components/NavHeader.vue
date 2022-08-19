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
            <em v-if="username">{{username}}</em>
            <em v-else>User</em>
          </template>
          <b-dropdown-item v-if="!username" @click="authenticate">Log In</b-dropdown-item>
          <b-dropdown-item v-else @click="deauthenticate">Log Out</b-dropdown-item>
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
    console.log('mounted: this.$route: ')
    console.log(this.$route)
    if (this.$route.query.user){
      console.log(this.$route.query.user)
      this.$store.commit('SET_USER_NAME', this.$route.query.user)
      this.$router.replace({'query.user':null})
    }
    this.username = this.getUserName;
  },
  methods: {
    authenticate() {
      console.log("in authenticate....");
      location.href = getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "auth/authenticate/"

//      var csrf_token = '';
//  
//      axios({
//        method: 'get',
//        headers: {'Content-Type': 'application/json'},
//        url: getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "get-token/",
//      })
//      .then(function (response) {
//        // log response, redirect to homepage
//        console.log("authenticate:" + JSON.stringify(response.data));
//        csrf_token = response.data['token'];
//        //location.href = '/.html';
//      })
//
     const front_end_origin = 'http://127.0.0.1:8000';
     const back_end_origin = 'http://127.0.0.1:8001';
     console.log('front_end_origin: ' + front_end_origin);
     console.log('back_end_origin: ' + back_end_origin);

//      axios({
//        method: 'get',
//        headers: {'Content-Type': 'application/json',
//                  'Access-Control-Allow-Origin': front_end_origin,
//                  'X-CSRFToken': csrf_token},
//        url: getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "auth/authenticate/",
//      })
//      .then(function (response) {
//        // log response, redirect to homepage
//        console.log("authenticate then:" + JSON.stringify(response.data));
//        //location.href = '/.html';
//      })
//      .catch(function (error) {
//        console.log('authenticate catch: ')
//        console.log(error)
//      });
//

      console.log("leaving authenticate....");
    }, // authenticate
    deauthenticate() {
      console.log("in deauthenticate....");
      this.$store.commit('SET_USER_NAME', null);
      this.username = null;

      location.href = getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "auth/logout/"
      console.log("leaving deauthenticate....");
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
