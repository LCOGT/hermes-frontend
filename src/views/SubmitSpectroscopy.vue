<template>
  <message-form page-title="Spectroscopy Reporting Form">
    <spectroscopy-input-table></spectroscopy-input-table>
  </message-form>
</template>

<script>

import SpectroscopyInputTable from "@/components/SpectroscopyInputTable.vue"
import MessageForm from "@/components/MessageForm";

export default {
  name: "SubmitSpectroscopy",
  components: {
    MessageForm,
    "spectroscopy-input-table": SpectroscopyInputTable,
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