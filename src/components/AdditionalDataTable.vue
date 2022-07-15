<template>
  <div>
    <!-- Build Additional Data Table -->
    <b-editable-table striped bordered class="additional-data-table" v-model="items" :fields="fields" :rowUpdate="rowUpdate">
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
    <div class="add-row-additional-data">
      <!-- Add Row Button -->
      <b-button class="add-row-additional-data-button" variant="primary" @click="handleAdd()">Add Row</b-button>
    </div>
  </div>
</template>

<script>
import BEditableTable from "bootstrap-vue-editable-table";
import { mapGetters } from "vuex";

export default {
  name: "AdditionalDataTable",
  components: {
      BEditableTable,
  },
  mounted() {
    this.items = [];
  },
  computed: {
    ...mapGetters(["getExtraData"]),
    items: {
      get() {
        return this.getExtraData;
      },
      set(value) {
        this.$store.commit('SET_EXTRA_DATA', value)
      }
    }
  },
  data() {
    return {
      fields: [{key: "key", label: "Key", type: 'text', editable: true, placeholder: "Key", class: "key-column"},
        {key: "value", label: "Value", type: 'text', editable: true, placeholder: "Value", class: "value-column"},
        {key: "delete",label: "", headerTitle: "delete", class: "delete-column",}
        ],
      rowUpdate: {},
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
          key: null,
          value: null,
          isActive: false,
        },
      };
    },
    removeRow(row){
      this.getExtraData.splice(row.index, 1)
    },
  }
}
</script>

<style scoped>
.add-row-additional-data-button {
  color: white
}

/* We need to use a deep selector here for the css because we are dynamically generating rows */
.additional-data-table /deep/ td {
  height: calc(1.5em + 0.75rem + 2px);
}
.additional-data-table /deep/ .data-cell {
  padding: 0.5rem;
}
</style>
