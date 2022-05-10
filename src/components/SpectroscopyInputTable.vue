<template>
    <div>
      <b-editable-table bordered class="spectroscopy-data-table" v-model="items" :fields="fields" :rowUpdate="rowUpdate">
        <template #cell(isActive)="data">
          <span v-if="data.value">Yes</span>
          <span v-else>No</span>
        </template>
      </b-editable-table>
      <div class="add-row-spectroscopy">
        <b-button class="add-row-spectroscopy-button" variant="primary" @click="handleAdd">Add Row</b-button>
      </div>
    </div>
</template>

<script>

import BEditableTable from "bootstrap-vue-editable-table";
import {mapGetters} from "vuex";
export default {
  name: "SpectroscopyInputTable",
  components: {
    BEditableTable,
  },
  mounted() {
    this.items = [{
        spectroscopyId: null, dateObs: null, telescope: null, instrument: null,
        exptime: null, classification: null, spectrumURL: null
      }];
  },
  computed: {
    ...mapGetters(["getMainData"]),
    items: {
      get() {
        return this.getMainData
      },
      set(value) {
        this.$store.commit("SET_MAIN_DATA", value)
      },
    }
  },
  data() {
    return {

      fields: [
        {key: 'spectroscopyId', label: 'ID', type: 'text', editable: true, placeholder: "Target ID", class: "spectroscopy-id-column"},
        {
          key: "dateObs",
          label: "Date-Obs",
          type: 'text',
          editable: true,
          placeholder: "Observation Date",
          class: "observation-date-column"
        },
        {key: 'telescope', label: 'Telescope', type: 'text', editable: true, placeholder: "Telescope", class: "telescope-column"},
        {key: "instrument", label: "Instrument", type: 'text', editable: true, placeholder: "Instrument", class: "instrument-column"},
        {key: "exptime", label: 'Exposure Time', type: 'text', editable: true, placeholder: "ExpTime", class: "exptime-column"},
        {
          key: "classification",
          label: "Classification", 
          type: 'text', 
          editable: true, 
          placeholder: "Classification",
          class: "classificaiton-column"
         },
        {
          key: "spectrumURL",
          label: "Link To Spectra",
          type: 'text',
          editable: true,
          placeholder: "Spectrum URL",
          class: "spectrum-url-column"
        },
      ],
      rowUpdate: {}
    };
  },
  methods: {
    handleAdd() {
      const newId = Date.now();
      this.rowUpdate = {
        edit: true,
        id: newId,
        action: "add",
        data: {
          id: newId,
          spectroscopyId: null,
          discoveryDate: null,
          telescope: null,
          instrument: null,
          exptime: null,
          classification: null,
          spectrumURL: null,
          isActive: false,
        },
      };
    }
  }
}
</script>

<style scoped>
.add-row-spectroscopy-button {
  color: white;
}

.spectroscopy-data-table /deep/ td {
  height: calc(1.5em + 0.75rem + 2px);
}

.spectroscopy-data-table /deep/ .data-cell {
  padding: 0.5rem;
}
</style>
