<template>
    <div>
      <b-editable-table striped bordered small :class="id + '-data-table'" v-model="tableData" :fields="fields" @input-change="handleInput">
        <template v-for="field in fields" v-slot:[`cell(${field.key})`]="data">
          <b-form-group v-if="'type' in field" :key="field.key + '-group' + '-' + data.index" :state="getCellState(data.index, data.field.key)" v-b-tooltip.hover :title="getCellError(data.index, data.field.key)" style="width:100%;">
            <b-form-input v-if="field.type == 'text'" :value="getFieldValue(field, data)" :state="getCellState(data.index, data.field.key)" :key="field.key + '-input-' + data.index" :placeholder="field.label" @input="handleInput($event, data)"></b-form-input>
            <b-form-select v-if="field.type == 'select'" :value="getFieldValue(field, data)" :options="field.options" :state="getCellState(data.index, data.field.key)" :key="field.key + '-select-' + data.index" @input="handleInput($event, data)"></b-form-select>
            <b-form-checkbox switch v-if="field.type == 'checkbox'" :checked="getFieldValue(field, data)" size="lg" :state="getCellState(data.index, data.field.key)" :key="field.key + '-checkbox-' + data.index" @input="handleInput($event, data)"></b-form-checkbox>
            <b-form-datepicker v-if="field.type == 'date'" :value="getFieldValue(field, data)" :state="getCellState(data.index, data.field.key)" :key="field.key + '-datepicker-' + data.index" @input="handleInput($event, data)"></b-form-datepicker>
          </b-form-group>
          <!-- Index Row -->
          <span v-if="field.key == 'index'" :key="field.key + '-index'">
            <b>{{ data.index }}</b>
          </span>
          <!-- Copy Row -->
          <span v-if="field.key == 'copy'" :key="field.key + '-btn'">
            <b-button :title="'Copy this ' + id" @click="copy(data)">
              <b-icon icon="file-earmark-plus" aria-hidden="true"></b-icon>
            </b-button>
          </span>
          <!-- Delete Row -->
          <span v-if="field.key == 'delete' && (allowEmpty || tableData.length > 1)" :key="field.key + '-btn'">
            <b-button :title="'Remove this ' + id" @click="remove(data)">
              <b-icon icon="trash" aria-hidden="true"></b-icon>
            </b-button>
          </span>
        </template>
      </b-editable-table>
    </div>
  </template>
  <script>
  import '@/assets/css/submissions.css';
  import BEditableTable from "bootstrap-vue-editable-table";

  export default {
    name: 'DataTable',
    components: {
      BEditableTable,
    },
    props: {
      id: {
        type: String,
        required: true
      },
      errors: {
        type: Array,
        required: true
      },
      tableData: {
        type: Array,
        required: true
      },
      fields: {
        type: Array,
        required: true
      },
      allowEmpty: {
        type: Boolean,
        default: true
      },
      show: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      getFieldValue(field, row) {
        return this.tableData[row.index][field.key];
      },
      getCellState(row, key) {
        let error = this.getCellError(row, key);
        if (error) {
          return false;
        }
        return null;
      },
      getCellError(row, key) {
        if (row < this.errors.length) {
          if (key in this.errors[row]){
            return this.errors[row][key].join(', ');
          }
        }
        return '';
      },
      remove: function (row) {
        this.$emit('remove', row.index);
      },
      copy: function (row) {
        this.$emit('copy', row.index);
      },
      handleInput: function (value, row) {
        this.tableData[row.index][row.field.key] = value;
        this.update();
      },
      update: function () {
        this.$emit('message-updated');
      }
    }
  };
  </script>
