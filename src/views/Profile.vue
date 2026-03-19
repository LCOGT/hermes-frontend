<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStateStore } from '@/stores/state';
import { useLogout } from '@/utils/logout.js';

const { logout } = useLogout();
const route = useRoute()
const stateStore = useStateStore()

const alertMessage = ref('')
const showAlert =  ref(false)
const alertVariant = ref('warning')
const tns_form = ref({
  'bot_id': null,
  'bot_name': null,
  'bot_api_token': null
})
const updatingBotCredentials = ref(false)
const updatingDefaultTopicsList = ref(false)
const copySnack = ref(false)
const defaultSelectedTopics = ref([]);
const revokingCredential = ref(false)
const revokingApiToken =  ref(false)

onMounted(async () => {
  if (route.query.alert){
    alertMessage.value = route.query.alert;
    alertVariant.value = 'error';
    showAlert.value = true;
  }
  // I think its reasonable to trigger a refresh of the profile data when you hit the /profile view.
  await stateStore.getProfileData();
  if (stateStore.userIsAuthenticated) {
    setTnsBotId(stateStore.profile?.tns_bot_id);
    setTnsBotName(stateStore.profile?.tns_bot_name);
    defaultSelectedTopics.value = reconcileSelectedTopics();
  }
})

watchEffect(() => stateStore.profile?.tns_bot_id), () => {
  setTnsBotId(stateStore.profile?.tns_bot_id);
}
watchEffect(() => stateStore.profile?.tns_bot_name), () => {
  setTnsBotName(stateStore.profile?.tns_bot_name);
}

const defaultTopicsChanged = computed(() => {
  let currentSet = new Set(defaultSelectedTopics.value);
  let newSet = new Set(stateStore.profile.default_topics_list)
  return currentSet.size != newSet.size || !currentSet.isSubsetOf(newSet);
})

const defaultTopicsChangedMessage = computed(() => {
  if (defaultTopicsChanged.value) {
    return 'Topics have changed! Click the button below to save the change.';
  }
  else {
    return '';
  }
})
  
const writableTopics = computed(() => {
  return stateStore.profile.writable_topics.join('\n');
})

const isGcnAuthorized = computed(() => {
  return stateStore.profile.integrated_apps.includes('GCN');
})
    
const canSubmitToGcn = computed(() => {
  return stateStore.profile.can_submit_to_gcn;
})  
    
const gcnAuthorizationText = computed(() => {
  if (isGcnAuthorized.value) {
    if (canSubmitToGcn.value) {
      return 'Current Status: <font color="green">Connected / Permitted</font>'
    }
    else {
      return 'Current Status: <font color="darkorange" title="Please check your GCN accounts peer endorsements to make sure you have GCN Circular submission privileges">Connected / Not Permitted</font>'
    }
  }
  else {
    return 'Current Status: <font color="red" title="You must authorize your GCN account">Not Connected</font>'
  }
}) 
    
const tnsBotCredentialsSet = computed(() => {
  return stateStore.profile.integrated_apps.includes('TNS');
})
    
const canSetTNSCredentials = computed(() => {
  if (tns_form.value.bot_id && tns_form.value.bot_name && tns_form.value.bot_api_token) {
    return true;
  }
  return false;
})
    
const botOverrideText = computed(() => {
  if (tnsBotCredentialsSet.value) {
    return 'Current Status: <font color="green">Bot Override Set</font>';
  }
  else {
    return 'Current Status: <font color="red">No Bot Override Set</font>';
  }
})

function reconcileSelectedTopics() {
  return stateStore.profile.default_topics_list.filter(element => stateStore.topic_options.includes(element));
}

function setTnsBotId(value) {
  if (value != -1) {
    tns_form.value.bot_id = value;
  }
}
    
function setTnsBotName(value) {
  if (value != '') {
    tns_form.value.bot_name = value;
  }
}
    
function authorizeGcn(evt) {
  evt.preventDefault();
  location.href =
    stateStore.hermesUrl + "gcn-auth/login";
}
    
async function performRevokeToken() {
  revokingApiToken.value = true;
  let url = new URL('/api/v0/revoke_api_token/', stateStore.hermesUrl).href
  fetch(url, {
    method: 'post',
    headers: {'Content-Type': 'application/json',
              'X-CSRFToken': stateStore.csrf_token
              },
    credentials: 'include',
  })
  .then((response) => {
    if (!response.ok) {
      let error = new Error("HTTP " + response.status);
      error.response = response;
      error.status = response.status;
      throw error;
    }
    stateStore.getProfileData();
    alertMessage.value = 'Token Successfully Revoked!';
    alertVariant.value = 'success';
    showAlert.value = true;
    revokingApiToken.value = false;
  })
  .catch((error) => {
    console.log(error);
    revokingApiToken.value = false;
    if (error.response.status == 401){
      logout();
    }
  });
}
    
async function performRevokeCredential() {
  revokingCredential.value = true;
  let url = new URL('/api/v0/revoke_hop_credential/', stateStore.hermesUrl).href
  fetch(url, {
    method: 'post',
    headers: {'Content-Type': 'application/json',
              'X-CSRFToken': stateStore.csrf_token
              },
    credentials: 'include',
  })
  .then((response) => {
    if (!response.ok) {
      let error = new Error("HTTP " + response.status);
      error.response = response;
      error.status = response.status;
      throw error;
    }
    stateStore.getProfileData();
    alertMessage.value = 'Hop Credentials Successfully Revoked!';
    alertVariant.value = 'success';
    revokingCredential.value = false;
    showAlert.value = true;
  })
  .catch((error) => {
    console.log(error);
    revokingCredential.value = false;
    if (error.response.status == 401){
      logout();
    }
  });
}
    
function performRevokeBotCredentials(evt) {
  evt.preventDefault();
  tns_form.value.bot_id = null;
  tns_form.value.bot_name = null;
  tns_form.value.bot_api_token = null;
  updateTNSBotCredentials('TNS Bot Credentials Successfully Revoked!');
}

function performUpdateBotCredentials(evt) {
  evt.preventDefault();
  updateTNSBotCredentials('TNS Bot Credentials Successfully Updated!');
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    copySnack.value = true;
  } catch (err) {
    console.error('Failed to copy')
  }
}

async function updateDefaultTopicsList() {
  updatingDefaultTopicsList.value = true;
  var topic_update = {
    'default_topics_list': defaultSelectedTopics.value
  };
  let url = new URL('/api/v0/profile/', stateStore.hermesUrl).href
  fetch(url, {
    mode: 'cors',
    method: 'patch',
    headers: {'Content-Type': 'application/json',
              'X-CSRFToken': stateStore.csrf_token
              },
    credentials: 'include',
    body: JSON.stringify(topic_update)
  })
  .then((response) => {
    if (!response.ok) {
      let error = new Error("HTTP " + response.status);
      error.response = response;
      error.status = response.status;
      throw error;
    }
    stateStore.getProfileData();
    alertMessage.value = 'Default Topics List Successfully Updated!';
    alertVariant.value = 'success';
    showAlert.value = true;
    updatingDefaultTopicsList.value = false;
  })
  .catch((error) => {
    console.log(error);
    updatingDefaultTopicsList.value = false;
    if (error.response.status == 401){
      logout();
    }
    else {
      alertMessage.value = error.response.data;
      alertVariant.value = 'error';
      showAlert.value = true;
    }
  });
}

async function updateTNSBotCredentials(success_message) {
  updatingBotCredentials.value = true;
  var tns_data = {
    'tns_bot_id': tns_form.value.bot_id || -1,
    'tns_bot_name': tns_form.value.bot_name || '',
    'tns_bot_api_token': tns_form.value.bot_api_token || ''
  };
  let url = new URL('/api/v0/profile/', stateStore.hermesUrl).href
  fetch(url, {
    mode: 'cors',
    method: 'patch',
    headers: {'Content-Type': 'application/json',
              'X-CSRFToken': stateStore.csrf_token
              },
    credentials: 'include',
    body: JSON.stringify(tns_data)
  })
  .then((response) => {
    if (!response.ok) {
      let error = new Error("HTTP " + response.status);
      error.response = response;
      error.status = response.status;
      throw error;
    }
    stateStore.getProfileData();
    alertMessage.value = success_message;
    alertVariant.value = 'success';
    showAlert.value = true;
    updatingBotCredentials.value = false;
  })
  .catch((error) => {
    console.log(error);
    updatingBotCredentials.value = false;
    if (error.response.status == 401){
      logout();
    }
    else {
      alertMessage.value = error.response.data;
      alertVariant.value = 'error';
      showAlert.value = true;
    }
  });
}

</script>
<template>
  <v-container>
    <v-snackbar v-model="copySnack" timeout="2000" color="success">Copied!</v-snackbar>
    <v-alert v-if="!stateStore.userIsAuthenticated" type="warning">
      <p>You must login to access your profile</p>
    </v-alert>
    <v-alert closable :type="alertVariant" v-model="showAlert" @dismissed="showAlert.value=false">{{ alertMessage }}</v-alert>
    <v-row v-if="stateStore.userIsAuthenticated">
      <v-col md="4" class="border-md">
        <h3 class="text-center">Writable Topics</h3>
        <v-textarea v-model="writableTopics" readonly rows="8">
        </v-textarea>
        <p class="pt-3">To add more writable topics, attach your
          <a class="text-secondary" href="https://my.hop.scimma.org/hopauth/">Scimma Auth</a> user account
          to more groups with the topic permissions you want, or manually add write permissions to your existing Hermes SCiMMA Auth credential.
        </p>
      </v-col>
      <v-col md="4" class="border-md">
        <h3 class="text-center">API Key</h3>
        <p>
          The following key may be used to authenticate when using the
          <a class="text-secondary" :href="stateStore.hermesUrl + 'api/v0/'">Hermes API</a>. This key should be treated like a password.
        </p>
        <v-text-field :model-value="stateStore.profile?.api_token" @click="copyText(stateStore.profile?.api_token)" readonly />
        <p class="pt-3">
          If you think your API token may have been compromised (by accidentally checking it in to a public source code
          repository, emailing it out, etc) you may revoke the token to obtain a new one using the button below.
        </p>
        <p>
          <b>WARNING</b>: This will cause any applications that use this token to stop working!
        </p>
        <div class="text-center mt-2">
          <v-btn color="error" @click="performRevokeToken">
            <v-progress-circular v-if="revokingApiToken" color="primary" size="16" indeterminate></v-progress-circular>
            Revoke Token
          </v-btn>
        </div>
      </v-col>
      <v-col md="4" class="border-md">
        <h3 class="text-center">SCiMMA Auth Credential</h3>
        <p>
          The following credential name was created and is used by Hermes for all authenication with SCiMMA Auth.
        </p>
        <v-text-field :model-value="stateStore.profile?.credential_name" @click="copyText(stateStore.profile?.credential_name)" readonly />
        <p class="pt-3">
          If you believe this credential has been compromised, or is not working properly, you may destroy the credential
          by clicking below. This will cause Hermes to regenerate a new SCiMMA Auth credential for your account. The initial permissions
          on the credential are set using your SCiMMA Auth user accounts various group permissions.
        </p>
        <div class="text-center mt-2">
          <v-btn color="error" @click="performRevokeCredential">
            <v-progress-circular v-if="revokingCredential" color="primary" size="16" indeterminate></v-progress-circular>
            Revoke Credential
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="stateStore.userIsAuthenticated">
      <v-col md="4" class="border-md pt-4">
        <h3 class="text-center">Default UI Topics Filter</h3>
        <p>The default set of topics that will be filtered on the HERMES homepage when you are logged in.</p><br />
        <v-autocomplete v-model="defaultSelectedTopics" :items="stateStore.topic_options" placeholder="All Topics shown by default" :error-messages="defaultTopicsChangedMessage" multiple chips clearable closable-chips persistent-clear></v-autocomplete>
        <div class="text-center mt-2">
          <v-btn color="success" @click="updateDefaultTopicsList" :disabled="!defaultTopicsChanged">
            <v-progress-circular v-if="updatingDefaultTopicsList" color="primary" size="16" indeterminate></v-progress-circular>
            Update Topics
          </v-btn>
        </div>
      </v-col>
      <v-col md="4" class="border-md pt-4">
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
          <v-btn color="info" @click="authorizeGcn">
            Authorize GCN
          </v-btn>
        </div>
      </v-col>
      <v-col md="4" class="border-md pt-4">
        <h3 class="text-center">TNS Bot Credentials</h3>
        <p>
          By default, TNS submissions will use the built-in <b>Hermes_bot</b>. This bot only has permissions to report to the TNS from the <b>Hermes_group</b>.
          You can override this behaviour and submit with your own TNS Bot credentials by adding then to your profile
          here or via the api.
        </p>
        <div v-html="botOverrideText"></div><br />
        <v-form>
          <v-number-input class="mb-1" v-model="tns_form.bot_id" control-variant="hidden" placeholder="Enter your TNS Bot ID"></v-number-input>
          <v-text-field class="mb-1" v-model="tns_form.bot_name" placeholder="Enter your TNS Bot Name"></v-text-field>
          <v-text-field  class="mb-1" v-model="tns_form.bot_api_token" placeholder="Enter your TNS Bot API Token"></v-text-field>
          <div class="mt-3 text-center">
            <v-btn-group divided>
              <v-btn color="error" @click="performRevokeBotCredentials">
                <v-progress-circular v-if="updatingBotCredentials" color="primary" size="16" indeterminate></v-progress-circular>
                Revoke Credentials
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="success" @click="performUpdateBotCredentials" :disabled="!canSetTNSCredentials">
                <v-progress-circular v-if="updatingBotCredentials" color="primary" size="16" indeterminate></v-progress-circular>
                Set Credentials
              </v-btn>
            </v-btn-group>
          </div>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
