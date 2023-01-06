<template>
    <div>
      <b-editable-table striped bordered small class="photometry-data-table" v-model="items" :fields="fields" :rowUpdate="rowUpdate"  @input="updateCallback">
        <template v-for="field in fields" v-slot:[`cell(${field.key})`]="data">
          <b-form-group :key="field.key + '-group'" :state="getCellState(data.index, data.field.key)" v-b-tooltip.hover :title="getCellError(data.index, data.field.key)" v-if="field.key != 'delete'">
            <b-form-input v-if="field.type == 'text'" v-model="data.value" :state="getCellState(data.index, data.field.key)" :key="field.key + '-input'" :placeholder="field.label" @input="handleInput(data)"></b-form-input>
            <b-form-select v-if="field.type == 'select'" v-model="data.value" :options="field.options" :state="getCellState(data.index, data.field.key)" :key="field.key + '-select'" @input="handleInput(data)"></b-form-select>
            <b-form-checkbox v-if="field.type == 'checkbox'" v-model="data.value" size="lg" value="true" unchecked-value="false" :state="getCellState(data.index, data.field.key)" :key="field.key + '-checkbox'" @input="handleInput(data)"></b-form-checkbox>
          </b-form-group>
          <!-- Delete Row -->
          <div v-if="field.key == 'delete' && getMainData.length > 1" :key="field.key + '-btn'" v-b-tooltip.hover role="button" title="Remove Row" @click="removeRow(data)">
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
import '@/assets/css/submissions.css';

export default {
  name: "PhotometryInputTable",
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
        band: null, brightness: null, nondetection: false, brightness_error: null, brightness_unit: "AB mag"
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
        this.$store.commit("SET_MAIN_TABLE_HEADER", "target_name,ra,dec,date,telescope,instrument,band,brightness,nondetection,brightness_error,brightness_unit");
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
          placeholder: "Target ID",
          class: "target-name-column"
        },
        {
          key: "ra",
          label: "RA",
          type: 'text',
          placeholder: "RA",
          class: "ra-column"
        },
        {
          key: "dec",
          label: "Dec",
          type: 'text',
          placeholder: "Dec",
          class: "dec-column"
        },
        {
          key: "date",
          label: "Discovery Date",
          type: 'text',
          placeholder: "Discovery Date",
          class: "discovery-date-column"
        },
        {
          key: 'telescope',
          label: 'Telescope',
          type: 'text',
          placeholder: "Telescope",
          class: "telescope-column"
        },
        {
          key: "instrument",
          label: "Instrument",
          type: 'text',
          placeholder: "Instrument",
          class: "instrument-column"
        },
        {
          key: "band",
          label: 'Band',
          type: 'text',
          placeholder: "Band",
          class: "band-column"
        },
        {
          key: "nondetection",
          label: "Non Detect",
          type: 'checkbox',
          default: false,
          class: "nondetection-column"
        },
        {
          key: "brightness",
          label: "Brightness",
          type: 'text',
          placeholder: "Brightness",
          class: "brightness-column"
        },
        {
          key: "brightness_error",
          label: "Brightness Error",
          type: 'text',
          placeholder: "Brightness Error",
          class: "brightness-error-column"
        },
        {
          key: "brightness_unit",
          label: "Brightness Unit",
          type: "select",
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
    handleInput(data) {
      const updatedRow = {...this.items[data.index], [data.field.key]: data.value};
      this.$set(this.items, data.index, updatedRow);
      this.updateCallback();
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
          nondetection: false,
          brightness: null,
          brightness_error: null,
          brightness_unit: "AB mag",
        },
      };
    },
    removeRow(row){
      this.getMainData.splice(row.index, 1)
    },
  }
};
</script>

<style scoped>


</style>
