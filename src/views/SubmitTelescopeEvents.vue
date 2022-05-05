<template>
  <message-form :nle-id=false page-title="Observatory Status Events">
    <telescope-event-table v-on:submit_message="submitToHop"></telescope-event-table>
  </message-form>
</template>

<script>
import MessageForm from "@/components/MessageForm";
import TelescopeEventTable from "@/components/TelescopeEventTable";
import {mapGetters} from "vuex";
import axios from "axios";
import getEnv from "@/utils/env";
export default {
  name: "SubmitTelescopeEvents",
  components: {
    MessageForm,
    'telescope-event-table': TelescopeEventTable
  },
  mounted() {
    this.topic = 'hermes.test'
  },
  computed: {
    ...mapGetters(["getTelescopeEvents", "getExtraData"])
  },
  methods: {
    submitToHop() {
      const additionalDataObj = this.getExtraData.reduce(
          (obj, element) => ({...obj, [element.key]: element.value}), {});
      const telescopeEventData = this.getTelescopeEvents;
      telescopeEventData.forEach(function (item) {
        delete item.isActive;
        delete item.id;
      });
      let payload = {
        "topic": this.topic,
        "title": this.title,
        "author": this.user,
        "data": additionalDataObj,
        "message_text": this.message
      };
      payload.data.telescope_events = telescopeEventData;
      payload.data.authors = this.authors;
      console.log(JSON.stringify(payload))
      axios({
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        url: getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "submit/",

        data: JSON.stringify(payload)
      })
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            location.href = '/.html'
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  }
}
</script>

<style scoped>

</style>