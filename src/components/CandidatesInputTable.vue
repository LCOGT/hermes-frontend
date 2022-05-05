<template>
    <div>
      <b-editable-table bordered class="candidate-data-table" v-model="items" :fields="fields" :rowUpdate="rowUpdate">
        <template #cell(isActive)="data">
          <span v-if="data.value">Yes</span>
          <span v-else>No</span>
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
  mounted() {
    this.items = [{
      candidateId: null, ra: null, dec: null, discoveryDate: null, telescope: null, instrument: null,
      band: null, brightness: null, brightnessError: null, brightnessUnit: "AB mag"
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
      },
    }
  },
  data() {
    return {
      fields: [
        {key: 'candidateId', label: 'ID', type: 'text', editable: true, placeholder: "Candidate ID", class: "candidate-id-column"},
        {key: "ra", label: "RA", type: 'text', editable: true, placeholder: "RA", class: "ra-column"},
        {key: "dec", label: "Dec", type: 'text', editable: true, placeholder: "Dec", class: "dec-column"},
        {
          key: "discoveryDate",
          label: "Discovery Date",
          type: 'text',
          editable: true,
          placeholder: "Discovery Date",
          class: "discovery-date-column"
        },
        {key: 'telescope', label: 'Telescope', type: 'text', editable: true, placeholder: "Telescope", class: "telescope-column"},
        {key: "instrument", label: "Instrument", type: 'text', editable: true, placeholder: "Instrument", class: "instrument-column"},
        {key: "band", label: 'Band', type: 'text', editable: true, placeholder: "Band", class: "band-column"},
        {key: "brightness", label: "Brightness", type: 'text', editable: true, placeholder: "Brightness", class: "brightness-column"},
        {
          key: "brightnessError",
          label: "Brightness Error",
          type: 'text',
          editable: true,
          placeholder: "Brightness Error",
          class: "brightness-error-column"
        },
        {
          key: "brightnessUnit",
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
          candidateId: null,
          ra: null,
          dec: null,
          discoveryDate: null,
          telescope: null,
          instrument: null,
          band: null,
          brightness: null,
          brightnessError: null,
          brightnessUnit: "AB mag",
          isActive: false,
        },
      };
    }
  }
}
</script>

<style scoped>
.add-row-candidate-button {
  color: white;
}

.candidate-data-table /deep/ td {
  height: calc(1.5em + 0.75rem + 2px);
}

</style>
