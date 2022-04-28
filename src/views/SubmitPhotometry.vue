<template>
  <b-container fluid class="outside-container">
    <!-- Form Title -->
    <h1>Photometry Reporting Form</h1>
    <!-- Basic Info Form -->
      <b-row>
      <b-col class=pr-1>
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
            <b-col class="eventid-col">
              <label for="eventid-input">Event ID:</label>
              <b-form-input class="eventid-input" placeholder="Event ID"></b-form-input>
            </b-col>
            <b-col class="authors-col">
              <label for="authors-input">Authors:</label>
              <b-form-input class="authors-input" placeholder="Authors"></b-form-input>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col class=pl-1>
        <!-- Upload Data Card -->
        <b-card title="Upload Data" class="upload-card mb-2 shadow" border-variant="primary">
          <b-card-text>
            This space will contain information explaining the procedure for uploading a text file that will automatically fill the photometry table below.
          </b-card-text>
          <b-button class="submit-button" variant="primary">Import Data</b-button>
        </b-card>
      </b-col>
    </b-row>
    <!-- Data Tables -->
    <b-card class="mb-2 shadow" border-variant="primary">
    <b-row>
      <b-col class="photometry-input-col">
      <photometry-input-table></photometry-input-table>
      </b-col>
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
      <b-form-textarea id="message-input" placeholder="Message" rows="3" max-rows="6"></b-form-textarea>
    </b-row>
    </b-card>
    <!-- Submit -->
    <b-row>
      <b-col>
      <div class="submit-container">
        <b-button class="submit-button shadow" variant="success" @click="submitToHop">Submit</b-button>
      </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">

import PhotometryInputTable from "@/components/PhotometryInputTable.vue"
import AdditionalDataTable from "@/components/AdditionalDataTable.vue"
import axios from "axios"
import getEnv from "@/utils/env.js";
import { mapGetters } from "vuex";

export default {
  name: "SubmitPhotometry",
  components: {
    "photometry-input-table": PhotometryInputTable,
    "additional-data-input-table": AdditionalDataTable
  },
  mounted() {
    this.topic = 'hermes.test'
  },
  data() {
    return {
      title: '',
      authors: '',
      topic: null,
      message: '',
      eventid: '',
      user: 'Hermes User.guest',
    };
  },
  computed: {
    ...mapGetters(["getPhotometry", "getPhotometryExtraData"])
  },
  methods: {
    submitToHop() {
        console.log("Submitting to hop");
        console.log(this.getPhotometryExtraData)
      const additionalDataObj = this.getPhotometryExtraData.reduce(
          (obj, element) => ({...obj, [element.key]: element.value}), {});
      console.log(additionalDataObj)
      const candidateData = this.getPhotometry
      candidateData.forEach(function (item) {
        delete item.isActive;
        delete item.id;
      });
      let payload = {
        "topic": this.topic,
        "title": this.title,
        "author": this.user,
        "data": additionalDataObj,
        "message_text": this.message
      };
      payload.data.candidate_data = candidateData;
      payload.data.eventid = this.eventid;
      payload.data.authors = this.authors;
      console.log(JSON.stringify(payload))
      axios({
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        url: getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "submit/",

        data: JSON.stringify(payload)
      })
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            location.href = '/.html'
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  }
}

</script>

<style scoped>
.outside-container {
  width: 75%;
  margin: auto;
}

.eventid-col {
  max-width: 20%;
  padding: 0;
  padding-right: 3%;
  padding-left: 15px;
}

.authors-col {
  max-width: 100%;
  padding: 0;
  padding-right: 15px;
}

.extra-input-col {
  max-width: 20%;
}
.submit-button {
  color: white
}
.import-button {
  color: white
}
.upload-card {
  height: 96%;
}
</style>