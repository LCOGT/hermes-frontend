<template>
  <div>
    <b-editable-table bordered class="telescope-event-table" v-model="items" :fields="fields" :rowUpdate="rowUpdate">
      <template #cell(isActive)="data">
        <span v-if="data.value">Yes</span>
        <span v-else>No</span>
      </template>
    </b-editable-table>
    <div class="add-row-telescope-event">
      <b-button class="add-row-telescope-event-button" variant="primary" @click="handleAdd">Add Row</b-button>
    </div>
  </div>
</template>


<script>
import BEditableTable from "bootstrap-vue-editable-table";
import {mapGetters} from "vuex";

export default {
  name: "TelescopeEventTable",
  components: {
    BEditableTable,
  },
  mounted() {
    this.items = [{ observatory: null, telescope: null, instrument: null, eventDate: null, description: null}];
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
        {key: 'observatory', label: 'Observatory', type: 'text', editable: true, placeholder: "Observatory",
          class: "observatory-column"},
        {key: "telescope", label: "Telescope", type: 'text', editable: true, placeholder: "Telescope",
          class: "telescope-column"},
        {key: "instrument", label: "Instrument", type: 'text', editable: true, placeholder: "Instrument",
          class: "instrument-column"},
        {key: 'eventDate', label: 'Date of Event', type: 'text', editable: true, placeholder: "Event Date",
          class: "event-date-column"},
        {key: "description", label: "Description of Event", type: 'text', editable: true,
          placeholder: "Event Description", class: "event-description-column"},

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
          observatory: null,
          telescope: null,
          instrument: null,
          eventDate: null,
          description: null,
          isActive: false,
        },
      };
    }
  }
}
</script>

<style scoped>
.add-row-telescope-event-button {
  color: white;
}

.telescope-event-table /deep/ td {
  height: calc(1.5em + 0.75rem + 2px);
}

</style>
