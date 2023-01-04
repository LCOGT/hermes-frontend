<template>
  <b-container fluid class="outside-container">
    <b-container fluid class="inside-container">
      <!-- Form Title -->
      <h1>{{ pageTitle }}</h1>
      <!-- Basic Info Form -->
      <b-card class="mb-2 shadow" border-variant="primary">
        <b-row class=p-2>
          <b-col>
            <label for="title-input">Title:</label>
            <b-form-input class="title-input" v-model="title" placeholder="Title" :state="getValidationState('title')" @input="validate"></b-form-input>
            <b-form-invalid-feedback id="title-input-feedback">{{ getValidationError('title') }}</b-form-invalid-feedback>
          </b-col>
          <b-col>
            <div>
              <label for="topic-input">Topic:</label>
              <b-form-select class="topic-input" v-model="topic" :options="topicOptions" :state="getValidationState('topic')" @input="validate">Topic</b-form-select>
              <b-form-invalid-feedback id="topic-input-feedback">{{ getValidationError('topic') }}</b-form-invalid-feedback>
            </div>
          </b-col>
        </b-row>
        <b-row class=p-2>
          <b-col v-if="nleId" class="eventid-col">
            <label for="eventid-input">Event ID:</label>
            <b-form-input class="eventid-input" v-model="eventId" placeholder="Event ID" :state="getValidationState('data.event_id')" @input="validate"></b-form-input>
            <b-form-invalid-feedback id="eventid-input-feedback">{{ getValidationError('data.event_id') }}</b-form-invalid-feedback>
          </b-col>
          <b-col class="authors-col">
            <label for="authors-input">Authors:</label>
            <b-form-input class="authors-input" v-model="authors" placeholder="Authors" :state="getValidationState('authors')" @input="validate"></b-form-input>
            <b-form-invalid-feedback id="authors-input-feedback">{{ getValidationError('authors') }}</b-form-invalid-feedback>
          </b-col>
        </b-row>
      </b-card>
      <!-- Data Tables -->
      <b-card class="mb-2 shadow" border-variant="primary">
        <b-row>
          <b-col class="input-table-col">
          <slot name="dataTable" :errors="childTableValidationErrors" :onUpdate="validate"></slot>
            <!-- Upload Data Card -->
            <b-card title="Upload Row Data to Main Table" class="upload-card my-2" border-variant="light">
              <!-- Get CSV Header -->
              <b-row>
                <div class="mx-2">
                  A CSV file with the proper header can be uploaded to automatically fill the above table.
                  Click the button below to copy this header to your clipboard.
                </div>
              </b-row>
              <b-row>
                <b-button variant="outline-primary" size="sm" @click="copy()" class="m-2">
                  <b> Copy CSV Header </b>
                </b-button>
                <!-- upload csv -->
                <form id=csvForm enctype="multipart/form-data" class="my-2">
                  <input type="file" @change="onFileChange">
                </form>
              </b-row>
              <b-row>
                <!-- Alert User of Successful Copy -->
                <b-alert
                  variant="success"
                  dismissible
                  fade
                  :show="showCopyAlert"
                  @dismissed="showCopyAlert=false"
                >
                  {{ getMainTableName.replace("_", " ").toUpperCase() }} CSV Header coppied to Clipboard.
                </b-alert>
              </b-row>
            </b-card>
          </b-col>
          <!-- Add additional Data Elements -->
          <b-col class="extra-input-col">
            <label for="extra-input-table">Additional Data Elements:</label>
            <additional-data-input-table class="extra-input-table"></additional-data-input-table>
          </b-col>
        </b-row>
      </b-card>
      <!-- Message Form -->
      <b-card class="mb-2 shadow" border-variant="primary">
        <b-row class="p-3">
          <label for="message-input">Message:</label>
            <b-tabs class="message-tabs" content-class="mt-2">
              <b-tab title="Edit" active>
                <b-form-textarea v-model="message" id="message-input" placeholder="Enter Message. Use '{key}' to reference values in Additional Data Table." rows="3" max-rows="6" :state="getValidationState('message_text')" @input="validate"></b-form-textarea>
                <b-form-invalid-feedback id="message-input-feedback">{{ getValidationError('message_text') }}</b-form-invalid-feedback>
              </b-tab>
              <b-tab title="Preview"><span style="white-space: pre;">
                {{ formattedMessage }}
              </span></b-tab>
            </b-tabs>
        </b-row>
      </b-card>
      <!-- Submit -->
      <b-row>
        <b-col>
          <div class="submit-container">
            <b-button class="submit-button shadow" variant="success" @click="submitToHop" :disabled="!readyToSubmit">Submit</b-button>
          </div>
        </b-col>
        <b-col>
          <b-button class="clear-button shadow mb-2" variant="outline-primary" @click="clearForm">Clear Form</b-button>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
import axios from "axios";
import _ from 'lodash';
import $ from 'jquery';
import { mapGetters } from "vuex";
import getEnv from "@/utils/env.js";
import AdditionalDataTable from "@/components/AdditionalDataTable";
import { OCSUtil } from 'ocs-component-lib';
import '@/assets/css/submissions.css';

export default {
  name: "MessageForm",
  computed: {
      ...mapGetters(["getUserName", "getMainData", "getExtraData", "getMainTableName", "getMainTableHeader", "getCsrfToken", "getWritableTopics"]),
      formattedMessage() {
      return this.formatMessage(this.message);
    }
  },
  mounted() {
    this.topicOptions = this.getWritableTopics;
    this.topic = this.topicOptions[0];
    this.user = this.getUserName;
  },
  props: {
    "pageTitle": String,
    nleId: {
      type: Boolean,
      default: true
    },
    "submissionEndpoint": String,
  },
  data() {
    return {
      title: '',
      authors: '',
      topic: '',
      topicOptions: [],
      message: '',
      eventId: '',
      user: 'HERMES Guest',
      fileInput: null,
      csvHeader: {
          id: 'csv-header',
          title: '',
          content: ''
      },
      showCopyAlert: false,
      validateRequestManager: new OCSUtil.mostRecentRequestManager(this.getValidationRequest, this.onValidationSuccess),
      validationErrors: {},
      childTableValidationErrors: [],
      readyToSubmit: false
    }
  },
  components: {
    "additional-data-input-table": AdditionalDataTable,
  },
  watch: {
    fileInput(newTable) {
      // Build Main Data when new file uploaded
      const loaded_array = this.csvToArray(newTable);
      this.$store.commit("SET_MAIN_DATA", loaded_array);
    }
  },
  methods: {
    clearForm() {
      // completely reset form data
      this.title = '';
      this.authors = '';
      this.topic = this.topicOptions[0];
      this.message = '';
      this.eventId = '';
      this.fileInput = null;
      this.$store.commit("SET_MAIN_DATA", []);
      this.$store.commit("SET_EXTRA_DATA", []);
      document.getElementById("csvForm").reset();
    },
    copy() {
      // Create and Copy Sample Table Header to Clipboard
      if (this.getMainTableHeader){
        // Copy Header to Clipboard. Only works with HTTPS or local
        navigator.clipboard.writeText(this.getMainTableHeader);
        // Trigger alert to show sucessful copy
        this.showCopyAlert = true;
      }
    },
    formatMessage(value) {
      // Convert message to plaintext with values inserted
      let formatted_string = value;
      // This nasty regex makes a list of elements that are in curly brackets
      const keys_to_format = value.match(/[^{}]+(?=})/g);
      // Store comparison lists for keys
      const additionalDataObj = this.getExtraData.reduce(
          (obj, element) => ({...obj, [element.key]: element.value}), {});
      const mainDataList = this.getMainTableHeader.split(',');
      const generalDataKeys = ['title', 'authors', 'topic', 'user', 'event_id'];
      // Loop through potential keys to search for matches
      for (let i in keys_to_format) {
        // Check for row references and convert to Camel Case
        var keyChain = keys_to_format[i].split(".")
        const camelCaseKey = keyChain[0].toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        if (keyChain[0] in additionalDataObj) {
          // Check Additional Data
          formatted_string = formatted_string.replace(RegExp('{' + keys_to_format[i] + '}', 'g'), additionalDataObj[keyChain[0]]);
        } else if (generalDataKeys.includes(camelCaseKey)) {
          // Check General Header
          formatted_string = formatted_string.replace(RegExp('{' + keys_to_format[i] + '}', 'g'), this[camelCaseKey]);
        } else if (mainDataList.includes(camelCaseKey) && keyChain[1]) {
          if (keyChain[1] < this.getMainData.length) {
            // Check Main Data Table for column.row
            formatted_string = formatted_string.replace(RegExp('{' + keys_to_format[i] + '}', 'g'), this.getMainData[keyChain[1]][camelCaseKey]);
          }
        } else if (camelCaseKey.toLowerCase().includes("id") && keyChain[1] && keyChain[1] < this.getMainData.length){
          // Perform necessary gymnastics to account for our use of specific "ID" for each table
          for (let mainDataKey of mainDataList){
            if (mainDataKey.toLowerCase().includes("id")) {
              formatted_string = formatted_string.replace(RegExp('{' + keys_to_format[i] + '}', 'g'), this.getMainData[keyChain[1]][mainDataKey]);
            }
          }
        }
      }
      return formatted_string;
    },
    validate: _.debounce(function() {
      this.validateRequestManager.send();
    }, 200),
    getValidationRequest: function() {
      return $.ajax({
        type: 'POST',
        url: new URL('/api/v0/' + this.submissionEndpoint + '/validate/', getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL")).href,
        data: JSON.stringify(this.getSubmissionPayload()),
        headers: {'X-CSRFToken': this.getCsrfToken},
        contentType: 'application/json'
      });
    },
    onValidationSuccess: function(data) {
      this.validationErrors = data;
      if (!_.isEmpty(this.validationErrors)) {
        this.readyToSubmit = false;
        if ('data' in this.validationErrors) {
          this.childTableValidationErrors = this.validationErrors.data[this.getMainTableName] || [];
        }
      }
      else{
        this.validationErrors = {};
        this.childTableValidationErrors = [];
        this.readyToSubmit = true;
      }
    },
    getValidationState: function(key) {
      let validationError = this.getValidationError(key);
      if (validationError) {
        return false;
      }
      return null;
    },
    getValidationError: function(key) {
      let splitKey = key.split('.');
      let errors = this.validationErrors;
      let pKey = key;
      if (splitKey.length == 2){
        errors = errors.data
        pKey = splitKey[1];
      }
      if (errors && pKey in errors) {
        return errors[pKey].join(', ');
      }
      return '';
    },
    sexagesimalToDeg(ra) {
      // Convert ra to degrees if in HH:MM:SS.s
      const ra_arr = ra.trim().split(':');
      if (ra_arr.length !== 3) {
        throw Error("Invalid sexagesimal value.");
      }
      return parseFloat(ra_arr[0]) * 15.0 + parseFloat(ra_arr[1]) * 15.0 / 60.0 +
        parseFloat(ra_arr[2]) * 15.0 / 3600.0;
    },
    getSubmissionPayload() {
      // Compile message and submit to HOPSKOTCH
      const additionalDataObj = this.getExtraData.reduce(
          (obj, element) => ({...obj, [element.key]: element.value}), {});
      const mainData = this.getMainData;
      // Remove elements used for Table maintenance and display
      mainData.forEach(function (item) {
        delete item.id;
      });
      // Build Basic Payload to match backend Model Structure
      let payload = {
        "topic": this.topic,
        "title": this.title,
        "submitter": this.user,
        "data": {},
        "message_text": this.formattedMessage
      };
      // Apply common elements to JSON field "data"
      if (additionalDataObj) {
        payload.data['extra_data'] = additionalDataObj;
      }
      if (mainData) {
        payload.data[this.getMainTableName] = mainData;
      } else {
        payload.data['main_data'] = mainData;
      }
      if (this.eventId) {
        payload.data['event_id'] = this.eventId;
      }
      if (this.authors) {
        payload['authors'] = this.authors;
      }
      return payload;
    },
    submitToHop() {
      let payload = this.getSubmissionPayload();
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
    onFileChange(event) {
      // Upload CSV from file and return text
      let files = event.target.files || event.dataTransfer.files;
      if (!files.length)
        return;
      let reader = new FileReader();
      reader.onload = () => {
        this.fileInput = reader.result;
      }
      reader.readAsText(files[0]);
    },
    csvToArray(unparsed_string, delimiter = ",") {
      // Convert Plain Text CSV String to an Array.
      // Pull in expected header and convert to array
      const expectedHeader = this.getMainTableHeader.split(',');
      // slice from start of text to the first \n index
      // use split to create an array from string by delimiter
      const headers = unparsed_string.slice(0, unparsed_string.indexOf("\n")).split(delimiter);
      // slice from \n index + 1 to the end of the text
      // use split to create an array of each csv value row
      const rows = unparsed_string.slice(unparsed_string.indexOf("\n") + 1).split("\n");
      // Map the rows
      // split values from each row into an array
      // use headers.reduce to create an object
      // object properties derived from headers:values
      // the object passed as an element of the array
      var outArray = rows.filter(function (row) {
        // skip blank lines
        return !(row.length === 0)
      }).map(function (row, rowindex) {
        const values = row.split(delimiter);
        return headers.reduce(function (object, header, index) {
          // Only include expected columns
          if (expectedHeader.includes(header)){
            object[header] = values[index];
            object['id'] = rowindex;
          }
          return object;
        }, {});
      });
      // add empty cells for unused columns
      for (let row of outArray) {
        for (let headerKey of expectedHeader){
          if (!(headerKey in row)){
            row[headerKey] = null;
          }
        }
      }
      return outArray;
    },
  },
};
</script>

<style scoped>

</style>
