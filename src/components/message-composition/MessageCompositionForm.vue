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
          and {{getGCNDestination()}}
        </div>
      </b-col>
      <b-col sm="6">
        <b-button class="clear-button shadow mb-2" variant="outline-primary" @click="clearForm">Clear Form</b-button>
      </b-col>
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
        show: true
      };
  },
  mounted() {
    this.topicOptions = this.getProfile.writable_topics;
    this.hermesMessage.topic = this.topicOptions[0];
    this.hermesMessage.submitter = this.getProfile.email;
  },
  computed: {
    ...mapGetters(["getCsrfToken", "getProfile", "getHermesUrl"]),
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
    getGCNDestination: function() {
      // This should probably pull from an API endopoint on the backend, but is hopefully sufficient for now.
      if (this.getHermesUrl == "https://hermes.lco.global/") {
        return "circulars@gcn.nasa.gov"
      }
      return "circulars@dev.gcn.nasa.gov"
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
      let payload = this.sanitizedMessageData();
      // Post message via axios
      axios({
        method: 'post',
        withCredentials: true,
        // TODO: see if Vue.js can add the X-CSRFToken to all headers automagically
        headers: {'Content-Type': 'application/json',
                  'X-CSRFToken': this.getCsrfToken
                  },
        url: new URL('/api/v0/' + this.submissionEndpoint + '/', this.getHermesUrl).href,
        data: JSON.stringify(payload)
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
    hermesMessageUpdated: function() {
      this.validate();
    }
  }
};
</script>
