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
            <b-dropdown-item
              v-if="username === 'HERMES Guest'"
              @click="authenticate"
              >Log In</b-dropdown-item
            >
            <b-dropdown-item v-else @click="deauthenticate"
              >Log Out</b-dropdown-item
            >
            <b-dropdown-item
              v-if="username === 'HERMES Guest'"
              @click="authenticate"
              >Register</b-dropdown-item
            >
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
import axios from "axios";

export default {
  computed: {
    ...mapGetters(["getUserName", "getCsrfToken", "getMidLogin"]),
  },
  mounted() {
    // get CSRF token and store it for submission
    axios
      .get(getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "get-csrf-token/")
      .then((response) =>
        this.$store.commit("SET_CSRF_TOKEN", response.data["token"])
      )
      .catch((error) => console.log(error));

    // If this is the first refresh after a login workflow, attempt to get the profile data and store it
    if (this.getMidLogin) {
      axios
        .get(getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "api/v0/profile/", {
          withCredentials: true,
        })
        .then((response) => {
          this.$store.commit("SET_USER_NAME", response.data["email"]);
          this.$store.commit(
            "SET_WRITABLE_TOPICS",
            response.data["writable_topics"]
          );
          this.$store.commit("SET_MID_LOGIN", false);
          this.username = this.getUserName;
        })
        .catch((error) => console.log(error));
    }
    this.username = this.getUserName;
  },
  methods: {
    authenticate() {
      this.$store.commit("SET_MID_LOGIN", true);
      location.href =
        getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "auth/authenticate/";
    },

    deauthenticate() {
      this.$store.commit("SET_USER_NAME", "HERMES Guest");
      this.$store.commit("SET_MID_LOGIN", false);
      this.$store.commit("SET_WRITABLE_TOPICS", ["hermes.test"]);
      this.username = "HERMES Guest";
      location.href =
        getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "auth/logout/";
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
