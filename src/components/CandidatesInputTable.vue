<template>
    <div>
      <b-table class='candidate-data-table' :items="items" :fields="fields">
        <template #cell(candidateId)="data">
          <b-form-input v-if="items[data.index].isEdit && selectedCell === 'candidateId'" type="text" v-model="items[data.index].candidateId" placeholder="Candidate ID"></b-form-input>
          <span v-else @click="editCellHandler(data, 'candidateId')">{{ formatEmpty(data.value) }}</span>
        </template>
        <template #cell(ra)="data">
          <b-form-input v-if="items[data.index].isEdit && selectedCell === 'ra'" type="text" v-model="items[data.index].ra" placeholder="RA"></b-form-input>
          <span v-else @click="editCellHandler(data, 'ra')">{{ formatEmpty(data.value) }}</span>
        </template>
        <template #cell(dec)="data">
          <b-form-input v-if="items[data.index].isEdit && selectedCell === 'dec'" type="text" v-model="items[data.index].dec" placeholder="Dec"></b-form-input>
          <span v-else @click="editCellHandler(data, 'dec')">{{ formatEmpty(data.value) }}</span>
        </template>
        <template #cell(discoveryDate)="data">
          <b-form-datepicker v-if="items[data.index].isEdit && selectedCell === 'discoveryDAte'" v-model="items[data.index].discoveryDate"></b-form-datepicker>
          <span v-else @click="editCellHandler(data, 'discoveryDate')">{{ formatEmpty(data.value) }}</span>
        </template>
        <template #cell(telescope)="data">
          <b-form-input v-if="items[data.index].isEdit && selectedCell === 'telescope'" type="text" v-model="items[data.index].telescope" placeholder="Telescope"></b-form-input>
          <span v-else @click="editCellHandler(data, 'telescope')">{{ formatEmpty(data.value) }}</span>
        </template>
        <template #cell(instrument)="data">
          <b-form-input v-if="items[data.index].isEdit && selectedCell === 'instrument'" type="text" v-model="items[data.index].instrument" placeholder="Instrument"></b-form-input>
          <span v-else @click="editCellHandler(data, 'instrument')">{{ formatEmpty(data.value) }}</span>
        </template>
        <template #cell(band)="data">
          <b-form-input v-if="items[data.index].isEdit && selectedCell === 'band'" type="text" v-model="items[data.index].band" placeholder="Band"></b-form-input>
          <span v-else @click="editCellHandler(data, 'band')">{{ formatEmpty(data.value) }}</span>
        </template>
        <template #cell(brightness)="data">
          <b-form-input v-if="items[data.index].isEdit && selectedCell === 'brightness'" type="text" v-model="items[data.index].brightness" placeholder="Brightness"></b-form-input>
          <span v-else @click="editCellHandler(data, 'brightness')">{{ formatEmpty(data.value) }}</span>
        </template>
        <template #cell(brightnessError)="data">
          <b-form-input v-if="items[data.index].isEdit && selectedCell === 'brightnessError'" type="text" v-model="items[data.index].brightnessError" placeholder="Brightness Error"></b-form-input>
          <span v-else @click="editCellHandler(data, 'brightnessError')">{{ formatEmpty(data.value) }}</span>
        </template>
      </b-table>
      <div class="add-row-candidate">
        <b-button class="add-row-candidate-button" variant="primary" @click="addRowHandler">Add Row</b-button>
      </div>
    </div>
</template>

<script>

export default {
  name: "CandidatesInputTable",
  data() {
    return {
      brightness: {
        type: "number"
      },
      brightnessError: {
        type: "number"
      },
      fields: [{key: 'candidateId', label: 'ID'}, {key: "ra", label: "RA"}, {key: "dec", label: "Dec"},
        {key: "discoveryDate", label: "Discovery Date", type: 'date-time'}, {key: 'telescope', label: 'Telescope'},
        {key: "instrument", label: "Instrument"}, {key: "band", label: 'Band'},
        {key: "brightness", label: "Brightness"}, {key: "brightnessError", label: "Brightness Error"}],
      items: [{candidateId: null, ra: null, dec: null, discoveryDate: null, telescope: null, instrument: null,
        band: null, brightness: null, brightnessError: null}],
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
      console.log(name)
    },
    addRowHandler() {
      const newRow = this.fields.reduce(
          (a, c) => ({ ...a, [c.key]: null }),
          {}
      );
      console.log(newRow)
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