

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import _ from 'lodash';
import { useLogout } from '@/utils/logout.js';
import { useStateStore } from '@/stores/state'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'

const { logout } = useLogout();
const stateStore = useStateStore()
const route = useRoute()

const username = ref(null)
const heartbeat_data = ref(null)

const streamState = computed(() => {
  if (_.isNil(heartbeat_data.value)){
    // If we can't access the endpoint to get stream heartbeat data, report warning
    return "warning";
  }
  let maxOutOfDate = 0;
  _.forEach(heartbeat_data, function(value, _key) {
    let date = Date.parse(value);
    if (_.isNaN(date)) {
      maxOutOfDate = 9999999;
    }
    else {
      maxOutOfDate = Math.max(maxOutOfDate, (new Date() - date) / 60000);
    }
  });
  if (maxOutOfDate > 15) {
    // If there is a stream that is more than 15 minutes old, report error color
    return "red";
  }
  return "success";
  
})

const streamStateText = computed(() => {
  if (_.isNil(heartbeat_data.value)){
    // If we can't access the endpoint to get stream heartbeat data, report warning
    return "Stream state unknown";
  }
  let text = "";
  _.forEach(heartbeat_data.value, function(value, key) {
    let date = Date.parse(value);
    let minutesOld = 0;
    let textClass = 'text-success';
    if (_.isNaN(date)) {
      minutesOld = date;
      textClass = 'text-error';
    }
    else {
      minutesOld = (new Date() - date) / 60000;
      if (minutesOld > 15) {
        textClass = "text-error"
      }
    }

    text += '<p class="' + textClass + '"><strong>' + _.capitalize(key) + '</strong>: ' + (_.isNaN(minutesOld) ? 'NaN' : minutesOld.toFixed(2)) + ' minutes old</p>';
  });
  return text;
})

onMounted(async () => {
  // get CSRF token and store it for submission
  fetch(stateStore.hermesUrl + "get-csrf-token/", {
    method: 'GET',
    credentials: 'include'
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
    stateStore.csrf_token = data["token"]
  })
  .catch((error) => {
    console.log(error);
    if (error.response.status == 401){
        deauthenticate();
      }
  });
  stateStore.getTopicOptions();
  stateStore.getTNSOptions();

  checkHeartbeat();

  // If this is the first refresh after a login workflow, attempt to get the profile data and store it
  if (stateStore.mid_login) {
    await stateStore.getProfileData();
  }
  username.value = stateStore.profile.email;
})

watch(() => stateStore.profile?.email), () => {
  username.value = stateStore.profile.email;
}

watch(() => route), () => {
  checkHeartbeat();
}

function authenticate() {
  stateStore.mid_login = true;
  location.href = stateStore.hermesUrl + "auth/authenticate/";
}

function deauthenticate() {
  logout();
  location.href = stateStore.hermesUrl + "auth/logout/";
}

function checkHeartbeat() {
  // Attempt to get the last updated time for the various datastreams and display a marker and tooltip based on that
  fetch(stateStore.hermesUrl + "api/v0/heartbeat/", {
    method: 'GET',
    credentials: 'include'
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
    heartbeat_data.value = data.last_timestamps;
    if (stateStore.userIsAuthenticated && !data.is_authenticated) {
      logout()
    }
  })
  .catch((error) => {
    console.log(error);
    if (error.response.status == 401){
      deauthenticate();
    }
  });
}

</script>
<template>
  <v-app-bar>
    <img
        src='@/assets/images/hermes_logo_white.png'
        height="32px"
        width="32px"
      ></img>
    <v-app-bar-title>
      HERMES     
    </v-app-bar-title>
    <template v-slot:append>
      <router-link
        to="/?limit=10"
        class="navbar-item"
      >
        <v-icon class="pr-2 pb-1" icon="mdi-home" size="small"></v-icon>
        Browse
      </router-link>
      <router-link
        to="/submit-message"
        class="navbar-item"
      >
        <v-icon class="pr-2 pb-1" icon="mdi-text-box-outline" size="small"></v-icon>
        Submit Message
      </router-link>
      <v-spacer class="mr-10 ml-10"></v-spacer>
      <v-tooltip location="bottom">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="d-inline-block">
            <v-btn :disabled="true">
              Stream Status:
              <template v-slot:append>
                <v-icon :color="streamState" icon="mdi-circle" size="large"></v-icon>
              </template>
            </v-btn>
          </div>
        </template>
        <span v-html="streamStateText"></span>
      </v-tooltip>
      <router-link
        to="/about"
        class="navbar-item"
      >
        <v-icon class="pr-2 pb-1" icon="mdi-information-outline" size="small"></v-icon>
        About
      </router-link>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn variant="text" v-bind="props">
            {{ stateStore.profile?.email }}
            <template v-slot:prepend>
              <v-icon icon="mdi-account" :color="stateStore.userIsAuthenticated ? 'success': 'text'"></v-icon>
            </template>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="stateStore.userIsAuthenticated">
            <v-btn
              to="/profile"
              style="width:100%;"
            >
              <v-icon class="pr-2 pb-1" icon="mdi-account" size="small"></v-icon>
              Profile
          </v-btn>
          </v-list-item>
          <v-list-item v-if="stateStore.userIsAuthenticated">
            <v-btn prepend-icon="mdi-logout" @click="deauthenticate()" style="width:100%;">Logout</v-btn>
          </v-list-item>
          <v-list-item v-if="!stateStore.userIsAuthenticated">
            <v-btn @click="authenticate()" style="width:100%;">Login</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
 </template>

<style scoped>

.v-app-bar-title {
  max-width: 180px;
}

.navbar-item {
  width: 180px;
  text-align:center;
}
</style>
