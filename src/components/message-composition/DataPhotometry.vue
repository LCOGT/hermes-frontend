<template>
    <b-container class="p-0" :id="'data-photometry-' + index">
      <b-card header-tag="header">
        <template #header>
          <b-form-row>
            <b-col md="3" class=" text-center data-label-text">
              <b>Photometry Datum {{ index }}</b>
            </b-col>
            <b-col md="3">
              <ocs-custom-select
                  v-model="photometry.target_name"
                  field="target_name"
                  label="Target:"
                  desc="Target name as defined in the Targets section"
                  :hide=false
                  :errors="errors.target_name"
                  :options="targetNames"
                  @input="update"
              />
            </b-col>
            <b-col md="3">
              <ocs-custom-field
                  v-model="photometry.date_obs"
                  field="date_obs"
                  label="Obs Date:"
                  desc="The date the observation producing this datum was taken"
                  :hide=false
                  :errors="errors.date_obs"
                  @input="update"
              />
            </b-col>
            <b-col md="2" offset-md="1" class="text-right">
              <b-button-toolbar>
                <b-button-group class="mr-1">
                  <b-button title="Advanced Photometry Fields" v-b-toggle="'advanced-photometry-collapse-' + index" @click="toggleCollapse">
                    <span v-if="advancedOptionsCollapsed">
                      <b-icon icon="arrows-expand" aria-hidden="true"></b-icon>
                    </span>
                    <span v-if="!advancedOptionsCollapsed">
                      <b-icon icon="arrows-collapse" aria-hidden="true"></b-icon>
                    </span>
                  </b-button>
                  <b-button title="Copy this Photometry Datum" @click="copy">
                    <b-icon icon="file-earmark-plus" aria-hidden="true"></b-icon>
                  </b-button>
                  <b-button title="Remove this Photometry Datum" @click="confirm('Are you sure you want to remove this Photometry Datum?', remove)">
                    <b-icon icon="trash" aria-hidden="true"></b-icon>
                  </b-button>
                </b-button-group>
              </b-button-toolbar>
            </b-col>
          </b-form-row>
        </template>
        <b-form-row class="mb-2">
          <b-col md="5">
            <ocs-custom-field v-model="photometry.brightness" field="brightness" label="Brightness:" :hide=false
              :errors="errors.brightness" @input="update">
              <b-input-group-append slot="inline-input">
                <b-form-select
                  :id="'brightness-unit-select-' + this.index"
                  v-model="photometry.brightness_unit"
                  :options="brightnessUnits"
                  @input="update"
                />
              </b-input-group-append>
            </ocs-custom-field>  
          </b-col>
          <b-col md="3">
            <ocs-custom-field v-model="photometry.brightness_error" field="brightness_error" label="Error:" :hide=false
              :errors="errors.brightness_error" @input="update" />
          </b-col>
          <b-col md="3">
            <ocs-custom-field v-if="!isTns" v-model="photometry.bandpass" field="bandpass" label="Band:" :hide=false
              :errors="errors.bandpass" @input="update" />
            <ocs-custom-select
              v-else
              v-model="photometry.bandpass"
              field="bandpass"
              label="Band:"
              :hide=false
              :options="getTnsValuesList('filters', true)"
              :errors="errors.bandpass"
              @input="update"
            />
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="5">
            <ocs-custom-field v-model="photometry.limiting_brightness" field="limiting_brightness" label="Limiting Brightness:" :hide=false
              :errors="errors.limiting_brightness" @input="update">
              <b-input-group-append slot="inline-input">
                <b-form-select
                  :id="'limiting-brightness-unit-select-' + this.index"
                  v-model="photometry.limiting_brightness_unit"
                  :options="brightnessUnits"
                  @input="update"
                />
              </b-input-group-append>
            </ocs-custom-field>  
          </b-col>
          <b-col md="3">
            <ocs-custom-field v-if="!isTns" v-model="photometry.telescope" field="telescope" label="Telescope:" :hide=false
              :errors="errors.telescope" @input="update" />
            <ocs-custom-select
              v-else
              v-model="photometry.telescope"
              field="telescope"
              label="Telescope:"
              :hide=false
              :options="getTnsValuesList('telescopes', true)"
              :errors="errors.telescope"
              @input="update"
            />
          </b-col>
          <b-col md="3">
            <ocs-custom-field v-if="!isTns" v-model="photometry.instrument" field="instrument" label="Instrument:" :hide=false
              :errors="errors.instrument" @input="update" />
            <ocs-custom-select
              v-else
              v-model="photometry.instrument"
              field="instrument"
              label="Instrument:"
              :hide=false
              :options="getTnsValuesList('instruments', true)"
              :errors="errors.instrument"
              @input="update"
            />
          </b-col>
        </b-form-row>
        <b-collapse :id="'advanced-photometry-collapse-' + index" class="mt-2">
          <b-form-row>
            <b-col md="2">
              <ocs-custom-field v-model="photometry.exposure_time" field="exposure_time" label="Exp Time:" :hide=false
                :errors="errors.exposure_time" @input="update" />
            </b-col>
            <b-col md="3">
              <ocs-custom-field v-model="photometry.observer" field="observer" label="Observer:" :hide=false
                :errors="errors.observer" @input="update" />
            </b-col>
            <b-col md="3">
              <ocs-custom-field v-model="photometry.catalog" field="catalog" label="Catalog:" :hide=false
                :errors="errors.catalog" @input="update" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col md="12">
              <b-form-group
                :id="'photometry-comments-fieldgroup' + id"
                label-size="sm"
                label-align-sm="right"
                label-cols-sm="1"
                label-for="comments"
              >
                <template slot="label">
                  Comments:
                </template>
                <b-input-group>
                  <b-form-textarea
                    :id="'photometry-comments-field' + id"
                    v-model="photometry.comments"
                    placeholder="Enter something..."
                    rows="2"
                    max-rows="4"
                    @input="update"
                  />
                  <slot name="inline-input" />
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-form-row>
        </b-collapse>
      </b-card>
    </b-container>
  </template>
  <script>
  import { OCSMixin } from 'ocs-component-lib';
  import _ from 'lodash';
  import { schemaDataMixin } from '@/mixins/schemaDataMixin.js';
  import { tnsUtilsMixin } from '@/mixins/tnsUtilsMixin.js';

  export default {
    name: 'DataPhotometry',
    mixins: [OCSMixin.confirmMixin, schemaDataMixin, tnsUtilsMixin],
    props: {
      index: {
        type: Number,
        required: true
      },
      errors: {
        type: Object,
        required: true
      },
      photometry: {
        type: Object,
        required: true
      },
      targets: {
        type: Array,
        required: true,
        default: () => {
          return [];
        }
      },
      isTns: {
        type: Boolean,
        default: false
      }
    },
    data: function() {
      return {
        brightnessUnits: ['AB mag', 'Vega mag', 'mJy', 'erg / s / cm² / Å'],
        advancedOptionsCollapsed: true,
        show: true,
        id: 'photometry-' + this.index
      };
    },
    computed: {
      targetNames: function() {
        return _.map(this.targets, 'name');
      }
    }
  };
  </script>
    