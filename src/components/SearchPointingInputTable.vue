<template>
    <div>
      <b-editable-table striped bordered class="search-pointing-data-table" nle-id v-model="items" :fields="fields" :rowUpdate="rowUpdate">
        <template #cell(isActive)="data">
          <span v-if="data.value">Yes</span>
          <span v-else>No</span>
        </template>
        <!-- Delete Row -->
        <template #cell(delete)="row">
          <div v-b-tooltip.hover title="Remove Row" @click="removeRow(row)">
            &#128465; <!-- Little Trashcan Icon -->
          </div>
        </template>
      </b-editable-table>
      <div class="add-row-search-pointing">
        <b-button class="add-row-search-pointing-button" variant="primary" @click="handleAdd">Add Row</b-button>
      </div>
    </div>
</template>

<script>

import BEditableTable from "bootstrap-vue-editable-table";
import {mapGetters} from "vuex";
export default {
  name: "SearchPointingInputTable",
  components: {
    BEditableTable,
  },
  mounted() {
    this.items = [{
      ra: null, dec: null, obsStatus: null, obsDate: null, telescope: null, instrument: null,
      band: null, depth: null, depthUnit: "AB mag"
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
        this.$store.commit("SET_MAIN_TABLE_NAME", "pointing_data")
        this.$store.commit("SET_MAIN_TABLE_HEADER", "ra,dec,obsStatus,obsDate,telescope,instrument,band,depth,depthUnit");
      },
    }
  },
  data() {
    return {
      fields: [
        {key: "ra", label: "RA", type: 'text', editable: true, placeholder: "RA", class: "ra-column"},
        {key: "dec", label: "Dec", type: 'text', editable: true, placeholder: "Dec", class: "dec-column"},
        {key: "obsStatus", label: "Observation Status", type: "text", editable: true, placeholder: "Observation Status", class: "obs-status-column"},
        {
          key: "obsDate",
          label: "Observation Date",
          type: 'text',
          editable: true,
          placeholder: "Observation Date",
          class: "observation-date-column"
        },
        {key: 'telescope', label: 'Telescope', type: 'text', editable: true, placeholder: "Telescope", class: "telescope-column"},
        {key: "instrument", label: "Instrument", type: 'text', editable: true, placeholder: "Instrument", class: "instrument-column"},
        {key: "band", label: 'Band', type: 'text', editable: true, placeholder: "Band", class: "band-column"},
        {key: "depth", label: "Depth", type: 'text', editable: true, placeholder: "Depth", class: "depth-column"},
        {
          key: "depthUnit",
          label: "Depth Unit",
          type: "select",
          editable: true,
          class: "depth-unit-col",
          options: [
            { value: "AB mag", text: "AB mag"},
            { value: "Vega mag", text: "Vega mag"},
            { value: "mJy", text: "mJy"},
            { value: "erg / s / cm² / Å", text: "erg / s / cm² / Å" },
          ],
        },
        {
          key: "delete",
          label: "",
          headerTitle: "delete",
          class: "delete-column",
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
          ra: null,
          dec: null,
          obsStatus: null,
          obsDate: null,
          telescope: null,
          instrument: null,
          band: null,
          depth: null,
          depthUnit: "AB mag",
          isActive: false,
        },
      };
    },
    removeRow(row){
      this.getMainData.splice(row.index, 1)
    },
  }
}
</script>

<style scoped>
.add-row-search-pointing-button {
  color: white;
}

.search-pointing-data-table /deep/ td {
  height: calc(1.5em + 0.75rem + 2px);
}

.search-pointing-data-table /deep/ .data-cell {
  padding: 0.5rem;
}
</style>
