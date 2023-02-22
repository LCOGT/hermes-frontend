<template>
  <div class="overflow-auto px-4" :style="{width: '100%'}">
  <b-row>
  <b-col>
    <b-row>
      <b-col class="col-md-4">
        <!-- Topic Filter -->
        <b-form-select
          id="topic_selector"
          v-model.lazy="queryParams.topic_exact"
          :options="topic_options"
          @change="onTopicChange"
        >
          <template #first>
            <b-form-select-option value="">-- All Topics --</b-form-select-option>
          </template>
        </b-form-select>
      </b-col>
      <b-col class="col-md-8">
        <!-- Pagination -->
        <ocs-pagination
          v-if="!isBusy"
          table-id="message-table"
          :per-page="queryParams.limit"
          :total-rows="data.count"
          :current-page="currentPage"
          :display-per-page-dropdown="false"
          total-rows-class="hermes-total-rows"
          @pageChange="onPageChange"
        ></ocs-pagination>
      </b-col>
    </b-row>
    <!-- Main Message Table -->
    <b-table
      hover
      small
      noCollapse
      outlined
      select-mode="single"
      selectable
      striped
      sort-icon-left
      head-variant="light"
      @row-clicked="item=>onRowClicked(item)"
      class="message-b-table"
      id="message-table"
      :busy="isBusy"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :items="data.results"
      :fields="visibleFields"
    >
      <template v-slot:table-busy>
        <br />
        <div class="text-center my-2"><i class="fa fa-spin fa-spinner" /> Loading messages...</div>
        <br />
      </template>
      <!-- Index Message -->
      <template #cell(index)="data">
        {{ data.index + 1 }}
      </template>

      <!-- Style Header -->
      <template #head()="data">
        <span variant="secondary" class="data-column">{{ data.label.toUpperCase() }}</span>
      </template>

      <!-- Selection Behavior -->
      <template #cell(selected)="row">
        <template v-if="row.rowSelected">
          <span aria-hidden="true">&#8667;<!-- Tripple rightarrow --></span>
        </template>
        <template v-else>
          <span aria-hidden="true">&#10624;<!-- Three Bars --></span>
        </template>
      </template>

      <!-- Format Timestamp -->
      <template #cell(created)="data">
        <div v-b-tooltip.hover :title="data.item.created|formatDate">
          {{ data.item.created | timeFromNow }}
        </div>
      </template>
    </b-table>
    <b-row>
      <b-col class="col-md-8 ml-auto">
        <!-- Pagination -->
        <ocs-pagination
          v-if="!isBusy"
          table-id="message-table"
          :per-page="queryParams.limit"
          :total-rows="data.count"
          :current-page="currentPage"
          :display-per-page-dropdown="false"
          total-rows-class="hermes-total-rows"
          @pageChange="onPageChange"
        ></ocs-pagination>
      </b-col>
    </b-row>
  </b-col>

  <!-- Full Message Box -->
  <b-col>
    <b-card border-variant="primary" class="mb-2" style="max-height: 50rem; overflow: auto;">
      <div v-if="selectedItem">
        <!-- Header -->
        <b-card-title> {{selectedItem.title}} </b-card-title>
        <b-card-sub-title> {{selectedItem.author}} </b-card-sub-title>
        <b-card-sub-title>
          Message ID:
          <b-link @click="copy(selectedItem.uuid, 'Message ID')">
            {{selectedItem.uuid}}
          </b-link>
        </b-card-sub-title>
        <hr>
        <!-- Main Message -->
        <b-row>
          <span class="m-2" style="white-space: pre-wrap;">
            {{ selectedItem.message_text}}
          </span>
        </b-row>
        <hr>
        <!-- Main Data Table -->
        <div v-if="getDataTitle(selectedItem)">
          <b-row sm="3" v-b-toggle.collapse-main-data class="text-sm-right mx-2">
            <h4 class="collapse-table-head">{{ getDataTitle(selectedItem).toUpperCase().replace("_", " ") }} TABLE &#9776;</h4>
          </b-row>
          <b-collapse id="collapse-main-data">
            <b-row  class="mx-2">
              <b-table
                small
                reactive
                class="data-b-table"
                :items="getDataItems(selectedItem)"
                :fields="getDataFields(selectedItem)"
              >
              </b-table>
            </b-row>
          </b-collapse>
          <hr>
        </div>
        <!-- Additional Data Table -->
        <b-row sm="3" v-b-toggle.collapse-additional-data class="text-sm-right mx-2">
          <h4 class="collapse-table-head">ADDITIONAL DATA TABLE &#9776;</h4>
        </b-row>
        <b-collapse id="collapse-additional-data">
          <b-row class="mx-2">
            <b-table
              small
              reactive
              class="kv-b-table"
              :items="getKVDataItems(selectedItem)"
              :fields="KVdataFields"
            >
            </b-table>
          </b-row>
        </b-collapse>
        <hr>
        <!-- Show JSON Button -->
        <b-row class="mb-2 mx-2 pb-3">
          <b-button variant="outline-primary" size="sm" @click="info(selectedItem, $event.target)" class="mr-1">
            <b> Show JSON: </b>
          </b-button>
        </b-row>
      </div>
      <!-- Initial Message Box Display -->
      <h4 class="text-center" v-else>
        HERMES is a Message Exchange Service for Multi-Messenger Astronomy applications that allow users to both send and review messages related to a variety of events and targets of interest.
      </h4>
    </b-card>
  </b-col>
  </b-row>

    <!-- JSON DATA -->
    <b-modal :id="jsonData.id" :title="jsonData.title" @hidden="resetjsonData">
      <b-row>
        <pre>{{ jsonData.content }}</pre>
      </b-row>
      <template #modal-footer="{ hide }">
        <div class="w-100">
          <b-button
            variant="outline-primary"
            size="sm"
            class="float-left"
            @click="copy(jsonData.content, 'JSON Data')"
          >
            Copy
          </b-button>
          <b-button
            variant="primary"
            size="sm"
            class="float-right"
            @click="hide()"
          >
            Done
          </b-button>
        </div>
      </template>
    </b-modal>

  </div>
</template>

<script>
import { OCSMixin } from 'ocs-component-lib';
import getEnv from "@/utils/env.js";
import axios from "axios";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import '@/assets/css/view.css';

export default {
  name: "ViewMessages",
  mixins: [OCSMixin.paginationAndFilteringMixin],
  data() {
    return {
      topic_options: [],
      sortBy: 'created',
      sortDesc: true,
      fields: [
        {
          key: "selected",
          label: "",
          headerTitle: "selected",
          class: "data-column",
          visible: true
        },
        {
          key: "index",
          label: "",
          class: "data-column",
          visible: false
        },
        {
          key: "created",
          sortable: true,
          sortDirection: 'desc',
          label: "Timestamp",
          class: "data-column",
          visible: true
        },
        {
          key: "topic",
          label: "Topic",
          class: "data-column",
          visible: true
        },
        {
          key: "title",
          sortable: true,
          class: "data-column",
          visible: true
        },
        {
          key: "submitter",
          sortable: true,
          class: "data-column",
          label: "Submitter",
          visible: true
        },
      ],
      selectedItem: null,
      topic: null,
      jsonData: {
          id: 'json-data',
          title: '',
          content: ''
      },
      KVdataFields: [{key: "key", class: "data-column"}, {key: "value", class: "data-column"}],
      preSetTableOrder: {
        nle_data: "eventId,discoveryDate,instrument,skymapLink,falseAlarmRate",
        non_detection_data: "ra,dec,obsDate,telescope,instrument,band,depth,depthUnit",
        pointing_data: "ra,dec,obsStatus,obsDate,telescope,instrument,band,depth,depthUnit",
        photometry: "target_name,ra,dec,date,telescope,instrument,band,nondetection,brightness,brightness_error,brightness_unit",
        spectroscopy_data: "spectroscopyId,dateObs,telescope,instrument,exptime,classification,spectrumURL",
        telescope_events: "observatory,telescope,instrument,eventDate,description"
      }
    };
  },
  mounted() {
    // Get available topics
    axios
      .get(getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "api/v0/topics/")
      .then((response) => (this.topic_options = response.data.topics))
      .catch((error) => console.log(error));
  },
  created() {
    dayjs.extend(relativeTime);
  },
  computed: {
    visibleFields() {
      return this.fields.filter(field => field.visible);
    }
  },
  methods: {
    copy(value, type) {
      // Copy text to Clipboard
      // Only works with HTTPS or local
      navigator.clipboard.writeText(value);
      // Trigger alert to show sucessful copy
      this.$bvToast.toast(type + ' copied to clipboard!', {
          title: 'Success!',
          variant: 'success',
          autoHideDelay: '1000',
          solid: "true"
        })
    },
    // Overrides method in paginationAndFilteringMixin
    initializeDataEndpoint: function() {
      return getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + 'api/v0/messages/';
    },
    // Overrides method in paginationAndFilteringMixin
    initializeDefaultQueryParams: function() {
      const defaultQueryParams = {
        topic_exact: '',
        limit: 10,
        offset: 0
      };
      return defaultQueryParams;
    },
    onTopicChange(value) {
      this.fields.forEach(field => {
        if (field.key == 'topic') {
          field.visible = (value == '');
        }
      });
      console.log(value);
      let fakeEvent = {'preventDefault': () => true};
      this.onSubmit(fakeEvent);
    },
    onRowClicked(item) {
      // Define Behavior when Row Clicked
      this.selectedItem = item
    },
    info(item, button) {
      // Get full message info as JSON String
      this.jsonData.content = JSON.stringify(item, null, 2);
      this.jsonData.title = "JSON for " + item.topic + " message.";
      // raise modal
      this.$root.$emit('bv::show::modal', this.jsonData.id, button);
    },
    resetjsonData() {
      // clear JSON data and remove copy alert when window closed
      this.jsonData.title = '';
      this.jsonData.content = '';
      this.showCopyAlert=false;
    },
    getKVDataItems(item){
      // Retrieve Key/Value data from JSON message
      var kvList = [];
      for (const [key, value] of Object.entries(item.data)) {
        // Carve out exceptions:
        // For GCN circulars, we use "body" to store the message and the
        // "header" contains a dictionary we want to parse for its own table.
        // If the value is an array, we want to display it as its own table.
        if (!(key == "body" && item.topic == 'gcn.circular') &&
            !(key == "header" && item.topic == 'gcn.circular') &&
            !(Array.isArray(value))) {
          // Build Additional Data Table
          var dataDict = {};
          dataDict['key']= key;
          dataDict['value']= value;
          kvList.push(dataDict);
        } else if (key == "header" && item.topic == 'gcn.circular') {
          // Convert GCN circular Header into Additional Data Table
          for (const [header_key, header_value] of Object.entries(value)) {
            var headerDict = {};
            headerDict['key']= header_key;
            headerDict['value']= header_value;
            kvList.push(headerDict);
          }
        }
      }
      return kvList;
    },
    getDataTitle(item){
      // Return the Table Title for the Main Data Table
      // Search for data with dicts within array
      for (const [key, value] of Object.entries(item.data)) {
        if (Array.isArray(value)) {
          if (value[0] && value[0].constructor == Object){
            return key;
          }
        }
      }
    },
    getDataItems(item){
      // Return the Main Data Table
      return item.data[this.getDataTitle(item)];
    },
    getDataFields(item){
      // Create the fields for the Main Data Table
      var fieldList = [];
      var column_list = []
      if (this.getDataTitle(item) in this.preSetTableOrder) {
        // If Hermes Table, pull Preset Order
        column_list = this.preSetTableOrder[this.getDataTitle(item)].split(',');
      } else if (item.data.mainDataOrder){
        // Otherwise use provided Ordered List
        column_list = item.data.mainDataOrder
      } else {
        // Otherwise just use first row of Table Data
        column_list = Object.keys(item.data[this.getDataTitle(item)][0])
      }
      for (const data_key of column_list) {
        var dataDict = {};
        dataDict['key']= data_key;
        dataDict['class']= "data-column";
        fieldList.push(dataDict);
      }
      return fieldList;
    },
  },
  filters: {
    timeFromNow: function(datetime) {
      if (!datetime) {
        return null;
      }
      return dayjs(datetime).fromNow();
    },
    formatDate: function(datetime) {
      if (!datetime) {
        return null;
      }
      return dayjs(datetime).format('MMM D, YYYY, HH:mm');
    }
  }
};
</script>

<style scoped>

</style>
