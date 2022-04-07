<template>
  <b-container fluid class="outside-container">
    <b-row>
    <label for="title-input">Title:</label>
    <b-form-input class="title-input" placeholder="Title"></b-form-input>
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
    <b-row>
      <b-col class="candidates-input-col">
      <candidates-input-table></candidates-input-table>
      </b-col>
      <b-col class="extra-input-col">
        <label for="extra-input-table">Additional Data Elements:</label>
        <additional-data-input-table class="extra-input-table"></additional-data-input-table>
      </b-col>
    </b-row>
    <b-row>
      <label for="message-input">Message:</label>
      <b-form-textarea id="message-input" placeholder="Message" rows="3" max-rows="6"></b-form-textarea>
    </b-row>
    <b-row>
      <div class="submit-container">
        <b-button class="submit-button" variant="success" @click="submitToHop">Submit</b-button>
      </div>
    </b-row>
  </b-container>
</template>

<script lang="ts">

import CandidatesInputTable from "@/components/CandidatesInputTable.vue"
import AdditionalDataTable from "@/components/AdditionalDataTable.vue"

export default {
  name: "SubmitCandidates",
  components: {
    "candidates-input-table": CandidatesInputTable,
    "additional-data-input-table": AdditionalDataTable
  },
  data() {
    return {
      data: {
      },
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
</style>