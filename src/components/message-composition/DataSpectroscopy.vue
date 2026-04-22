<script setup>
import { ref, computed, watch } from 'vue';
import _ from 'lodash';
import '@/assets/css/view.css';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import FilesWithDescriptions from '@/components/message-composition/FilesWithDescriptions.vue'
import ConfirmDialogBtn from '@/components/message-composition/ConfirmDialogBtn.vue';
import { useTnsUtils } from '@/utils/tnsUtils.js';
import { useSchemaDataUtils } from '@/utils/schemaDataUtils.js';

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  errors: {
    type: Object,
    required: true
  },
  spectroscopy: {
    type: Object,
    required: true
  },
  targets: {
    type: Array,
    required: true,
    default: () => {
      return [];
    }
  },
  isTns: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['remove', 'copy', 'message-updated']);

const { getTnsValuesList } = useTnsUtils();
const { remove, copy, update, getErrors } = useSchemaDataUtils(emit);

const tab = ref('file');
const wavelengthUnits = ['µm', 'nm', 'Å', 'Hz', 'GHz', 'THz'];
const fluxUnits = ['mJy', 'erg / s / cm² / Å'];
const fluxTypes = ['Fλ', 'Fν'];
const proprietaryPeriodUnits = ['Days', 'Months', 'Years'];
const fileHeader = ref({});
const advancedOptionsCollapsed = ref(!props.isTns);
const id = 'spectroscopy-' + props.index

const targetNames = computed(() => {
  return _.map(props.targets, 'name');
})

const advancedOptionsIcon = computed(() => {
  if (advancedOptionsCollapsed.value) {
    return 'mdi-arrow-expand-vertical';
  }
  else {
    return 'mdi-arrow-collapse-vertical';
  }
})

watch(() => props.isTns, (value) => {
  if (value){
    advancedOptionsCollapsed.value = false;
  }
});

watch(() => props.spectroscopy.files, (files) => {
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++){
      if (files[i].name.includes('.fits')) {
        files[i].arrayBuffer().then( (value) => {
          fileHeader.value = getHeader(value);
          fillInFromHeader(fileHeader.value);
        }, (reason) => {
          console.log(reason);
        })
        break;
      }
    }
  }
  else {
    fileHeader.value = {};
  }
});

function getHeader(fileData) {
  var header = {};
  var headerPos = 0;
  // This fits header parsing code is adapted from www.clearskyinstitute.com/fits/ fits viewer javascript code
  try {
    for (headerPos = 0; headerPos < fileData.byteLength; headerPos += 80) {
      var line = String.fromCharCode.apply(null, new Uint8Array(fileData, headerPos, 80));
      if (line.match(/^END */)) {
        headerPos += 80;
        break;
      }

      if (line.indexOf("=") < 0) {
        // Skip COMMENT/HISTORY
        continue;
      }
      // Key is first 8 characters of line
      var key = line.substring(0, 8);
      // Remove trailing blanks from key
      key = key.replace(/ *$/, "");

      // Value starts in line 11
      var value = line.substring(10);
      value = value.replace(/^ */, "");  // remove leading breaks
      value = value.replace(/\/.*$/, "");  // remove comments
      value = value.replace(/ *$/, "");  // remove trailing blanks
      if (value.indexOf("'") >= 0) {
        value = value.substring(1, value.length-2);  // treat value is a string
        value = value.trim();
      }
      else if (value.indexOf("T") >= 0) {
        value = true;  // treat value as a boolean True
      }
      else if (value.indexOf("F") >= 0) {
        value = false;  // treat value as a boolean False
      }
      else if (value.indexOf(".") >= 0) {
        value = parseFloat(value);  // treat value as a float
      }
      else {
        value = parseInt(value);  // treat value as an int
      }
      header[key] = value;
    }
    console.log(header);
  } catch(e) {
    console.log("File does not have standard .fits format");
  }
  return header;
}

function fillInFieldFromHeader(header, headerKeys, fieldName){
  headerKeys.forEach((headerKey) => {
    if (headerKey in header) {
      props.spectroscopy[fieldName] = header[headerKey].toString();
      return;
    }
  });
}

function fillInFromHeader(header) {
  if (header == {}) {
    return;
  }
  // Attempt to fill in the obs date
  fillInFieldFromHeader(header, ['DATE-OBS', 'MJD-OBS'], 'date_obs');
  // Attempt to fill in the exposure time
  fillInFieldFromHeader(header, ['EXPTIME'], 'exposure_time');
  // Attempt to fill in the observer
  fillInFieldFromHeader(header, ['USERID'], 'observer');
  // Attempt to fill in the instrument field
  fillInFieldFromHeader(header, ['INSTRUME'], 'instrument');
  // Attempt to fill in the telescope field
  fillInFieldFromHeader(header, ['TELESCOP', 'SITE', 'ORIGIN'], 'telescope');
  update();
}

function copyFlux(idx) {
  props.spectroscopy.flux.push(_.cloneDeep(props.spectroscopy.flux[idx]));
  props.spectroscopy.flux_error.push(_.cloneDeep(props.spectroscopy.flux_error[idx]));
  props.spectroscopy.wavelength.push(_.cloneDeep(props.spectroscopy.wavelength[idx]));
  update();
}

function removeFlux(idx) {
  props.spectroscopy.flux.splice(idx, 1);
  props.spectroscopy.flux_error.splice(idx, 1);
  props.spectroscopy.wavelength.splice(idx, 1);
  update();
}

function getArrayErrors(section, idx) {
  return _.get(props.errors, [section, idx], {});
}

function switchToRaw() {
  if (props.spectroscopy.flux.length == 0){
    props.spectroscopy.flux.push(null);
    props.spectroscopy.flux_error.push(0);
    props.spectroscopy.wavelength.push(null);
    update();
  }
}

</script>
<template>
  <v-container class="p-0" :id="'data-spectroscopy-' + index" fluid>
    <v-card variant="outlined">
      <v-card-title>
        <v-row align="center">
          <v-col md="3" class=" text-center data-label-text">
            <b>Spectroscopy Datum {{ index }}</b>
          </v-col>
          <v-col md="3">
            <v-select
              v-model="props.spectroscopy.target_name"
              label="Target"
              variant="outlined"
              density="compact"
              v-tooltip="'Target name as defined in the Targets section'"
              :error-messages="props.errors.target_name"
              :items="targetNames"
              @update:modelValue="update"
            />
          </v-col>
          <v-col md="3">
            <VueDatePicker
              v-model="props.spectroscopy.date_obs"
              model-type="iso"
              class="cell-date-picker data-label-text"
              placeholder="Observation Date"
              v-tooltip="'The date the observation producing this datum was taken'"
              :dark="true"
              :teleport="true"
              required
              error-messages="props.errors.date_obs"
              @update:modelValue="update">
            </VueDatePicker>
          </v-col>
          <v-col md="2" offset-md="1" class="text-right">
            <v-btn-group divided color="primary-darken-1" class="data-label-text">
              <v-btn v-tooltip="'Advanced Spectroscopy Fields'" :icon="advancedOptionsIcon" :disabled="props.isTns" @click="advancedOptionsCollapsed = !advancedOptionsCollapsed">
              </v-btn>
              <v-btn v-tooltip="'Copy this Spectroscopy Datum'" icon="mdi-file-document-plus-outline" @click="copy">
              </v-btn>
              <confirm-dialog-btn
                btn-tooltip="Remove this Spectroscopy Datum"
                btn-icon="mdi-trash-can-outline"
                confirm-text="Are you sure you want to remove this Spectroscopy Datum?"
                confirm-action="Remove"
                @confirmed="remove">
              </confirm-dialog-btn>
            </v-btn-group>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-tabs color="primary" v-model="tab">
            <v-tab value="file">File Input</v-tab>
            <v-tab value="raw" @click="switchToRaw">Raw Data</v-tab>
          </v-tabs>
          <v-divider />
          <v-tabs-window v-model="tab" class="w-100">
            <v-tabs-window-item value="file">
              <v-container fluid>
                <p class="text-primary">
                  Upload one or more spectrum files to associate with your message.
                  These files will be stored in the Scimma Archive and will be <b>publicly accessible</b> and linked from the message.
                  They should follow commonly used spectrum data formats.
                </p>
                <files-with-descriptions
                  :id="id + '-files'"
                  :errors="getErrors(props.errors, 'files', [])"
                  :multiple=true
                  v-model:files="props.spectroscopy.files"
                  v-model:fileDescriptions="props.spectroscopy.file_descriptions"
                  :show-spectra-preview="true"
                  @message-updated="update"
                >
                </files-with-descriptions>
              </v-container>
            </v-tabs-window-item>
            <v-tabs-window-item value="raw">
              <v-container>
                <v-alert v-if="getErrors(props.errors, 'flux', []).length > 0 && props.spectroscopy.flux.length == 0" type="error" title="Flux Errors:">
                  <span v-html="getErrors(props.errors, 'flux', [])[0]"></span>
                </v-alert>
                <v-row class="mb-1" justify="center" v-for="(flux, idx) in props.spectroscopy.flux" :key="'flux-' + idx">
                  <v-col md="3">
                    <v-text-field v-model="props.spectroscopy.flux[idx]" label="Flux" variant="outlined" :error-messages="getArrayErrors('flux', idx)" @update:modelValue="update" style="min-width:100%;"/>
                  </v-col>
                  <v-col md="3">
                    <v-text-field v-model="props.spectroscopy.flux_error[idx]" label="Flux Error" variant="outlined" :error-messages="getArrayErrors('flux_error', idx)" @update:modelValue="update" />
                  </v-col>
                  <v-col md="4">
                    <v-text-field v-model="props.spectroscopy.wavelength[idx]" label="Wavelength" variant="outlined" :error-messages="getArrayErrors('wavelength', idx)" @update:modelValue="update" />
                  </v-col>
                  <v-col md="2" class="text-right">
                    <v-btn-group divided>
                      <v-btn v-tooltip="'Copy this Flux value'" icon="mdi-file-document-plus-outline" color="secondary" @click="copyFlux(idx)">
                      </v-btn>
                      <v-btn :disabled="props.spectroscopy.flux.length == 0" v-tooltip="'Remove this Flux value'" color="secondary" icon="mdi-trash-can-outline" @click="removeFlux(idx)">
                      </v-btn>
                    </v-btn-group>
                  </v-col>
                </v-row>
              </v-container>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-row>
        <v-row class="mt-4">
          <v-col md="4">
            <v-select
              v-model="props.spectroscopy.flux_units"
              label="Flux Units"
              variant="outlined"
              :error-messages="props.errors.flux_units"
              :items="fluxUnits"
              @update:modelValue="update"
            />
          </v-col>
          <v-col md="4">
            <v-select
              v-model="props.spectroscopy.wavelength_units"
              label="Wavelength Units"
              variant="outlined"
              :error-messages="props.errors.wavelength_units"
              :items="wavelengthUnits"
              @update:modelValue="update"
            />
          </v-col>
          <v-col md="4">
            <v-select
              v-model="props.spectroscopy.flux_type"
              label="Flux Type"
              variant="outlined"
              :error-messages="props.errors.flux_type"
              :items="fluxTypes"
              @update:modelValue="update"
            />
          </v-col>
        </v-row>
        <v-row class="mt-1">
          <v-col md="4">
            <v-text-field v-model="props.spectroscopy.proprietary_period" label="Proprietary Period" variant="outlined" rounded="0" :error-messages="props.errors.proprietary_period" @update:modelValue="update">
              <template v-slot:append>
                <v-select v-model="props.spectroscopy.proprietary_period_units" variant="outlined" class="appended-element" label="Units" rounded="0" :items="proprietaryPeriodUnits" hide-details @update:modelValue="update"></v-select>
              </template>
            </v-text-field>
          </v-col>
          <v-col md="4">
            <v-text-field v-if="!props.isTns" v-model="props.spectroscopy.telescope" label="Telescope" variant="outlined" :error-messages="props.errors.telescope" @update:modelValue="update" />
            <v-autocomplete
              v-else
              v-model="props.spectroscopy.telescope"
              label="Telescope"
              variant="outlined"
              :items="getTnsValuesList('telescopes', false)"
              clearable
              :error-messages="props.errors.telescope"
              @update:modelValue="update"
            />
          </v-col>
          <v-col md="4">
            <v-text-field v-if="!props.isTns" v-model="props.spectroscopy.instrument" label="Instrument" variant="outlined" :error-messages="props.errors.instrument" @update:modelValue="update" />
            <v-autocomplete
              v-else
              v-model="props.spectroscopy.instrument"
              label="Instrument"
              variant="outlined"
              :items="getTnsValuesList('instruments', false)"
              clearable
              :error-messages="props.errors.instrument"
              @update:modelValue="update"
            />
          </v-col>
        </v-row>
        <span v-if="!advancedOptionsCollapsed">
          <v-row  class="mt-1">
            <v-col md="3">
              <v-text-field v-model="props.spectroscopy.observer" label="Observer" variant="outlined" :error-messages="props.errors.observer" @update:modelValue="update" />
            </v-col>
            <v-col md="3">
              <v-text-field v-model="props.spectroscopy.reducer" label="Reducer" variant="outlined" :error-messages="props.errors.reducer" @update:modelValue="update" />
            </v-col>
            <v-col md="3">
              <v-autocomplete
                v-model="props.spectroscopy.classification"
                label="Classification"
                variant="outlined"
                v-tooltip="'Classification of spectroscopic datum'"
                :error-messages="props.errors.classification"
                :items="getTnsValuesList('objtypes', false)"
                clearable
                @update:modelValue="update"
              />
            </v-col>
            <v-col md="3">
              <v-text-field v-model="props.spectroscopy.exposure_time" label="Exposure Time" variant="outlined" :error-messages="props.errors.exposure_time" @update:modelValue="update" />
            </v-col>
          </v-row>
          <v-row class="mt-1">
            <v-col md="3">
              <v-text-field v-model="props.spectroscopy.setup" label="Setup" variant="outlined" :error-messages="props.errors.setup" @update:modelValue="update" />
            </v-col>
            <v-col md="3">
              <v-select
                v-model="props.spectroscopy.spec_type"
                label="Spec Type"
                variant="outlined"
                v-tooltip="'Type of the Spectrograph'"
                :error-messages="props.errors.spec_type"
                :items="getTnsValuesList('spectra_types', false)"
                clearable
                @update:modelValue="update"
              />
            </v-col>
          </v-row>
          <v-row class="mt-1">
            <v-col md="12">
              <v-textarea v-model="props.spectroscopy.comments" max-rows="4" rows="2" label="Comments" variant="outlined" placeholder="Enter something..." @update:modelValue="update" />
            </v-col>
          </v-row>
        </span>
      </v-card-text>
    </v-card>
  </v-container>
</template>
