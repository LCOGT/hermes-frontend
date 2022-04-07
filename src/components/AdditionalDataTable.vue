<template>
  <div>
      <b-table class='additional-data-table' :items="items" :fields="fields">
        <template #cell(key)="data">
          <b-form-input v-if="items[data.index].isEdit && selectedCell === 'key'" type="text" v-model="items[data.index].key" placeholder="Key"></b-form-input>
          <span v-else @click="editCellHandler(data, 'key')">{{ formatEmpty(data.value) }}</span>
        </template>
        <template #cell(value)="data">
          <b-form-input v-if="items[data.index].isEdit && selectedCell === 'value'" type="text" v-model="items[data.index].value" placeholder="Value"></b-form-input>
          <span v-else @click="editCellHandler(data, 'value')">{{ formatEmpty(data.value) }}</span>
        </template>
      </b-table>
      <div class="add-row-additional-data">
        <b-button class="add-row-additional-data-button" variant="primary" @click="addRowHandler">Add Row</b-button>
      </div>
  </div>
  </template>

<script>
export default {
  name: "AdditionalDataTable",
  data() {
    return {
      fields: [{key: "key", label: "Key"},
        {key: "value", label: "Value"}],
      items: [],
      selectedCell: null
    };
  },
  mounted() {
    this.items = this.items.map(item => ({...item, isEdit: false}));
  },
  methods: {
    editCellHandler(data, name) {
      this.items = this.items.map(item => ({...item, isEdit: false}));
      this.items[data.index].isEdit = true;
      this.selectedCell = name
    },
    addRowHandler() {
      const newRow = this.fields.reduce(
          (a, c) => ({ ...a, [c.key]: null }),
          {}
      );
      newRow.isEdit = true;
      this.items.push(newRow);
    },
    formatEmpty(value) {
    return value?.trim() ? value : " - ";
    }
  }
}
</script>

<style scoped>

</style>