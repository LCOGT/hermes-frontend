<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="primary" class="shadow-sm">
      <b-navbar-brand to="/"
        ><img
          :src="require('@/assets/images/hermes_logo_white.png')"
          height="32px"
          width="32px"
      /> HERMES
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item class="ml-4" to="/?limit=10">Browse</b-nav-item>
          <b-nav-item class="ml-4" to="/submit-message">Submit Message</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item disabled v-b-tooltip.hover.html="streamStateText">
            Stream Status:
            <b-icon icon="circle-fill" :variant="streamState"></b-icon>
          </b-nav-item>
          <b-nav-item to="/about">About</b-nav-item>
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>{{ username }}</em>
            </template>
            <b-dropdown-item v-if="isLoggedIn" to="/profile">
              Profile
            </b-dropdown-item>
            <b-dropdown-item v-if="!isLoggedIn" @click="authenticate">
              Log In
            </b-dropdown-item>
            <b-dropdown-item v-else @click="deauthenticate">
              Log Out
            </b-dropdown-item>
            <b-dropdown-item v-if="!isLoggedIn" @click="authenticate">
              Register
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from "vuex";
import axios from "axios";
import { logoutMixin } from '@/mixins/logoutMixin.js';

export default {
  mixins: [logoutMixin],
  data() {
    return {
      username: null,
      heartbeat_data: null
    };
  },
  computed: {
    ...mapGetters(["getProfile", "getCsrfToken", "getMidLogin", "isLoggedIn", "getHermesUrl"]),
    streamState() {
      if (_.isNil(this.heartbeat_data)){
        // If we can't access the endpoint to get stream heartbeat data, report warning
        return "warning";
      }
      let maxOutOfDate = 0;
      _.forEach(this.heartbeat_data, function(value, _key) {
        let date = Date.parse(value);
        maxOutOfDate = Math.max(maxOutOfDate, (new Date() - date) / 60000);
      });
      if (maxOutOfDate > 15) {
        // If there is a stream that is more than 15 minutes old, report danger
        return "danger";
      }
      return "success";
    },
    streamStateText() {
      if (_.isNil(this.heartbeat_data)){
        // If we can't access the endpoint to get stream heartbeat data, report warning
        return "Stream state unknown";
      }
      let text = "";
      _.forEach(this.heartbeat_data, function(value, key) {
        let date = Date.parse(value);
        let minutesOld = (new Date() - date) / 60000;
        let textClass = 'text-success';
        if (minutesOld > 15) {
          textClass = "text-danger"
        }
        text += '<p class="' + textClass + '"><strong>' + _.capitalize(key) + '</strong>: ' + minutesOld.toFixed(2) + ' minutes old</p>';
      });
      return text;
    }
  },
  mounted() {
    // get CSRF token and store it for submission
    axios
      .get(this.getHermesUrl + "get-csrf-token/", {
          withCredentials: true,
        })
      .then((response) =>
        this.$store.commit("SET_CSRF_TOKEN", response.data["token"])
      )
      .catch((error) => {
        console.log(error);
        if (error.response.status == 401){
          this.deauthenticate();
        }
    });

    // If this is the first refresh after a login workflow, attempt to get the profile data and store it
    if (this.getMidLogin) {
      this.$store.dispatch('getProfileData');
    }
    this.username = this.getProfile.email;

    // Attempt to get the last updated time for the various datastreams and display a marker and tooltip based on that
    axios
      .get(this.getHermesUrl + "api/v0/heartbeat/", {
          withCredentials: true,
        })
      .then((response) =>
        this.heartbeat_data = response.data
      )
      .catch((error) => {
        console.log(error);
        if (error.response.status == 401){
          this.deauthenticate();
        }
    });
  },
  watch: {
    "getProfile.email": function(value) {
      this.username = value;
    }
  },
  methods: {
    authenticate() {
      this.$store.commit("SET_MID_LOGIN", true);
      location.href =
        this.getHermesUrl + "auth/authenticate/";
    },
    deauthenticate() {
      this.logout();
      location.href =
        this.getHermesUrl + "auth/logout/";
    },
  }
};
</script>

<style lang="scss" scoped>
#nav {
  a.router-link-active {
    color: white;
    font-weight: bolder;
  }
  width: 100%;
}
</style>
