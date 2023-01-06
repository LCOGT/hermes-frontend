<template>
  <message-form page-title="Discovery Submission Form" submission-endpoint="submit_discoveries" :top-level-fields="topLevelFields">
    <template v-slot:dataTable="{ errors, onUpdate }">
      <discoveries-input-table :updateCallback="onUpdate" :fieldErrors="errors"></discoveries-input-table>
    </template>
  </message-form>
</template>

<script>

import DiscoveriesInputTable from "@/components/DiscoveriesInputTable.vue"
import MessageForm from "@/components/MessageForm";

export default {
  name: "SubmitDiscoveries",
  components: {
    MessageForm,
    "discoveries-input-table": DiscoveriesInputTable,
  },
  data() {
    return {
      topLevelFields: [
        'title',
        'topic',
        'event_id',
        'type',
        'authors'
      ]
    };
  }
};

</script>

<style scoped>

</style>
