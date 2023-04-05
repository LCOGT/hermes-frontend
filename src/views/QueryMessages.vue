<template>
  <div class="overflow-auto px-4" :style="{width: '100%'}">
  <b-row>
    <b-col md="7">
      <b-row>
        <b-col class="col-md-4">
          <!-- Topic Filter -->
          <b-form-select
            id="topic_selector"
            v-model.lazy="queryParams.topic_exact"
            :options="topic_options"
            @change="onTopicChange"
          >
            <template #first>
              <b-form-select-option value="">-- All Topics --</b-form-select-option>
            </template>
          </b-form-select>
        </b-col>
        <b-col class="col-md-6 ml-auto">
          <b-form-input placeholder="Search Placeholder"></b-form-input>
        </b-col>
      </b-row>
      <!-- Main Message Table -->
      <b-table
        hover
        small
        noCollapse
        outlined
        select-mode="single"
        selectable
        striped
        sort-icon-left
        head-variant="light"
        @row-selected="items=>onRowSelected(items)"
        class="message-b-table"
        id="message-table"
        :busy="isBusy"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :items="data.results"
        :fields="visibleFields"
      >
        <template v-slot:table-busy>
          <br />
          <div class="text-center my-2"><i class="fa fa-spin fa-spinner" /> Loading messages...</div>
          <br />
        </template>
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
          <template v-if="row.rowSelected">
            <span aria-hidden="true">&#8667;<!-- Tripple rightarrow --></span>
          </template>
          <template v-else>
            <span aria-hidden="true">&#10624;<!-- Three Bars --></span>
          </template>
        </template>

        <!-- Format Timestamp -->
        <template #cell(created)="data">
          <div v-b-tooltip.hover :title="data.item.created|formatDate">
            {{ data.item.created | timeFromNow }}
          </div>
        </template>
      </b-table>
      <!-- Pagination -->
      <ocs-pagination
        v-if="!isBusy"
        table-id="message-table"
        :per-page="queryParams.limit"
        :total-rows="data.count"
        :current-page="currentPage"
        :display-per-page-dropdown="true"
        total-rows-class="hermes-total-rows"
        @pageChange="onPageChange"
        @limitChange="onLimitChange"
      ></ocs-pagination>
    </b-col>
    <!-- Full Message Box -->
    <b-col md="5" class="only-right-padding">
      <message-detail v-if="selectedItem" :message="selectedItem"></message-detail>
      <!-- Initial Message Box Display -->
      <b-card v-else border-variant="primary" class="mb-2" style="max-height: 50rem; overflow: auto;">
        <h4 class="text-center" >
          HERMES is a Message Exchange Service for Multi-Messenger Astronomy applications that allow users to both send and review messages related to a variety of events and targets of interest.
        </h4>
      </b-card>
    </b-col>
  </b-row>
  </div>
</template>
<script>
import { OCSMixin } from 'ocs-component-lib';
import getEnv from "@/utils/env.js";
import axios from "axios";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import '@/assets/css/view.css';
import MessageDetail from '@/views/MessageDetail.vue';
import { logoutMixin } from '@/mixins/logoutMixin.js';

export default {
  name: "QueryMessages",
  mixins: [OCSMixin.paginationAndFilteringMixin, logoutMixin],
  components: {
    MessageDetail,
  },
  data() {
    return {
      topic_options: [],
      sortBy: 'created',
      sortDesc: true,
      fields: [
        {
          key: "selected",
          label: "",
          headerTitle: "selected",
          class: "data-column",
          visible: true
        },
        {
          key: "index",
          label: "",
          class: "data-column",
          visible: false
        },
        {
          key: "created",
          sortable: true,
          sortDirection: 'desc',
          label: "Timestamp",
          class: "data-column",
          visible: true
        },
        {
          key: "topic",
          label: "Topic",
          class: "data-column",
          visible: true
        },
        {
          key: "title",
          sortable: true,
          class: "data-column",
          visible: true
        },
        {
          key: "submitter",
          sortable: true,
          class: "data-column",
          label: "Submitter",
          visible: true
        },
      ],
      selectedItem: null,
      topic: null,
    };
  },
  mounted() {
    // Get available topics
    axios
      .get(getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + "api/v0/topics/", {
          withCredentials: true,
        })
      .then((response) => (this.topic_options = response.data.topics))
      .catch((error) => {
        console.log(error);
        if (error.response.status == 401){
          this.logout();
        }
      });
  },
  created() {
    dayjs.extend(relativeTime);
  },
  computed: {
    visibleFields() {
      return this.fields.filter(field => field.visible);
    }
  },
  methods: {
    // Overrides method in paginationAndFilteringMixin
    initializeDataEndpoint: function() {
      return getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + 'api/v0/messages/';
    },
    // Overrides method in paginationAndFilteringMixin
    initializeDefaultQueryParams: function() {
      const defaultQueryParams = {
        topic_exact: '',
        limit: 10,
        offset: 0
      };
      return defaultQueryParams;
    },
    // Overrides methods in paginationAndFilteringMixin
    onErrorRetrievingData: function(response) {
      if (response.status == 401) {
        this.logout();
      }
    },
    onTopicChange(value) {
      this.fields.forEach(field => {
        if (field.key == 'topic') {
          field.visible = (value == '');
        }
      });
      let fakeEvent = {'preventDefault': () => true};
      this.onSubmit(fakeEvent);
    },
    onRowSelected(items) {
      // Define Behavior when Row Selected
      this.selectedItem = items[0];
    }
  },
  filters: {
    timeFromNow: function(datetime) {
      if (!datetime) {
        return null;
      }
      return dayjs(datetime).fromNow();
    },
    formatDate: function(datetime) {
      if (!datetime) {
        return null;
      }
      return dayjs(datetime).format('MMM D, YYYY, HH:mm');
    },
  }
};
</script>

<style scoped>

</style>
