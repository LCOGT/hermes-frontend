<template>
  <message-form page-title="Candidate Submission Form" submission-endpoint="submit_candidates">
    <template v-slot:dataTable="{ errors, onUpdate }">
      <candidates-input-table :updateCallback="onUpdate" :fieldErrors="errors"></candidates-input-table>
    </template>
  </message-form>
</template>

<script>

import CandidatesInputTable from "@/components/CandidatesInputTable.vue"
import MessageForm from "@/components/MessageForm";

export default {
  name: "SubmitCandidates",
  components: {
    MessageForm,
    "candidates-input-table": CandidatesInputTable,
  },
};

</script>

<style scoped>

</style>
