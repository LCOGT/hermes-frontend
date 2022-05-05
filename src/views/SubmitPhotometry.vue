<template>
  <message-form page-title="Photometry Reporting Form">
    <photometry-input-table></photometry-input-table>
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

export default {
  name: "SubmitPhotometry",
  components: {
    MessageForm,
    "photometry-input-table": PhotometryInputTable,
  },
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