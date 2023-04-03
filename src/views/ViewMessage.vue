<template>
  <div :class="containerSize">
    <b-alert :show="failedToLoad" variant="danger">
      <p>Message with UUID starting with {{ this.id }} not found, or UUID is not specific enough to specify a single message.</p>
    </b-alert>
    <message-detail v-if="message" :message="message"></message-detail>
  </div>
</template>
<script>
import getEnv from "@/utils/env.js";
import axios from "axios";
import '@/assets/css/view.css';
import MessageDetail from '@/views/MessageDetail.vue';

export default {
  name: "ViewMessage",
  components: {
    MessageDetail,
  },
  data() {
    return {
      message: null,
      failedToLoad: false,
    };
  },
  computed: {
    id: function() {
      return this.$route.params.id;
    },
    containerSize: function() {
      if (this.failedToLoad) {
        return 'w-99';
      }
      else {
        return 'w-100';
      }
    }
  },
  created: function() {
    axios
      .get(getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "api/v0/messages/" + this.id + '/')
      .then((response) => (this.message = response.data))
      .catch(() => this.failedToLoad = true);
  }
};
</script>
