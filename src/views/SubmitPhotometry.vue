<template>
  <b-container fluid class="outside-container">
    <b-row>
    <b-col>
      <b-row>
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
      <b-row>
        <b-col class="eventid-col">
          <label for="eventid-input">Event ID:</label>

          <b-form-input class="eventid-input" placeholder="Event ID"></b-form-input>
        </b-col>
        <b-col class="authors-col">
          <label for="authors-input">Authors:</label>
          <b-form-input class="authors-input" placeholder="Authors"></b-form-input>
        </b-col>
      </b-row>
    </b-col>
      <b-col>
        <b-card title="Upload Data">
          <b-card-text>
            This space will contain information explaining the procedure for uploading a text file that will automatically fill the photometry table below.
          </b-card-text>
          <b-button class="submit-button" variant="primary">Import Data</b-button>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="photometry-input-col">
      <photometry-input-table></photometry-input-table>
      </b-col>
      <b-col class="extra-input-col">
        <label for="extra-input-table">Additional Data Elements:</label>
        <additional-data-input-table class="extra-input-table"></additional-data-input-table>
      </b-col>
    </b-row>
    <b-row class="py-3">
      <label for="message-input">Message:</label>
      <b-form-textarea id="message-input" placeholder="Message" rows="3" max-rows="6"></b-form-textarea>
    </b-row>
    <b-row>
      <b-col>
      <div class="submit-container">
        <b-button class="submit-button" variant="success" @click="submitToHop">Submit</b-button>
      </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">

import PhotometryInputTable from "@/components/PhotometryInputTable.vue"
import AdditionalDataTable from "@/components/AdditionalDataTable.vue"

export default {
  name: "SubmitPhotometry",
  components: {
    "photometry-input-table": PhotometryInputTable,
    "additional-data-input-table": AdditionalDataTable
  },
  data() {
    return {
      title: '',
      author: '',
      topic: 'hermes.test',
      message: '',
      eventid: '',
    };
  },
  methods: {
    submitToHop() {
      console.log("Submitting to hop")
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
}

.authors-col {
  max-width: 100%;
  padding: 0;
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
</style>