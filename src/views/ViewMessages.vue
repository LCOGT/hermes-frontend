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
      class="message-b-table"
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
        <span variant="secondary" class="data-column">{{ data.label.toUpperCase() }}</span>
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
            <b-col sm="3" class="text-sm-right"><b>Additional Data:</b></b-col>
            <b-col>
              <b-table
                small
                reactive
                class="kv-b-table"
                :items="getDataitems(row.item)"
                :fields="dataFields"
              >
              </b-table>
            </b-col>
          </b-row>
          
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right">
              <b-button variant="outline-primary" size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
                <b> Show JSON: </b>
              </b-button>
            </b-col>
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

    <!-- JSON DATA -->
    <b-modal :id="jsonData.id" :title="jsonData.title" ok-only @hide="resetjsonData">
      <pre>{{ jsonData.content }}</pre>
    </b-modal>

  </div>
</template>

<script>
import getEnv from "@/utils/env.js"
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
          class: "data-column"
        },
        {
          key: "index",
          label: "",
          class: "data-column"
        },
        {
          key: "created",
          sortable: true,
          sortDirection: 'desc',
          label: "Timestamp",
          class: "data-column"
        },
        {
          key: "title",
          sortable: true,
          class: "data-column"
        },
        {
          key: "author",
          sortable: true,
          class: "data-column"
        },
      ],
      items: [],
      selectedItem: null,
      jsonData: {
          id: 'json-data',
          title: '',
          content: ''
      },
      dataFields: [{key: "key", class: "data-column"}, {key: "value", class: "data-column"}],
    };
  },
  mounted() {
    axios
      .get(getEnv("VUE_APP_HERMES_BACKEND_URL"))
      .then((response) => (this.items = response.data))
      .catch((error) => console.log(error));
  },
  methods: {
      info(item, index, button) {
        this.jsonData.title = `Row index: ${index + 1}`
        this.jsonData.content = JSON.stringify(item, null, 2)
        this.$root.$emit('bv::show::modal', this.jsonData.id, button)
      },
      resetjsonData() {
        this.jsonData.title = ''
        this.jsonData.content = ''
      },
    getDataitems(item){
      var kvList = [];
      for (const [key, value] of Object.entries(item.data)) {
        if (!(key == "body") && !(key == "header")) {
          var dataDict = {};
          dataDict['key']= key;
          dataDict['value']= value;
          kvList.push(dataDict);
        } else if (key == "header") {
          for (const [header_key, header_value] of Object.entries(value)) {
            var headerDict = {};
            headerDict['key']= header_key;
            headerDict['value']= header_value;
            kvList.push(headerDict);
          }
        }
      }
      return kvList;
    }
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
    return ((datetime.getUTCHours() < 9) ? '0' : '') + datetime.getUTCHours() + ':' +
      ((datetime.getUTCMinutes() < 9) ? '0' : '') + datetime.getUTCMinutes() + ':' +
      ((datetime.getUTCSeconds() < 9) ? '0' : '') + datetime.getUTCSeconds() + '.' + datetime.getUTCMilliseconds();
  }
}
};
</script>

<style scoped>
.message-b-table {
  width: 100%
}

.message-b-table >>> .data-column{
  padding : 0.3rem;
}

.kv-b-table {
  width: 100%
}
</style>