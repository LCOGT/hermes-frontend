<template>
  <div class="overflow-auto px-4" :style="{width: '100%'}">
  <b-row>
    <b-col md="7">
      <b-row class="pb-2">
        <b-col class="col-md-5 pr-0">
          <multiselect
            v-model.lazy="queryParams.topic"
            placeholder="Filter by Topic"
            maxHeight="500"
            :optionHeight=38
            :options="topic_options"
            :multiple="true"
            @input="onTopicChange"
          >
          </multiselect>
        </b-col>
        <b-col class="col-md-1 text-left pl-0">
          <b-button-group vertical class="w-5">
            <b-button class="br-0 ms-button smooth-top-border" variant="outline-secondary" @click="selectAllTopics" title="Select All Topics">
              <b-icon icon="check-all" class="ms-icon" shift-h="-8" shift-v="8"></b-icon>
            </b-button>
            <b-button class="br-0 ms-button smooth-bottom-border" variant="outline-secondary" @click="deselectAllTopics" title="Deselect All Topics">
              <b-icon stacked icon="stop" class="ms-icon" shift-h="-8" shift-v="8"></b-icon>
            </b-button>
          </b-button-group>
        </b-col>
        <b-col class="col-md-6 ml-auto">
          <b-form-input type="search" placeholder="Search Terms" v-model.lazy="queryParams.search" @input="searchTerms"></b-form-input>
        </b-col>
      </b-row>
      <div class="table-container">
        <!-- Main Message Table -->
        <b-table
          hover
          small
          noCollapse
          outlined
          select-mode="single"
          selected-variant="secondary"
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
      </div>
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
import _ from 'lodash';
import Multiselect from 'vue-multiselect';
import "vue-multiselect/dist/vue-multiselect.min.css";
import "vue-multiselect-bootstrap-theme/dist/vue-multiselect-bootstrap4.scss";
import { OCSMixin } from 'ocs-component-lib';
import { mapGetters } from "vuex";
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
    Multiselect
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
      .get(this.getHermesUrl + "api/v0/topics/", {
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
    ...mapGetters(["getHermesUrl"]),
    visibleFields() {
      return this.fields.filter(field => field.visible);
    }
  },
  methods: {
    selectAllTopics: function() {
      this.queryParams.topic = this.topic_options;
      let fakeEvent = {'preventDefault': () => true};
      this.onSubmit(fakeEvent);
    },
    deselectAllTopics: function() {
      this.queryParams.topic = [];
      let fakeEvent = {'preventDefault': () => true};
      this.onSubmit(fakeEvent);
    },
    // Overrides method in paginationAndFilteringMixin
    initializeDataEndpoint: function() {
      return getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL") + 'api/v0/messages/';
    },
    // Overrides method in paginationAndFilteringMixin
    initializeDefaultQueryParams: function() {
      const defaultQueryParams = {
        topic: [],
        search: '',
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
          field.visible = (value == []);
        }
      });
      let fakeEvent = {'preventDefault': () => true};
      this.onSubmit(fakeEvent);
    },
    searchTerms: _.debounce(function() {
      let fakeEvent = {'preventDefault': () => true};
      this.onSubmit(fakeEvent);
    }, 300),
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
