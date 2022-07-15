<template>
  <message-form page-title="Candidate Submission Form">
    <candidates-input-table></candidates-input-table>
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
