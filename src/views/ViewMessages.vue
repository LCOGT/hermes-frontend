<template>
  <div class="overflow-auto px-4" :style="{width: '100%'}">

   <b-pagination
      v-model="currentPage"
      :total-rows="items.length"
      :per-page="perPage"
      first-number
      last-number
      aria-controls="message-table"
    ></b-pagination>

    <b-table
      hover
      small
      noCollapse
      outlined
      striped
      sort-icon-left
      head-variant="light"
      @row-clicked="(item) => $set(item, '_showDetails', !item._showDetails)"
      id="message-table"
      :per-page="perPage"
      :current-page="currentPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :items="items"
      :fields="fields"
    >
      <!-- Index Message -->
      <template #cell(index)="data">
        {{ data.index + 1 }}
      </template>

      <!-- Style Header -->
      <template #head()="data">
        <span variant="secondary">{{ data.label.toUpperCase() }}</span>
      </template>

      <!-- Selection Behavior -->
      <template #cell(selected)="row">
        <template v-if="row.detailsShowing">
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
      <template #cell(created)="data">
        <b class="small">
          {{ data.item.created | format_date }}
          {{ data.item.created | format_time }}
        </b>
      </template>
    </b-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ViewMessages",
  data() {
    return {
      sortBy: 'created',
      sortDesc: true,
      perPage: 10,
      currentPage: 1,
      fields: [
        {
          key: "selected",
          label: "",
          headerTitle: "selected",
        },
        {
          key: "index",
          label: "",
        },
        {
          key: "created",
          sortable: true,
          sortDirection: 'desc',
          label: "Timestamp"
        },
        {
          key: "title",
          sortable: true,
        },
        {
          key: "author",
          sortable: true,
        },
      ],
      items: [],
      selectedItem: null,
    };
  },
  mounted() {
    axios
      .get("http://hermes-dev.lco.gtn/api/v0/messages.json")
      .then((response) => (this.items = response.data))
      .catch((error) => console.log(error));
  },
  filters: {
  format_date: function(datetime) {
    if (!datetime) { return '(n/a)'; }
    datetime = new Date(datetime);
    return datetime.getUTCFullYear() + "/" +
      ((datetime.getUTCMonth() < 9) ? '0' : '') + (datetime.getUTCMonth() + 1) + '/' +
      ((datetime.getUTCDate() < 10) ? '0' : '') + datetime.getUTCDate();
  },
  format_time:  function(datetime) {
    if (!datetime) { return '(n/a)'; }
    datetime = new Date(datetime);
    return datetime.getUTCHours() + ':' + datetime.getUTCMinutes() + ':' +
      datetime.getUTCSeconds() + '.' + datetime.getUTCMilliseconds();
  }
}
};
</script>
