<template>
  <message-form page-title="Search Pointing Submission Form" submission-endpoint="submit_message">
    <search-pointing-input-table></search-pointing-input-table>
  </message-form>
</template>

<script>

import SearchPointingInputTable from "@/components/SearchPointingInputTable.vue"
import MessageForm from "@/components/MessageForm";

export default {
  name: "SubmitSearchPointing",
  components: {
    MessageForm,
    "search-pointing-input-table": SearchPointingInputTable,
  },
};

</script>

<style scoped>

</style>
