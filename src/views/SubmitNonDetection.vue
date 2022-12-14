<template>
  <message-form page-title="Non-Detection Submission Form" submission-endpoint="submit_message">
    <non-detection-input-table></non-detection-input-table>
  </message-form>
</template>

<script>

import NonDetectionInputTable from "@/components/NonDetectionInputTable.vue"
import MessageForm from "@/components/MessageForm";

export default {
  name: "SubmitNonDetection",
  components: {
    MessageForm,
    "non-detection-input-table": NonDetectionInputTable,
  },
};

</script>

<style scoped>

</style>
