<template>
  <b-card no-body class="mt-2">
    <b-card-header header-tag="header" class="p-1" role="tab">
      <b>Discovery Info</b>
    </b-card-header>
    <b-card-body>
      <ocs-custom-alert v-for="error in errors.non_field_errors" :key="error" alert-class="danger" :dismissible="false">
        {{ error }}
      </ocs-custom-alert>
      <b-form-row>
        <b-col md="3">
          <ocs-custom-field v-if="!isTns" v-model="data.reporting_group" field="reporting_group" label="Reporting Group:" :hide=false
            :errors="errors.reporting_group" @input="update" />
          <ocs-custom-select
              v-else
              v-model="data.reporting_group"
              field="reporting_group"
              label="Reporting Group:"
              :hide=false
              :options="getTnsValuesList('groups', true)"
              :errors="errors.reporting_group"
              @input="update"
          />
        </b-col>
        <b-col md="3">
          <ocs-custom-field v-if="!isTns" v-model="data.discovery_source" field="discovery_source" label="Source:" :hide=false
            :errors="errors.discovery_source" @input="update" />
          <ocs-custom-select
              v-else
              v-model="data.discovery_source"
              field="discovery_source"
              label="Source:"
              :hide=false
              :options="getTnsValuesList('groups', true)"
              :errors="errors.discovery_source"
              @input="update"
          />
        </b-col>
        <b-col md="3">
          <ocs-custom-select
              v-model="data.transient_type"
              field="transient_type"
              label="Transient Type:"
              :hide=false
              :options="transientTypes"
              :errors="errors.transient_type"
              @input="update"
          />
        </b-col>
        <b-col md="3">
          <ocs-custom-field v-model="data.proprietary_period" field="proprietary_period" label="Proprietary:" :hide=false
            :errors="errors.proprietary_period" @input="update" >
            <b-input-group-append slot="inline-input">
              <b-form-select
                :id="'proprietary-period-units-select-' + this.index"
                v-model="data.proprietary_period_units"
                :options="proprietaryPeriodUnits"
                @input="update"
              />
            </b-input-group-append>
          </ocs-custom-field>
        </b-col>
      </b-form-row>
      <b-form-row>
            <b-col md="4">
              <ocs-custom-field v-if="!isTns" v-model="data.nondetection_source" field="nondetection_source" label="Nondetection Source:" :hide=false
                :errors="errors.nondetection_source" @input="update" />
              <ocs-custom-select
                  v-else
                  v-model="data.nondetection_source"
                  field="nondetection_source"
                  label="Nondetection Source:"
                  :hide=false
                  :options="getTnsValuesList('archives', true)"
                  :errors="errors.nondetection_source"
                  @input="update"
              />
            </b-col>
            <b-col md="8">
              <ocs-custom-field v-model="data.nondetection_comments" field="nondetection_comments" label="Nondetection Comments:" :hide=false
                :errors="errors.nondetection_comments" @input="update" />
            </b-col>
          </b-form-row>
    </b-card-body>
  </b-card>
</template>
<script>
  import { tnsUtilsMixin } from '@/mixins/tnsUtilsMixin.js';

  export default {
    name: 'DiscoveryInfo',
    mixins: [tnsUtilsMixin],
    props: {
      index: {
        type: Number,
        required: true
      },
      errors: {
        type: Object,
        required: true
      },
      data: {
        type: Object,
        required: true
      },
      isTns: {
        type: Boolean,
        default: false
      }
    },
    data: function() {
      return {
        transientTypes: [{value: null, text: ''}, 'AGN - Known AGN', 'FRB - Fast Radio Burst event', 'NUC - Possibly nuclear', 'Other - Undefined', 'PNV - Possible Nova', 'PSN - Possible SN'],
        proprietaryPeriodUnits: ['Days', 'Months', 'Years'],
        show: true,
        id: 'discovery-info-' + this.index
      };
    },
    methods: {
      update: function () {
        this.$emit('message-updated');
      }
    }
  };
</script>
