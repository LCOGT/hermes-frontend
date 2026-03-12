<script setup>
import { ref, computed, watch } from 'vue';
import _ from 'lodash';
import '@/assets/css/submissions.css';

const props = defineProps({
  errors: {
    required: true
  },
  datatype: {
    type: String,
    required: true
  },
  pluralDatatype: {
    type: String,
    required: false
  },
  isEmpty: {
    type: Boolean,
    default: false
  },
  sectionShowSimple: {
    type: Boolean,
    default: true
  },
  onlySimple: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  allowLoading: {
    type: Boolean,
    default: false
  },
  section: {
    type: String,
    required: true
  }
})

// Expose the forceVisibility function to parent component
defineExpose({
  forceVisibility
});

const emit = defineEmits(['parse-csv', 'new-row', 'toggle-section-show-simple', 'copy-headers']);

const visible = ref(false)
const panel = ref([])
const fileRef = ref(null)
const fileInput = ref(null)

watch(() => fileInput, () => {
  if (fileInput.value) {
    emit('parse-csv', props.section, fileInput.value);
  }
});

const capitalSection = computed(() => {
  if (props.pluralDatatype){
    return props.pluralDatatype;
  }
  return _.capitalize(props.section);
})

const hasErrors = computed(() => {
  return !_.isEmpty(props.errors);
})

const textStyle = computed(() => {
  if (props.allowLoading) {
    return 'font-size: x-large;';
  }
  else {
    return 'margin-right: 92px !important; font-size: x-large;';
  }
})

const getMainColor = computed(() => {
  if (hasErrors.value){
    return 'error';
  }
  else if (props.isEmpty) {
    return 'primary';
  }
  else{
    return 'success';
  }
})

function forceVisibility(shouldShow) {
  if (shouldShow) {
    panel.value = [props.section + 'Panel'];
  }
  else {
    panel.value = [];
  }
}

function addNewRowIfEmpty() {
  if (props.isEmpty) {
    emit('new-row');
  }
}

const errorTooltipString = computed(() => {
  if (_.isEmpty(props.errors)){
    return null;
  }
  let errorStr = 'Field Errors:\n';
  if (_.isArray(props.errors)){
    for (var i = 0; i < props.errors.length; i += 1) {
      if (_.isString(props.errors[i])) {
        errorStr += props.errors[i] + '\n';
      }
      else if (_.isObject(props.errors[i]) && !_.isEmpty(props.errors[i])) {
        _.forEach(props.errors[i], function(value, key) {
          errorStr += i + ': ' + key + '\n';
        });
      }
    }
  }
  return errorStr;
})

function toggleSectionShowSimple() {
  emit('toggle-section-show-simple', props.section);
}

function copyHeaders() {
  emit('copy-headers', props.section);
}

function openFileInput() {
  if (fileRef.value) {
    fileRef.value.click();
  }
}

function loadCsv(files) {
  // Upload CSV from file and return text
  if (!files.length)
    return;
  let reader = new FileReader();
  reader.onload = () => {
    fileInput.value = reader.result;
  }
  reader.readAsText(files[0]);
}

</script>
<template>
  <v-container class="pa-0" :id="'data-' + section">
    <v-expansion-panels variant="accordion" static v-model="panel">
      <v-expansion-panel hide-actions @click="addNewRowIfEmpty" :value="props.section + 'Panel'">
        <v-expansion-panel-title :color="getMainColor" class="pa-0">
          <v-row no-gutters align="center" justify="center">
            <v-col v-if="hasErrors" class="d-flex justify-start error-icon">
              <v-icon icon="mdi-alert-circle" color="red-darken-4" size="48" v-tooltip="errorTooltipString"></v-icon>
            </v-col>
            <v-col v-if="props.isEmpty" class="text-center" :style="textStyle">
              Add {{ props.datatype }}
            </v-col>
            <v-col v-else class="text-center" :style="textStyle">
              {{ capitalSection }}
            </v-col>
            <v-col class="d-flex justify-end">
              <v-btn-group divided color="primary-darken-1" rounded="0">
                <v-btn v-if="props.allowLoading" icon="mdi-clipboard-outline" v-tooltip="'Copy Headers'" @click.stop="copyHeaders()"></v-btn>
                <v-btn v-if="props.allowLoading" icon="mdi-upload" v-tooltip="'Load CSV File'" @click.stop="openFileInput()"></v-btn>
                <v-btn v-if="props.sectionShowSimple && !props.onlySimple" icon="mdi-sitemap-outline" v-tooltip="'Advanced UI'" :disabled="props.disabled" @click.stop="toggleSectionShowSimple()"></v-btn>
                <v-btn v-if="!props.sectionShowSimple || props.onlySimple" icon="mdi-list-box-outline" v-tooltip="'Simple UI'" :disabled="props.disabled" @click.stop="toggleSectionShowSimple()"></v-btn>
              </v-btn-group>
              <v-file-input ref="fileRef" accept=".csv,.txt" @change="loadCsv" style="display: none"></v-file-input>
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <slot />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>