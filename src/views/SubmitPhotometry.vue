<template>
  <message-form page-title="Photometry Reporting Form" submission-endpoint="submit_photometry" :top-level-fields="topLevelFields">
    <template v-slot:dataTable="{ errors, onUpdate }">
      <photometry-input-table :updateCallback="onUpdate" :fieldErrors="errors"></photometry-input-table>
    </template>
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
  data() {
    return {
      topLevelFields: [
        'title',
        'topic',
        'event_id',
        'authors'
      ]
    };
  }
};
</script>
