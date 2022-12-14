<template>
  <message-form page-title="Spectroscopy Reporting Form" submission-endpoint="submit_message">
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

</style>
