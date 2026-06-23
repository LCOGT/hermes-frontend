
<script setup>
import MessageCompositionForm from "@/components/message-composition/MessageCompositionForm.vue";
import { useStateStore } from '@/stores/state';

const stateStore = useStateStore()

</script>
<template>
  <v-container class="pt-0 pl-0 pr-0" fluid>
    <v-alert v-if="!stateStore.userIsAuthenticated" type="error" style="text-align:center;" text="You must login to submit a message">
    </v-alert>
    <message-composition-form v-else page-title="Photometry Reporting Form" submission-endpoint="submit_message">
    </message-composition-form>
  </v-container>
</template>
