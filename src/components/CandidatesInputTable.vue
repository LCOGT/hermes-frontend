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
      band: null, brightness: null, brightnessError: null
    }];
  },
  computed: {
    ...mapGetters(["getCandidates"]),
    items: {
      get() {
        return this.getCandidates
      },
      set(value) {
        this.$store.commit("SET_CANDIDATES", value)
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
        }
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

.candidate-data-table >>> .candidate-id-column {
  height: calc(1.5em + 0.75rem + 2px);
}

.candidate-data-table >>> .ra-column {
  height: calc(1.5em + 0.75rem + 2px);
}

.candidate-data-table >>> .dec-column {
  height: calc(1.5em + 0.75rem + 2px);
}

.candidate-data-table >>> .discovery-date-column {
  height: calc(1.5em + 0.75rem + 2px);
}

.candidate-data-table >>> .telescope-column {
  height: calc(1.5em + 0.75rem + 2px);
}

.candidate-data-table >>> .instrument-column {
  height: calc(1.5em + 0.75rem + 2px);
}

.candidate-data-table >>> .band-column {
  height: calc(1.5em + 0.75rem + 2px);
}

.candidate-data-table >>> .brightness-column {
  height: calc(1.5em + 0.75rem + 2px);
}

.candidate-data-table >>> .brightness-error-column {
  height: calc(1.5em + 0.75rem + 2px);
}
</style>
