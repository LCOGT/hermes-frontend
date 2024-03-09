<template>
  <b-container>
    <b-row v-if="preloadError">
      <b-alert show dismissible variant="danger" @dismissed="clearPreloadError()" style="width:100%;">
        {{this.preloadError}}
      </b-alert>
    </b-row>
    <b-row>
      <b-col class="m-0 p-0">
        <hermes-message :errors="validationErrors" :hermes-message="hermesMessage" :plain-text="plainText" ref="messageForm"
          @hermes-message-updated="hermesMessageUpdated" @generate-plain-text="generatePlainText">
        </hermes-message>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col sm="1" class="submit-container">
        <b-button class="submit-button shadow" variant="success" @click="checkSessionAndSubmitToHop"
          :disabled="!readyToSubmit">Submit</b-button>
      </b-col>
      <b-col sm="5"> to {{this.hermesMessage.topic}}
        <div v-if="this.hermesMessage.submit_to_gcn">
          and {{getGcnDestination()}}
        </div>
        <div v-if="this.hermesMessage.submit_to_tns">
          and {{getTnsDestination()}}
        </div>
      </b-col>
      <b-col sm="6">
        <b-button class="clear-button shadow mb-2" variant="outline-primary" @click="clearForm">Clear Form</b-button>
      </b-col>
    </b-row>
    <b-row v-if="submissionError">
      <b-alert show dismissible variant="danger" @dismissed="clearSubmissionError()">
        {{this.submissionError}}
      </b-alert>
    </b-row>
  </b-container>
</template>
<script>
import _ from 'lodash';
import $ from 'jquery';
import axios from "axios";
import { mapGetters } from "vuex";
import HermesMessage from '@/components/message-composition/HermesMessage.vue';
import { OCSUtil } from 'ocs-component-lib';
import { messageFormatMixin } from '@/mixins/messageFormatMixin.js';
import { logoutMixin } from '@/mixins/logoutMixin.js';

export default {
  name: 'MessageCompositionForm',
  components: {
    HermesMessage,
  },
  mixins: [messageFormatMixin, logoutMixin],
  props: {
    // The initial hermesMessage data. The basic structure of a hermes message should be included in the
    // object, including the base elements and an empty data element that can be filled in with various
    // sections.
    hermesMessage: {
      type: Object,
      default: () => {
        return {
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
        };
      }
    },
    "submissionEndpoint": String,
  },
  data: function() {
    return {
        plainText: '',
        topicOptions: [],
        validateRequestManager: new OCSUtil.mostRecentRequestManager(this.getValidationRequest, this.onValidationSuccess, this.onValidationFail),
        validationErrors: {},
        readyToSubmit: false,
        show: true,
        submissionError: '',
        preloadError: '',
      };
  },
  mounted() {
    if (_.isEmpty(this.getTnsOptions)) {
      this.$store.dispatch('getTnsOptionsData');
    }
    this.topicOptions = this.getProfile.writable_topics;
    if (this.isProd) {
      this.hermesMessage.topic = this.topicOptions[0];
    }
    else {
      this.hermesMessage.topic = 'hermes.test';
    }
    this.hermesMessage.submitter = this.getProfile.email;
    // Accept a id in the route that will cause this to load a preloaded message from the server with that id
    if (!_.isEmpty(this.$route.query) && 'id' in this.$route.query){
      this.preloadData(this.$route.query.id);
    }
  },
  computed: {
    ...mapGetters(["getCsrfToken", "getProfile", "getHermesUrl", "getTnsOptions", "isLoggedIn"]),
    isProd: function() {
      return this.getHermesUrl == "https://hermes.lco.global/";
    }
  },
  methods: {
    validate: _.debounce(function() {
      this.validateRequestManager.send();
    }, 200),
    getValidationRequest: function() {
      return $.ajax({
        type: 'POST',
        url: new URL('/api/v0/' + this.submissionEndpoint + '/validate/', this.getHermesUrl).href,
        data: JSON.stringify(this.sanitizedMessageData()),
        headers: {'X-CSRFToken': this.getCsrfToken},
        contentType: 'application/json'
      });
    },
    onValidationSuccess: function(data) {
      this.validationErrors = data;
      if (!_.isEmpty(this.validationErrors)) {
        this.readyToSubmit = false;
      }
      else{
        this.readyToSubmit = true;
      }
    },
    onValidationFail: function(jqXHR) {
      if (jqXHR.status == 401) {
        this.logout();
      }
    },
    getGcnDestination: function() {
      // This should probably pull from an API endopoint on the backend, but is hopefully sufficient for now.
      if (this.isProd) {
        return "circulars@gcn.nasa.gov";
      }
      return "circulars@dev.gcn.nasa.gov";
    },
    getTnsDestination: function() {
      // This should probably pull from an API endopoint on the backend, but is hopefully sufficient for now.
      if (this.isProd) {
        return "TNS";
      }
      return "TNS (sandbox)";
    },
    generatePlainText: function() {
      let payload = this.sanitizedMessageData();
      // Post message via axios
      axios({
        method: 'post',
        withCredentials: true,
        // TODO: see if Vue.js can add the X-CSRFToken to all headers automagically
        headers: {'Content-Type': 'application/json',
                  'X-CSRFToken': this.getCsrfToken
                  },
        url: new URL('/api/v0/' + this.submissionEndpoint + '/plaintext/', this.getHermesUrl).href,
        data: JSON.stringify(payload)
      })
      .then((response) => {
        this.plainText = response.data;
      })
      .catch(error => {
        console.log(error);
        if (error.response.status == 401){
          this.logout();
        }
      });
    },
    submitToHop() {
      let payload = JSON.stringify(this.sanitizedMessageData());
      let formData = null;
      if (this.hasAnyFiles(this.hermesMessage)){
        formData = new FormData();
        // Add files from within the targets sections of the message
        for (var i = 0; i < this.hermesMessage.data.targets.length; i += 1) {
          this.hermesMessage.data.targets[i].files.forEach(function (file) {
            formData.append("files", file);
          });
        }
        // Add files from within the spectroscopy sections of the message
        for (i = 0; i < this.hermesMessage.data.spectroscopy.length; i += 1) {
          this.hermesMessage.data.spectroscopy[i].files.forEach(function (file) {
            formData.append("files", file);
          });
        }
        formData.append("data", payload);
      }
      // Post message via axios
      axios({
        method: 'post',
        withCredentials: true,
        // TODO: see if Vue.js can add the X-CSRFToken to all headers automagically
        headers: {'Content-Type': _.isNull(formData) ? 'application/json' : 'multipart/form-data',
                  'X-CSRFToken': this.getCsrfToken
                  },
        url: new URL('/api/v0/' + this.submissionEndpoint + '/', this.getHermesUrl).href,
        data: _.isNull(formData) ? payload : formData
      })
      .then(() => {
        // log response, redirect to homepage
        location.href = '/';
      })
      .catch(error => {
        console.log(error);
        if (error.response.status == 401){
          this.logout();
        }
        else if (error.response.status == 400) {
          this.submissionError = error.response.data.error;
        }
      });
    },
    clearForm() {
      // Reset the page to a clean state
      this.hermesMessage.title = '';
      this.hermesMessage.authors = '';
      this.hermesMessage.topic = this.topicOptions[0];
      this.hermesMessage.message_text = '';
      this.hermesMessage.submitter = this.getUserName;
      this.hermesMessage.submit_to_tns = false;
      this.hermesMessage.submit_to_mpc = false;
      this.hermesMessage.submit_to_gcn = false;
      this.hermesMessage.data = {
        event_id: null,
        references: [],
        extra_data: [],
        targets: [],
        photometry: [],
        spectroscopy: [],
        astrometry: [],
      };
      this.validate();
    },
    clearSubmissionError() {
      this.submissionError = '';
    },
    clearPreloadError() {
      this.preloadError = '';
    },
    hermesMessageUpdated: function() {
      this.validate();
    },
    preloadData: function(preloadId) {
      axios
      .get(new URL('/api/v0/' + this.submissionEndpoint + '/load/' + preloadId, this.getHermesUrl).href, {
          withCredentials: true,
        })
      .then((response) => {
        let preloadData = response.data;
        if ('topic' in preloadData && this.topicOptions.includes(preloadData['topic'])) {
          this.hermesMessage.topic = preloadData['topic'];
        }
        this.hermesMessage.title = 'title' in preloadData ? preloadData['title'] : this.hermesMessage.title;
        this.hermesMessage.authors = 'authors' in preloadData ? preloadData['authors'] : this.hermesMessage.authors;
        this.hermesMessage.message_text = 'message_text' in preloadData ? preloadData['message_text'] : this.hermesMessage.message_text;
        this.hermesMessage.submit_to_tns = 'submit_to_tns' in preloadData ? preloadData['submit_to_tns'] : this.hermesMessage.submit_to_tns;
        this.hermesMessage.submit_to_mpc = 'submit_to_mpc' in preloadData ? preloadData['submit_to_mpc'] : this.hermesMessage.submit_to_mpc;
        this.hermesMessage.submit_to_gcn = 'submit_to_gcn' in preloadData ? preloadData['submit_to_gcn'] : this.hermesMessage.submit_to_gcn;
        if (!_.isEmpty(preloadData.data)) {
          // Here we pass down into the hermesMessage component since it better understands how to check and update values of the data sections
          this.$refs.messageForm.preloadData(preloadData.data);
        }
        this.validate();
      })
      .catch((error) => {
        if (error.response.status == 404) {
          // If a message with this preload ID is not found on the server, report that to the user
          this.preloadError = 'Preloaded Message with ID ' + preloadId + ' does not exist on the server.';
        }
        else if (error.response.status == 401) {
          this.logout();
        }
        else {
          console.log(error);
        }
      });
    },
    checkSessionAndSubmitToHop() {
      // Attempt to check the user session is still valid before submitting, to ensure no confusion in who is submitting the message
      axios
        .get(this.getHermesUrl + "api/v0/heartbeat/", {
            withCredentials: true,
          })
        .then((response) => {
          if (this.isLoggedIn && !response.data.is_authenticated) {
            this.logout(false);
            this.submissionError = 'Your user session expired while composing this message.' +
                                   ' Refresh the page and login again to submit as your user account' +
                                   ', or click the submit button again to send the message as the HERMES Guest user';
          }
          else {
            this.submitToHop();
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status == 401){
            this.logout(false);
            this.submissionError = 'Your user session expired while composing this message.' +
                                   ' Refresh the page and login again to submit as your user account' +
                                   ', or click the submit button again to send the message as the HERMES Guest user';
          }
      });
    }
  }
};
</script>
