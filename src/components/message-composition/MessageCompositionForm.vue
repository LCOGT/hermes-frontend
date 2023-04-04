<template>
  <b-container>
    <b-row>
      <b-col class="m-0 p-0">
        <hermes-message :errors="validationErrors" :hermes-message="hermesMessage" ref="hermesMessageChild"
          @hermes-message-updated="hermesMessageUpdated">
        </hermes-message>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col>
        <div class="submit-container">
          <b-button class="submit-button shadow" variant="success" @click="submitToHop"
            :disabled="!readyToSubmit">Submit</b-button>
        </div>
      </b-col>
      <b-col>
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
import getEnv from "@/utils/env.js";

import HermesMessage from '@/components/message-composition/HermesMessage.vue';
import { OCSUtil } from 'ocs-component-lib';
import { messageFormatMixin } from '@/mixins/messageFormatMixin.js';

export default {
  name: 'MessageCompositionForm',
  components: {
    HermesMessage,
  },
  mixins: [messageFormatMixin],
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
        topicOptions: [],
        validateRequestManager: new OCSUtil.mostRecentRequestManager(this.getValidationRequest, this.onValidationSuccess),
        validationErrors: {},
        readyToSubmit: false,
        show: true
      };
  },
  mounted() {
    this.topicOptions = this.getWritableTopics;
    this.hermesMessage.topic = this.topicOptions[0];
    this.hermesMessage.submitter = this.getUserName;
  },
  computed: {
    ...mapGetters(["getUserName", "getCsrfToken", "getWritableTopics"]),
  },
  methods: {
    validate: _.debounce(function() {
      this.validateRequestManager.send();
    }, 200),
    getValidationRequest: function() {
      return $.ajax({
        type: 'POST',
        url: new URL('/api/v0/' + this.submissionEndpoint + '/validate/', getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL")).href,
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
    submitToHop() {
      let payload = this.sanitizedMessageData();
      // Post message via axios
      axios({
        method: 'post',
        // TODO: see if Vue.js can add the X-CSRFToken to all headers automagically
        headers: {'Content-Type': 'application/json',
                  'X-CSRFToken': this.getCsrfToken
                  },
        url: new URL('/api/v0/' + this.submissionEndpoint + '/', getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL")).href,
        data: JSON.stringify(payload)
      })
      .then(function () {
        // log response, redirect to homepage
        location.href = '/';
      })
      .catch(error => {
        console.log(error);
      });
    },
    clearForm() {
      // Reset the page to a clean state
      let emptyData = '';
      let dataFieldList = [
        'references',
        'extra_data',
        'targets',
        'photometry',
        'spectroscopy',
        'astrometry']
      this.hermesMessage.title = emptyData;
      this.hermesMessage.authors = emptyData;
      this.hermesMessage.topic = this.topicOptions[0];
      this.hermesMessage.message_text = emptyData;
      this.hermesMessage.submitter = emptyData;
      this.hermesMessage.submit_to_tns = false;
      this.hermesMessage.submit_to_mpc = false;
      for (let i = 0; i < dataFieldList.length; i += 1) {
        let section = dataFieldList[i]
        this.hermesMessage.data[section] = []
        this.$refs.hermesMessageChild.$refs[section + 'Section'].forceVisibility(false);
      }
      this.hermesMessage.data['event_id'] = null;
      this.$refs.hermesMessageChild.update();
    },
    hermesMessageUpdated: function() {
      this.validate();
    }
  }
};
</script>
