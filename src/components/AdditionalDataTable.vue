<template>
  <div>
    <b-editable-table bordered class="additional-data-table" v-model="items" :fields="fields" :rowUpdate="rowUpdate">
      <template #cell(isActive)="data">
        <span v-if="data.value">Yes</span>
        <span v-else>No</span>
      </template>
    </b-editable-table>
      <div class="add-row-additional-data">
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
    ...mapGetters(["getCandidateExtraData"]),
    items: {
      get() {
        return this.getCandidateExtraData
      },
      set(value) {
        this.$store.commit('SET_CANDIDATE_EXTRA_DATA', value)
      }
    }
  },
  data() {
    return {
      fields: [{key: "key", label: "Key", type: 'text', editable: true, placeholder: "Key", class: "key-column"},
        {key: "value", label: "Value", type: 'text', editable: true, placeholder: "Value", class: "value-column"}],
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

</style>
