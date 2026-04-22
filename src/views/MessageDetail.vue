
<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import _ from 'lodash';
import '@/assets/css/view.css';
import PlotlyChart from '@/components/PlotlyChart.vue';
import { useStateStore } from '@/stores/state';
import { useLogout } from '@/utils/logout.js';
import { buildSpectraPlotData, loadSpectraFromUrl, isSpectraTextFile } from '@/utils/spectraPlotUtils.js';

const { logout } = useLogout();
const stateStore = useStateStore()

const props = defineProps({
  uuid: {
    type: String,
    required: true,
  }
})

const jsonData = ref({
  title: '',
  content: ''
})

const extraKeypairSearch = ref('')
const loadingMessage = ref(false)
const messageData = ref(null)
const retrieveMessageError = ref('')
const messageHeaders = ref(null)
const topic = ref('')
const panels = ref([])
const retractDialog = ref(false)
const jsonDialog = ref(false)
const plotDataByName = ref({})
const layoutByName = ref({})

const KVdataFields = [{ key: "key", title: "Key" }, { key: "value", title: "Value" }]
const kvItemsPerPage = ref(10);
const preSetTableOrder = {
  targets: "name,ra,ra_error,ra_error_units,dec,dec_error,dec_error_units,file_info,pm_ra,pm_dec,epoch,aliases,redshift,host_redshift,host_name,group_associations",
  photometry: "target_name,date_obs,telescope,instrument,bandpass,brightness,brightness_error,brightness_unit,limiting_brightness,limiting_brightness_error,limiting_brightness_unit,exposure_time,observer,catalog",
  spectroscopy: "target_name,date_obs,telescope,instrument,file_info,flux_units,wavelength_units,flux_type,observer,reducer,classification,exposure_time,setup,spec_type,proprietary_period,proprietary_period_units",
  astrometry: "target_name,date_obs,telescope,instrument,ra,ra_error,ra_error_units,dec,dec_error,dec_error_units,mpc_sitecode,catalog",
  references: "source,citation,url",
}

onMounted(async () => {
  await loadMessageData()
})

watch(() => props.uuid, async () => {
  await loadMessageData();
})

watch(() => messageData.value, async () => {
  if (messageData.value) {
    await createSpectraPlots();
  }
})

const messageUUID = computed(() => {
  return props.uuid;
})

const messageTitle = computed(() => {
  if (messageData.value?.title) {
    return messageData.value.title;
  }
  else if (messageData.value?.subject) {
    return messageData.value.subject;
  }
  else {
    return messageUUID.value
  }
})

const messageAuthor = computed(() => {
  if (messageData.value && messageData.value?.submitter) {
    // GCN Circular formatted authors
    return messageData.value?.submitter
  }
  else if (messageData.value && messageData.value?.authors) {
    // HERMES formatted authors
    return messageData.value?.authors
  }
  else if (messageHeaders.value && messageHeaders.value?._sender) {
    // Otherwise try to parse _sender out of message headers
    return messageHeaders.value?._sender
  }
  return ''
})

const messageText = computed(() => {
  if (messageData.value && _.isObjectLike(messageData.value)) {
    if ('message_text' in messageData.value) {
      // HERMES formatted message text
      return messageData.value.message_text
    }
    else if ('body' in messageData.value) {
      // GCN Circular formatted message text
      return messageData.value.body
    }
    else {
      // Otherwise no parseable plaintext field
      return ''
    }
  }
  return ''
})

// Return short versio of UUID
const shortUUID = computed(() => {
  return messageUUID.value.split("-")[0];
})

const isGcnCircular = computed(() => {
  return topic.value === 'gcn.circular' || topic.value === 'gcn.circulars'
})
    
const showRetractMessage = computed(() => {
  // if (stateStore.userIsAuthenticated && messageData.value) {
  //   let group = topic.value.split(".", 1)[0];
  //   if (group in stateStore.profile.group_memberships && stateStore.profile.group_memberships[group] === 'Owner') {
  //     return !messageData.annotations?.retracted;
  //   }
  // }
  return false;
})

async function loadMessageData() {
  let uuid = messageUUID.value
  retrieveMessageError.value = ''
  loadingMessage.value = true
  messageData.value = null
  messageHeaders.value = null
  if (uuid) {
    fetch(stateStore.hermesUrl + `api/v0/query/message/${uuid}`, {
      credentials: 'include',
      method: 'get'
    })
    .then((response) => {
      if (!response.ok) {
        let error = new Error("HTTP " + response.status);
        error.response = response;
        error.status = response.status;
        throw error;
      }
      return response.json();
    })
    .then(data => {
      messageData.value = data.message
      messageHeaders.value = data.metadata?.headers
      topic.value = data.metadata?.topic
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status == 400) {
        retrieveMessageError.value = `No message with UUID ${props.uuid} found`
      }      
      else if (error.response.status == 401){
        logout()
      }
      else {
        retrieveMessageError.value = `Error: ${error.response.content}`
      }
    })
    .finally(() => {
      loadingMessage.value = false
    });
  }
}

async function createSpectraPlots() {
  plotDataByName.value = {};
  layoutByName.value = {};
  if (_.has(messageData.value, 'data.spectroscopy') && !_.isEmpty(messageData.value, 'data.spectroscopy')) {
    let i = 1;
    for (const spectro_entry of messageData.value.data.spectroscopy) {
      if (!_.isEmpty(spectro_entry.flux) && !_.isEmpty(spectro_entry.wavelength)) {
        const title = i + ': ' + spectro_entry.date_obs;
        const { plotData, layout } = buildSpectraPlotData(
          spectro_entry.flux, spectro_entry.flux_units, spectro_entry.flux_error,
          spectro_entry.wavelength, spectro_entry.wavelength_units, title
        );
        plotDataByName.value[title] = plotData;
        layoutByName.value[title] = layout;
      }
      if (!_.isEmpty(spectro_entry.file_info)) {
        for (const file_info of spectro_entry.file_info) {
          if (!_.isEmpty(file_info.url) && isSpectraTextFile(file_info.name)) {
            const title = i + ': ' + file_info.name;
            try {
              const { fluxArray, wavelengthArray } = await loadSpectraFromUrl(file_info.url);
              const { plotData, layout } = buildSpectraPlotData(
                fluxArray, spectro_entry.flux_units, null,
                wavelengthArray, spectro_entry.wavelength_units, title
              );
              plotDataByName.value[title] = plotData;
              layoutByName.value[title] = layout;
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
      i++;
    }
  }
}

function copy(value, type) {
  // Copy text to Clipboard
  // Only works with HTTPS or local
  navigator.clipboard.writeText(value);
  // TODO: Show vuetify alert to show sucessful copy
}

function info() {
  // Get full message info as JSON String
  jsonData.value.content = JSON.stringify(messageData.value, null, 2);
  jsonData.value.title = "JSON for " + topic.value + " message.";
  jsonDialog.value = true;
}

async function retractMessage() {
  //TODO: This is not yet implemented in scimma archive
  console.log("Attempting to Retract message " + props.uuid);
  const url = new URL('/api/v0/messages/' + props.uuid + '/', stateStore.hermesUrl).href
  fetch(url, {
    mode: 'cors',
    method: 'patch',
    headers: {'Content-Type': 'application/json',
              'X-CSRFToken': stateStore.csrf_token
              },
    credentials: 'include',
    body: JSON.stringify({'retracted': true})
  })
  .then((response) => {
    if (!response.ok) {
      let error = new Error("HTTP " + response.status);
      error.response = response;
      error.status = response.status;
      throw error;
    }
    messageData.annotations.retracted = response.data.retracted;
  })
  .catch((error) => {
    console.log(error);
    if (error.response.status == 401){
      logout();
    }
  });
}

function resetjsonData() {
  // clear JSON data and remove copy alert when window closed
  jsonData.value.title = '';
  jsonData.value.content = '';
  showCopyAlert.value = false;
}

function getGcnCircularLink(message) {
  return 'https://gcn.nasa.gov/circulars/' + getGcnCircularNumber(message);
}

function getGcnCircularNumber (message) {
  return messageData.value.circularId;
}

function getGraceDBLink(superevent_id) {
  return 'https://gracedb.ligo.org/superevents/' + superevent_id + '/view/';
}

function itemHasEventId(item) {
  return _.has(item.value, 'data.event_id');
}

function itemIsNLE(item) {
  return _.has(item.value, 'superevent_id');
}

function getKVItems(item) {
  var kvList = [];
  if (item) {
    for (const [key, value] of Object.entries(item)) {
      kvList.push({ 'key': key, 'value': value });
    }
  }
  return kvList;
}

function getArrayDataItems(message) {
  // Return the data object with just array items remaining
  if (message) {
    const data = message.data ? message.data : message
    return _.pickBy(data, function(value, key) {
      return _.isArray(value) && value.length > 0 && _.isObject(value[0]);
    });
  }
  return {};
}

function getDictionaryDataItems(message) {
  // Return the data object with just dictionary items remaining
  if (message) {
    const data = message.data ? message.data : message
    return _.pickBy(data, function (value,) {
      return _.isObject(value) && !_.isArray(value);
    });
  }
  return {};
}

function shouldShowTableFooter(items, perPage) {
  if (Object.keys(items).length > perPage) {
    return true;
  }
  return false;
}

function valueForKV(key, value) {
  let shouldInclude = true;
  if (key == 'event_id') {
    shouldInclude = false;
  }
  else if(_.isArray(value) && value.length > 0 && _.isObjectLike(value[0])) {
    shouldInclude = false;
  }
  else if(_.isObjectLike(value) && !_.isArray(value)) {
    shouldInclude = false;
  }
  return shouldInclude;
}

function getNonObjectDataItems(message) {
  // Return KV pairs for the remaining non-array/non-object primitive fields within the data
  if (message) {
    const data = message.data ? message.data : message
    let kvPairs = _.pickBy(data, function (value, key) {
      return valueForKV(key, value)
    });
    return getKVItems(kvPairs);
  }
  return []
}

function hasNonObjectDataItems(message) {
  return !_.isEmpty(getNonObjectDataItems(message));
}

function isLink(text) {
  return _.isString(text) && text.startsWith('http');
}

function getDataFields(section, values) {
  // Create the fields for the Main Data Table
  var fieldList = [];
  var column_list = [];
  var dataFields = new Set();
  // Get the set of fields in this tables data
  for (let i = 0; i < values.length; i += 1) {
    _.keys(values[i]).forEach(dataFields.add, dataFields);
  }
  dataFields = Array.from(dataFields);
  // This is a hack to remove *_units fields that don't have a corresponding field they relate to.
  for (let i = dataFields.length - 1; i >= 0; i--) {
    if (dataFields[i].includes('_units')) {
      if (!dataFields.includes(_.replace(dataFields[i], '_units', ''))) {
        dataFields.splice(i, 1);
        continue;
      }
    }
    else if (dataFields[i].includes('_unit') && !dataFields.includes(_.replace(dataFields[i], '_unit', ''))) {
      dataFields.splice(i, 1);
    }
  }
  if (section in preSetTableOrder) {
    // If Hermes Table, pull Preset Order
    column_list = _.intersection(preSetTableOrder[section].split(','), dataFields);
  } else {
    // Otherwise just use the order of the fields in the data itself
    column_list = dataFields;
  }
  for (const data_key of column_list) {
    var dataDict = {};
    dataDict['key'] = data_key;
    dataDict['title'] = data_key;
    dataDict['class'] = "data-column";
    fieldList.push(dataDict);
  }
  return fieldList;
}
</script>
<template>
  <div class="overflow-auto px-4 no-padding" :style="{ width: '100%' }">
    <v-container class="no-padding">
      <v-progress-linear v-if="loadingMessage" indeterminate height="25">
        <template v-slot:default>
          <strong>Loading Message</strong>
        </template>
      </v-progress-linear>
      <v-alert v-if="retrieveMessageError" type="error" title="Error" density="compact">
        <p>{{ retrieveMessageError }}</p>
      </v-alert>
      <v-card v-if="messageData" variant="flat" class="mb-2" :class="messageData.annotations?.retracted ? 'retracted-body': ''" style="overflow: auto;">
        <!-- Header -->
        <v-card-title>
          <v-row v-if="messageData.annotations?.retracted" class="retracted-text">
            <v-col class="d-flex justify-content-center">
              <h4 class="retracted-text">MESSAGE RETRACTED</h4>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <p style="white-space: pre-wrap;">
                {{ messageTitle }}
              </p>
              <v-btn v-if="showRetractMessage" variant="outlined" color="error" title="Retract Message" @click="retractDialog.value = true">
                <v-icon icon="clipboard-x"></v-icon>
              </v-btn>
              <v-dialog v-model="retractDialog" persistent>
                <v-card title="Are you sure you want to retract this message?">
                  <v-card-text>
                    Retracted messages are excluded from hermes queries by default. <b>This operation is not reversible!</b>
                  </v-card-text>
                  <template v-slot:actions>
                    <v-btn variant="flat" color="primary" @click="retractDialog.value = false">Cancel</v-btn>
                    <v-spacer />
                    <v-btn variant="flat" color="error" @click="retractDialog.value = false; retractMessage()">Retract</v-btn>
                  </template>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-subtitle> Author: {{ messageAuthor }} </v-card-subtitle>
        <v-card-subtitle>
          Message ID:
          <v-btn :to="{ name: 'message', params: { uuid: messageUUID } }" v-tooltip="messageUUID" :title="messageUUID" variant="plain" density="compact" color="secondary">
            {{ shortUUID }}
          </v-btn>
          <v-btn title="Copy ID" icon="mdi-content-copy" @click="copy(messageUUID, 'Message ID')" v-tooltip="'Copy'" density="compact" class="rounded-0">
          </v-btn>
        </v-card-subtitle>
        <v-card-subtitle class="mt-1" v-if="itemHasEventId(messageData)">
          Related Superevent Messages:
          <v-btn :to="{ name: 'nonlocalizedevent', params: { id: messageData.value.data.event_id } }" v-tooltip="messageData.value.data.event_id"
            :title="messageData.value.data.event_id" variant="plain" density="compact" color="secondary">
            {{ messageData.value.data.event_id }}
          </v-btn>
        </v-card-subtitle>
        <v-card-subtitle class="mt-1" v-if="itemIsNLE(messageData)">
          Superevent Messages:
          <v-btn :to="{ name: 'nonlocalizedevent', params: { id: messageData.value.superevent_id } }" v-tooltip="messageData.value.superevent_id"
            :title="messageData.value.superevent_id" variant="plain" density="compact" color="secondary">
            {{ messageData.value.superevent_id }}
          </v-btn>
        </v-card-subtitle>
        <v-card-subtitle class="mt-1" v-if="isGcnCircular">
          Originally published as
          <v-btn :href="getGcnCircularLink(messageData)" v-tooltip="getGcnCircularLink(messageData)"
            :title="getGcnCircularLink(messageData)" target="_blank" variant="plain" density="compact" color="secondary">
            GCN Circular {{ getGcnCircularNumber(messageData) }}
          </v-btn>
        </v-card-subtitle>
        <hr class="mt-4">
        <!-- Main Message -->
        <v-row v-if="messageText">
          <span class="mt-4 pl-6 mb-4" style="white-space: pre-wrap;">
            {{ messageText }}
          </span>
        </v-row>
        <div v-if="Object.keys(plotDataByName).length > 0">
          <div v-for="plotName in Object.keys(plotDataByName)" :key="plotName + '-spectra-plot'">
            <v-row>
              <PlotlyChart :data="new Array(plotDataByName[plotName])" :layout="layoutByName[plotName]"></PlotlyChart>
            </v-row>
          </div>
          <hr class="mt-4">
        </div>
        <!-- Main Data Table -->
        <v-expansion-panels v-model="panels" variant="accordion" multiple>
          <v-expansion-panel v-for="(items, field) in getArrayDataItems(messageData)" :key="field + '-array-table'" :value="field + '-array-table'" :title="field.toUpperCase().replace('_', ' ') + ' TABLE'">
            <v-expansion-panel-text>
              <v-data-table :items="items" :headers="getDataFields(field, items)" fixed-header disable-sort striped="even" density="compact" :items-per-page="kvItemsPerPage">
                <template v-slot:item.citation="{ item }">
                  <v-btn v-if="item.source == 'hop_uuid'" :to="{ name: 'message', params: { id: item.citation } }">{{ item.citation }}</v-btn>
                  <v-btn v-else-if="item.source == 'gracedb_id'" :href="getGraceDBLink(item.citation)" target="_blank" v-tooltip="getGraceDBLink(item.citation)">{{ item.citation }}</v-btn>
                  <p v-else>{{ item.citation }}</p>
                </template>
                <template v-slot:item.file_info="{ item }">
                  <v-btn v-for="(file_info, idx) in item.file_info" class="pr-2" :key="'file_info-' + file_info.name" :href="file_info.url" target="_blank" :disabled="!file_info.url" color="secondary" variant="plain">{{ file_info.name }}</v-btn>
                </template>
                <template v-slot:item.url="{ item }">
                  <v-btn :href="item.url" target="_blank" color="secondary" variant="plain">{{ item.url }}</v-btn>
                </template>
                <template v-slot:bottom v-if="!shouldShowTableFooter(items, kvItemsPerPage)"></template>
            </v-data-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel v-for="(items, field) in getDictionaryDataItems(messageData)" :key="field + '-dictionary'" :value="field + '-dictionary'" :title="field.toUpperCase().replace('_', ' ')">
            <v-expansion-panel-text>
              <v-data-table :items="getKVItems(items)" :headers="KVdataFields" fixed-header disable-sort striped="even" density="compact" :items-per-page="kvItemsPerPage">
                <template v-slot:item.value="{ item }">
                  <v-btn v-if="isLink(item.value)" :href="item.value" target="_blank" color="secondary" variant="plain">{{ item.value }}</v-btn>
                  <p v-else>{{ item.value }}</p>
                </template>
                <template v-slot:bottom v-if="!shouldShowTableFooter(getKVItems(items), kvItemsPerPage)"></template>
              </v-data-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel v-if="hasNonObjectDataItems(messageData)" title="EXTRA KEYPAIRS" value="extra-keypairs">
            <v-expansion-panel-text>
              <v-text-field v-if="shouldShowTableFooter(getNonObjectDataItems(messageData), kvItemsPerPage)" v-model="extraKeypairSearch" label="Filter" density="compact" prepend-inner-icon="mdi-magnify" variant="outlined" hide-details single-line></v-text-field>
              <v-data-table :items="getNonObjectDataItems(messageData)" :headers="KVdataFields" fixed-header disable-sort striped="even" density="compact" :items-per-page="kvItemsPerPage" :search="extraKeypairSearch">
                  <template v-slot:item.value="item">
                    <v-btn v-if="isLink(item.value)" :href="item.value" target="_blank">{{ item.value }}</v-btn>
                    <p v-else>{{ item.value }}</p>
                </template>
                <template v-slot:bottom v-if="!shouldShowTableFooter(getNonObjectDataItems(messageData), kvItemsPerPage)"></template>
              </v-data-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-card-actions>
          <v-btn variant="outlined" color="primary" @click="info()" class="mr-1">Show JSON:</v-btn>
          <v-dialog v-model="jsonDialog" width="auto">
            <v-card :title="jsonData.title">
              <v-card-text style="overflow-y: scroll;">
                <pre>{{ jsonData.content }}</pre>
              </v-card-text>
              <template v-slot:actions>
                <v-btn variant="outlined" color="primary" density="compact" @click="copy(jsonData.content, 'JSON Data')">Copy</v-btn>
                <v-spacer />
                <v-btn variant="outlined" color="primary" density="compact" @click="jsonDialog = false">Done</v-btn>
              </template>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>
<style>

.retracted-text {
  background: linear-gradient(
    90deg,
    red,
    darkorange,
    red
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
  animation: move-gradient 2s linear infinite;
}

.retracted-body {
  background-image: repeating-linear-gradient(45deg, #f003 0px, #f003 2px, transparent 2px, transparent 50px);
}

@keyframes move-gradient {
  to {
    background-position: -200% 0;
  }
}

.js-plotly-plot {
  width: 100%;
}

</style>
