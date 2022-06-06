<template>
  <div>
    <b-editable-table striped bordered class="non-localized-event-table" v-model="items" :fields="fields" :rowUpdate="rowUpdate">
      <template #cell(isActive)="data">
        <span v-if="data.value">Yes</span>
        <span v-else>No</span>
      </template>
      <!-- Delete Row -->
      <template #cell(delete)="row">
        <div v-b-tooltip.hover title="Remove Row" @click="removeRow(row)">
          &#128465;
        </div>
      </template>
    </b-editable-table>
    <div class="add-row-nl-event">
      <b-button class="add-row-nl-event-button" variant="primary" @click="handleAdd">Add Row</b-button>
    </div>
  </div>
</template>


<script>
import BEditableTable from "bootstrap-vue-editable-table";
import {mapGetters} from "vuex";

export default {
  name: "NLEventTable",
  components: {
    BEditableTable,
  },
  mounted() {
    this.items = [{ eventId: null, discoveryDate: null, instrument: null, skymapLink: null, falseAlarmRate: null}];
  },
  computed: {
    ...mapGetters(["getMainData"]),
    items: {
      get() {
        return this.getMainData
      },
      set(value) {
        this.$store.commit("SET_MAIN_DATA", value)
        this.$store.commit("SET_MAIN_TABLE_NAME", "nle_data")
      },
    }
  },
  data() {
    return {
      fields: [
        {key: 'eventId', label: 'Event ID', type: 'text', editable: true, placeholder: "Event ID",
          class: "event-id-column"},
        {key: "discoveryDate", label: "Discovery Date", type: 'text', editable: true, placeholder: "Discovery Date",
          class: "discovery-date-column"},
        {key: "instrument", label: "Instrument", type: 'text', editable: true, placeholder: "Instrument",
          class: "instrument-column"},
        {key: 'skymapLink', label: 'Link to Skymap', type: 'text', editable: true, placeholder: "Skymap Link",
          class: "skymap-link-column"},
        {key: "falseAlarmRate", label: "False Alarm Rate", type: 'text', editable: true,
          placeholder: "False Alarm Rate", class: "false-alarm-rate-column"},
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
          eventId: null,
          discoveryDate: null,
          instrument: null,
          skymapLine: null,
          falseAlarmRate: null,
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
.add-row-nl-event-button {
  color: white;
}

.non-localized-event-table /deep/ td {
  height: calc(1.5em + 0.75rem + 2px);
}

.non-localized-event-table /deep/ .data-cell {
  padding: 0.5rem;
}
</style>