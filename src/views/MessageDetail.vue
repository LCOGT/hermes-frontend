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
        <b-card-sub-title class="mt-1" v-if="isGcnCircular">
          Originally published as
          <b-link :href="getGcnCircularLink(message)" v-b-tooltip.hover
            :title="getGcnCircularLink(message)" target="_blank">GCN Circular {{ getGcnCircularNumber(message) }}</b-link>
        </b-card-sub-title>
        <hr>
        <!-- Main Message -->
        <b-row>
          <span class="m-2" style="white-space: pre-wrap;">
            {{ message.message_text }}
          </span>
        </b-row>
        <hr>
        <div v-for="plotName in Object.keys(plotDataByName)" :key="plotName + '-spectra-plot'">
          <b-row>
            <PlotlyChart :data="new Array(plotDataByName[plotName])" :layout="layoutByName[plotName]"></PlotlyChart>
          </b-row>
        </div>
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
                  <b-link v-else-if="data.item.source == 'gracedb_id'" :href="getGraceDBLink(data.item.citation)" target="_blank" v-b-tooltip.hover :title="getGraceDBLink(data.item.citation)">
                    {{ data.item.citation }}
                  </b-link>
                  <p v-else>{{ data.item.citation }}</p>
                </template>
                <template #cell(file_info)="data">
                  <b-link v-for="(file_info, idx) in data.item.file_info" class="pr-2" :key="'file_info-' + file_info.name" :href="file_info.url" target="_blank" :disabled="!file_info.url">
                    {{ file_info.name }}
                  </b-link>
                </template>
                <template #cell(url)="data">
                  <b-link :href="data.item.url" target="_blank">
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
          <b-collapse visible :id="field" >
            <b-row class="mx-2">
              <b-table small reactive class="kv-b-table" :items="getKVItems(dictvalue)" :fields="KVdataFields">
                <template #cell(value)="data">
                  <b-link v-if="isLink(data.item.value)" :href="data.item.value" target="_blank">
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
                  <b-link v-if="isLink(data.item.value)" :href="data.item.value" target="_blank">
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
import PlotlyChart from '@/components/PlotlyChart.vue';
import axios from "axios";

export default {
  name: "MessageDetail",
  components: {
    PlotlyChart
  },
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
      plotDataByName: {},
      layoutByName: {},
      baseLayout: {
        margin: {
          r: 20,
          b: 40,
          l: 80
        },
        title: {
          text: 'Spectrum Plot',
          font: {
            size: 26
          },
          yref: 'paper',
          automargin: true
        },
        yaxis: {
          title: {
            text: 'Flux'
          },
          tickformat: '.1e',
          type: 'linear'
        },
        xaxis: {
          title: {
            text: 'Wavelength'
          },
          showgrid: false
        },
        legend: {
          x: 0.85,
          y: 1.0
        }
      },
      KVdataFields: [{ key: "key", class: "data-column" }, { key: "value", class: "data-column" }],
      preSetTableOrder: {
        targets: "name,ra,ra_error,ra_error_units,dec,dec_error,dec_error_units,file_info,pm_ra,pm_dec,epoch,aliases,redshift,host_redshift,host_name,group_associations",
        photometry: "target_name,date_obs,telescope,instrument,bandpass,brightness,brightness_error,brightness_unit,limiting_brightness,limiting_brightness_error,limiting_brightness_unit,exposure_time,observer,catalog",
        spectroscopy: "target_name,date_obs,telescope,instrument,file_info,flux_units,wavelength_units,flux_type,observer,reducer,classification,exposure_time,setup,spec_type,proprietary_period,proprietary_period_units",
        astrometry: "target_name,date_obs,telescope,instrument,ra,ra_error,ra_error_units,dec,dec_error,dec_error_units,mpc_sitecode,catalog",
        references: "source,citation,url",
      }
    };
  },
  mounted() {
    // Check for spectrum data and if present set up plotly plots with it
    this.createSpectraPlots();
  },
  watch: {
    message: function() {
      this.createSpectraPlots();
    }
  },
  computed: {
    isGcnCircular: function() {
      return this.message.topic == 'gcn.circular';
    }
  },
  methods: {
    createSpectraPlots: function() {
      this.plotDataByName = {};
      this.layoutByName = {};
      if (_.has(this.message, 'data.spectroscopy') && !_.isEmpty(this.message, 'data.spectroscopy')) {
        let i = 1;
        for (const spectro_entry of this.message.data.spectroscopy) {
          if (!_.isEmpty(spectro_entry.flux) && !_.isEmpty(spectro_entry.wavelength)) {
            let title = i + ': ' + spectro_entry.date_obs;
            this.addSpectraPlot(spectro_entry.flux, spectro_entry.flux_units, spectro_entry.flux_error,
                                spectro_entry.wavelength, spectro_entry.wavelength_units, title);
          }
          if (!_.isEmpty(spectro_entry.file_info)) {
            for (const file_info of spectro_entry.file_info) {
              let lowercaseName = file_info.name.toLowerCase();
              if (!_.isEmpty(file_info.url) && (lowercaseName.endsWith('.txt') || lowercaseName.endsWith('.ascii') || lowercaseName.endsWith('.text'))) {
                this.downloadSpectraFile(file_info.url, i + ': ' + file_info.name, spectro_entry.flux_units, spectro_entry.wavelength_units);
              }
            }
          }
          i++;
        }
      }
    },
    addSpectraPlot(fluxArray, fluxUnits, fluxErrorArray, wavelengthArray, wavelengthUnits, title) {
      this.plotDataByName[title] = {
        x: wavelengthArray,
        y: fluxArray,
        type: 'scatter',
        name: title,
        exponentformat: 'e',
        mode: 'lines'
      };
      if (!_.isNil(fluxErrorArray) && _.isArray(fluxErrorArray) && !_.every(fluxErrorArray, x => x == 0)) {
        let fluxErrorLabels = _.clone(fluxErrorArray);
        for (let i = 0; i < fluxErrorLabels.length; i++) {
          fluxErrorLabels[i] = '\u{00B1} ' + fluxErrorLabels[i].toString();
        }
        this.plotDataByName[title]['text'] = fluxErrorLabels;
      }
      this.layoutByName[title] = _.cloneDeep(this.baseLayout);
      this.layoutByName[title].title.text = title;
      this.layoutByName[title].xaxis.title.text = 'Wavelength (' + wavelengthUnits + ')';
      this.layoutByName[title].yaxis.title.text = 'Flux (' + fluxUnits + ')';
    },
    downloadSpectraFile(url, title, fluxUnits, wavelengthUnits) {
      axios
        .get(url)
        .then((response) => {
          let filedata = response.data;
          var lines = filedata.split('\n');
          let fluxArray = new Array();
          let wavelengthArray = new Array();
          for (const line of lines) {
            var lineparts = line.split(/[\t\s]+/);
            wavelengthArray.push(parseFloat(lineparts[0]));
            fluxArray.push(parseFloat(lineparts[1]));
          }
          this.addSpectraPlot(fluxArray, fluxUnits, null, wavelengthArray, wavelengthUnits, title);
          this.$forceUpdate();  // Need to force an update here since its asynchronous
        })
        .catch((error) => {
          console.log(error)
        });
    },
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
    getGcnCircularLink(message) {
      return 'https://gcn.nasa.gov/circulars/' + this.getGcnCircularNumber(message);
    },
    getGcnCircularNumber (message) {
      return message.data.number;
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
<style>

.js-plotly-plot {
  width: 100%;
}

</style>
