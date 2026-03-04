<script setup>
import { ref, computed, onMounted } from 'vue';

import '@/assets/css/view.css';
import MessageDetail from '@/views/MessageDetail.vue';
import { useStateStore } from '@/stores/state';
import { useLogout } from '@/utils/logout.js';

const { logout } = useLogout();
const stateStore = useStateStore()

const nlevent = ref(null);
const failedToLoad = ref(false);

const props = defineProps({
  id: {
    type: String,
    required: true,
  }
})

const containerSize = computed(() => {
  if (this.failedToLoad) {
    return 'w-99';
  }
  else {
    return 'w-100';
  }
})

const graceDBLink = computed(() => {
  return `https://gracedb.ligo.org/superevents/${props.id}/view/`
})

onMounted(async () => {
  fetch(stateStore.hermesUrl + `api/v0/nonlocalizedevents/${props.id}/`, {
    credentials: 'include',
    method: 'get'
  })
  .then((response) => {
    if (!response.ok) {
      let error = new Error("HTTP " + response.status);
      error.response = response;
      error.status = response.status;
      throw error;
    }
    return response.json();
  })
  .then(data => {
    this.nlevent.value = data
  })
  .catch((error) => {
    console.log(error);
    failedToLoad.value = true
    if (error.response.status == 401){
      logout();
    }
  });
})

function getSequenceHeader(sequence) {
  return sequence.sequence_number + ': ' + sequence.sequence_type;
}

</script>
<template>
  <div :class="containerSize">
    <v-alert v-if="failedToLoad" type="error">
      <p>Nonlocalizedevent with ID {{ props.id }} not found.</p>
    </v-alert>
    <v-card v-if="nlevent">
      <v-card-title class="text-center">
        <v-btn :href="graceDBLink" v-tooltip="getGraceDBLink">
          <b>{{ props.id }}</b>
        </v-btn>
      </v-card-title>
      <hr>
      <v-expansion-panels v-if="nlevent.value.sequences.length > 0">
        <h4 class="text-center">Sequences:</h4>
        <v-expansion-panel v-for="(sequence, idx) in nlevent.value.sequences" :key="'sequence-' + idx" :title="getSequenceHeader(sequence)">
          <v-expansion-panel-text>
            <message-detail :uuid="sequence.message.uuid"></message-detail>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels v-if="nlevent.value.references.length > 0">
        <h4 class="text-center">References:</h4>
        <v-expansion-panel v-for="(reference, idx) in nlevent.value.references" :key="'reference-' + idx" :title="reference.uuid">
          <v-expansion-panel-text>
            <message-detail :uuid="reference.uuid"></message-detail>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>
