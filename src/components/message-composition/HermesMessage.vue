
<script setup>
import { ref, computed, watch } from 'vue';
import _ from 'lodash';
import '@/assets/css/submissions.css';
import DataSection from '@/components/message-composition/DataSection.vue'
import DataReference from '@/components/message-composition/DataReference.vue'
import DataTable from '@/components/message-composition/DataTable.vue'
import DataTarget from '@/components/message-composition/DataTarget.vue'
import DataView from '@/components/message-composition/DataView.vue'
import DataPhotometry from '@/components/message-composition/DataPhotometry.vue'
import DataSpectroscopy from '@/components/message-composition/DataSpectroscopy.vue'
import DataAstrometry from '@/components/message-composition/DataAstrometry.vue'
import { sanitizeMessage, formattedMessageText } from '@/utils/messageUtils.js';
import { useStateStore } from '@/stores/state';
import { RouterLink } from 'vue-router'

const stateStore = useStateStore();
const emit = defineEmits(['hermes-message-updated', 'generate-plain-text']);

const messageTab = ref('edit')
const tab = ref('submission')

// Expose the preloadData function to parent component
defineExpose({
  preloadData
});

const props = defineProps({
  errors: {
    type: Object,
    required: true,
  },
  hermesMessage: {
    type: Object,
    required: true
  },
  plainText: {
    type: String,
    required: true
  }
})
  
const sectionShowSimple = ref({
  'references': true,
  'targets': true,
  'photometry': true,
  'spectroscopy': true,
  'astrometry': true,
  'extra_data': true,
  'message': true
})

const sectionRefs = {
  'referencesSection': ref(null),
  'targetsSection': ref(null),
  'photometrySection': ref(null),
  'spectroscopySection': ref(null),
  'astrometrySection': ref(null),
  'extra_dataSection': ref(null),
  'messageSection': ref(null)
}

const copySnack = ref(false)
const copyText = ref('')

const referenceFields = [
  {
    key: 'source',
    title: 'Source',
    type: 'text',
    align: 'center',
    list: [
      { value: "hop_uuid", text: "Hop UUID" },
      { value: "doi", text: "DOI" },
      { value: "gracedb_id", text: "GraceDB ID" },
      { value: "gcn_circular", text: "GCN Circular ID" },
    ],
    placeholder: "Source",
    class: "source-column"
  },
  {
    key: "citation",
    title: "Citation",
    type: 'text',
    align: 'center',
    placeholder: "Citation",
    class: "citation-column"
  },
  {
    key: "url",
    title: "Url",
    type: 'text',
    align: 'center',
    placeholder: "Url",
    class: "url-column"
  },
  {
    key: "copy",
    title: "",
    align: 'center',
    headerTitle: "copy",
    class: "copy-column",
  },
  {
    key: "delete",
    title: "",
    headerTitle: "delete",
    class: "delete-column",
  }
]

const extraDataFields = [
  {
    key: 'key',
    title: 'Key',
    type: 'text',
    align: 'center',
    placeholder: "Key",
    class: "key-column"
  },
  {
    key: 'value',
    title: 'Value',
    type: 'text',
    align: 'center',
    placeholder: "Value",
    class: "value-column"
  },
  {
    key: "copy",
    title: "",
    align: 'center',
    headerTitle: "copy",
    class: "copy-column",
  },
  {
    key: "delete",
    title: "",
    headerTitle: "delete",
    class: "delete-column",
  }
]

const targetFields = [
  {
    key: 'index',
    title: '',
    class: 'index-column'
  },
  {
    key: 'name',
    title: 'Name',
    type: 'text',
    align: 'center',
    placeholder: "Name",
    class: "target-name-column"
  },
  {
    key: "ra",
    title: "RA",
    type: 'text',
    align: 'center',
    placeholder: "RA",
    class: "ra-column"
  },
  {
    key: "dec",
    title: "Dec",
    type: 'text',
    align: 'center',
    placeholder: "Dec",
    class: "dec-column"
  },
  {
    key: "new_discovery",
    title: "New Discovery",
    type: 'checkbox',
    align: 'center',
    default: false,
    class: "new-discovery-column"
  },
  {
    key: "copy",
    title: "",
    headerTitle: "copy",
    class: "copy-column",
  },
  {
    key: "delete",
    title: "",
    headerTitle: "delete",
    class: "delete-column",
  }
]

const emptySections = {
  'references': {
    'source': null,
    'citation': null,
    'url': null
  },
  'targets': {
    'name': null,
    'type': 'Sidereal',
    'discovery_info': {
      'date': null,
      'reporting_group': null,
      'discovery_source': null,
      'transient_type': null,
      'proprietary_period': null,
      'proprietary_period_units': null,
      'nondetection_source': null,
      'nondetection_comments': null,
    },
    'ra': null,
    'dec': null,
    'ra_error': null,
    'dec_error': null,
    'ra_error_units': 'degrees',
    'dec_error_units': 'degrees',
    'pm_ra': null,
    'pm_dec': null,
    'epoch': null,
    'new_discovery': false,
    'orbital_elements': {
      'epoch_of_elements': null,
      'orbital_inclination': null,
      'longitude_of_the_ascending_node': null,
      'argument_of_the_perihelion': null,
      'eccentricity': null,
      'semimajor_axis': null,
      'mean_anomaly': null,
      'perihelion_distance': null,
      'epoch_of_perihelion': null
    },
    'redshift': null,
    'host_name': null,
    'host_redshift': null,
    'distance': null,
    'distance_error': null,
    'distance_units': null,
    'aliases': null,
    'group_associations': null,
    'comments': null,
    'files': [],
    'file_descriptions': [],
  },
  'photometry': {
    'target_name': null,
    'date_obs': '',
    'telescope': null,
    'instrument': null,
    'bandpass': null,
    'brightness': null,
    'brightness_error': null,
    'brightness_unit': 'AB mag',
    'exposure_time': null,
    'observer': null,
    'comments': null,
    'catalog': null,
    'limiting_brightness': null,
    'limiting_brightness_error': null,
    'limiting_brightness_unit': 'AB mag',
  },
  'spectroscopy': {
    'target_name': null,
    'date_obs': '',
    'telescope': null,
    'instrument': null,
    'flux': [],
    'flux_error': [],
    'wavelength': [],
    'flux_units': 'mJy',
    'wavelength_units': 'nm',
    'flux_type': 'Fλ',
    'setup': null,
    'classification': null,
    'proprietary_period': null,
    'proprietary_period_units': 'Days',
    'exposure_time': null,
    'observer': null,
    'comments': null,
    'reducer': null,
    'spec_type': null,
    'files': [],
    'file_descriptions': [],
  },
  'astrometry': {
    'target_name': null,
    'date_obs': '',
    'telescope': null,
    'instrument': null,
    'ra': null,
    'dec': null,
    'ra_error': null,
    'dec_error': null,
    'ra_error_units': 'degrees',
    'dec_error_units': 'degrees',
    'mpc_sitecode': null,
    'catalog': null,
    'comments': null,
  },
  'extra_data': {
    'key': null,
    'value': null
  }
}

const submitToTnsTooltip = computed(() => {
  if (stateStore.profile.tns_bot_name) {
    return 'Submit to TNS with your configured <b>' + stateStore.profile.tns_bot_name + '</b> Bot credential';
  }
  else {
    return 'Hermes Bot credentials will be used by default. Click <a href="profile" target="_blank">here</a> to set your own TNS Bot credentials';
  }
})

const submitToGcnTooltip = computed(() => {
  if (stateStore.canSubmitToGcn) {
    return ''
  }
  else {
    return 'You must link a GCN account with Circular submission privileges on your Hermes Profile page';
  }
})

const targetNames = computed(() => {
  return _.map(props.hermesMessage.data.targets, 'name');
})

const photometryFields = computed(() => {
  return [
    {
      key: 'index',
      title: '',
      class: 'index-column'
    },
    {
      key: 'target_name',
      title: 'Target',
      type: 'select',
      align: 'center',
      options: targetNames.value,
      class: "target-select-column"
    },
    {
      key: "date_obs",
      title: "Observation Date",
      type: 'date',
      align: 'center',
      placeholder: "date",
      class: "date-obs-column"
    },
    {
      key: "telescope",
      title: "Telescope",
      type: 'text',
      align: 'center',
      placeholder: "tst",
      class: "telescope-column"
    },
    {
      key: "instrument",
      title: "Instrument",
      type: 'text',
      align: 'center',
      placeholder: "instrument",
      class: "instrument-column"
    },
    {
      key: "bandpass",
      title: "Band",
      type: 'text',
      align: 'center',
      placeholder: "",
      class: "bandpass-column"
    },
    {
      key: "brightness",
      title: "Brightness",
      type: 'text',
      align: 'center',
      placeholder: "",
      class: "brightness-column"
    },
    {
      key: "brightness_unit",
      title: "Units",
      type: 'select',
      align: 'center',
      options: [
        { value: "AB mag", text: "AB mag" },
        { value: "Vega mag", text: "Vega mag" },
        { value: "mJy", text: "mJy" },
        { value: "erg / s / cm² / Å", text: "erg / s / cm² / Å" },
      ],
      class: "brightness-units-column"
    },
    {
      key: "brightness_error",
      title: "Error",
      type: 'text',
      align: 'center',
      placeholder: "",
      class: "brightness-error-column"
    },
    {
      key: "copy",
      title: "",
      headerTitle: "copy",
      class: "copy-column",
    },
    {
      key: "delete",
      title: "",
      headerTitle: "delete",
      class: "delete-column",
    }
  ];
})
   
const astrometryFields = computed(() => {
  return [
    {
      key: 'index',
      title: '',
      class: 'index-column'
    },
    {
      key: 'target_name',
      title: 'Target',
      type: 'select',
      align: 'center',
      options: targetNames.value,
      class: "target-select-column"
    },
    {
      key: "date_obs",
      title: "Observation Date",
      type: 'date',
      align: 'center',
      placeholder: "date",
      class: "date-obs-column"
    },
    {
      key: "telescope",
      title: "Telescope",
      type: 'text',
      align: 'center',
      placeholder: "tst",
      class: "telescope-column"
    },
    {
      key: "instrument",
      title: "Instrument",
      type: 'text',
      align: 'center',
      placeholder: "instrument",
      class: "instrument-column"
    },
    {
      key: "ra",
      title: "RA",
      type: 'text',
      align: 'center',
      placeholder: "RA",
      class: "ra-column"
    },
    {
      key: "ra_error",
      title: "Error",
      type: 'text',
      align: 'center',
      placeholder: "",
      class: "ra-error-column"
    },
    {
      key: "ra_error_units",
      title: "Units",
      type: 'select',
      align: 'center',
      options: [
        { value: "degrees", text: "Degrees" },
        { value: "marcsec", text: "marcsec" },
        { value: "arcsec", text: "arcsec" },
        { value: "arcmin", text: "arcmin" },
      ],
      class: "ra-error-units-column"
    },
    {
      key: "dec",
      title: "Dec",
      type: 'text',
      align: 'center',
      placeholder: "Dec",
      class: "dec-column"
    },
    {
      key: "dec_error",
      title: "Error",
      type: 'text',
      align: 'center',
      placeholder: "",
      class: "dec-error-column"
    },
    {
      key: "dec_error_units",
      title: "Units",
      type: 'select',
      align: 'center',
      options: [
        { value: "degrees", text: "Degrees" },
        { value: "marcsec", text: "marcsec" },
        { value: "arcsec", text: "arcsec" },
        { value: "arcmin", text: "arcmin" },
      ],
      class: "dec-error-units-column"
    },
    {
      key: "copy",
      title: "",
      headerTitle: "copy",
      class: "copy-column",
    },
    {
      key: "delete",
      title: "",
      headerTitle: "delete",
      class: "delete-column",
    }
  ];
})

// watch(() => props.hermesMessage.data, () => {
//   for (const section in sectionShowSimple.value){
//     sectionRefs[section + 'Section'].forceVisibility(false);
//   }
// }, { deep: true });

watch(() => props.hermesMessage.submit_to_tns, (newValue) => {
  if (newValue) {
    sectionShowSimple.value['targets'] = false;
    sectionShowSimple.value['photometry'] = false;
    sectionShowSimple.value['spectroscopy'] = false;
  }
});

function update(data) {
  emit('hermes-message-updated', data);
}
 
function messageUpdated(data) {
  update(data);
}

function preloadSection(section, sectionData) {
  if (!_.isArray(sectionData)) {
    return false;
  }
  let validSection = [];
  let changes = false;
  let validSectionInstance = {}
  sectionData.forEach(instance => {
    validSectionInstance = _.cloneDeep(emptySections[section]);
    Object.keys(validSectionInstance).forEach(key => {
      if (key in instance){
        if (key == 'aliases' && _.isArray(instance[key])) {
          // Aliases are submitted as arrays, but stored in the frontend as a list of comma-delimited strings
          validSectionInstance[key] = instance[key].join(',');
          changes = true;
        }
        else if (_.isObject(instance[key]) && !_.isArray(instance[key])) {
          if (key == 'orbital_elements') {
            validSectionInstance['type'] = 'Non-Sidereal';
            sectionShowSimple.value['targets'] = false;
          }
          Object.keys(validSectionInstance[key]).forEach(nestedKey => {
            if (nestedKey in instance[key]) {
              if (_.isNumber(instance[key][nestedKey])){
                validSectionInstance[key][nestedKey] = instance[key][nestedKey].toString();
              }
              else {
                validSectionInstance[key][nestedKey] = instance[key][nestedKey];
              }
              changes = true;
            }
          })
        }
        else if (_.isNumber(instance[key])) {
          // The frontend likes to deal in strings, to correct this here for numbers
          validSectionInstance[key] = instance[key].toString();
        }
        else {
          validSectionInstance[key] = instance[key];
          changes = true;
        }
      }
    })
    validSection.push(validSectionInstance);
  });
  if (changes) {
    props.hermesMessage.data[section] = validSection;
  }
  return changes;
}

function preloadData(data) {
  if ('event_id' in data) {
    props.hermesMessage.data.event_id = data['event_id'];
  }
  Object.keys(emptySections).forEach(section => {
    // For each section, preload the data if present, and if preloaded, show that section in the UI
    sectionRefs[section + 'Section'].forceVisibility(preloadSection(section, data[section]));
  });
  if (!_.isEmpty(props.hermesMessage.message_text)) {
    // If the message was preloaded, show that section as well
    sectionRefs['messageSection'].forceVisibility(true);
  }
}

function isSectionEmpty(section) {
  return _.isEmpty(props.hermesMessage.data[section]);
}

function addSection(section) {
  let emptySection = _.cloneDeep(emptySections[section]);
  if (!(section in props.hermesMessage.data)) {
    props.hermesMessage.data[section] = [];
  }
  props.hermesMessage.data[section].push(emptySection);
  update();
}

function copySection(section, idx) {
  let newSection = _.cloneDeep(props.hermesMessage.data[section][idx]);
  props.hermesMessage.data[section].push(newSection);
  update();
}

function removeSection(section, idx) {
  props.hermesMessage.data[section].splice(idx, 1);
  if (_.isEmpty(props.hermesMessage.data[section])) {
    sectionRefs[section + 'Section'].forceVisibility(false);
  }
  update();
}

function generatePlainText() {
  emit('generate-plain-text');
}

function getDataErrorsArray(section, idx) {
  return _.get(getErrors('data', {}), [section, idx], {});
}

function getErrors(key, default_value) {
  let errors = _.get(props.errors, key, default_value);
  let non_field_key = '';
  if (key.includes('target')){
    non_field_key = 'target_non_field_errors';
  }
  else if (key.includes('photometry')) {
    non_field_key = 'photometry_non_field_errors';
  }
  else if (key.includes('spectroscopy')) {
    non_field_key = 'spectroscopy_non_field_errors';
  }
  if (non_field_key){
    errors = _.concat(errors, _.get(props.errors, non_field_key, default_value));
  }
  return errors;
}

function toggleSectionShowSimple(section) {
  sectionShowSimple.value[section] = !sectionShowSimple.value[section]
}

function copyHeaders(section) {
  const keys = _.keys(_.omitBy(emptySections[section], _.isObject));
  const deepkeys = _.flatMap(_.pickBy(emptySections[section], _.isObject), _.keys);

  navigator.clipboard.writeText(_.concat(keys, deepkeys));
  copySnack.value = true
  copyText.value = section.charAt(0).toUpperCase() + section.slice(1) + ' csv headers copied to clipboard!'
}

function parseCsv(section, fileInput) {
  const lines = fileInput.split("\n");
  let headers = [];
  let dataLines = [];
  _.forEach(lines, function(line){
    const splitLine = line.split(',');
    if (_.every(splitLine, v => v === '')){
      // Saving from excel can yield empty lines at the top, so we skip those lines
      return;
    }
    else if(_.isEmpty(headers)) {
      // Set the headers array
      headers = splitLine;
    }
    else {
      // Save the data lines - this will be an array of arrays
      dataLines.push(splitLine);
    }
  });
  let loadedSection = [];
  let nestedSections = _.pickBy(emptySections[section], _.isObject);
  for (let i = 0; i < dataLines.length; i += 1) {
    let newSection = _.cloneDeep(emptySections[section]);
    for (let j = 0; j < headers.length; j+= 1) {
      if (dataLines[i][j] != '') {
        if (headers[j] in newSection) {
          newSection[headers[j]] = dataLines[i][j];
        }
        else {
          // Go through the nested objects and check if those keys are present
          _.forEach(nestedSections, function(value, key) {
            if (headers[j] in value) {
              newSection[key][headers[j]] = dataLines[i][j];
            }
          });
        }
      }
    }
    loadedSection.push(newSection);
  }
  if (!_.isEmpty(loadedSection)) {
    props.hermesMessage.data[section] = loadedSection;
    sectionRefs[section + 'Section'].forceVisibility(true);
    update();
  }
}

</script>
  <template>
  <v-card no-body>
    <v-tabs color="primary" v-model="tab">
      <v-tab value="submission">Submission Form</v-tab>
      <v-tab value="api">API View</v-tab>
      <v-tab value="plaintext" @click="generatePlainText">Text View</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-tabs-window v-model="tab">
			<v-tabs-window-item value="submission">
        <v-container>
          <v-alert v-if="props.hermesMessage.submit_to_gcn" color="info">
            Please review the <a href="https://gcn.nasa.gov/docs/circulars/styleguide" target="_blank">GCN Style Guide</a> before your first GCN submission.
          </v-alert>
          <v-alert v-for="error in props.errors.non_field_errors" :key="error" color="error">
            <span v-html="error"></span>
          </v-alert>
          <v-row>
            <v-col md="8">
              <v-text-field
                v-model="props.hermesMessage.title"
                label="Title"
                variant="outlined"
                :error-messages="props.errors.title"
                @update:modelValue="update"
              />
            </v-col>
            <v-col md="4">
              <v-autocomplete
                v-model="props.hermesMessage.topic"
                variant="outlined"
                :items="stateStore.profile.writable_topics"
                placeholder="Filter by Topic"
                label="Topic"
                :error-messages="props.errors.topic"
                @update:modelValue="update"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col md="3">
              <v-text-field
                v-model="props.hermesMessage.data.event_id"
                label="Event ID"
                variant="outlined"
                :error-messages="getErrors('data.event_id', [])"
                v-tooltip="'Nonlocalized event ID (if applicable)'"
                @update:modelValue="update"
              />
            </v-col>
            <v-col md="6">
              <v-text-field
                v-model="props.hermesMessage.authors"
                label="Authors"
                variant="outlined"
                :error-messages="props.errors.authors"
                v-tooltip="'Authors list in format: FirstName1 LastName1 (Affil1), FirstName2 LastName2 (Affil2), ...'"
                @update:modelValue="update"
              />
            </v-col>
            <v-col md="2" v-if="stateStore.userIsAuthenticated">
              <v-switch
                v-model="props.hermesMessage.submit_to_tns"
                class="submit_switch"
                label="Submit to TNS"
                color="primary"
                @update:modelValue="update"
              >
              </v-switch>
              <v-switch
                  v-model="props.hermesMessage.submit_to_gcn"
                  color="primary"
                  class="submit_switch"
                  label="Submit to GCN"
                  v-tooltip="submitToGcnTooltip"
                  :disabled="!stateStore.canSubmitToGcn"
                  @update:modelValue="update"
              >
              </v-switch>
            </v-col>
            <v-col>
              <v-menu open-on-hover :close-on-content-click="false" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-help" size="small" variant="plain" rounded="0" style="margin-top:-8px;"></v-btn>
                </template>
                <div v-html="submitToTnsTooltip" class="program-tooltip"></div>
              </v-menu>
              <v-menu open-on-hover :close-on-content-click="false" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-help" size="small" variant="plain" rounded="0"></v-btn>
                </template>
                <div v-html="submitToGcnTooltip" class="program-tooltip"></div>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <data-section
              class="mb-1"
              section="targets"
              datatype="Target"
              :errors="getErrors('data.targets', [])"
              :isEmpty="isSectionEmpty('targets')"
              :allowLoading=true
              :sectionShowSimple="sectionShowSimple['targets']"
              :disabled="props.hermesMessage.submit_to_tns"
              :ref="(el) => sectionRefs['targetsSection'] = el"
              @new-row="addSection('targets')"
              @copy-headers="copyHeaders"
              @parse-csv="parseCsv"
              @toggle-section-show-simple="toggleSectionShowSimple"
            >
              <data-table
                v-if="sectionShowSimple.targets && props.hermesMessage.data.targets.length > 0"
                id="target"
                :tableData="props.hermesMessage.data.targets"
                :fields="targetFields"
                :errors="getErrors('data.targets', [])"
                @remove="removeSection('targets', $event)"
                @copy="copySection('targets', $event)"
                @message-updated="update"
              >
              </data-table>
              <span v-if="!sectionShowSimple.targets">
                <div v-for="(target, idx) in props.hermesMessage.data.targets" :key="'target' + idx">
                  <data-target
                    :index="idx"
                    :target="target"
                    :errors="getDataErrorsArray('targets', idx)"
                    :is-tns="props.hermesMessage.submit_to_tns"
                    @remove="removeSection('targets', idx)"
                    @copy="copySection('targets', idx)"
                    @message-updated="update"
                  >
                  </data-target>
                </div>
              </span>
            </data-section>
            <data-section
              class="mb-1"
              section="photometry"
              datatype="Photometry"
              :errors="getErrors('data.photometry', [])"
              :isEmpty="isSectionEmpty('photometry')"
              :allowLoading=true
              :sectionShowSimple="sectionShowSimple['photometry']"
              :disabled="props.hermesMessage.submit_to_tns"
              :ref="(el) => sectionRefs['photometrySection'] = el"
              @new-row="addSection('photometry')"
              @copy-headers="copyHeaders"
              @parse-csv="parseCsv"
              @toggle-section-show-simple="toggleSectionShowSimple"
            >
              <data-table
                  v-if="sectionShowSimple.photometry && props.hermesMessage.data.photometry.length > 0"
                  id="photometry"
                  :tableData="props.hermesMessage.data.photometry"
                  :fields="photometryFields"
                  :errors="getErrors('data.photometry', [])"
                  @remove="removeSection('photometry', $event)"
                  @copy="copySection('photometry', $event)"
                  @message-updated="update"
                >
              </data-table>
              <span v-if="!sectionShowSimple.photometry">
                <div v-for="(photometry, idx) in props.hermesMessage.data.photometry" :key="'photometry' + idx">
                  <data-photometry
                    :index="idx"
                    :photometry="photometry"
                    :targets="props.hermesMessage.data.targets"
                    :errors="getDataErrorsArray('photometry', idx)"
                    :is-tns="props.hermesMessage.submit_to_tns"
                    @remove="removeSection('photometry', idx)"
                    @copy="copySection('photometry', idx)"
                    @message-updated="update"
                  >
                  </data-photometry>
                </div>
              </span>
            </data-section>
            <data-section
              class="mb-1"
              section="spectroscopy"
              datatype="Spectroscopy (beta)"
              :errors="getErrors('data.spectroscopy', [])"
              :isEmpty="isSectionEmpty('spectroscopy')"
              :sectionShowSimple="sectionShowSimple['spectroscopy']"
              :onlySimple=true
              :disabled=true
              :ref="(el) => sectionRefs['spectroscopySection'] = el"
              @new-row="addSection('spectroscopy')"
            >
              <div v-for="(spectroscopy, idx) in props.hermesMessage.data.spectroscopy" :key="'spectroscopy' + idx">
                <data-spectroscopy
                  :index="idx"
                  :spectroscopy="spectroscopy"
                  :targets="props.hermesMessage.data.targets"
                  :errors="getDataErrorsArray('spectroscopy', idx)"
                  :is-tns="props.hermesMessage.submit_to_tns"
                  @remove="removeSection('spectroscopy', idx)"
                  @copy="copySection('spectroscopy', idx)"
                  @message-updated="update"
                >
                </data-spectroscopy>
              </div>
            </data-section>
            <data-section
              class="mb-1"
              section="astrometry"
              datatype="Astrometry"
              :errors="getErrors('data.astrometry', [])"
              :isEmpty="isSectionEmpty('astrometry')"
              :allowLoading=true
              :sectionShowSimple="sectionShowSimple['astrometry']"
              :ref="(el) => sectionRefs['astrometrySection'] = el"
              @new-row="addSection('astrometry')"
              @copy-headers="copyHeaders"
              @parse-csv="parseCsv"
              @toggle-section-show-simple="toggleSectionShowSimple"
            >
              <data-table
                  v-if="sectionShowSimple.astrometry && props.hermesMessage.data.astrometry.length > 0"
                  id="astrometry"
                  :tableData="props.hermesMessage.data.astrometry"
                  :fields="astrometryFields"
                  :errors="getErrors('data.astrometry', [])"
                  @remove="removeSection('astrometry', $event)"
                  @copy="copySection('astrometry', $event)"
                  @message-updated="update"
                >
              </data-table>
              <span v-if="!sectionShowSimple.astrometry">
                <div v-for="(astrometry, idx) in props.hermesMessage.data.astrometry" :key="'astrometry' + idx">
                  <data-astrometry
                    :index="idx"
                    :astrometry="astrometry"
                    :targets="props.hermesMessage.data.targets"
                    :errors="getDataErrorsArray('astrometry', idx)"
                    @remove="removeSection('astrometry', idx)"
                    @copy="copySection('astrometry', idx)"
                    @message-updated="update"
                  >
                  </data-astrometry>
                </div>
              </span>
            </data-section>
            <data-section
              class="mb-1"
              section="references"
              datatype="Reference"
              :errors="getErrors('data.references', [])"
              :isEmpty="isSectionEmpty('references')"
              :sectionShowSimple="sectionShowSimple['references']"
              :allowLoading=true
              :ref="(el) => sectionRefs['referencesSection'] = el"
              @new-row="addSection('references')"
              @copy-headers="copyHeaders"
              @parse-csv="parseCsv"
              @toggle-section-show-simple="toggleSectionShowSimple"
            >
              <data-table
                v-if="sectionShowSimple.references && props.hermesMessage.data.references.length > 0"
                id="reference"
                :tableData="props.hermesMessage.data.references"
                :fields="referenceFields"
                :errors="getErrors('data.references', [])"
                @remove="removeSection('references', $event)"
                @copy="copySection('references', $event)"
                @message-updated="update"
              >
              </data-table>
              <span v-if="!sectionShowSimple.references" >
                <div v-for="(reference, idx) in props.hermesMessage.data.references" :key="'reference' + idx">
                  <data-reference
                    :index="idx"
                    :reference="reference"
                    :errors="getDataErrorsArray('references', idx)"
                    @remove="removeSection('references', idx)"
                    @copy="copySection('references', idx)"
                    @message-updated="update"
                  >
                  </data-reference>
                  <hr v-if="(idx + 1) < props.hermesMessage.data.references.length"/>
                </div>
              </span>
            </data-section>
            <data-section
              class="mb-1"
              section="extra_data"
              datatype="Extra Data"
              plural-datatype="Extra Data"
              :errors="getErrors('data.extra_data', [])"
              :sectionShowSimple="sectionShowSimple['extra_data']"
              :onlySimple=true
              :disabled=true
              :isEmpty="isSectionEmpty('extra_data')"
              :ref="(el) => sectionRefs['extra_dataSection'] = el"
              @new-row="addSection('extra_data')"
            >
              <data-table
                v-if="sectionShowSimple.extra_data && props.hermesMessage.data.extra_data.length > 0"
                id="extra_data"
                :tableData="props.hermesMessage.data.extra_data"
                :fields="extraDataFields"
                :errors="getErrors('data.extra_data', [])"
                @remove="removeSection('extra_data', $event)"
                @copy="copySection('extra_data', $event)"
                @message-updated="update"
              >
              </data-table>
            </data-section>
            <data-section
              section="message"
              datatype="Message"
              :ref="(el) => sectionRefs['messageSection'] = el"
              :errors="getErrors('message_text', null)"
              :isEmpty="props.hermesMessage.message_text === ''"
              :sectionShowSimple="sectionShowSimple['message']"
              :onlySimple=true
              :disabled=true
            >
            <v-tabs color="primary" v-model="messageTab">
              <v-tab value="edit">Edit</v-tab>
              <v-tab value="preview">Preview</v-tab>
              <v-tab value="help">Help</v-tab>
            </v-tabs>
            <v-divider></v-divider>
            <v-tabs-window v-model="messageTab">
              <v-tabs-window-item value="edit">
                <v-container>
                  <v-textarea v-model="props.hermesMessage.message_text" variant="outlined" placeholder="Enter Message. Use '{key}' to reference values in Additional Data Table." rows="3" max-rows="10" @update:modelValue="update">
                  </v-textarea>
                </v-container>
              </v-tabs-window-item>
              <v-tabs-window-item value="preview">
                <v-container>
                  <span style="white-space: pre;">
                    {{ formattedMessageText(props.hermesMessage) }}
                  </span>
                </v-container>
              </v-tabs-window-item>
              <v-tabs-window-item value="help">
                <v-container>
                  <ul>
                    <li>
                      Inject elements of the message data using the api key surrounded by curly braces <code>{}</code>.
                      <ul class="ml-4">
                        <li>
                          Ex. <code>{authors}</code> injects the values of the Authors field
                        </li>
                      </ul>
                    </li>
                    <li>
                      Dot notation is used to reference elements of a list or nested data structure.
                      <ul class="ml-4">
                        <li>
                          Ex. <code>{targets.0.ra}</code> injects the first Targets RA value
                        </li>
                      </ul>
                    </li>
                    <li>
                      If the dot notation references an array or nested structure, a string representation of the whole structure will be injected.
                      <ul class="ml-4">
                        <li>
                          Ex. <code>{targets}</code> injects the entire Targets table and all filled out associated fields
                        </li>
                      </ul>
                    </li>
                    <li>
                      For `Extra Data`, reference the key directly in the curly braces to substitute its value. These keys should not overlap with existing API structures.
                    </li>
                    <li>
                      If the dot notation does not match anything, nothing will be substituted into the message text. Key dotpaths are case sensitive.
                    </li>
                    <li>
                      Check out the <b>API View</b> tab on this page, or the <router-link to="/about" active>About page</router-link> for API documentation for the available message fields.
                    </li>
                  </ul>
                </v-container>
              </v-tabs-window-item>
            </v-tabs-window>
            </data-section>
          </v-row>
        </v-container>
      </v-tabs-window-item
            >
      <v-tabs-window-item value="api">
        <v-container>
          <v-row>
            <v-col class="bg-light rounded">
              <data-view
                class="p-4"
                :data="sanitizeMessage(props.hermesMessage)"
                :extra-download-button-attrs="{ class: 'float-right', variant: 'primary' }"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="plaintext">
        <v-container>
          <v-row>
            <v-col class="bg-light rounded">
              <data-view
                class="p-4"
                :data="props.plainText"
                downloadText="Download Plaintext"
                downloadFilename="textview.txt"
                :extra-download-button-attrs="{ class: 'float-right', variant: 'primary' }"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>
<style>
.submit_switch {
  max-height: 36px;
  position: relative;
  top: -15px;
}

.program-tooltip {
  background-color: lightgray;
  color:black;
}
</style>
