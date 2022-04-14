<template>
  <div>
      <b-table hover noCollapse outlined sticky-header sort-icon-left
        head-variant="light" 
        selectable
        reactive
        @row-clicked="item=>$set(item, '_showDetails', !item._showDetails)"
        :items="items"
        :fields="fields">

        <!-- Index Message -->
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>

        <!-- Style Header -->
        <template #head()="data">
          <span variant="secondary">{{ data.label.toUpperCase() }}</span>
        </template>

        <!-- Selection Behavior -->
        <template #cell(selected)="{ rowSelected }">
          <template v-if="rowSelected">
            <span aria-hidden="true">&#10507;</span>
          </template>
          <template v-else>
            <span aria-hidden="true">&#10624;</span>
          </template>
        </template>

        <!-- Detail Card -->
        <template slot="row-details" slot-scope="row">
          <b-card>

            <b-row class="mb-2">
              <b-col sm="3" class="text-sm-right"><b>Message:</b></b-col>
              <b-col>{{ row.item.message_text }}</b-col>
            </b-row>

            <b-row class="mb-2">
              <b-col sm="3" class="text-sm-right"><b>Other Stuff:</b></b-col>
              <b-col>{{ row.item.data }}</b-col>
            </b-row>

          </b-card>
        </template>

        <!-- Format Timestamp -->
        <template #cell(timestamp)="data">
          <b class="small">
            {{ data.item.timestamp.split("T") }}
          </b>
        </template>

      </b-table>
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
            key: 'selected',
            label: '',
            headerTitle: 'selected'
          },
          {
            key: 'index',
            label: ''
          },
          {
            key: 'timestamp',
          },
          {
            key: 'title',
            sortable: true
          },
          {
            key: 'author',
            sortable: true
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
