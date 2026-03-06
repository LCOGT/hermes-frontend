
<script setup>
import '@/assets/css/submissions.css';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import ConfirmDialogBtn from '@/components/message-composition/ConfirmDialogBtn.vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  errors: {
    type: Array,
    required: true
  },
  tableData: {
    type: Array,
    required: true
  },
  fields: {
    type: Array,
    required: true
  },
  allowEmpty: {
    type: Boolean,
    default: true
  },
  show: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['remove', 'copy', 'message-updated']);

function getCellError(row, key) {
  if (row < props.errors.length) {
    if (key in props.errors[row]){
      return props.errors[row][key].join(', ');
    }
  }
  return '';
}

function remove(index) {
  emit('remove', index);
}

function copy(index) {
  emit('copy', index);
}

function update() {
  emit('message-updated');
}

</script>
<template>
  <div>
    <v-data-table class="data-table-style" :items="props.tableData" :headers="props.fields" density="compact" hide-default-footer disable-sort>
      <template v-for="header in props.fields" v-slot:[`item.${header.key}`]="{ item, index }">
        <v-text-field v-if="header.type == 'text' && !header.list" v-model="props.tableData[index][header.key]" :error-messages="getCellError(index, header.key)" variant="outlined" density="compact" :placeholder="header.title" style="width:100%" @update:modelValue="update()"></v-text-field>
        <v-combobox v-else-if="header.type == 'text' && header.list" item-title="text" item-value="value" :return-object="false" :items="header.list" v-model="props.tableData[index][header.key]" :error-messages="getCellError(index, header.key)" variant="outlined" density="compact" :placeholder="header.title" @update:modelValue="update()"></v-combobox>
        <v-select v-else-if="header.type == 'select'" v-model="props.tableData[index][header.key]" :items="header.options" item-value="value" item-title="text" :error-messages="getCellError(index, header.key)" variant="outlined" density="compact" @update:modelValue="update()"></v-select>
        <v-switch v-else-if="header.type == 'checkbox'" class="d-flex justify-center align-with-fields" v-model="props.tableData[index][header.key]" color="primary" hide-details :error-messages="getCellError(index, header.key)" variant="outlined" density="compact" @update:modelValue="update()"></v-switch>
        <VueDatePicker v-else-if="header.type == 'date'" class="cell-date-picker" v-model="props.tableData[index][header.key]" model-type="iso" :dark="true" :teleport="true" :placeholder="header.title" required  @update:modelValue="update()"></VueDatePicker>
        <b v-else-if="header.key == 'index'" class="align-with-fields">{{ index }}</b>
        <v-btn v-else-if="header.key == 'copy'" class="align-with-fields" density="compact" variant="plain" rounded="0" icon="mdi-file-document-plus-outline" v-tooltip="'Copy this ' + props.id" @click="copy(index)"></v-btn>
        <confirm-dialog-btn
          v-else-if="header.key == 'delete' && (props.allowEmpty || props.tableData.length > 1)"
          variant="plain"
          density="compact"
          rounded="0"
          class="align-with-fields"
          btn-tooltip="Remove this row"
          btn-icon="mdi-trash-can-outline"
          confirm-text="Are you sure you want to remove this row?"
          confirm-action="Remove"
          @confirmed="remove(index)">
        </confirm-dialog-btn>
      </template>
    </v-data-table>
  </div>
</template>
<style>
  .align-with-fields {
    position: relative;
    top: -10px;
  }

  .v-data-table__td:has(.cell-date-picker) {
    vertical-align:top;
  }

  .v-table > .v-table__wrapper > table > tbody > tr > td,
  .v-table > .v-table__wrapper > table > tbody > tr > th,
  .v-table > .v-table__wrapper > table > thead > tr > td,
  .v-table > .v-table__wrapper > table > thead > tr > th,
  .v-table > .v-table__wrapper > table > tfoot > tr > td,
  .v-table > .v-table__wrapper > table > tfoot > tr > th {
    padding: 0 4px !important;
  }
</style>