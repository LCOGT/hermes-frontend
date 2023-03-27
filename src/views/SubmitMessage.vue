<template>
  <message-composition-form page-title="Photometry Reporting Form" submission-endpoint="submit_message">
  </message-composition-form>
</template>
<script>
import MessageCompositionForm from "@/components/message-composition/MessageCompositionForm.vue";

export default {
  name: "SubmitPhotometry",
  components: {
    MessageCompositionForm
  }
};
</script>
