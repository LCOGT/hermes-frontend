<template>
  <message-form :nle-id=false page-title="Submit Non-localized Event">
    <non-localized-event-table></non-localized-event-table>
  </message-form>
</template>

<script>
import MessageForm from "@/components/MessageForm";
import NLEventTable from "@/components/NLEventTable.vue";

export default {
  name: "SubmitNonLocalizedEvent",
  components: {
    MessageForm,
    'non-localized-event-table': NLEventTable
  },
}
</script>

<style scoped>

</style>
