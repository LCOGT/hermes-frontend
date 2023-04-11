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
import { mapGetters } from "vuex";
import axios from "axios";
import { logoutMixin } from '@/mixins/logoutMixin.js';

export default {
  mixins: [logoutMixin],
  computed: {
    ...mapGetters(["getProfile", "getCsrfToken", "getMidLogin", "isLoggedIn", "getHermesUrl"]),
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
  },
  data() {
    return {
      username: null,
    };
  },
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
