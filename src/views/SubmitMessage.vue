<template>
  <b-container>
    <b-alert v-if="!isLoggedIn" variant="danger">
      <p>You must login to submit a message</p>
    </b-alert>
    <message-composition-form v-else page-title="Photometry Reporting Form" submission-endpoint="submit_message">
    </message-composition-form>
  </b-container>
</template>
<script>
import MessageCompositionForm from "@/components/message-composition/MessageCompositionForm.vue";
import { mapGetters } from "vuex";

export default {
  name: "SubmitPhotometry",
  components: {
    MessageCompositionForm
  },
  computed: {
    ...mapGetters(["isLoggedIn"])
  }
};
</script>
