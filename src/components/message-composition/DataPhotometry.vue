<script setup>
import { ref, computed } from 'vue';
import _ from 'lodash';
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
  photometry: {
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

const { remove, copy, update } = useSchemaDataUtils(emit)
const { getTnsValuesList } = useTnsUtils();

const brightnessUnits = ['AB mag', 'Vega mag', 'mJy', 'erg / s / cm² / Å'];
const advancedOptionsCollapsed = ref(true);
const id = 'photometry-' + props.index;

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

</script>
<template>
  <v-container class="p-0" :id="'data-photometry-' + index" fluid>
    <v-card variant="outlined">
      <v-card-title>
        <v-row align="center">
          <v-col md="3" class=" text-center data-label-text">
            <b>Photometry Datum {{ index }}</b>
          </v-col>
          <v-col md="3">
            <v-select
              v-model="props.photometry.target_name"
              label="Target"
              density="compact"
              variant="outlined"
              v-tooltip="'Target name as defined in the Targets section'"
              :error-messages="props.errors.target_name"
              :items="targetNames"
              @update:modelValue="update"
            />
          </v-col>
          <v-col md="3">
            <VueDatePicker
              v-model="props.photometry.date_obs"
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
              <v-btn v-tooltip="'Advanced Photometry Fields'" :icon="advancedOptionsIcon" :disabled="props.isTns" @click="advancedOptionsCollapsed = !advancedOptionsCollapsed">
              </v-btn>
              <v-btn v-tooltip="'Copy this Photometry Datum'" icon="mdi-file-document-plus-outline" @click="copy">
              </v-btn>
              <confirm-dialog-btn
                btn-tooltip="Remove this Photometry Datum"
                btn-icon="mdi-trash-can-outline"
                confirm-text="Are you sure you want to remove this Photometry Datum?"
                confirm-action="Remove"
                @confirmed="remove">
              </confirm-dialog-btn>
            </v-btn-group>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row class="mb-2">
          <v-col md="5">
            <v-text-field v-model="props.photometry.brightness" label="Brightness" variant="outlined" :error-messages="props.errors.brightness" rounded="0" @update:modelValue="update">
              <template v-slot:append>
                <v-select v-model="props.photometry.brightness_unit" variant="outlined" class="appended-element" label="Units" rounded="0" :items="brightnessUnits" hide-details @update:modelValue="update"></v-select>
              </template>
            </v-text-field>  
          </v-col>
          <v-col md="3">
            <v-text-field v-model="props.photometry.brightness_error" label="Brightness Error" variant="outlined" :error-messages="props.errors.brightness_error" @update:modelValue="update" />
          </v-col>
          <v-col md="3">
            <v-text-field v-if="!props.isTns" v-model="props.photometry.bandpass" label="Band" variant="outlined" :error-messages="props.errors.bandpass" @update:modelValue="update" />
            <v-autocomplete
              v-else
              v-model="props.photometry.bandpass"
              label="Band"
              variant="outlined"
              :items="getTnsValuesList('filters', false)"
              clearable=""
              :error-messages="props.errors.bandpass"
              @update:modelValue="update"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col md="5">
            <v-text-field v-model="props.photometry.limiting_brightness" label="Limiting Brightness" variant="outlined" rounded="0" :error-messages="props.errors.limiting_brightness" @update:modelValue="update">
              <template v-slot:append>
                <v-select v-model="props.photometry.limiting_brightness_unit" variant="outlined" class="appended-element" label="Units" rounded="0" :items="brightnessUnits" hide-details @update:modelValue="update"></v-select>
              </template>
            </v-text-field>  
          </v-col>
          <v-col md="3">
            <v-text-field v-if="!props.isTns" v-model="props.photometry.telescope" label="Telescope" variant="outlined" :error-messages="props.errors.telescope" @update:modelValue="update" />
            <v-autocomplete
              v-else
              v-model="props.photometry.telescope"
              label="Telescope"
              variant="outlined"
              :items="getTnsValuesList('telescopes', false)"
              clearable=""
              :error-messages="props.errors.telescope"
              @update:modelValue="update"
            />
          </v-col>
          <v-col md="3">
            <v-text-field v-if="!props.isTns" v-model="props.photometry.instrument" label="Instrument" variant="outlined" :error-messages="props.errors.instrument" @update:modelValue="update" />
            <v-autocomplete
              v-else
              v-model="props.photometry.instrument"
              label="Instrument"
              variant="outlined"
              :items="getTnsValuesList('instruments', false)"
              clearable=""
              :error-messages="props.errors.instrument"
              @update:modelValue="update"
            />
          </v-col>
        </v-row>
        <span v-if="!advancedOptionsCollapsed">
          <v-row>
            <v-col md="2">
              <v-text-field v-model="props.photometry.exposure_time" label="Exp Time" variant="outlined" :error-messages="props.errors.exposure_time" @update:modelValue="update" />
            </v-col>
            <v-col md="3">
              <v-text-field v-model="props.photometry.observer" label="Observer" variant="outlined" :error-messages="props.errors.observer" @update:modelValue="update" />
            </v-col>
            <v-col md="3">
              <v-text-field v-model="props.photometry.catalog" label="Catalog" variant="outlined" :error-messages="props.errors.catalog" @update:modelValue="update" />
            </v-col>
          </v-row>
          <v-row class="mt-1">
            <v-col md="12">
              <v-textarea v-model="props.photometry.comments" max-rows="4" rows="2" label="Comments" variant="outlined" placeholder="Enter something..." @update:modelValue="update" />
            </v-col>
          </v-row>
        </span>
      </v-card-text>
    </v-card>
  </v-container>
</template>
