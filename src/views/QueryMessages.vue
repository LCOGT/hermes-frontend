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
import DataExtra from '../components/message-composition/DataExtra.vue';

dayjs.extend(relativeTime);

const stateStore = useStateStore()
const { logout } = useLogout();


const headers = ref([
  { title: 'Timestamp', key: 'metadata.timestamp', align: 'start' },
  { title: 'Topic', key: 'metadata.topic', align: 'start' },
])

const selectedUUID= ref(null)
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

async function queryMessages(page=null) {
  let params = queryParams.value;
  if (page) {
    params += `&page=${page}`;
  }
  isQuerying.value = true;
  fetch(stateStore.hermesUrl + "api/v0/query/" + params, {
    credentials: 'include',
    method: 'get',
  })
  .then((response) => response.json())
  .then(data => {
    results.value = data;
  })
  .catch((error) => {
    console.log(error);
    results.value = {};
    if (error.response.status == 401){
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
  }
  else {
    selectedUUID.value = uuid;
  }
}

const tableRowProps = ({ item }) => {
  if (item.annotations.con_text_uuid == selectedUUID.value) {
    return { class: 'selected-row' };
  }
  return { class: '' };
}

</script>
<template>
  <div class="overflow-auto px-4" :style="{width: '100%'}">
    <v-row class="m-0" v-if="!stateStore.userIsAuthenticated">
      <v-alert class="text-center" variant="outlined" color="warning" text="You must login to use HERMES" icon="mdi-account-alert">
      </v-alert>
    </v-row>
    <v-row class="m-0" v-if="stateStore.userIsAuthenticated">
      <v-col md="6">
        <v-row class="pb-2 pt-2">
          <v-col class="pr-0 pb-0">
            <div class="datepicker-group">
              <v-label id="start-dp-label" class="datepicker-label">Start Date</v-label>
              <VueDatePicker v-model="startDate" model-type="iso" placeholder="Start Date" label="Start" required dark :clearable="false" @update:model-value="debounceQuery"></VueDatePicker>
            </div>
          </v-col>
          <v-col class="pr-0 pb-0">
            <div class="datepicker-group">
              <v-label id="end-dp-label" class="datepicker-label">End Date</v-label>
              <VueDatePicker v-model="endDate" model-type="iso" placeholder="End Date" required dark :clearable="false" @update:model-value="debounceQuery"></VueDatePicker>
            </div>
          </v-col>
        </v-row>
        <v-row class="pb-2 pt-1">
          <v-col class="col-md-7 pr-0 pt-1">
            <v-autocomplete
              v-model="topics"
              multiple
              chips
              closable-chips
              variant="outlined"
              width="400px"
              :items="stateStore.topic_options"
              placeholder="Filter by Topic"
              label="Topics"
              persistent-clear
              clearable
              @update:modelValue="onTopicChange"
            >
            </v-autocomplete>
          </v-col>
          <v-col class="col-md-4 ml-auto pl-2 pt-1">
            <v-text-field type="search" clearable variant="outlined" label="Search Terms" v-model="searchTerms" @input="debounceQuery" @click:clear="debounceQuery"></v-text-field>
          </v-col>
        </v-row>
        <div class="table-container">
          <!-- Main Message Table -->
          <v-data-table-server
            hover
            :items="results.messages"
            :headers="headers"
            :loading="isQuerying"
            loading-text="Loading messages..."
            item-value="annotations.con_text_uuid"
            :row-props="tableRowProps"
            hide-default-footer
            @click:row="selectRow"
            items-length="99999"
            density="compact"
          >
            <template v-slot:item.metadata.timestamp="{ value }">
              <span v-tooltip="formatDate(value)">
                {{ timeFromNow(value) }}
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
        <message-detail v-if="selectedUUID" :uuid="selectedUUID"></message-detail>
        <!-- Initial Message Box Display -->
        <v-card v-else border-variant="primary" class="mb-2" style="max-height: 50rem; overflow: auto;">
          <h4 class="text-center" >
            HERMES is a Message Exchange Service for Multi-Messenger Astronomy applications that allow users to both send and review messages related to a variety of events and targets of interest.
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
  position:absolute;
  font-size:small;
  top:-12px;
  left: 8px;
  background-color: var(--vt-c-black);
}

button.dp--clear-btn {
  display: none;
}

</style>
