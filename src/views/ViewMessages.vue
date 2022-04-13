<template>
  <div class="overflow-auto">
   <b-pagination
      v-model="currentPage"
      :total-rows="items.length"
      :per-page="perPage"
      aria-controls="message-table"
    ></b-pagination>
    <b-table
      hover
      small
      noCollapse
      outlined
      sort-icon-left
      head-variant="light"
      selectable
      @row-clicked="(item) => $set(item, '_showDetails', !item._showDetails)"
      id="message-table"
      :per-page="perPage"
      :current-page="currentPage"
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
      <template #cell(created)="data">
        <b class="small">
          {{ data.item.created.split("T") }}
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
      perPage: 3,
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
  methods: {
    onRowClicked(item) {
      this.selectedItem = item;
    },
  },
  mounted() {
    axios
      .get("http://hermes-dev.lco.gtn/api/v0/messages.json")
      .then((response) => (this.items = response.data.results))
      .catch((error) => console.log(error));
  },
};
</script>
