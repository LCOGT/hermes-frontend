<template>
  <b-container>
    <b-alert :show="!isLoggedIn" variant="danger">
      <p>You must login to access your profile</p>
    </b-alert>
    <b-alert dismissible :variant="alertVariant" v-model="showAlert" @dismissed="showAlert=false">{{ alertMessage }}</b-alert>
    <b-row v-if="isLoggedIn">
      <b-col md="4" class="border-right">
        <h3 class="text-center">Writable Topics</h3>
        <b-form-textarea v-model="writableTopics" readonly rows="8">
        </b-form-textarea>
        <p class="pt-3">To add more writable topics, attach your
          <a class="text-secondary" href="https://my.hop.scimma.org/hopauth/">Scimma Auth</a> user account
          to more groups with the topic permissions you want, or manually add write permissions to your existing Hermes SCiMMA Auth credential.
        </p>
      </b-col>
      <b-col md="4" class="border-right">
        <h3 class="text-center">API Key</h3>
        <p>
          The following key may be used to authenticate when using the
          <a class="text-secondary" :href="this.getHermesUrl + 'api/v0/'">Hermes API</a>. This key should be treated like a password.
        </p>
        <input class="form-control" :value="getProfile.api_token" onclick="this.select()" readonly />
        <p class="pt-3">
          If you think your API token may have been compromised (by accidentally checking it in to a public source code
          repository, emailing it out, etc) you may revoke the token to obtain a new one using the button below.
        </p>
        <p>
          <b>WARNING</b>: This will cause any applications that use this token to stop working!
        </p>
        <div class="text-center">
          <b-button variant="danger" @click="performRevokeToken">
            Revoke Token
          </b-button>
        </div>
      </b-col>
      <b-col md="4">
        <h3 class="text-center">SCiMMA Auth Credential</h3>
        <p>
          The following credential name was created and is used by Hermes for all authenication with SCiMMA Auth.
        </p>
        <input class="form-control" :value="getProfile.credential_name" onclick="this.select()" readonly />
        <p class="pt-3">
          If you believe this credential has been compromised, or is not working properly, you may destroy the credential
          by clicking below. This will cause Hermes to regenerate a new SCiMMA Auth credential for your account. The initial permissions
          on the credential are set using your SCiMMA Auth user accounts various group permissions.
        </p>
        <div class="text-center">
          <b-button variant="danger" @click="performRevokeCredential">
            Revoke Credential
          </b-button>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="isLoggedIn">
      <b-col md="4" class="border-right border-top pt-4">
        <h3 class="text-center">GCN Authorization</h3>
        <p>
          To submit messages to GCN Circulars, you must have a valid <a class="text-secondary" href="https://gcn.nasa.gov/">NASA GCN</a> account
          with GCN Circular <a class="text-secondary" href="https://gcn.nasa.gov/docs/circulars/submitting#become-a-gcn-circulars-submitter">submission privileges</a>.
          Click below to authorize hermes to submit to GCN on your behalf with your GCN account credentials.
          <ul class="pl-4">
            <li>You <b>must</b> use the same identity provider you originally created your GCN account with.</li>
            <li>You <b>must</b> re-authorize your account after making changes or adding permissions at GCN.</li>
          </ul>
        </p>
        <div v-html="gcnAuthorizationText"></div><br />
        <div class="text-center">
          <b-button variant="info" @click="authorizeGcn">
            Authorize GCN
          </b-button>
        </div>
      </b-col>
      <b-col md="4" class="border-top pt-4">
        <h3 class="text-center">TNS Bot Credentials</h3>
        <p>
          By default, TNS submissions will use the built-in <b>Hermes_bot</b>. This bot only has permissions to report to the TNS from the <b>Hermes_group</b>.
          You can override this behaviour and submit with your own TNS Bot credentials by adding then to your profile
          here or via the api.
        </p>
        <div v-html="botOverrideText"></div><br />
        <b-form>
          <b-form-input class="mb-1" v-model="tns_form.bot_id" type="number" placeholder="Enter your TNS Bot ID"></b-form-input>
          <b-form-input class="mb-1" v-model="tns_form.bot_name" placeholder="Enter your TNS Bot Name"></b-form-input>
          <b-form-input class="mb-1" v-model="tns_form.bot_api_token" placeholder="Enter your TNS Bot API Token"></b-form-input>
          <div class="mt-4">
            <b-button class="mr-2" variant="danger" @click="performRevokeBotCredentials">
              <b-spinner small v-if="updatingBotCredentials"></b-spinner>
              Revoke Credentials
            </b-button>
            <b-button variant="success" @click="performUpdateBotCredentials" :disabled="!canSetTNSCredentials">
              <b-spinner small v-if="updatingBotCredentials"></b-spinner>
              Set Credentials
            </b-button>
          </div>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>

import { mapGetters } from "vuex";
import axios from "axios";
import { logoutMixin } from '@/mixins/logoutMixin.js';

export default {
  name: 'ProfileView',
  mixins: [logoutMixin],
  data: function () {
    return {
      alertMessage: null,
      showAlert: false,
      alertVariant: 'warning',
      tns_form: {
        'bot_id': null,
        'bot_name': null,
        'bot_api_token': null
      },
      updatingBotCredentials: false,
      revokingCredential: false,
      revokingApiToken: false
    };
  },
  mounted() {
    if (this.$route.query.alert){
      this.alertMessage = this.$route.query.alert;
      this.alertVariant = 'danger';
      this.showAlert = true;
    }
    // I think its reasonable to trigger a refresh of the profile data when you hit the /profile view.
    this.$store.dispatch('getProfileData');
    if (this.getProfile) {
      this.setTnsBotId(this.getProfile.tns_bot_id);
      this.setTnsBotName(this.getProfile.tns_bot_name);
    }
  },
  watch: {
    "this.getProfile.tns_bot_id": function(value) {
      this.setTnsBotId(value);
    },
    "this.getProfile.tns_bot_name": function(value) {
      this.setTnsBotName(value);
    }
  },
  computed: {
    ...mapGetters(["getProfile", "getCsrfToken", "isLoggedIn", "getHermesUrl"]),
    writableTopics: function() {
      return this.getProfile.writable_topics.join('\n');
    },
    isGcnAuthorized: function() {
      return this.getProfile.integrated_apps.includes('GCN');
    },
    canSubmitToGcn: function() {
      return this.getProfile.can_submit_to_gcn;
    },
    gcnAuthorizationText: function() {
      if (this.isGcnAuthorized) {
        if (this.canSubmitToGcn) {
          return 'Current Status: <font color="green">Connected / Permitted</font>'
        }
        else {
          return 'Current Status: <font color="darkorange" title="Please check your GCN accounts peer endorsements to make sure you have GCN Circular submission privileges">Connected / Not Permitted</font>'
        }
      }
      else {
        return 'Current Status: <font color="red" title="You must authorize your GCN account">Not Connected</font>'
      }
    },
    tnsBotCredentialsSet: function() {
      return this.getProfile.integrated_apps.includes('TNS');
    },
    canSetTNSCredentials: function() {
      if (this.tns_form.bot_id && this.tns_form.bot_name && this.tns_form.bot_api_token) {
        return true;
      }
      return false;
    },
    botOverrideText: function() {
      if (this.tnsBotCredentialsSet) {
        return 'Current Status: <font color="green">Bot Override Set</font>';
      }
      else {
        return 'Current Status: <font color="red">No Bot Override Set</font>';
      }
    },
    alertText: function() {
      return this.$route.query.alert;
    }
  },
  methods: {
    setTnsBotId: function(value) {
      if (value != -1) {
        this.tns_form.bot_id = value;
      }
    },
    setTnsBotName: function(value) {
      if (value != '') {
        this.tns_form.bot_name = value;
      }
    },
    authorizeGcn: function(evt) {
      evt.preventDefault();
      location.href =
        this.getHermesUrl + "gcn-auth/login";
    },
    performRevokeToken: function (evt) {
      evt.preventDefault();
      axios({
        method: 'post',
        withCredentials: true,
        // TODO: see if Vue.js can add the X-CSRFToken to all headers automagically
        headers: {'Content-Type': 'application/json',
                  'X-CSRFToken': this.getCsrfToken
                  },
        url: new URL('/api/v0/revoke_api_token/', this.getHermesUrl).href,
      })
      .then(() => {
        this.$store.dispatch('getProfileData');
        this.alertMessage = 'Token Successfully Revoked!';
        this.alertVariant = 'warning';
        this.showAlert = true;
      })
      .catch(error => {
        console.log(error);
        if (error.response.status == 401){
          this.logout();
        }
      });
    },
    performRevokeCredential: function (evt) {
      evt.preventDefault();
      axios({
        method: 'post',
        withCredentials: true,
        // TODO: see if Vue.js can add the X-CSRFToken to all headers automagically
        headers: {'Content-Type': 'application/json',
                  'X-CSRFToken': this.getCsrfToken
                  },
        url: new URL('/api/v0/revoke_hop_credential/', this.getHermesUrl).href,
      })
      .then(() => {
        this.$store.dispatch('getProfileData');
        this.alertMessage = 'Hop Credentials Successfully Revoked!';
        this.alertVariant = 'warning';
        this.showAlert = true;
      })
      .catch(error => {
        console.log(error);
        if (error.response.status == 401){
          this.logout();
        }
      });
    },
    performRevokeBotCredentials: function(evt) {
      evt.preventDefault();
      this.tns_form.bot_id = null;
      this.tns_form.bot_name = null;
      this.tns_form.bot_api_token = null;
      this.updateTNSBotCredentials('TNS Bot Credentials Successfully Revoked!');
    },
    performUpdateBotCredentials: function(evt) {
      evt.preventDefault();
      this.updateTNSBotCredentials('TNS Bot Credentials Successfully Updated!');
    },
    updateTNSBotCredentials(success_message) {
      this.updatingBotCredentials = true;
      var tns_data = {
        'tns_bot_id': this.tns_form.bot_id || -1,
        'tns_bot_name': this.tns_form.bot_name || '',
        'tns_bot_api_token': this.tns_form.bot_api_token || ''
      };
      axios({
        method: 'patch',
        withCredentials: true,
        // TODO: see if Vue.js can add the X-CSRFToken to all headers automagically
        headers: {'Content-Type': 'application/json',
                  'X-CSRFToken': this.getCsrfToken
                  },
        url: new URL('/api/v0/profile/', this.getHermesUrl).href,
        data: tns_data
      })
      .then(() => {
        this.$store.dispatch('getProfileData');
        this.alertMessage = success_message;
        this.alertVariant = 'warning';
        this.showAlert = true;
        this.updatingBotCredentials = false;
      })
      .catch(error => {
        console.log(error);
        this.updatingBotCredentials = false;
        if (error.response.status == 401){
          this.logout();
        }
        else {
          this.alertMessage = error.response.data;
          this.alertVariant = 'danger';
          this.showAlert = true;
        }
      });
    }
  }
};
</script>
  