<template>
  <div>
    <b-row>
      <b-col class="pr-0">
      <b-table small hover noCollapse outlined sticky-header sort-icon-left
        head-variant="light" 
        select-mode="single"
        selectable
        reactive
        class="h-100"
        @row-clicked="onRowClicked"
        :items="items"
        :fields="fields">

        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>

        <template #head()="data">
          <span variant="secondary">{{ data.label.toUpperCase() }}</span>
        </template>

        <template #cell(selected)="{ rowSelected }">
          <template v-if="rowSelected">
            <span aria-hidden="true">&Rrightarrow;</span>
          </template>
          <template v-else>
            <span aria-hidden="true">&#10624;</span>
          </template>
        </template>

      </b-table>
      </b-col>
      <b-col class="pl-0">
      <b-card class="h-100"
        style="width: 20rem; border: 5px solid lightgray;"
      >
        <pre v-if="selectedItem">
          <b-card-title>Message</b-card-title>
          {{ selectedItem.message_text }}</pre>
        <h4 class="text-center" v-else>
          Expand a message.
        </h4>
      </b-card>
    </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "ViewMessages",
  data() {
    return {
      fields: [
          {
            key: 'index',
            label: ''
          },
          {
            key: 'title',
            sortable: true
          },
          {
            key: 'author',
            sortable: true
          },
          {
            key: 'selected',
            label: '',
            headerTitle: 'selected'
          },
        ],
      items: null,
      selectedItem: null,
    }
  },
  methods: {
    onRowClicked(item) {
      this.selectedItem = item
    }
  },
  mounted () {
    axios
      .get(process.env.VUE_APP_HERMES_BACKEND_URL)
      .then(response => (this.items = response.data.results))
      .catch(error => console.log(error))
  }
}
</script>
