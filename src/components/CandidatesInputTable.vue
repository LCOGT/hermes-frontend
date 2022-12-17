<template>
    <div>
      <b-editable-table striped bordered class="candidate-data-table" nle-id v-model="items" :fields="fields" :rowUpdate="rowUpdate" @input="updateCallback">
        <!-- Delete Row -->
        <template #cell(delete)="row">
          <div v-b-tooltip.hover role="button" title="Remove Row" @click="removeRow(row)" v-if="getMainData.length > 1">
            &#128465; <!-- Little Trashcan Icon -->
          </div>
        </template>
        <template v-for="field in fields" v-slot:[`cell(${field.key})`]="data">
          <b-form-group :key="field.key + '-group'" :state="getCellState(data.index, data.field.key)" v-b-tooltip.hover :title="getCellError(data.index, data.field.key)">
            <b-form-input v-if="field.type == 'text'" v-model="data.value" :state="getCellState(data.index, data.field.key)" :key="field.key + '-input'" :placeholder="field.label"></b-form-input>
            <b-form-select v-if="field.type == 'select'" v-model="data.value" :options="field.options" :state="getCellState(data.index, data.field.key)" :key="field.key + '-select'"></b-form-select>
          </b-form-group>
        </template>
      </b-editable-table>
      <div class="add-row-candidate">
        <b-button class="add-row-candidate-button" variant="primary" @click="handleAdd">Add Row</b-button>
      </div>
    </div>
</template>

<script>

import BEditableTable from "bootstrap-vue-editable-table";
import {mapGetters} from "vuex";
export default {
  name: "CandidatesInputTable",
  components: {
    BEditableTable,
  },
  props: {
    fieldErrors: {
      type: Array,
      required: false,
      default: function() {
        return [];
      }
    },
    updateCallback: {
      type: Function
    }
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
        this.$store.commit("SET_MAIN_TABLE_NAME", "candidates");
        this.$store.commit("SET_MAIN_TABLE_HEADER", "target_name,ra,dec,date,telescope,instrument,band,brightness,brightness_error,brightness_unit");

      },
    }
  },
  data() {
    return {
      fields: [
        {
          key: 'target_name',
          label: 'Target Name',
          type: 'text',
          editable: true, 
          placeholder: "Target ID", 
          class: "target-name-column"
        },
        {
          key: "ra",
          label: "RA",
          type: 'text',
          editable: true,
          placeholder: "RA",
          class: "ra-column"
        },
        {
          key: "dec",
          label: "Dec",
          type: 'text',
          editable: true,
          placeholder: "Dec",
          class: "dec-column"
        },
        {
          key: "date",
          label: "Discovery Date",
          type: 'text',
          editable: true,
          placeholder: "Discovery Date",
          class: "discovery-date-column"
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
    getCellState(row, key) {
      let error = this.getCellError(row, key);
      if (error) {
        return false;
      }
      return null;
    },
    getCellError(row, key) {
      if (row < this.fieldErrors.length) {
        if (key in this.fieldErrors[row]){
          return this.fieldErrors[row][key].join(', ');
        }
      }
      return '';
    },
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
        },
      };
      this.updateCallback();
    },
    removeRow(row){
      if (this.getMainData.length > 1){
        this.getMainData.splice(row.index, 1)
        this.updateCallback();
      }
    },
  }
};
</script>

<style scoped>
.add-row-candidate-button {
  color: white;
}

.candidate-data-table /deep/ td {
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.5rem
}

</style>
