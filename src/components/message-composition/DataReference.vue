<script setup>
import '@/assets/css/submissions.css';
import { useSchemaDataUtils } from '@/utils/schemaDataUtils.js';
import ConfirmDialogBtn from '@/components/message-composition/ConfirmDialogBtn.vue';

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  errors: {
    type: Object,
    required: true
  },
  reference: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['remove', 'copy', 'message-updated']);

const { remove, copy, update } = useSchemaDataUtils(emit)

const sourceList = [
  { value: "hop_uuid", text: "Hop UUID" },
  { value: "doi", text: "DOI" },
  { value: "gracedb_id", text: "GraceDB ID" },
  { value: 'gcn_circular', text: 'GCN Circular ID'}
]

</script>
<template>
  <v-container class="p-0" :id="'data-reference-' + props.index">
    <v-row align="center">
      <v-col md="1" class="text-center data-label-text">
        <b>{{ props.index }}</b>
      </v-col>
      <v-col md="2">
        <v-combobox v-model="props.reference.source" label="Source" variant="outlined" :error-messages="props.errors.source" :items="sourceList" item-value="value" item-title="text" :return-object="false" @update:modelValue="update" />
      </v-col>
      <v-col md="3">
        <v-text-field v-model="props.reference.citation" label="Citation" variant="outlined" :error-messages="props.errors.citation" @update:modelValue="update" />
      </v-col>
      <v-col md="4">
        <v-text-field v-model="props.reference.url" label="Url" variant="outlined" :error-messages="props.errors.url" @update:modelValue="update" />
      </v-col>
      <v-col md="2" class="text-right">
        <v-btn-group divided color="primary-darken-1" class="data-label-text">
          <v-btn icon="mdi-file-document-plus-outline" v-tooltip="'Copy this Reference'" @click="copy" />
          <confirm-dialog-btn
            btn-tooltip="Remove this Reference"
            btn-icon="mdi-trash-can-outline"
            confirm-text="Are you sure you want to remove this Reference?"
            confirm-action="Remove"
            @confirmed="remove">
          </confirm-dialog-btn>
        </v-btn-group>
      </v-col>
    </v-row>
  </v-container>
</template>