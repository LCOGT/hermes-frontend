<template>
  <b-container>
    <b-row>
      <b-col class="m-0 p-0">
        <hermes-message :errors="validationErrors" :hermes-message="hermesMessage" :plain-text="plainText"
          @hermes-message-updated="hermesMessageUpdated" @generate-plain-text="generatePlainText">
        </hermes-message>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col sm="1" class="submit-container">
        <b-button class="submit-button shadow" variant="success" @click="submitToHop"
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
      <b-alert show dismissible variant="danger" @dismissed="clearError()">
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
          files: [],
          file_descriptions: [],
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
  },
  computed: {
    ...mapGetters(["getCsrfToken", "getProfile", "getHermesUrl", "getTnsOptions"]),
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
        // Add files from the outer part of the message
        this.hermesMessage.files.forEach(function (file) {
          formData.append("files", file);
        });
        // Add files from within the spectroscopy sections of the message
        for (var i = 0; i < this.hermesMessage.data.spectroscopy.length; i += 1) {
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
      this.hermesMessage.files = [];
      this.hermesMessage.file_descriptions = [];
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
    hermesMessageUpdated: function() {
      this.validate();
    }
  }
};
</script>
