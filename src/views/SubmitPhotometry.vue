<template>
  <message-form page-title="Photometry Reporting Form">
    <photometry-input-table v-on:submit_message="submitToHop"></photometry-input-table>
    <!-- Upload Data Card -->
    <b-card title="Upload Data" class="upload-card my-2" border-variant="light">
      <b-card-text>
        This space will contain information explaining the procedure for uploading a text file that will automatically fill the photometry table below.
      </b-card-text>
      <b-button class="submit-button" variant="primary">Import Data</b-button>
    </b-card>
  </message-form>
</template>

<script>

import PhotometryInputTable from "@/components/PhotometryInputTable.vue"
import MessageForm from "@/components/MessageForm";
import axios from "axios"
import getEnv from "@/utils/env.js";
import { mapGetters } from "vuex";

export default {
  name: "SubmitPhotometry",
  components: {
    MessageForm,
    "photometry-input-table": PhotometryInputTable,
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
</style>