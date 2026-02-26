<script setup>
import { ref, computed, onMounted } from 'vue';
import _ from 'lodash';
import HermesMessage from '@/components/message-composition/HermesMessage.vue';
import { useLogout } from '@/utils/logout.js';
import { sanitizeMessage } from '@/utils/messageUtils.js';
import { useStateStore } from '@/stores/state';
import { useRoute } from 'vue-router';

const route = useRoute()
const { logout } = useLogout();
const stateStore = useStateStore()

// The initial hermesMessage data. The basic structure of a hermes message should be included in the
// object, including the base elements and an empty data element that can be filled in with various
// sections.
const hermesMessage = ref({
  title: '',
  authors: '',
  topic: '',
  message_text: '',
  submitter: '',
  submit_to_tns: false,
  submit_to_mpc: false,
  submit_to_gcn: false,
  data: {
    event_id: null,
    references: [],
    extra_data: [],
    targets: [],
    photometry: [],
    spectroscopy: [],
    astrometry: [],
  },
})

const messageForm = ref(null);
const isPlainTexting = ref(false)
const plainText = ref('')
const isValidating = ref(false)
const validationErrors = ref({})
const readyToSubmit = ref(false)
const isSubmitting = ref(false)
const submissionError = ref('')
const isPreloading = ref(false)
const preloadError = ref('')

onMounted(async () => {
  if (_.isEmpty(stateStore.tns_options)) {
    await stateStore.getTNSOptions();
  }
  if (stateStore.isProd) {
    hermesMessage.value.topic = stateStore.profile.writable_topics[0];
  }
  else {
    hermesMessage.value.topic = 'hermes.test';
  }
  hermesMessage.value.submitter = stateStore.profile.email;
  if (!_.isEmpty(route.query) && 'id' in route.query) {
    preloadData(route.query.id);
  }
})

async function validate() {
  isValidating.value = true
  let url = new URL('/api/v0/submit_message/validate/', stateStore.hermesUrl).href
  fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': stateStore.csrf_token
    },
    credentials: 'include',
    body: JSON.stringify(sanitizeMessage(hermesMessage.value))
  })
    .then((response) => response.json())
    .then(data => {
      validationErrors.value = data
      if (!_.isEmpty(validationErrors.value)) {
        readyToSubmit.value = false
      }
      else {
        readyToSubmit.value = true
      }
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status == 401) {
        logout();
      }
    })
    .finally(() => {
      isValidating.value = false
    });
}

const debouncedValidate = _.debounce(validate, 200);

const gcnDestination = computed(() => {
  return stateStore.isProd ? "circulars@gcn.nasa.gov" : "circulars@dev.gcn.nasa.gov";
})

const tnsDesination = computed(() => {
  return stateStore.isProd ? "TNS" : "TNS (sandbox)";
})

async function generatePlainText() {
  let url = new URL('/api/v0/submit_message/plaintext/', stateStore.hermesUrl).href
  isPlainTexting.value = true
  fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': stateStore.csrf_token
    },
    credentials: 'include',
    body: JSON.stringify(sanitizeMessage(hermesMessage.value))
  })
    .then((response) => response.json())
    .then(data => {
      plainText.value = data
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status == 401) {
        logout();
      }
    })
    .finally(() => {
      isPlainTexting.value = false
    });
}

function hasAnyFiles() {
  for (var i = 0; i < hermesMessage.value.data.targets.length; i += 1) {
    if (hermesMessage.value.data.targets[i].files.length > 0) {
      return true;
    }
  }
  for (i = 0; i < hermesMessage.value.data.spectroscopy.length; i += 1) {
    if (hermesMessage.value.data.spectroscopy[i].files.length > 0) {
      return true;
    }
  }
  return false;
}

async function submitToHop() {
  let payload = JSON.stringify(sanitizeMessage(hermesMessage.value));
  let formData = null;
  if (hasAnyFiles()) {
    formData = new FormData();
    // Add files from within the targets sections of the message
    for (var i = 0; i < hermesMessage.value.data.targets.length; i += 1) {
      hermesMessage.value.data.targets[i].files.forEach(function (file) {
        formData.append("files", file);
      });
    }
    // Add files from within the spectroscopy sections of the message
    for (i = 0; i < hermesMessage.value.data.spectroscopy.length; i += 1) {
      hermesMessage.value.data.spectroscopy[i].files.forEach(function (file) {
        formData.append("files", file);
      });
    }
    formData.append("data", payload);
  }
  let url = new URL('/api/v0/submit_message/', stateStore.hermesUrl).href
  isSubmitting.value = true
  submissionError.value = ''
  fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': _.isNull(formData) ? 'application/json' : 'multipart/form-data',
      'X-CSRFToken': stateStore.csrf_token
    },
    credentials: 'include',
    body: _.isNull(formData) ? payload : formData
  })
    .then(() => {
      // on success redirect to homepage
      location.href = '/';
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status == 401) {
        logout();
      }
      else if (error.response.status == 400) {
        submissionError.value = error.response.data.error;
      }
    })
    .finally(() => {
      isSubmitting.value = false
    });
}

function clearForm() {
  // Reset the page to a clean state
  hermesMessage.value.title = '';
  hermesMessage.value.authors = '';
  hermesMessage.value.topic = stateStore.profile.writable_topics[0];
  hermesMessage.value.message_text = '';
  hermesMessage.value.submitter = stateStore.profile.email;
  hermesMessage.value.submit_to_tns = false;
  hermesMessage.value.submit_to_mpc = false;
  hermesMessage.value.submit_to_gcn = false;
  hermesMessage.value.data = {
    event_id: null,
    references: [],
    extra_data: [],
    targets: [],
    photometry: [],
    spectroscopy: [],
    astrometry: [],
  };
  debouncedValidate();
}

async function hermesMessageUpdated() {
  debouncedValidate();
}

async function preloadData(preloadId) {
  preloadError.value = '';
  isPreloading.value = true;
  fetch(stateStore.hermesUrl + "api/v0/submit_message/load/" + preloadId, {
    credentials: 'include',
    method: 'get'
  })
    .then((response) => response.json())
    .then(data => {
      if ('topic' in data && stateStore.profile.writable_topics.includes(data['topic'])) {
        hermesMessage.value.topic = data['topic'];
      }
      hermesMessage.value.title = 'title' in data ? data['title'] : hermesMessage.value.title;
      hermesMessage.value.authors = 'authors' in data ? data['authors'] : hermesMessage.value.authors;
      hermesMessage.value.message_text = 'message_text' in data ? data['message_text'] : hermesMessage.value.message_text;
      hermesMessage.value.submit_to_tns = 'submit_to_tns' in data ? data['submit_to_tns'] : hermesMessage.value.submit_to_tns;
      hermesMessage.value.submit_to_mpc = 'submit_to_mpc' in data ? data['submit_to_mpc'] : hermesMessage.value.submit_to_mpc;
      hermesMessage.value.submit_to_gcn = 'submit_to_gcn' in data ? data['submit_to_gcn'] : hermesMessage.value.submit_to_gcn;
      if (!_.isEmpty(data.data) && messageForm.value) {
        // Here we pass down into the hermesMessage component since it better understands how to check and update values of the data sections
        messageForm.value.preloadData(data.data);
      }
      debouncedValidate();
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status == 401) {
        logout();
      }
      else if (error.response.status == 404) {
        preloadError.value = 'Preloaded Message with ID ' + preloadId + ' does not exist on the server.';
      }
    })
    .finally(() => {
      isPreloading.value = false;
    });
}

// TODO: Do we still want to allow unauthenticated submission??
async function checkSessionAndSubmitToHop() {
  // Attempt to check the user session is still valid before submitting, to ensure no confusion in who is submitting the message
  isSubmitting.value = true
  fetch(stateStore.hermesUrl + "api/v0/heartbeat/", {
    credentials: 'include',
    method: 'get'
  })
    .then((response) => response.json())
    .then(data => {
      if (stateStore.userIsAuthenticated && !data.is_authenticated) {
        logout(false);
        submissionError.value = 'Your user session expired while composing this message.' +
          ' Refresh the page and login again to submit as your user account' +
          ', or click the submit button again to send the message as the HERMES Guest user';
      }
      else {
        submitToHop();
      }
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status == 401) {
        logout(false);
        submissionError.value = 'Your user session expired while composing this message.' +
          ' Refresh the page and login again to submit as your user account' +
          ', or click the submit button again to send the message as the HERMES Guest user';
      }
    })
    .finally(() => {
      isSubmitting.value = false;
    });
}

</script>
<template>
  <v-container>
    <v-row v-if="preloadError">
      <v-alert type="error" closable @click:close="preloadError.value = ''">
        {{ preloadError }}
      </v-alert>
    </v-row>
    <v-row>
      <v-col class="m-0 p-0">
        <hermes-message :errors="validationErrors" :hermes-message="hermesMessage" :plain-text="plainText"
          ref="messageForm" @hermes-message-updated="debouncedValidate()" @generate-plain-text="generatePlainText">
        </hermes-message>
      </v-col>
    </v-row>
    <v-row class="mt-2">
      <v-col sm="1" class="submit-container">
        <v-btn class="text-white" variant="flat" color="success" @click="checkSessionAndSubmitToHop"
          :disabled="!readyToSubmit">Submit</v-btn>
      </v-col>
      <v-col sm="5"> to {{ hermesMessage.topic }}
        <div v-if="hermesMessage.submit_to_gcn">
          and {{ gcnDestination }}
        </div>
        <div v-if="hermesMessage.submit_to_tns">
          and {{ tnsDesination }} through {{ stateStore.tnsBot }}
          <div v-if="stateStore.tnsBot === 'Hermes Bot'">&#42; Click <a href="profile" target="_blank">here</a> to set
            your own TNS Bot credentials</div>
        </div>
      </v-col>
      <v-col sm="6">
        <v-btn class="float-right mb-2" variant="outlined" color="primary" @click="clearForm">Clear Form</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="submissionError">
      <v-alert type="error" closable @click:close="submissionError.value = ''">
        {{ submissionError }}
      </v-alert>
    </v-row>
  </v-container>
</template>
