<template>
  <div class="overflow-auto px-4" :style="{width: '100%'}">
  <b-row>
  <b-col>
   <b-row>
     <b-col>
       <!-- Pagination -->
        <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            first-number
            last-number
            aria-controls="message-table"
          ></b-pagination>
      </b-col>
      <b-col>
        <!-- Topic Filter -->
        <b-form-group label="Topics" label-for="topic_selector" label-cols-lg="2">
          <b-form-select
            id="topic_selector"
            v-model="filter"
            :options="topic_options"
          >
            <template #first>
              <b-form-select-option value="">-- All Topics --</b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
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
      :filter="filter"
      :filter-included-fields="topic"
      @filtered="onFiltered"
      :per-page="perPage"
      :current-page="currentPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :items="items"
      :fields="fields"
    >
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
        <div v-b-tooltip.hover :title="data.item.created|format_time">
          {{ data.item.created | format_date }}
        </div>
      </template>
    </b-table>
  </b-col>

  <!-- Full Message Box -->
  <b-col>
    <b-card border-variant="primary" class="mb-2" style="max-height: 50rem; overflow: auto;">
      <div v-if="selectedItem">
        <!-- Header -->
        <b-card-title> {{selectedItem.title}} </b-card-title>
        <b-card-sub-title> {{selectedItem.author}} </b-card-sub-title>
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
      <b-row>
        <!-- Alert User of Successful Copy -->
        <b-alert
          variant="success"
          dismissible
          fade
          :show="showCopyAlert"
          @dismissed="showCopyAlert=false"
        >
          JSON coppied to Clipboard.
        </b-alert>
      </b-row>
      <template #modal-footer="{ hide }">
        <div class="w-100">
          <b-button
            variant="outline-primary"
            size="sm"
            class="float-left"
            @click="copy"
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
import getEnv from "@/utils/env.js";
import axios from "axios";

export default {
  name: "ViewMessages",
  data() {
    return {
      topic_options: [],
      sortBy: 'created',
      sortDesc: true,
      perPage: 10,
      currentPage: 1,
      totalRows: 1,
      filter: "",
      filterOn: [],
      fields: [
        {
          key: "selected",
          label: "",
          headerTitle: "selected",
          class: "data-column"
        },
        {
          key: "index",
          label: "",
          class: "data-column"
        },
        {
          key: "created",
          sortable: true,
          sortDirection: 'desc',
          label: "Timestamp",
          class: "data-column"
        },
        {
          key: "title",
          sortable: true,
          class: "data-column"
        },
        {
          key: "author",
          sortable: true,
          class: "data-column",
          label: "Submitter",
        },
      ],
      items: [],
      selectedItem: null,
      topic: null,
      jsonData: {
          id: 'json-data',
          title: '',
          content: ''
      },
      showCopyAlert: false,
      KVdataFields: [{key: "key", class: "data-column"}, {key: "value", class: "data-column"}],
      preSetTableOrder: {
        nle_data: "eventId,discoveryDate,instrument,skymapLink,falseAlarmRate",
        candidate_data: "candidateId,ra,dec,discoveryDate,telescope,instrument,band,brightness,brightnessError,brightnessUnit",
        non_detection_data: "ra,dec,obsDate,telescope,instrument,band,depth,depthUnit",
        pointing_data: "ra,dec,obsStatus,obsDate,telescope,instrument,band,depth,depthUnit",
        photometry_data: "photometryId,dateObs,telescope,instrument,band,brightness,brightnessError,brightnessUnit",
        spectroscopy_data: "spectroscopyId,dateObs,telescope,instrument,exptime,classification,spectrumURL",
        telescope_events: "observatory,telescope,instrument,eventDate,description"
      }
    };
  },
  mounted() {
    // Get available topics
    axios
      .get(getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "api/v0/topics/")
      .then((response) => (this.topic_options = response.data.read))
      .catch((error) => console.log(error));
    // Retrieve messages and store data
    axios
      .get(getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "api/v0/messages.json/?page=1")
      .then((response) => (this.items = response.data, this.totalRows = response.data.length))
      .catch((error) => console.log(error));
  },
  methods: {
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
    copy() {
      // Copy JSON data and trigger alert
      if (this.jsonData.content){
        // Copy JSON to Clipboard. Only works with HTTPS or local
        navigator.clipboard.writeText(this.jsonData.content);
        // Trigger alert to show sucessful copy
        this.showCopyAlert = true;
      }
    },
    resetjsonData() {
      // clear JSON data and remove copy alert when window closed
      this.jsonData.title = '';
      this.jsonData.content = '';
      this.showCopyAlert=false;
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
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
  format_date: function(datetime) {
    // Convert the timestamp into a user friendly DATE
    if (!datetime) { return '(n/a)'; }
    datetime = new Date(datetime);
    return datetime.getUTCFullYear() + "/" +
      ((datetime.getUTCMonth() < 9) ? '0' : '') + (datetime.getUTCMonth() + 1) + '/' +
      ((datetime.getUTCDate() < 10) ? '0' : '') + datetime.getUTCDate();
  },
  format_time:  function(datetime) {
    // Convert the timestamp into a user friendly TIME
    if (!datetime) { return '(n/a)'; }
    datetime = new Date(datetime);
    return ((datetime.getUTCHours() < 9) ? '0' : '') + datetime.getUTCHours() + ':' +
      ((datetime.getUTCMinutes() < 9) ? '0' : '') + datetime.getUTCMinutes() + ':' +
      ((datetime.getUTCSeconds() < 9) ? '0' : '') + datetime.getUTCSeconds();
  }
}
};
</script>

<style scoped>
.message-b-table {
  width: 100%;
}

.message-b-table >>> .data-column{
  padding : 0.3rem;
}

.kv-b-table {
  width: 100%;
}

.message-block {
  max-width: 80%;
}
.expand-button {
  max-width: 20%;
}

/* Show mouseover for Collapsable Data Table */
.collapse-table-head:hover {
  opacity: 0.5;
}
.collapse-table-head {
  opacity: 1;
}

</style>
