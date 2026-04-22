<script setup>
import { ref, computed } from 'vue';
import _ from 'lodash';
import SexagesimalCustomField from '@/components/message-composition/SexagesimalCustomField.vue';
import ConfirmDialogBtn from '@/components/message-composition/ConfirmDialogBtn.vue';
import { useSchemaDataUtils } from '@/utils/schemaDataUtils.js';
import { VueDatePicker } from '@vuepic/vue-datepicker';

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  errors: {
    type: Object,
    required: true
  },
  astrometry: {
    type: Object,
    required: true
  },
  targets: {
    type: Array,
    required: true,
    default: () => {
      return [];
    }
  }
})

const emit = defineEmits(['remove', 'copy', 'message-updated']);

const { remove, copy, update } = useSchemaDataUtils(emit)

const errorUnits = ['mas', 'arcsec', 'arcmin', 'degrees'];
const catalogList = [
  {value: 'Gaia_Int', text: 'Gaia_Int'},
  {value: 'PS1_DR1', text: 'PanSTARRS-1 DR 1'},
  {value: 'PS1_DR2', text: 'PanSTARRS-1 DR 2'},
  {value: 'ATLAS2', text: 'ATLAS-REFCAT 2'},
  {value: 'Gaia3', text: 'Gaia DR 3'},
  {value: 'Gaia3E', text: 'Gaia EDR 3'},
  {value: 'Gaia2', text: 'Gaia DR 2'},
  {value: 'Gaia1', text: 'Gaia DR 1'},
  {value: 'Gaia_2016', text: 'Gaia epoch 2016'},
  {value: 'NOMAD', text: 'NOMAD'},
  {value: 'PPMXL', text: 'PPM-XL'},
  {value: 'UBSC', text: 'USNO Bright-star Catalog'},
  {value: 'UCAC5', text: 'UCAC 5'},
  {value: 'UCAC4', text: 'UCAC 4'},
  {value: 'URAT1', text: 'URAT 1'},
  {value: '2MASS', text: '2MASS'},
  {value: 'SDSS', text: 'SDSS'}
];

const advancedOptionsCollapsed = ref(true);
const id = 'astrometry-' + props.index;

const advancedOptionsIcon = computed(() => {
  if (advancedOptionsCollapsed.value) {
    return 'mdi-arrow-expand-vertical';
  }
  else {
    return 'mdi-arrow-collapse-vertical';
  }
})

const getErrorAlignment = computed(() => {
  if (!_.isEmpty(props.astrometry.ra) || !_.isEmpty(props.astrometry.dec)){
    return "center";
  }
  else{
    return "baseline";
  }
})

const targetNames = computed(() => {
  return _.map(props.targets, 'name');
})

</script>
<template>
  <v-container class="p-0" :id="'data-astrometry-' + index" fluid>
    <v-card variant="outlined">
      <v-card-title>
        <v-row align="center">
          <v-col md="3" class=" text-center data-label-text">
            <b>Astrometry Datum {{ index }}</b>
          </v-col>
          <v-col md="3">
            <v-select
              v-model="props.astrometry.target_name"
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
              v-model="props.astrometry.date_obs"
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
              <v-btn v-tooltip="'Advanced Astrometry Fields'" :icon="advancedOptionsIcon" @click="advancedOptionsCollapsed = !advancedOptionsCollapsed">
              </v-btn>
              <v-btn v-tooltip="'Copy this Astrometry Datum'" icon="mdi-file-document-plus-outline" @click="copy">
              </v-btn>
              <confirm-dialog-btn
                btn-tooltip="Remove this Astrometry Datum"
                btn-icon="mdi-trash-can-outline"
                confirm-text="Are you sure you want to remove this Astrometry Datum?"
                confirm-action="Remove"
                @confirmed="remove">
              </confirm-dialog-btn>
            </v-btn-group>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col md="3">
            <sexagesimal-custom-field
              v-model="props.astrometry.ra"
              coordinate="ra"
              label="Right Ascension"
              :errors="props.errors.ra"
              @update="update"
            >
            </sexagesimal-custom-field>
          </v-col>
          <v-col md="3" :align-self="getErrorAlignment">
            <v-text-field v-model="props.astrometry.ra_error" label="RA Error" variant="outlined" rounded="0" :error-messages="props.errors.ra_error" @update:modelValue="update" >
              <template v-slot:append>
                <v-select v-model="props.astrometry.ra_error_units" variant="outlined" class="appended-element" label="Units" rounded="0" :items="errorUnits" hide-details @update:modelValue="update"></v-select>
              </template>
            </v-text-field>
          </v-col>
          <v-col md="3">
            <sexagesimal-custom-field
              v-model="props.astrometry.dec"
              coordinate="dec"
              label="Declination"
              :errors="props.errors.dec"
              @update="update"
            >
            </sexagesimal-custom-field>
          </v-col>
          <v-col md="3" :align-self="getErrorAlignment">
            <v-text-field v-model="props.astrometry.dec_error" label="Dec Error" variant="outlined" rounded="0" :error-messages="props.errors.dec_error" @update:modelValue="update" >
              <template v-slot:append>
                <v-select v-model="props.astrometry.dec_error_units" variant="outlined" class="appended-element" label="Units" rounded="0" :items="errorUnits" hide-details @update:modelValue="update"></v-select>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-1">
          <v-col md="3">
            <v-text-field v-model="props.astrometry.telescope" label="Telescope" variant="outlined" :error-messages="props.errors.telescope" @update:modelValue="update" />
          </v-col>
          <v-col md="3">
            <v-text-field v-model="props.astrometry.instrument" label="Instrument" variant="outlined" :error-messages="props.errors.instrument" @update:modelValue="update" />
          </v-col>
        </v-row>
        <span v-if="!advancedOptionsCollapsed">
          <v-row class="mt-1">
            <v-col md="3">
              <v-text-field v-model="props.astrometry.mpc_sitecode" label="MPC Sitecode" variant="outlined" :error-messages="props.errors.mpc_sitecode" @update:modelValue="update" />
            </v-col>
            <v-col md="3">
              <v-combobox v-model="props.astrometry.catalog" label="Astrometric Catalog" variant="outlined" :error-messages="props.errors.catalog" @update:modelValue="update" :items="catalogList" item-title="text" item-value="value" :return-object="false"/>
            </v-col>
          </v-row>
          <v-row class="mt-1">
            <v-col md="12">
              <v-textarea v-model="props.astrometry.comments" max-rows="4" rows="2" label="Comments" variant="outlined" placeholder="Enter something..." @update:modelValue="update" />
            </v-col>
          </v-row>
        </span>
      </v-card-text>
    </v-card>
  </v-container>
</template>
