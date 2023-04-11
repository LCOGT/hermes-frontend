<template>
    <b-container class="p-0" :id="'data-spectroscopy-' + index">
      <b-card header-tag="header">
        <template #header>
          <b-form-row>
            <b-col md="3" class=" text-center data-label-text">
              <b>Spectroscopy Datum {{ index }}</b>
            </b-col>
            <b-col md="3">
              <ocs-custom-select
                v-model="spectroscopy.target_name"
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
                v-model="spectroscopy.date_obs"
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
                  <b-button title="Advanced Spectroscopy Fields" v-b-toggle="'advanced-spectroscopy-collapse-' + index" @click="toggleCollapse">
                    <span v-if="advancedOptionsCollapsed">
                      <b-icon icon="arrows-expand" aria-hidden="true"></b-icon>
                    </span>
                    <span v-if="!advancedOptionsCollapsed">
                      <b-icon icon="arrows-collapse" aria-hidden="true"></b-icon>
                    </span>
                  </b-button>
                  <b-button title="Copy this Spectroscopy Datum" @click="copy">
                    <b-icon icon="file-earmark-plus" aria-hidden="true"></b-icon>
                  </b-button>
                  <b-button title="Remove this Spectroscopy Datum" @click="confirm('Are you sure you want to remove this Spectroscopy Datum?', remove)">
                    <b-icon icon="trash" aria-hidden="true"></b-icon>
                  </b-button>
                </b-button-group>
              </b-button-toolbar>
            </b-col>
          </b-form-row>
        </template>
        <b-form-row class="mb-1" v-for="(flux, idx) in spectroscopy.flux" :key="'flux-' + idx">
          <b-col md="3">
            <ocs-custom-field v-model="spectroscopy.flux[idx]" field="flux" label="Flux:" :hide=false
            :errors="getArrayErrors('flux', idx)" @input="update" />
          </b-col>
          <b-col md="3">
            <ocs-custom-field v-model="spectroscopy.flux_error[idx]" field="flux_error" label="Error:" :hide=false
            :errors="getArrayErrors('flux_error', idx)" @input="update" />
          </b-col>
          <b-col md="4">
            <ocs-custom-field v-model="spectroscopy.wavelength[idx]" field="wavelength" label="Wavelength:" :hide=false
            :errors="getArrayErrors('wavelength', idx)" @input="update" />
          </b-col>
          <b-col md="1" class="text-right">
            <b-button-toolbar>
              <b-button-group class="mr-1">
                <b-button title="Copy this Flux value" @click="copyFlux(idx)">
                  <b-icon icon="file-earmark-plus" aria-hidden="true"></b-icon>
                </b-button>
                <b-button :disabled="spectroscopy.flux.length == 1" title="Remove this Flux value" @click="removeFlux(idx)">
                  <b-icon icon="trash" aria-hidden="true"></b-icon>
                </b-button>
              </b-button-group>
            </b-button-toolbar>
          </b-col>
        </b-form-row>
        <b-form-row class="mt-2">
          <b-col md="3">
            <ocs-custom-select
              v-model="spectroscopy.flux_units"
              field="flux_units"
              label="Flux Units:"
              :hide=false
              :errors="errors.flux_units"
              :options="fluxUnits"
              @input="update"
            />
          </b-col>
          <b-col md="3">
            <ocs-custom-select
              v-model="spectroscopy.wavelength_units"
              field="wavelength_units"
              label="Wavelength Units:"
              :hide=false
              :errors="errors.wavelength_units"
              :options="wavelengthUnits"
              @input="update"
            />
          </b-col>
          <b-col md="3">
            <ocs-custom-select
              v-model="spectroscopy.flux_type"
              field="flux_type"
              label="Flux Type:"
              :hide=false
              :errors="errors.flux_type"
              :options="fluxTypes"
              @input="update"
            />
          </b-col>
        </b-form-row>
        <b-form-row>
          <b-col md="4">
            <ocs-custom-field v-model="spectroscopy.proprietary_period" field="proprietary_period" label="Proprietary Period:" :hide=false
              :errors="errors.proprietary_period" @input="update">
              <b-input-group-append slot="inline-input">
                <b-form-select
                  :id="'proprietary-period-unit-select-' + this.index"
                  v-model="spectroscopy.proprietary_period_units"
                  :options="proprietaryPeriodUnits"
                  @input="update"
                />
              </b-input-group-append>
            </ocs-custom-field>
          </b-col>
          <b-col md="3">
            <ocs-custom-field v-model="spectroscopy.telescope" field="telescope" label="Telescope:" :hide=false
              :errors="errors.telescope" @input="update" />
          </b-col>
          <b-col md="3">
            <ocs-custom-field v-model="spectroscopy.instrument" field="instrument" label="Instrument:" :hide=false
              :errors="errors.instrument" @input="update" />
          </b-col>
        </b-form-row>
        <b-collapse :id="'advanced-spectroscopy-collapse-' + index" class="mt-2">
          <b-form-row  class="mt-3">
            <b-col md="3">
              <ocs-custom-field v-model="spectroscopy.observer" field="observer" label="Observer:" :hide=false
                :errors="errors.observer" @input="update" />
            </b-col>
            <b-col md="3">
              <ocs-custom-field v-model="spectroscopy.reducer" field="reducer" label="Reducer:" :hide=false
                :errors="errors.reducer" @input="update" />
            </b-col>
            <b-col md="3">
              <ocs-custom-select
                  v-model="spectroscopy.classification"
                  field="classification"
                  label="Class:"
                  desc="Classification of spectroscopic datum"
                  :hide=false
                  :errors="errors.classification"
                  :options="classificationTypes"
                  @input="update"
              />
            </b-col>
            <b-col md="3">
              <ocs-custom-field v-model="spectroscopy.exposure_time" field="exposure_time" label="Exposure Time:" :hide=false
                :errors="errors.exposure_time" @input="update" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col md="3">
              <ocs-custom-field v-model="spectroscopy.setup" field="setup" label="Setup:" :hide=false
                :errors="errors.setup" @input="update" />
            </b-col>
            <b-col md="3">
              <ocs-custom-select
                  v-model="spectroscopy.spec_type"
                  field="spec_type"
                  label="Spec Type:"
                  desc="Type of the Spectrograph"
                  :hide=false
                  :errors="errors.spec_type"
                  :options="specTypes"
                  @input="update"
              />
            </b-col>
            <b-col md="6">
              <ocs-custom-field v-model="spectroscopy.group_associations" field="group_associations" label="Group Associations:" :hide=false
                :errors="errors.group_associations" @input="update" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col md="12">
              <b-form-group
                :id="'spectroscopy-comments-fieldgroup' + id"
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
                    :id="'spectroscopy-comments-field' + id"
                    v-model="spectroscopy.comments"
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
  import {schemaDataMixin} from '@/mixins/schemaDataMixin.js';

  export default {
    name: 'DataSpectroscopy',
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
      spectroscopy: {
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
        wavelengthUnits: ['µm', 'nm', 'Å', 'Hz', 'GHz', 'THz'],
        fluxUnits: ['mJy', 'erg / s / cm² / Å'],
        fluxTypes: ['Fλ', 'Fν'],
        proprietaryPeriodUnits: ['Days', 'Months', 'Years'],
        specTypes: ['Object', 'Host', 'Synthetic', 'Sky', 'Arcs'],
        classificationTypes: [
          'Afterglow',
          'AGN',
          'Computed-Ia',
          'Computed-IIb',
          'Computed-IIn',
          'Computed-IIP',
          'Computed-PISN',
          'CV',
          'FBOT',
          'FRB',
          'Galaxy',
          'Gap',
          'Gap I',
          'Gap II',
          'ILRT',
          'Impostor-SN',
          'Kilonova',
          'LBV',
          'Light-Echo',
          'LRN',
          'M dwarf',
          'Nova',
          'QSO',
          'SLSN-I',
          'SLSN-II',
          'SLSN-R',
          'SN',
          'SN I',
          'SN I-faint',
          'SN I-rapid',
          'SN Ia',
          'SN Ia-91bg-like',
          'SN Ia-91T-like',
          'SN Ia-Ca-rich',
          'SN Ia-CSM',
          'SN Ia-pec',
          'SN Ia-SC',
          'SN Iax[02cx-like]',
          'SN Ib',
          'SN Ib-Ca-rich',
          'SN Ib-pec',
          'SN Ib/c',
          'SN Ib/c-Ca-rich',
          'SN Ibn',
          'SN Ibn/Icn',
          'SN Ic',
          'SN Ic-BL',
          'SN Ic-Ca-rich',
          'SN Ic-pec',
          'SN Icn',
          'SN II',
          'SN II-pec',
          'SN IIb',
          'SN IIL',
          'SN IIn',
          'SN IIn-pec',
          'SN IIP',
          'Std-spec',
          'TDE',
          'TDE-H',
          'TDE-H-He',
          'TDE-He',
          'Varstar',
          'WR',
          'WR-WC',
          'WR-WN',
          'WR-WO',
          'Other'
        ],
        advancedOptionsCollapsed: true,
        show: true,
        id: 'spectroscopy-' + this.index
      };
    },
    computed: {
      targetNames: function() {
        return _.map(this.targets, 'name');
      }
    },
    methods: {
      copyFlux: function(idx) {
        this.spectroscopy.flux.push(_.cloneDeep(this.spectroscopy.flux[idx]));
        this.spectroscopy.flux_error.push(_.cloneDeep(this.spectroscopy.flux_error[idx]));
        this.spectroscopy.wavelength.push(_.cloneDeep(this.spectroscopy.wavelength[idx]));
        this.update();
      },
      removeFlux: function(idx) {
        this.spectroscopy.flux.splice(idx, 1);
        this.spectroscopy.flux_error.splice(idx, 1);
        this.spectroscopy.wavelength.splice(idx, 1);
        this.update();
      },
      getArrayErrors: function(section, idx) {
        return _.get(this.errors, [section, idx], {});
      }
    }
  };
  </script>
    