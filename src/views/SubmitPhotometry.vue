<template>
  <message-form page-title="Photometry Reporting Form">
    <photometry-input-table></photometry-input-table>
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
}
</script>
