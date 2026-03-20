<script setup>
import '@/assets/css/submissions.css';

const props = defineProps({
  extra_data: {
    type: Array,
    required: true
  },
  show: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['remove', 'copy', 'message-updated']);

const headers = [
  {
    key: "key",
    label: "Key",
    type: 'text',
    editable: true,
    placeholder: "Key",
    class: "key-column"
  },
  {
    key: "value",
    label: "Value",
    type: 'text',
    editable: true,
    placeholder: "Value",
    class: "value-column"
  },
  {
    key: "copy",
    label: "",
    editable: false,
    headerTitle: "copy",
    class: "copy-column",
  },
  {
    key: "delete",
    label: "",
    editable: false,
    headerTitle: "delete",
    class: "delete-column",
  }
]

function remove(row) {
  emit('remove', row.index);
}

function copy(row) {
  emit('copy', row.index);
}

function update() {
  emit('message-updated');
}

</script>
<template>
  <div>
    <v-data-table striped class="extra-data-table" :items="props.extra_data" :headers="headers">
      <template v-for="header in props.fields" v-slot:[`item.${header.key}`]="{ data }">
        <v-btn v-if="header.key == 'copy'" density="compact" variant="outlined" rounded="0" icon="mdi-file-document-plus-outline" v-tooltip="'Copy Row'" @click="copy(data)"></v-btn>
        <v-btn v-else-if="header.key == 'delete' && (props.allowEmpty || props.tableData.length > 1)" density="compact" variant="outlined" rounded="0" icon="mdi-trash-can-outline" v-tooltip="'Remove Row'" @click="remove(data)"></v-btn>
        <v-text-field v-else v-model="data.value" :placeholder="header.label" style="width:100%" @update:modelValue="update()"></v-text-field>
      </template>
    </v-data-table>
  </div>
</template>