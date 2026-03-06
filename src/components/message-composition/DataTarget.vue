<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import _ from 'lodash';
import '@/assets/css/submissions.css';
import DiscoveryInfo from '@/components/message-composition/DiscoveryInfo.vue'
import SexagesimalCustomField from '@/components/message-composition/SexagesimalCustomField.vue';
import ConfirmDialogBtn from '@/components/message-composition/ConfirmDialogBtn.vue';
import { useTnsUtils } from '@/utils/tnsUtils.js';
import { useSchemaDataUtils } from '@/utils/schemaDataUtils.js';
import FilesWithDescriptions from '@/components/message-composition/FilesWithDescriptions.vue'

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  errors: {
    type: Object,
    required: true
  },
  target: {
    type: Object,
    required: true
  },
  isTns: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['remove', 'copy', 'message-updated']);

const { getTnsValuesList } = useTnsUtils();
const { remove, copy, update, getErrors } = useSchemaDataUtils(emit)

const type =  ref('Sidereal')
const typeOptions = ref(['Sidereal', 'Non-Sidereal'])
const errorUnits = ['mas', 'arcsec', 'arcmin', 'degrees']
const distanceUnits = ['cm', 'm', 'km', 'pc', 'kpc', 'Mpc', 'Gpc', 'ly', 'au']
const advancedOptionsCollapsed = ref(!props.isTns)
const groupsArray = ref([])
const id = ref('target-' + props.index)

onMounted(() => {
  type.value = defaultType.value
})

watch(() => props.isTns, (value) => {
  if (value) {
    advancedOptionsCollapsed.value = false;
    typeOptions.value = ['Sidereal'];
    type.value = 'Sidereal';
    groupsArray.value = [];
  }
  else {
    typeOptions.value = ['Sidereal', 'Non-Sidereal'];
  }
});

watch(() => groupsArray, (value) => {
  if (!_.isEmpty(value)) {
    props.target.group_associations = value.join(',');
  }
  props.target.group_associations = ''
  update()
});

const advancedOptionsIcon = computed(() => {
  if (advancedOptionsCollapsed.value) {
    return 'mdi-arrow-expand-vertical';
  }
  else {
    return 'mdi-arrow-collapse-vertical';
  }
})

const defaultType = computed(() => {
  if (_.isEmpty(_.omitBy(props.target.orbital_elements, field => field === null || (_.isEmpty(field) && !_.isBoolean(field))))) {
    return 'Sidereal';
  }
  else{
    return 'Non-Sidereal';
  }
})

const getErrorAlignment = computed(() => {
  if (!_.isEmpty(props.target.ra) || !_.isEmpty(props.target.dec)){
    return "center";
  }
  else{
    return "baseline";
  }
})

function onTypeChange() {
  if (props.target.type === 'Sidereal') {
    props.target.orbital_elements = {
      'epoch_of_elements': null,
      'orbital_inclination': null,
      'longitude_of_the_ascending_node': null,
      'argument_of_the_perihelion': null,
      'eccentricity': null,
      'semimajor_axis': null,
      'mean_anomaly': null,
      'perihelion_distance': null,
      'epoch_of_perihelion': null
    }
  }
  else {
    props.target.ra = null;
    props.target.ra_error = null;
    props.target.pm_ra = null;
    props.target.dec = null;
    props.target.dec_error = null;
    props.target.pm_dec = null;
  }
  update();
}
</script>
<template>
  <v-container class="p-0">
    <v-card variant="outlined">
      <v-card-title>
        <v-row align="center">
          <v-col md="2" class=" text-center data-label-text">
            <b>Target {{ props.index }}</b>
          </v-col>
          <v-col md="3">
            <v-text-field v-model="props.target.name" label="Name" variant="outlined" :error-messages="props.errors.name" @update:modelValue="update" />
          </v-col>
          <v-col md="3">
            <v-select
                v-model="props.target.type"
                label="Type"
                variant="outlined"
                :items="typeOptions"
                @update:modelValue="onTypeChange"
            />
          </v-col>
          <v-col md="2" offset-md="2">
            <v-btn-group divided color="primary-darken-1" class="data-label-text">
              <v-btn v-tooltip="'Advanced Target Fields'" :icon="advancedOptionsIcon" :disabled="props.isTns" @click="advancedOptionsCollapsed = !advancedOptionsCollapsed">
              </v-btn>
              <v-btn v-tooltip="'Copy this Target'" icon="mdi-file-document-plus-outline" @click="copy">
              </v-btn>
              <confirm-dialog-btn
                btn-tooltip="Remove this Target"
                btn-icon="mdi-trash-can-outline"
                confirm-text="Are you sure you want to remove this Target?"
                confirm-action="Remove"
                @confirmed="remove">
              </confirm-dialog-btn>
            </v-btn-group>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <span v-if="props.target.type === 'Sidereal'" class="sidereal">
          <v-row>
            <v-col md="3">
              <sexagesimal-custom-field
                v-model="props.target.ra"
                coordinate="ra"
                label="Right Ascension"
                :errors="props.errors.ra"
                @update:modelValue="update"
              >
              </sexagesimal-custom-field>
            </v-col>
            <v-col md="3" :align-self="getErrorAlignment">
              <v-text-field v-model="props.target.ra_error" label="RA Error" variant="outlined" rounded="0" :error-messages="props.errors.ra_error" @update:modelValue="update" >
                <template v-slot:append>
                  <v-select v-model="props.target.ra_error_units" variant="outlined" class="appended-element" label="Units" rounded="0" :items="errorUnits" hide-details @update:modelValue="update"></v-select>
                </template>
              </v-text-field>
            </v-col>
            <v-col md="3">
              <sexagesimal-custom-field
                v-model="props.target.dec"
                coordinate="dec"
                label="Declination"
                :errors="props.errors.dec"
                @update:modelValue="update"
              >
              </sexagesimal-custom-field>
            </v-col>
            <v-col md="3" :align-self="getErrorAlignment">
              <v-text-field v-model="props.target.dec_error" label="Dec Error" variant="outlined" rounded="0" :error-messages="props.errors.dec_error" @update:modelValue="update" >
                <template v-slot:append>
                  <v-select v-model="props.target.dec_error_units" variant="outlined" class="appended-element" label="Units" rounded="0" :items="errorUnits" hide-details @update:modelValue="update"></v-select>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="3">
              <v-text-field v-model="props.target.pm_ra" label="Proper Motion RA" variant="outlined" :error-messages="props.errors.pm_ra" @update:modelValue="update" />
            </v-col>
            <v-col md="3">
              <v-text-field v-model="props.target.pm_dec" label="Proper Motion Dec" variant="outlined" :error-messages="props.errors.pm_dec" @update:modelValue="update" />
            </v-col>
            <v-col md="3">
              <v-text-field v-model="props.target.epoch" label="Epoch" variant="outlined" :error-messages="props.errors.epoch" @update:modelValue="update" />
            </v-col>
            <v-col md="2" offset-md="1" align-self="center">
              <v-switch
                v-model="props.target.new_discovery"
                label="New Discovery"
                :error-messages="props.errors.new_discovery"
                @update:modelValue="update"
              >
              </v-switch>
            </v-col>
          </v-row>
        </span>
        <span v-else-if="props.target.type === 'Non-Sidereal'" class="non-sidereal">
          <v-alert v-for="error in getErrors(props.errors, 'orbital_elements.non_field_errors', [])" :key="error" type="error" :text="error" title="Orbital Elements Error">
          </v-alert>
          <v-row class="mt-1">
            <v-col md="4">
              <v-text-field v-model="props.target.orbital_elements.epoch_of_elements" label="Epoch of Elements" variant="outlined" :error-messages="getErrors(props.errors, 'orbital_elements.epoch_of_elements', [])" @update:modelValue="update" />
            </v-col>
            <v-col md="4">
              <v-text-field v-model="props.target.orbital_elements.orbital_inclination" label="Orbital Inclination" variant="outlined" :error-messages="getErrors(props.errors, 'orbital_elements.orbital_inclination', [])" @update:modelValue="update" />
            </v-col>
            <v-col md="4">
              <v-text-field v-model="props.target.orbital_elements.longitude_of_the_ascending_node" label="Longitude of Ascending Node" variant="outlined" :error-messages="getErrors(props.errors, 'orbital_elements.longitude_of_the_ascending_node', [])" @update:modelValue="update" />
            </v-col>
          </v-row>
          <v-row class="mt-1">
            <v-col md="4">
              <v-text-field v-model="props.target.orbital_elements.argument_of_the_perihelion" label="Argument of Perihelion" variant="outlined" :error-messages="getErrors(props.errors, 'orbital_elements.argument_of_the_perihelion', [])" @update:modelValue="update" />
            </v-col>
            <v-col md="4">
              <v-text-field v-model="props.target.orbital_elements.eccentricity" label="Eccentricity" variant="outlined" :error-messages="getErrors(props.errors, 'orbital_elements.eccentricity', [])" @update:modelValue="update" />
            </v-col>
            <v-col md="4">
              <v-text-field v-model="props.target.orbital_elements.semimajor_axis" label="SemiMajor Axis" variant="outlined" :error-messages="getErrors(props.errors, 'orbital_elements.semimajor_axis', [])" @update:modelValue="update" />
            </v-col>
          </v-row>
          <v-row class="mt-1">
            <v-col md="4">
              <v-text-field v-model="props.target.orbital_elements.mean_anomaly" label="Mean Anomaly" variant="outlined" :error-messages="getErrors(props.errors, 'orbital_elements.mean_anomaly', [])" @update:modelValue="update" />
            </v-col>
            <v-col md="4">
              <v-text-field v-model="props.target.orbital_elements.perihelion_distance" label="Perihelion Distance" variant="outlined" :error-messages="getErrors(props.errors, 'orbital_elements.perihelion_distance', [])" @update:modelValue="update" />
            </v-col>
            <v-col md="4">
              <v-text-field v-model="props.target.orbital_elements.epoch_of_perihelion" label="Epoch of Perihelion" variant="outlined" :errors="getErrors(props.errors, 'orbital_elements.epoch_of_perihelion', [])" @update:modelValue="update" />
            </v-col>
          </v-row>
        </span>
        <span v-if="!advancedOptionsCollapsed">
          <v-row class="mt-1">
            <v-col md="3">
              <v-text-field v-model="props.target.redshift" label="Redshift" variant="outlined" :error-messages="props.errors.redshift" @update:modelValue="update" />
            </v-col>
            <v-col md="3">
              <v-text-field v-model="props.target.host_name" label="Host" variant="outlined" :error-messages="props.errors.host_name" @update:modelValue="update" />
            </v-col>
            <v-col md="3">
              <v-text-field v-model="props.target.host_redshift" label="Host Redshift" variant="outlined" :error-messages="props.errors.host_redshift" @update:modelValue="update" />
            </v-col>
          </v-row>
          <v-row class="mt-1">
            <v-col md="3">
              <v-text-field v-model="props.target.distance" label="Distance" variant="outlined" rounded="0" :error-messages="props.errors.distance" @update:modelValue="update" >
                <template v-slot:append>
                  <v-select v-model="props.target.distance_units" variant="outlined" class="appended-element" label="Units" rounded="0" :items="distanceUnits" hide-details @update:modelValue="update" style="min-width:100px;"/>
                </template>
              </v-text-field>
            </v-col>
            <v-col md="3">
              <v-text-field v-model="props.target.distance_error" label="Distance Error" variant="outlined" :error-messages="props.errors.distance_error" @update:modelValue="update" />
            </v-col>
          </v-row>
          <v-row class="mt-1">
            <v-col md="6">
              <v-text-field v-if="!props.isTns" v-model="props.target.group_associations" label="Groups" variant="outlined" hide-details="auto" v-tooltip="'Comma separated list of TNS group associations for this Target'"
                :error-messages="props.errors.group_associations" @update:modelValue="update" />
              <v-autocomplete
                v-else
                v-model.lazy="groupsArray"
                placeholder="Associate TNS Groups"
                variant="outlined"
                hide-details="auto"
                multiple
                clearable
                chips
                closable-chips
                :items="getTnsValuesList('groups')"
              >
              </v-autocomplete>
            </v-col>
            <v-col md="6">
              <v-text-field v-model="props.target.aliases" label="Aliases" variant="outlined" hide-details="auto" v-tooltip="'Comma separated list of aliases for this Target'"
                :error-messages="props.errors.aliases" @update:modelValue="update" />
            </v-col>
          </v-row>
          <v-row class="mt-1">
            <v-col md="12">
              <v-textarea v-model="props.target.comments" max-rows="4" rows="2" label="Comments" variant="outlined" placeholder="Enter something..." @update:modelValue="update" />
            </v-col>
          </v-row>
          <discovery-info :data="props.target.discovery_info" :errors="getErrors(props.errors, 'discovery_info', {})" :index="props.index" :is-tns="props.isTns" @message-updated="update">
          </discovery-info>
          <v-card no-body class="mt-2" variant="outlined">
            <v-card-title class="p-1">
              <b>Related Target Files</b>
            </v-card-title>
            <v-card-text>
              <p class="text-primary">
                Upload one or more related target files to associate with your message. If you are submitting to the TNS, these files
                will be uploaded there. If your target proprietary period is 0, the files will also be stored
                in the Scimma Archive and will be <b>publicly accessible</b> and linked from the message.
              </p>
              <files-with-descriptions
                :id="id + '-files'"
                :errors="getErrors(props.errors, 'files', [])"
                :multiple=true
                v-model:files="target.files"
                v-model:fileDescriptions="target.file_descriptions"
                @message-updated="update"
              >
              </files-with-descriptions>
            </v-card-text>
          </v-card>
        </span>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<style>
.v-input__append:has(.appended-element) {
  margin-left: 0;
}

</style>