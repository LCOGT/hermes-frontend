<template>
  <div :class="containerSize">
    <b-alert :show="failedToLoad" variant="danger">
      <p>Nonlocalizedevent with ID {{ this.id }} not found.</p>
    </b-alert>
    <b-card v-if="nlevent">
      <b-card-title class="text-center">
        <b-link :href="getGraceDBLink(nlevent.event_id)" v-b-tooltip.hover
          :title="getGraceDBLink(nlevent.event_id)"><b>{{ nlevent.event_id }}</b></b-link>
      </b-card-title>
      <hr>
      <div v-if="nlevent.sequences.length > 0">
        <h4 class="text-center">Sequences:</h4>
        <div class="accordion" role="tablist" v-for="(sequence, idx) in nlevent.sequences" :key="'sequence-' + idx">
          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-0" role="tab">
              <b-button block v-b-toggle="'sequence-' + idx" variant="light">{{ getSequenceHeader(sequence) }}</b-button>
            </b-card-header>
            <b-collapse :id="'sequence-' + idx" accordion="sequence-accordion" role="tabpanel">
              <message-detail :message="sequence.message" :id="'sequence-' + idx" class="mt-2"></message-detail>
            </b-collapse>
          </b-card>
        </div>
      </div>
      <div v-if="nlevent.references.length > 0">
        <h4 class="text-center">References:</h4>
        <div class="accordion" role="tablist" v-for="(reference, idx) in nlevent.references" :key="'reference-' + idx">
          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-0" role="tab">
              <b-button block v-b-toggle="'reference-' + idx" variant="light">{{ reference.uuid }}</b-button>
            </b-card-header>
            <b-collapse :id="'reference-' + idx" accordion="reference-accordion" role="tabpanel">
              <message-detail :message="reference" :id="'reference-' + idx" class="mt-2"></message-detail>
            </b-collapse>
          </b-card>
        </div>
      </div>
    </b-card>
  </div>
</template>
<script>
import getEnv from "@/utils/env.js";
import axios from "axios";
import '@/assets/css/view.css';
import MessageDetail from '@/views/MessageDetail.vue';
import { logoutMixin } from '@/mixins/logoutMixin.js';

export default {
  name: "ViewNonlocalizedevent",
  mixins: [logoutMixin],
  components: {
      MessageDetail,
  },
  data() {
    return {
      nlevent: null,
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
      .get(getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "api/v0/nonlocalizedevents/" + this.id + '/', {
        withCredentials: true,
      })
      .then((response) => (this.nlevent = response.data))
      .catch((error) => {
        this.failedToLoad = true;
        if (error.response.status == 401){
          this.logout();
        }
      });
  },
  methods: {
    getSequenceHeader: function(sequence) {
      return sequence.sequence_number + ': ' + sequence.sequence_type;
    },
    getGraceDBLink(superevent_id) {
      return 'https://gracedb.ligo.org/superevents/' + superevent_id + '/view/';
    },
  }
};
</script>
