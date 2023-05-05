<template>
  <div class="overflow-auto px-4 no-padding" :style="{ width: '100%' }">
    <b-container class="no-padding">
      <b-card border-variant="primary" class="mb-2" style="overflow: auto;">
        <!-- Header -->
        <b-card-title> {{ message.title }} </b-card-title>
        <b-card-sub-title> {{ message.author }} </b-card-sub-title>
        <b-card-sub-title>
          Message ID:
          <b-link :to="{ name: 'message', params: { id: message.uuid } }" v-b-tooltip.hover :title="message.uuid">
            {{ shortUUID() }}
          </b-link>
          <b-link @click="copy(message.uuid, 'Message ID')" v-b-tooltip.hover title="Copy ID">
            &boxbox;
          </b-link>
        </b-card-sub-title>
        <b-card-sub-title class="mt-1" v-if="itemHasEventId(message)">
          Related Superevent Messages:
          <b-link :to="{ name: 'nonlocalizedevent', params: { id: message.data.event_id } }" v-b-tooltip.hover
            :title="message.data.event_id">{{ message.data.event_id }}</b-link>
        </b-card-sub-title>
        <b-card-sub-title class="mt-1" v-if="itemIsNLE(message)">
          Superevent Messages:
          <b-link :to="{ name: 'nonlocalizedevent', params: { id: message.data.superevent_id } }" v-b-tooltip.hover
            :title="message.data.superevent_id">{{ message.data.superevent_id }}</b-link>
        </b-card-sub-title>
        <hr>
        <!-- Main Message -->
        <b-row>
          <span class="m-2" style="white-space: pre-wrap;">
            {{ message.message_text }}
          </span>
        </b-row>
        <hr>
        <!-- Main Data Table -->
        <div v-for="(value, field) in getArrayDataItems(message)" :key="field + '-array-table'">
          <b-row sm="3" v-b-toggle:[field] class="text-sm-right mx-2">
            <h4 class="collapse-table-head">{{ field.toUpperCase().replace("_", " ") }} TABLE &#9776;</h4>
          </b-row>
          <b-collapse :id="field">
            <b-row class="mx-2">
              <b-table small reactive class="data-b-table" :items="value" :fields="getDataFields(field, value)">
                <template #cell(citation)="data">
                  <b-link v-if="data.item.source == 'hop_uuid'" :to="{ name: 'message', params: { id: data.item.citation } }">
                    {{ data.item.citation }}
                  </b-link>
                  <b-link v-else-if="data.item.source == 'gracedb_id'" :href="getGraceDBLink(data.item.citation)" v-b-tooltip.hover :title="getGraceDBLink(data.item.citation)">
                    {{ data.item.citation }}
                  </b-link>
                  <p v-else>{{ data.item.citation }}</p>
                </template>
                <template #cell(url)="data">
                  <b-link :href="data.item.url">
                    {{ data.item.url }}
                  </b-link>
                </template>
              </b-table>
            </b-row>
          </b-collapse>
          <hr>
        </div>
        <!-- Additional Data Table -->
        <div v-for="(dictvalue, field) in getDictionaryDataItems(message)" :key="field + '-dictionary'">
          <b-row sm="3" v-b-toggle:[field] class="text-sm-right mx-2">
            <h4 class="collapse-table-head">{{ field.toUpperCase().replace("_", " ") }} KEYPAIRS &#9776;</h4>
          </b-row>
          <b-collapse :id="field">
            <b-row class="mx-2">
              <b-table small reactive class="kv-b-table" :items="getKVItems(dictvalue)" :fields="KVdataFields">
                <template #cell(value)="data">
                  <b-link v-if="isLink(data.item.value)" :href="data.item.value">
                    {{ data.item.value }}
                  </b-link>
                  <p v-else>{{ data.item.value }}</p>
                </template>
              </b-table>
            </b-row>
          </b-collapse>
          <hr>
        </div>
        <div v-if="hasNonObjectDataItems(message)">
          <b-row sm="3" v-b-toggle.collapse-additional-data-kp class="text-sm-right mx-2">
            <h4 class="collapse-table-head">EXTRA KEYPAIRS &#9776;</h4>
          </b-row>
          <b-collapse id="collapse-additional-data-kp">
            <b-row class="mx-2">
              <b-table small reactive class="kv-b-table" :items="getNonObjectDataItems(message)" :fields="KVdataFields">
                <template #cell(value)="data">
                  <b-link v-if="isLink(data.item.value)" :href="data.item.value">
                    {{ data.item.value }}
                  </b-link>
                  <p v-else>{{ data.item.value }}</p>
                </template>
              </b-table>
            </b-row>
          </b-collapse>
          <hr>
        </div>
        <!-- Show JSON Button -->
        <b-row class="mb-2 mx-2 pb-3">
          <b-button variant="outline-primary" size="sm" @click="info(message, $event.target)" class="mr-1">
            <b> Show JSON: </b>
          </b-button>
        </b-row>
      </b-card>
      <!-- JSON DATA -->
      <b-modal :id="jsonData.id" :title="jsonData.title" @hidden="resetjsonData">
        <b-row>
          <pre>{{ jsonData.content }}</pre>
        </b-row>
        <template #modal-footer="{ hide }">
          <div class="w-100">
            <b-button variant="outline-primary" size="sm" class="float-left" @click="copy(jsonData.content, 'JSON Data')">
              Copy
            </b-button>
            <b-button variant="primary" size="sm" class="float-right" @click="hide()">
              Done
            </b-button>
          </div>
        </template>
      </b-modal>
    </b-container>
  </div>
</template>
<script>
import _ from 'lodash';
import '@/assets/css/view.css';

export default {
  name: "MessageDetail",
  props: {
    message: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: false,
      default: "1"
    }
  },
  data() {
    return {
      jsonData: {
        id: 'json-data-' + this.id,
        title: '',
        content: ''
      },
      KVdataFields: [{ key: "key", class: "data-column" }, { key: "value", class: "data-column" }],
      preSetTableOrder: {
        targets: "name,ra,ra_error,ra_error_units,dec,dec_error,dec_error_units,pm_ra,pm_dec,epoch,aliases,redshift,host_redshift,host_name,group_associations",
        photometry: "target_name,date_obs,telescope,instrument,bandpass,brightness,brightness_error,brightness_unit,limiting_brightness,limiting_brightness_error,limiting_brightness_unit,exposure_time,observer,catalog,group_associations",
        spectroscopy: "target_name,date_obs,telescope,instrument,flux,flux_units,flux_error,wavelength,wavelength_units,flux_type,observer,reducer,classification,exposure_time,setup,spec_type,proprietary_period,proprietary_period_units,group_associations",
        astrometry: "target_name,date_obs,telescope,instrument,ra,ra_error,ra_error_units,dec,dec_error,dec_error_units,mpc_sitecode,catalog",
        references: "source,citation,url",
      }
    };
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
    shortUUID: function () {
      return this.message.uuid.split("-")[0];
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
      this.showCopyAlert = false;
    },
    getGraceDBLink(superevent_id) {
      return 'https://gracedb.ligo.org/superevents/' + superevent_id + '/view/';
    },
    itemHasEventId(item) {
      return _.has(item, 'data.event_id');
    },
    itemIsNLE(item) {
      return _.has(item, 'data.superevent_id');
    },
    getKVItems(item) {
      var kvList = [];
      for (const [key, value] of Object.entries(item)) {
        kvList.push({ 'key': key, 'value': value });
      }
      return kvList;
    },
    getArrayDataItems(message) {
      // Return the data object with just array items remaining
      return _.pickBy(message.data, _.isArray);
    },
    getDictionaryDataItems(message) {
      // Return the data object with just dictionary items remaining
      return _.pickBy(message.data, function (value,) {
        return _.isObject(value) && !_.isArray(value);
      });
    },
    getNonObjectDataItems(message) {
      // Return KV pairs for the remaining non-array/non-object primitive fields within the data
      let kvPairs = _.pickBy(message.data, function (value, key) {
        return !_.isObjectLike(value) && !_.isArray(value) && key != 'event_id';
      });
      return this.getKVItems(kvPairs);
    },
    hasNonObjectDataItems(message) {
      return !_.isEmpty(this.getNonObjectDataItems(message));
    },
    isLink(text) {
      return _.isString(text) && text.startsWith('http');
    },
    getDataFields(section, values) {
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
      if (section in this.preSetTableOrder) {
        // If Hermes Table, pull Preset Order
        column_list = _.intersection(this.preSetTableOrder[section].split(','), dataFields);
      } else {
        // Otherwise just use the order of the fields in the data itself
        column_list = dataFields;
      }
      for (const data_key of column_list) {
        var dataDict = {};
        dataDict['key'] = data_key;
        dataDict['class'] = "data-column";
        fieldList.push(dataDict);
      }
      return fieldList;
    },
  }
};
</script>
