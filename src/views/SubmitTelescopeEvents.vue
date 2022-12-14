<template>
  <message-form :nle-id=false page-title="Observatory Status Events" submission-endpoint="submit_message">
    <telescope-event-table></telescope-event-table>
  </message-form>
</template>

<script>
import MessageForm from "@/components/MessageForm";
import TelescopeEventTable from "@/components/TelescopeEventTable";

export default {
  name: "SubmitTelescopeEvents",
  components: {
    MessageForm,
    'telescope-event-table': TelescopeEventTable
  },
}
</script>

<style scoped>

</style>
