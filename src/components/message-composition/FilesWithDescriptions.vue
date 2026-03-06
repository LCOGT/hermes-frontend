<script setup>
import { ref, computed } from 'vue';
import {filesize} from "filesize";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  errors: {
    type: Array,
    required: true
  },
  multiple: {
    type: Boolean,
    default: true
  },
  files: {
    type: Array,
    required: true,
    default: () => {
      return [];
    }
  },
  fileDescriptions: {
    type: Array,
    required: true,
    default: () => {
      return [];
    }
  }
})

const emit = defineEmits(['message-updated', 'update:files', 'update:fileDescriptions']);

const filesModel = ref(props.files)
const localDescriptions = ref(props.fileDescriptions)

// Need to juggle filesModel (used in the file component), localFiles (list of selected files), and files (input/output files list) because
// this component works with single file or multiple file selection
const localFiles = computed(() => {
  if (Array.isArray(filesModel.value)) {
    return filesModel.value;
  }
  else {
    if (filesModel.value == null) {
      return [];
    }
    else {
      return [filesModel.value];
    }
  }
})

const validationState = computed(() => {
  if (props.errors === null || props.errors.length == 0) {
    // No validation displayed
    return null;
  }
  // If we have an error, show bad state (red outline)
  return false;
})

function removeFile(idx) {
  if (props.multiple) {
    if (idx < filesModel.value.length) {
      filesModel.value.splice(idx, 1);
      localDescriptions.value.splice(idx, 1);
    }
    updateFiles();
    updateFileDescriptions();
  }
  else {
    clearFiles();
  }
}

function clearFiles() {
  if (props.multiple) {
    filesModel.value = [];
    localDescriptions.value = [];
  }
  else {
    filesModel.value = null;
    localDescriptions.value = [];
  }
  
  updateFiles();
  updateFileDescriptions();
}

function addFiles() {
  // need to update the parent prop of files
  updateFiles();
  // If we change files, we should just clear all comments to be safe
  localDescriptions.value = [];
  // Then add an empty comment for each file that exists
  while (localDescriptions.value.length < localFiles.value.length) {
    localDescriptions.value.push('');
  }
  updateFileDescriptions();
}

function getFileSize(size) {
  return filesize(size, {standard: 'jedec'})
}

function updateFiles() {
  emit('update:files', localFiles.value);
}

function updateFileDescriptions() {
  emit('update:fileDescriptions', localDescriptions.value);
  update();
}

function update() {
  emit('message-updated');
}

</script>
<template>
  <div class="mb-2">
    <v-row>
      <v-col md="11" class="mt-2">
        <v-file-input v-model="filesModel" variant="outlined" :error-messages="props.errors" :multiple="props.multiple" :chips="props.multiple" clearable placeholder="Choose a file or drop it here..." @update:model-value="addFiles">
        </v-file-input>
      </v-col>
    </v-row>
    <v-row v-for="(file, index) in localFiles" :key="props.id + '-file-' + props.index" no-gutters>
      <v-col md="3" align-self="center" class="pr-2">
          <b>{{ file.name }}</b>
      </v-col>
      <v-col md="1" align-self="center" class="pl-2 pr-0">
          {{ getFileSize(file.size) }}
      </v-col>
      <v-col md="7">
          <v-text-field v-model="localDescriptions[index]" placeholder="Description" variant="outlined" @input="updateFileDescriptions"></v-text-field>
      </v-col>
      <v-col md="1">
          <v-btn v-tooltip="'Remove this file'" icon="mdi-trash-can-outline" variant="plain" @click="removeFile(index)"></v-btn>
      </v-col>
    </v-row>
  </div>
</template>
