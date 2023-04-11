<template>
  <div :class="containerSize">
    <b-alert :show="failedToLoad" variant="danger">
      <p>Message with UUID starting with {{ this.id }} not found, or UUID is not specific enough to specify a single message.</p>
    </b-alert>
    <message-detail v-if="message" :message="message"></message-detail>
  </div>
</template>
<script>
import axios from "axios";
import '@/assets/css/view.css';
import MessageDetail from '@/views/MessageDetail.vue';
import { logoutMixin } from '@/mixins/logoutMixin.js';
import { mapGetters } from "vuex";

export default {
  name: "ViewMessage",
  components: {
    MessageDetail,
  },
  mixins: [logoutMixin],
  data() {
    return {
      message: null,
      failedToLoad: false,
    };
  },
  computed: {
    ...mapGetters(["getHermesUrl"]),
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
      .get(this.getHermesUrl + "api/v0/messages/" + this.id + '/', {
          withCredentials: true,
        })
      .then((response) => (this.message = response.data))
      .catch((error) => {
        this.failedToLoad = true;
        if (error.response.status == 401){
          this.logout();
        }
      });
  }
};
</script>
