<template>
    <b-container class="p-0" :id="'data-astrometry-' + index">
      <b-card header-tag="header">
        <template #header>
          <b-form-row>
            <b-col md="3" class=" text-center data-label-text">
              <b>Astrometry Datum {{ index }}</b>
            </b-col>
            <b-col md="3">
              <ocs-custom-select
                  v-model="astrometry.target_name"
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
                  v-model="astrometry.date_obs"
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
                  <b-button title="Advanced Astrometry Fields" v-b-toggle="'advanced-astrometry-collapse-' + index" @click="toggleCollapse">
                    <span v-if="advancedOptionsCollapsed">
                      <b-icon icon="arrows-expand" aria-hidden="true"></b-icon>
                    </span>
                    <span v-if="!advancedOptionsCollapsed">
                      <b-icon icon="arrows-collapse" aria-hidden="true"></b-icon>
                    </span>
                  </b-button>
                  <b-button title="Copy this Astrometry Datum" @click="copy">
                    <b-icon icon="file-earmark-plus" aria-hidden="true"></b-icon>
                  </b-button>
                  <b-button title="Remove this Astrometry Datum" @click="confirm('Are you sure you want to remove this Astrometry Datum?', remove)">
                    <b-icon icon="trash" aria-hidden="true"></b-icon>
                  </b-button>
                </b-button-group>
              </b-button-toolbar>
            </b-col>
          </b-form-row>
        </template>
        <b-form-row>
          <b-col md="3">
              <ocs-sexagesimal-custom-field
              v-model="astrometry.ra"
              coordinate="ra"
              field="ra"
              label="Right Ascension:"
              :hide=false
              :collapse=false
              :errors="errors.ra"
              @input="update"
              />
          </b-col>
          <b-col md="3" :align-self="getErrorAlignment">
              <ocs-custom-field v-model="astrometry.ra_error" field="ra_error" label="Error:" :hide=false
              :errors="errors.ra_error" @input="update" >
              <b-input-group-append slot="inline-input">
                  <b-form-select
                  :id="'ra-error-units-select-' + this.index"
                  v-model="astrometry.ra_error_units"
                  :options="errorUnits"
                  @input="update"
                  />
              </b-input-group-append>
              </ocs-custom-field>
          </b-col>
          <b-col md="3">
              <ocs-sexagesimal-custom-field
              v-model="astrometry.dec"
              coordinate="dec"
              field="dec"
              label="Declination:"
              :hide=false
              :collapse=false
              :errors="errors.dec"
              @input="update"
              />
          </b-col>
          <b-col md="3" :align-self="getErrorAlignment">
              <ocs-custom-field v-model="astrometry.dec_error" field="dec_error" label="Error:" :hide=false
              :errors="errors.dec_error" @input="update" >
              <b-input-group-append slot="inline-input">
                  <b-form-select
                  :id="'dec-error-units-select-' + this.index"
                  v-model="astrometry.dec_error_units"
                  :options="errorUnits"
                  @input="update"
                  />
              </b-input-group-append>
              </ocs-custom-field>
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="3">
            <ocs-custom-field v-model="astrometry.telescope" field="telescope" label="Telescope:" :hide=false
              :errors="errors.telescope" @input="update" />
          </b-col>
          <b-col md="3">
            <ocs-custom-field v-model="astrometry.instrument" field="instrument" label="Instrument:" :hide=false
              :errors="errors.instrument" @input="update" />
          </b-col>
        </b-form-row>
        <b-collapse :id="'advanced-astrometry-collapse-' + index">
          <b-form-row class="mt-3">
            <b-col md="3">
              <ocs-custom-field v-model="astrometry.mpc_sitecode" field="mpc_sitecode" label="MPC Sitecode:" :hide=false
                :errors="errors.mpc_sitecode" @input="update" />
            </b-col>
            <b-col md="3">
              <ocs-custom-field v-model="astrometry.catalog" field="catalog" label="Astrometric Catalog:" :hide=false
                :errors="errors.catalog" @input="update" :list="catalogList"/>
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col md="12">
              <b-form-group
                :id="'astrometry-comments-fieldgroup' + id"
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
                    :id="'astrometry-comments-field' + id"
                    v-model="astrometry.comments"
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
  import _ from 'lodash';
  import { OCSMixin } from 'ocs-component-lib';
  import {schemaDataMixin} from '@/mixins/schemaDataMixin.js';

  export default {
    name: 'DataAstrometry',
    mixins: [OCSMixin.confirmMixin, schemaDataMixin],
    props: {
      index: {
        type: Number,
        required: true
      },
      errors: {
        type: Object,
        required: true
      },
      astrometry: {
        type: Object,
        required: true
      },
      targets: {
        type: Array,
        required: true,
        default: () => {
          return [];
        }
      }
    },
    data: function() {
      return {
        brightnessUnits: ['AB mag', 'Vega mag', 'mJy', 'erg / s / cm² / Å'],
        errorUnits: ['marcsec', 'arcsec', 'arcmin', 'degrees'],
        catalogList: [
          {value: 'Gaia_Int', text: 'Gaia_Int'},
          {value: 'PS1_DR1', text: 'PanSTARRS-1 DR 1'},
          {value: 'PS1_DR2', text: 'PanSTARRS-1 DR 2'},
          {value: 'ATLAS2', text: 'ATLAS-REFCAT 2'},
          {value: 'Gaia3', text: 'Gaia DR 3'},
          {value: 'Gaia3E', text: 'Gaia EDR 3'},
          {value: 'Gaia2', text: 'Gaia DR 2'},
          {value: 'Gaia1', text: 'Gaia DR 1'},
          {value: 'Gaia_2016', text: 'Gaia epoch 2016'},
          {value: 'NOMAD', text: 'NOMAD'},
          {value: 'PPMXL', text: 'PPM-XL'},
          {value: 'UBSC', text: 'USNO Bright-star Catalog'},
          {value: 'UCAC5', text: 'UCAC 5'},
          {value: 'UCAC4', text: 'UCAC 4'},
          {value: 'URAT1', text: 'URAT 1'},
          {value: '2MASS', text: '2MASS'},
          {value: 'SDSS', text: 'SDSS'}
        ],
        advancedOptionsCollapsed: true,
        show: true,
        id: 'astrometry-' + this.index
      };
    },
    computed: {
      getErrorAlignment: function () {
        if (!_.isEmpty(this.astrometry.ra) || !_.isEmpty(this.astrometry.dec)){
          return "center";
        }
        else{
          return "baseline";
        }
      },
      targetNames: function() {
        return _.map(this.targets, 'name');
      }
    }
  };
  </script>
    