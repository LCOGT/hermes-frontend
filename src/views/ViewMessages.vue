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
        <b-col class="col-md-6 ml-auto">
          <b-form-input placeholder="Search Placeholder"></b-form-input>
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
      <!-- Pagination -->
      <ocs-pagination
        v-if="!isBusy"
        table-id="message-table"
        :per-page="queryParams.limit"
        :total-rows="data.count"
        :current-page="currentPage"
        :display-per-page-dropdown="true"
        total-rows-class="hermes-total-rows"
        @pageChange="onPageChange"
        @limitChange="onLimitChange"
      ></ocs-pagination>
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
            <b-link @click="copy(shortUUID(), 'Message ID')" v-b-tooltip.hover :title="selectedItem.uuid">
              {{shortUUID()}} &boxbox;
            </b-link>
          </b-card-sub-title>
          <b-card-sub-title class="mt-1" v-if="itemHasEventId(selectedItem)">
            Related Superevent ID:
            <b-link :href="getGraceDBLink(selectedItem.data.event_id)" v-b-tooltip.hover :title="getGraceDBLink(selectedItem.data.event_id)">{{ selectedItem.data.event_id }}</b-link>
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
          <div v-for="(value, field) in getArrayDataItems(selectedItem)" :key="field + '-array-table'">
            <b-row sm="3" v-b-toggle:[field] class="text-sm-right mx-2">
              <h4 class="collapse-table-head">{{ field.toUpperCase().replace("_", " ") }} TABLE &#9776;</h4>
            </b-row>
            <b-collapse :id="field">
              <b-row  class="mx-2">
                <b-table
                  small
                  reactive
                  class="data-b-table"
                  :items="value"
                  :fields="getDataFields(field, value)"
                >
                </b-table>
              </b-row>
            </b-collapse>
            <hr>
          </div>
          <!-- Additional Data Table -->
          <div v-for="(value, field) in getDictionaryDataItems(selectedItem)" :key="field + '-dictionary'">
            <b-row sm="3" v-b-toggle:[field] class="text-sm-right mx-2">
              <h4 class="collapse-table-head">{{ field.toUpperCase().replace("_", " ") }} KEYPAIRS &#9776;</h4>
            </b-row>
            <b-collapse :id="field">
              <b-row class="mx-2">
                <b-table
                  small
                  reactive
                  class="kv-b-table"
                  :items="getKVItems(value)"
                  :fields="KVdataFields"
                >
                </b-table>
              </b-row>
            </b-collapse>
            <hr>
          </div>
          <div v-if="hasNonObjectDataItems(selectedItem)">
            <b-row sm="3" v-b-toggle.collapse-additional-data-kp class="text-sm-right mx-2">
              <h4 class="collapse-table-head">ADDITIONAL DATA KEYPAIRS &#9776;</h4>
            </b-row>
            <b-collapse id="collapse-additional-data-kp">
              <b-row class="mx-2">
                <b-table
                  small
                  reactive
                  class="kv-b-table"
                  :items="getNonObjectDataItems(selectedItem)"
                  :fields="KVdataFields"
                >
                </b-table>
              </b-row>
            </b-collapse>
            <hr>
          </div>
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
import _ from 'lodash';
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
        targets: "name,ra,ra_error,ra_error_units,dec,dec_error,dec_error_units,pm_ra,pm_dec,epoch,aliases,redshift,host_redshift,host_name,group_associations",
        photometry: "target_name,date_obs,telescope,instrument,bandpass,brightness,brightness_error,brightness_unit,limiting_brightness,limiting_brightness_error,limiting_brightness_unit,exposure_time,observer,catalog,group_associations",
        spectroscopy: "target_name,date_obs,telescope,instrument,flux,flux_units,flux_error,wavelength,wavelength_units,flux_type,observer,reducer,classification,exposure_time,setup,spec_type,proprietary_period,proprietary_period_units,group_associations",
        astrometry: "target_name,date_obs,telescope,instrument,ra,ra_error,ra_error_units,dec,dec_error,dec_error_units,mpc_sitecode,catalog",
        references: "source,citation,url",
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
          solid: true
        })
    },
    // Return short versio of UUID
    shortUUID: function() {
      return this.selectedItem.uuid.split("-")[0];
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
    getGraceDBLink(superevent_id) {
      return 'https://gracedb.ligo.org/superevents/' + superevent_id + '/view/';
    },
    itemHasEventId(item) {
      return _.has(item, 'data.event_id');
    },
    getKVItems(item) {
      var kvList = [];
      for (const [key, value] of Object.entries(item)) {
        kvList.push({'key': key, 'value': value});
      }
      return kvList;
    },
    getArrayDataItems(message) {
      // Return the data object with just array items remaining
      return _.pickBy(message.data, _.isArray);
    },
    getDictionaryDataItems(message) {
      // Return the data object with just dictionary items remaining
      return _.pickBy(message.data, function(value, ) {
        return _.isObject(value) && !_.isArray(value);
      });
    },
    getNonObjectDataItems(message) {
      // Return KV pairs for the remaining non-array/non-object primitive fields within the data
      let kvPairs = _.pickBy(message.data, function(value, key) {
        return !_.isObjectLike(value) && !_.isArray(value) && key != 'event_id';
      });
      return this.getKVItems(kvPairs);
    },
    hasNonObjectDataItems(message) {
      return !_.isEmpty(this.getNonObjectDataItems(message));
    },
    getDataFields(section, values){
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
      for (let i = dataFields.length - 1; i >= 0; i-- ) {
        if ( dataFields[i].includes('_units')) {
          if (!dataFields.includes(_.replace(dataFields[i], '_units', ''))) {
            dataFields.splice(i, 1);
            continue;
          }
        }
        else if ( dataFields[i].includes('_unit') && !dataFields.includes(_.replace(dataFields[i], '_unit', ''))){
          dataFields.splice(i, 1);
        }
      }
      if (section in this.preSetTableOrder) {
        // If Hermes Table, pull Preset Order
        column_list = _.intersection(this.preSetTableOrder[section].split(','), dataFields);
      } else {
        // Otherwise just use the order of the fields in the data itself
        column_list = dataFields;
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
    },
  }
};
</script>

<style scoped>

</style>
