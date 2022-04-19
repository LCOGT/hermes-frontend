<template>
  <b-container fluid class="outside-container">
    <b-row>
    <label for="title-input">Title:</label>
    <b-form-input class="title-input" v-model="title" placeholder="Title"></b-form-input>
    </b-row>
    <b-row>
      <b-col class="eventid-col">
        <label for="eventid-input">Event ID:</label>

        <b-form-input class="eventid-input" v-model="eventid" placeholder="Event ID"></b-form-input>
      </b-col>
      <b-col class="authors-col">
        <label for="authors-input">Authors:</label>
        <b-form-input class="authors-input" v-model="author" placeholder="Authors"></b-form-input>
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
    <b-row class="py-3">
      <label for="message-input">Message:</label>
      <b-form-textarea v-model="message" id="message-input" placeholder="Message" rows="3" max-rows="6"></b-form-textarea>
    </b-row>
    <b-row>
      <b-col><div>
        <label for="topic-input">Topic:</label>
        <b-form-select class="topic-input" v-model="topic" :options="['hermes.test']">Topic</b-form-select>
      </div></b-col>
      <b-col>
      <div class="submit-container">
        <b-button class="submit-button" variant="success" @click="submitToHop">Submit</b-button>
      </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

import CandidatesInputTable from "@/components/CandidatesInputTable.vue"
import AdditionalDataTable from "@/components/AdditionalDataTable.vue"
import axios from "axios"
import getEnv from "@/utils/env.js";
import { mapGetters } from "vuex";

export default {
  name: "SubmitCandidates",
  components: {
    "candidates-input-table": CandidatesInputTable,
    "additional-data-input-table": AdditionalDataTable
  },
  mounted() {
    this.topic = 'hermes.test'
  },
  data() {
    return {
      title: '',
      author: '',
      topic: null,
      message: '',
      eventid: '',
    };
  },
  computed: {
    ...mapGetters(["getCandidates", "getCandidateExtraData"])
  },
  methods: {
    submitToHop() {
        console.log("Submitting to hop");
        console.log(this.getCandidateExtraData)
      const additionalDataObj = this.getCandidateExtraData.reduce(
          (obj, element) => ({...obj, [element.key]: element.value}), {});
      console.log(additionalDataObj)
      const candidateData = this.getCandidates
      candidateData.forEach(function (item) {
        delete item.isActive;
        delete item.id;
      });
      let payload = {
        "topic": this.topic,
        "title": this.title,
        "author": this.author,
        "data": additionalDataObj,
        "message_text": this.message
      };
      payload.data.candidate_data = candidateData;
      payload.data.eventid = this.eventid;
      console.log(JSON.stringify(payload))
      axios({
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        url: getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "submit/",

        data: JSON.stringify(payload)
      })
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  }
};



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
</style>