<template>
  <b-container>
    <b-alert v-if="!isLoggedIn" :show="!isLoggedIn" variant="danger" style="text-align:center;">
      You must login to submit a message
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
