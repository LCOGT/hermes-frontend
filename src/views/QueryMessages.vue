<script setup>
import { ref, computed, onMounted } from 'vue';
import _ from 'lodash';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@/assets/css/view.css';
import { useDebounceFn } from '@vueuse/core';
import MessageDetail from '@/views/MessageDetail.vue';
import { useStateStore } from '@/stores/state'
import { useLogout } from '@/utils/logout.js';

dayjs.extend(relativeTime);

const stateStore = useStateStore()
const { logout } = useLogout();


const headers = ref([
  { title: 'Timestamp', key: 'metadata.timestamp', align: 'start' },
  { title: 'Topic', key: 'metadata.topic', align: 'start' },
  { title: 'Title', key: 'annotations.title', align: 'start' },
  { title: 'Sender', key: 'annotations.sender', align: 'start' },
  { title: 'Type', key: 'annotations.media_type', align: 'end'}
])

const selectedUUID = ref(null)
const selectedItem = ref(null)
const topics = ref([])
const searchTerms = ref(null)
// Initial date range is last 30 days
const startDate = ref((new Date(Date.now() - (3600 * 1000 * 24 * 30))).toISOString())
const endDate = ref((new Date(Date.now())).toISOString());
const limit = ref(10)
const isQuerying = ref(false)
const results = ref({})

const queryParams = computed(() => {
  let params = `?limit=${limit.value}`;
  topics.value.forEach((topic) => {
    params += `&topic=${topic}`;
  })
  if (searchTerms.value) {
    params += `&search_query=${searchTerms.value}`;
  }
  if (startDate.value) {
    params += `&start=${startDate.value}`
  }
  if (endDate.value) {
    params += `&end=${endDate.value}`
  }
  return params;
})

const fileIsSelected = computed(() => {
  if (selectedUUID.value) {
    if (selectedItem.value.annotations.file_name) {
      // Right now seeing if there is a filename seems like the best way to check
      return true;
    }
  }
  return false;
})

onMounted(async () => {
  queryMessages()
})

function timeFromNow(datetime) {
  if (!datetime) {
    return null;
  }
  return dayjs(datetime).fromNow();
}

function formatDate(datetime) {
  if (!datetime) {
    return null;
  }
  return dayjs(datetime).format('MMM D, YYYY, HH:mm');
}

async function queryMessages(page = null) {
  let params = queryParams.value;
  if (page) {
    params += `&page=${page}`;
  }
  isQuerying.value = true;
  fetch(stateStore.hermesUrl + "api/v0/query/" + params, {
    credentials: 'include',
    method: 'get',
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
    results.value = data;
  })
  .catch((error) => {
    console.log(error);
    results.value = {};
    if (error.response.status == 401) {
      logout()
    }
  })
  .finally(() => {
    isQuerying.value = false;
  });
}

async function pageForward() {
  queryMessages(results.value.next)
}

async function pageBackward() {
  queryMessages(results.value.prev)
}

// function toggleIncludeRetracted() {
//   this.queryParams.include_retracted = !this.queryParams.include_retracted;
//   let fakeEvent = {'preventDefault': () => true};
//   this.onSubmit(fakeEvent);
// }

async function downloadSelectedFile() {
  if (selectedItem.value) {
    let params = `?filename=${selectedItem.value.annotations.file_name}`;
    if (selectedItem.value.annotations.media_type) {
      params += `&content_type=${selectedItem.value.annotations.media_type}`;
    }
    try {
      const response = await fetch(stateStore.hermesUrl + `api/v0/query/download/${selectedUUID.value}/${params}`, {
        credentials: 'include',
        method: 'get',
      });
      if (!response.ok) {
        throw new Error(`Failed to Download File ${selectedItem.value.annotations.file_name}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedItem.value.annotations.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
    catch (error) {
      console.error('Download error: ', error);
    }
  }
}

async function onTopicChange() {
  queryMessages();
}

const debounceQuery = useDebounceFn(() => {
  queryMessages();
}, 300)

const selectRow = (event, { item }) => {
  const uuid = item.annotations.con_text_uuid;
  if (uuid == selectedUUID.value) {
    selectedUUID.value = null;
    selectedItem.value = null;
  }
  else {
    selectedUUID.value = uuid;
    selectedItem.value = item;
  }
}

const tableRowProps = ({ item }) => {
  if (item.annotations.con_text_uuid == selectedUUID.value) {
    return { class: 'selected-row' };
  }
  return { class: '' };
}

function mediaTypeToIcon(item) {
  if (item.annotations.file_name) {
    return 'mdi-file-download-outline';
  }
  else if (item.annotations.media_type.includes('voevent')) {
    return 'mdi-circle-outline';
  }
  else if (item.annotations.media_type.includes('json') || item.annotations.media_type.includes('avro') ||
          item.annotations.media_type == 'application/x.gcn.notice' || item.annotations.media_type == 'application/x.gcn.circular') {
    return 'mdi-code-json';
  }
  else if (item.annotations.media_type.includes('text')){
    return 'mdi-text';
  }
  else {
    return 'mdi-help';
  }
}

</script>
<template>
  <div class="overflow-auto px-4" :style="{ width: '100%' }">
    <v-row class="m-0" v-if="!stateStore.userIsAuthenticated">
      <v-alert class="text-center" variant="outlined" color="warning" text="You must login to use HERMES"
        icon="mdi-account-alert">
      </v-alert>
    </v-row>
    <v-row class="m-0" v-if="stateStore.userIsAuthenticated">
      <v-col md="6">
        <v-row class="pb-2 pt-2">
          <v-col class="pr-0 pb-0">
            <div class="datepicker-group">
              <v-label id="start-dp-label" class="datepicker-label">Start Date</v-label>
              <VueDatePicker v-model="startDate" model-type="iso" placeholder="Start Date" label="Start" required dark
                :clearable="false" @update:model-value="debounceQuery"></VueDatePicker>
            </div>
          </v-col>
          <v-col class="pr-0 pb-0">
            <div class="datepicker-group">
              <v-label id="end-dp-label" class="datepicker-label">End Date</v-label>
              <VueDatePicker v-model="endDate" model-type="iso" placeholder="End Date" required dark :clearable="false"
                @update:model-value="debounceQuery"></VueDatePicker>
            </div>
          </v-col>
        </v-row>
        <v-row class="pb-2 pt-1">
          <v-col class="col-md-7 pr-0 pt-1">
            <v-autocomplete v-model="topics" multiple chips closable-chips variant="outlined" width="400px"
              :items="stateStore.topic_options" placeholder="Filter by Topic" label="Topics" persistent-clear clearable
              @update:modelValue="onTopicChange">
            </v-autocomplete>
          </v-col>
          <v-col class="col-md-4 ml-auto pl-2 pt-1">
            <v-text-field type="search" clearable variant="outlined" label="Search Terms" v-model="searchTerms"
              @input="debounceQuery" @click:clear="debounceQuery"></v-text-field>
          </v-col>
        </v-row>
        <div class="table-container">
          <!-- Main Message Table -->
          <v-data-table-server hover :items="results.messages" :headers="headers" :loading="isQuerying"
            loading-text="Loading messages..." item-value="annotations.con_text_uuid" :row-props="tableRowProps"
            hide-default-footer @click:row="selectRow" items-length="99999" density="compact" disable-sort>
            <template v-slot:item.metadata.timestamp="{ value }">
              <span v-tooltip="formatDate(value)">
                {{ timeFromNow(value) }}
              </span>
            </template>
              <template v-slot:item.metadata.topic="{ value }">
              <span v-tooltip="value">
                {{ value.substring(value.lastIndexOf('.') + 1, value.length) }}
              </span>
            </template>
            <template v-slot:item.annotations.sender="{ value }">
              <span v-tooltip="value">
                {{ value.substring(0, value.indexOf('-')) }}
              </span>
            </template>
            <template v-slot:item.annotations.media_type="{ item, value }">
              <span v-tooltip="value">
                <v-btn v-if="value.includes('voevent')" icon="mdi-circle-outline" variant="plain" size="small" density="compact" readonly>vo</v-btn>
                <v-btn v-else :icon="mediaTypeToIcon(item)" variant="plain" size="small" density="compact" readonly></v-btn>
              </span>
            </template>
            <template #bottom>
              <div class="text-center pt-2 pb-2">
                <v-btn class="mr-2" variant="outlined" :disabled="!results.prev" @click="pageBackward">
                  Previous
                </v-btn>
                <v-btn class="ml-2" variant="outlined" :disabled="!results.next" @click="pageForward">
                  Next
                </v-btn>
              </div>
            </template>
          </v-data-table-server>
        </div>
      </v-col>
      <!-- Full Message Box -->
      <v-col md="6">
        <v-card v-if="fileIsSelected" border-variant="primary" class="mb-2" style="max-height: 50rem; overflow: auto;">
          <v-card-title>
            <b>{{ selectedItem.annotations.file_name }}</b>
          </v-card-title>
          <v-card-subtitle v-if="selectedItem.annotations.media_type">
            Type: <b>{{ selectedItem.annotations.media_type }}</b>
          </v-card-subtitle>
          <v-card-subtitle v-if="selectedItem.annotations.size">
            Size: <b>{{ selectedItem.annotations.size }}</b>
          </v-card-subtitle>
          <v-card-subtitle v-if="selectedItem.annotations.sender">
            Sender: <b>{{ selectedItem.annotations.sender }}</b>
          </v-card-subtitle>
          <v-card-text>
            <v-btn prepend-icon="mdi-file-download" variant="outlined" @click="downloadSelectedFile" color="secondary">Download {{ selectedItem.annotations.file_name }}</v-btn>
          </v-card-text>
        </v-card>
        <message-detail v-else-if="selectedUUID" :uuid="selectedUUID"></message-detail>
        <!-- Initial Message Box Display -->
        <v-card v-else border-variant="primary" class="mb-2" style="max-height: 50rem; overflow: auto;">
          <h4 class="text-center">
            HERMES is a Message Exchange Service for Multi-Messenger Astronomy applications that allow users to both
            send and
            review messages related to a variety of events and targets of interest.
          </h4>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<style>
.selected-row {
  background-color: rgb(45, 120, 163);
}

.retracted-btn {
  height: 32px;
  width: 32px;
  margin-top: 4px;
}

.retracted-btn.btn-danger {
  color: white;
}

.datepicker-group {
  position: relative;
}

.datepicker-label {
  z-index: 2;
  position: absolute;
  font-size: small;
  top: -12px;
  left: 8px;
  background-color: var(--vt-c-black);
}

button.dp--clear-btn {
  display: none;
}
</style>
