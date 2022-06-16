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
            <b-form-input class="title-input" v-model="title" placeholder="Title"></b-form-input>
          </b-col>
          <b-col>
            <div>
              <label for="topic-input">Topic:</label>
              <b-form-select class="topic-input" v-model="topic" :options="['hermes.test']">Topic</b-form-select>
            </div>
          </b-col>
        </b-row>
        <b-row class=p-2>
          <b-col v-if="nleId" class="eventid-col">
            <label for="eventid-input">Event ID:</label>
            <b-form-input class="eventid-input" v-model="eventid" placeholder="Event ID"></b-form-input>
          </b-col>
          <b-col class="authors-col">
            <label for="authors-input">Authors:</label>
            <b-form-input class="authors-input" v-model="authors" placeholder="Authors"></b-form-input>
          </b-col>
        </b-row>
      </b-card>
      <!-- Data Tables -->
      <b-card class="mb-2 shadow" border-variant="primary">
        <b-row>
          <b-col class="input-table-col">
          <slot></slot>
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
                <b-form-textarea v-model="message" id="message-input" placeholder="Enter Message. Use '{key}' to reference values in Additional Data Table." rows="3" max-rows="6"></b-form-textarea>
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
            <b-button class="submit-button shadow" variant="success" @click="submitToHop">Submit</b-button>
              <b-modal ok-only v-model="showErrorModal" @close="closeErrorModal"
                title="Submission Error"
                header-bg-variant="danger"
              >
                <template>
                  <div>{{ errorModalText }}</div>
                </template>
              </b-modal>
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
import AdditionalDataTable from "@/components/AdditionalDataTable";
import axios from "axios";
import getEnv from "@/utils/env.js";
import { mapGetters } from "vuex";

export default {
  name: "MessageForm",
  computed: {
      ...mapGetters(["getMainData", "getExtraData", "getMainTableName", "getMainTableHeader"]),
      formattedMessage() {
      return this.formatMessage(this.message);
    }
  },
  mounted() {
    this.topic = 'hermes.test';
    this.showErrorModal = false;
  },
  props: {
    "pageTitle": String,
    nleId: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      title: '',
      authors: '',
      topic: 'hermes.test',
      message: '',
      eventid: '',
      user: 'Hermes User.guest',
      fileInput: null,
      showErrorModal: false,
      errorModalText: '',
      csvHeader: {
          id: 'csv-header',
          title: '',
          content: ''
      },
       showCopyAlert: false
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
      this.topic = 'hermes.test';
      this.message = '';
      this.eventid = '';
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
      const additionalDataObj = this.getExtraData.reduce(
          (obj, element) => ({...obj, [element.key]: element.value}), {});
      // const mainDataList = this.getMainTableHeader.split(',');
      const generalDataKeys = ['title', 'authors', 'topic', 'user', 'eventid'];
      for (let i in keys_to_format) {
        let keyChain = keys_to_format[i].split(".")
        if (keyChain[0] in additionalDataObj) {
          formatted_string = formatted_string.replace(RegExp('{' + keyChain[0] + '}', 'g'), additionalDataObj[keyChain[0]])
        }
        if (generalDataKeys.includes(keyChain[0])) {
          formatted_string = formatted_string.replace(RegExp('{' + keyChain[0] + '}', 'g'), this[keyChain[0]])
        }
        // if (mainDataList.includes(keyChain[0])) {
        //   formatted_string = formatted_string.replace(RegExp('{' + keyChain[0] + '}', 'g'), this.getMainData[keyChain[0]][keyChain[1]])
        // }
      }
      return formatted_string;
      },
    closeErrorModal() {
      // Clear error text when closed
      this.errorModalText = '';
      this.showErrorModal = false;
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
    validateRA(table) {
      // Check if RA makes sense.
      table.forEach((row) => {
        if ('ra' in row) {
          let this_ra;
          try {
            this_ra = this.sexagesimalToDeg(row.ra);
          }
          catch {
            try {
              this_ra = parseFloat(row.ra)
              if (isNaN(this_ra)) {
                throw Error("RA did not parse to a number.")
              }
            }
            catch {
              this.errorModalText = row.ra + ' is not a valid RA.';
              this.showErrorModal = true;
              throw Error("Invalid RA")
            }
          }
          if (this_ra < 0.0 || this_ra >= 360.0) {
            this.errorModalText = row.ra + ' is out of the range 0 and 360 degrees.';
            this.showErrorModal = true;
            throw Error("Invalid RA");
          }
        }
      });
    },
    submitToHop() {
      // Compile message and submit to HOPSKOTCH
      const additionalDataObj = this.getExtraData.reduce(
          (obj, element) => ({...obj, [element.key]: element.value}), {});
      const mainData = this.getMainData;
      // Remove elements used for Table maintenance and display
      mainData.forEach(function (item) {
        delete item.isActive;
        delete item.id;
      });
      // Run Validation
      try {
        this.validateRA(mainData);
      }
      catch {
        return
      }
      // get Main Data column order
      let mainDataOrder = [];
      if (mainData[0]) {
        for (const [key, ] of Object.entries(mainData[0])) {
          mainDataOrder.push(key);
        }
      }
      // Build Basic Payload to match backend Model Structure
      let payload = {
        "topic": this.topic,
        "title": this.title,
        "author": this.user,
        "data": additionalDataObj,
        "message_text": this.formattedMessage
      };
      // Apply common elements to JSON field "data"
      if (this.getMainTableName) {
        payload.data[this.getMainTableName] = mainData;
      } else {
        payload.data['main_data'] = mainData;
      }
      if (mainDataOrder) {
        payload.data.mainDataOrder = mainDataOrder;
      }
      if (this.eventid) {
        payload.data.eventid = this.eventid;
      }
      if (this.authors) {
        payload.data.authors = this.authors;
      }
      // Post message via axios
      console.log(JSON.stringify(payload));
      axios({
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        url: getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "submit/",
        data: JSON.stringify(payload)
      })
      .then(function (response) {
        // log response, redirect to homepage
        console.log(JSON.stringify(response.data));
        location.href = '/.html';
      })
      .catch(error => {
        // If error, show modal
        console.log(error);
        this.showErrorModal = true;
        this.errorModalText = error.message;
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
          console.log(header)
          console.log(expectedHeader)
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
}
</script>

<style scoped>
.outside-container {
  overflow-x: auto;
  margin: auto;
}

.inside-container {
  max-width: 75%;
  min-width: min-content;
  margin: auto;
}

.eventid-col {
  max-width: 20%;
  padding: 0;
  padding-left: 15px;
  padding-right: 15px;
}

.authors-col {
  max-width: 100%;
  padding: 0;
  padding-left: 15px;
  padding-right: 15px;
}

.message-tabs {
  width: 100%;
}

.extra-input-col {
  max-width: 20%;
}
.submit-button {
  color: white;
}
.clear-button {
  float: right;
}
</style>