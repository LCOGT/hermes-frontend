<template>
    <div>
      <b-editable-table striped bordered class="photometry-data-table" v-model="items" :fields="fields" :rowUpdate="rowUpdate">
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
      <div class="add-row-photometry">
        <b-button class="add-row-photometry-button" variant="primary" @click="handleAdd">Add Row</b-button>
      </div>
    </div>
</template>

<script>

import BEditableTable from "bootstrap-vue-editable-table";
import {mapGetters} from "vuex";
export default {
  name: "PhotometryInputTable",
  components: {
    BEditableTable,
  },
  mounted() {
    this.items = [{
        target_name: null, ra: null, dec: null, date: null, telescope: null, instrument: null,
        band: null, brightness: null, brightness_error: null, brightness_unit: "AB mag"
      }];
  },
  computed: {
    ...mapGetters(["getMainData"]),
    items: {
      get() {
        return this.getMainData
      },
      set(value) {
        this.$store.commit("SET_MAIN_DATA", value);
        this.$store.commit("SET_MAIN_TABLE_NAME", "photometry");
        this.$store.commit("SET_MAIN_TABLE_HEADER", "target_name,ra,dec,date,telescope,instrument,band,brightness,brightness_error,brightness_unit");
      },
    },
  },
  data() {
    return {

      fields: [
        {
          key: 'target_name',
          label: 'Target Name',
          type: 'text',
          editable: true,
          placeholder: "Target Name",
          class: "target-name-column"
        },
        {
          key: "date",
          label: "Date-Obs",
          type: 'text',
          editable: true,
          placeholder: "Observation Date",
          class: "observation-date-column"
        },
        {
          key: 'telescope',
          label: 'Telescope',
          type: 'text',
          editable: true,
          placeholder: "Telescope",
          class: "telescope-column"
        },
        {
          key: "instrument",
          label: "Instrument",
          type: 'text',
          editable: true,
          placeholder: "Instrument",
          class: "instrument-column"
        },
        {
          key: "band",
          label: 'Band',
          type: 'text',
          editable: true,
          placeholder: "Band",
          class: "band-column"
        },
        {
          key: "brightness",
          label: "Brightness",
          type: 'text',
          editable: true,
          placeholder: "Brightness",
          class: "brightness-column"
        },
        {
          key: "brightness_error",
          label: "Brightness Error",
          type: 'text',
          editable: true,
          placeholder: "Brightness Error",
          class: "brightness-error-column"
        },
        {
          key: "brightness_unit",
          label: "Brightness Unit",
          type: "select",
          editable: true,
          class: "brightness-unit-col",
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
          target_name: null,
          ra: null,
          dec: null,
          date: null,
          telescope: null,
          instrument: null,
          band: null,
          brightness: null,
          brightness_error: null,
          brightness_unit: "AB mag",
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
.add-row-photometry-button {
  color: white;
}

.photometry-data-table /deep/ td {
  height: calc(1.5em + 0.75rem + 2px);
}

.photometry-data-table /deep/ .data-cell {
  padding: 0.5rem;
}
</style>
