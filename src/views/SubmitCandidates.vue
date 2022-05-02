<template>
  <message-form page-title="Candidate Submission Form">
    <candidates-input-table v-on:submit_message="submitToHop"></candidates-input-table>
  </message-form>
</template>

<script>

import CandidatesInputTable from "@/components/CandidatesInputTable.vue"
import MessageForm from "@/components/MessageForm";
import axios from "axios"
import getEnv from "@/utils/env.js";
import { mapGetters } from "vuex";

export default {
  name: "SubmitCandidates",
  components: {
    MessageForm,
    "candidates-input-table": CandidatesInputTable,
  },
  mounted() {
    this.topic = 'hermes.test'
  },
  computed: {
    ...mapGetters(["getCandidates", "getExtraData"])
  },
  methods: {
    submitToHop() {
        console.log("Submitting to hop");
        console.log(this.getExtraData)
      const additionalDataObj = this.getExtraData.reduce(
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
};

</script>

<style scoped>

</style>
