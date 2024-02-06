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
        <div>
          <b-tabs pills card content-class='mt-4' justified active-nav-item-class="bg-secondary">
            <b-tab title="File Input" class="no-padding">
              <p class="text-danger">
                Upload one or more spectrum files to associate with your message.
                These files will be stored in the Scimma Archive and will be publicly accessible and linked from the message.
                They should follow commonly used spectrum data formats.
              </p>
              <files-with-descriptions
                :id="id + '-files'"
                :errors="getErrors('files', [])"
                :multiple=false
                v-bind:files.sync="spectroscopy.files"
                v-bind:fileDescriptions.sync="spectroscopy.file_descriptions"
                @message-updated="update"
              >
              </files-with-descriptions>
            </b-tab>
            <b-tab title="Raw Data" class="no-padding" @click="switchToRaw">
              <ocs-custom-alert v-if="getErrors('flux', []).length > 0 && this.spectroscopy.flux.length == 0" :key="fluxError" alert-class="danger" :dismissible="false">
                <span v-html="getErrors('flux', [])[0]"></span>
              </ocs-custom-alert>
              <show-wrapper :id="id + '-raw-data-fields'">
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
                        <b-button :disabled="spectroscopy.flux.length == 0" title="Remove this Flux value" @click="removeFlux(idx)">
                          <b-icon icon="trash" aria-hidden="true"></b-icon>
                        </b-button>
                      </b-button-group>
                    </b-button-toolbar>
                  </b-col>
                </b-form-row>
              </show-wrapper>
            </b-tab>
          </b-tabs>
        </div>
        <b-form-row class="mt-4">
          <b-col md="4">
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
          <b-col md="4">
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
          <b-col md="4">
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
          <b-col md="4">
            <ocs-custom-field v-model="spectroscopy.telescope" field="telescope" label="Telescope:" :hide=false
              :errors="errors.telescope" @input="update" />
          </b-col>
          <b-col md="4">
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
  import '@/assets/css/view.css';
  import {schemaDataMixin} from '@/mixins/schemaDataMixin.js';
  import FilesWithDescriptions from '@/components/message-composition/FilesWithDescriptions.vue'
  import ShowWrapper from '@/components/message-composition/ShowWrapper.vue'

  export default {
    name: 'DataSpectroscopy',
    components: {
      ShowWrapper,
      FilesWithDescriptions
    },
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
      },
      isTns: {
        type: Boolean,
        default: false
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
        header: {},
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
    watch: {
      "spectroscopy.files": function(files) {
        if (files.length > 0) {
          files[0].arrayBuffer().then( (value) => {
            this.header = this.getHeader(value);
            this.fillInFromHeader(this.header);
          }, (reason) => {
            console.log(reason);
          })
        }
        else {
          this.header = {};
        }
      }
    },
    methods: {
      getHeader: function(fileData) {
        var header = {};
        var headerPos = 0;
        // This fits header parsing code is adapted from www.clearskyinstitute.com/fits/ fits viewer javascript code
        try {
          for (headerPos = 0; headerPos < fileData.byteLength; headerPos += 80) {
            var line = String.fromCharCode.apply(null, new Uint8Array(fileData, headerPos, 80));
            if (line.match(/^END */)) {
              headerPos += 80;
              break;
            }

            if (line.indexOf("=") < 0) {
              // Skip COMMENT/HISTORY
              continue;
            }
            // Key is first 8 characters of line
            var key = line.substring(0, 8);
            // Remove trailing blanks from key
            key = key.replace(/ *$/, "");

            // Value starts in line 11
            var value = line.substring(10);
            value = value.replace(/^ */, "");  // remove leading breaks
            value = value.replace(/\/.*$/, "");  // remove comments
            value = value.replace(/ *$/, "");  // remove trailing blanks
            if (value.indexOf("'") >= 0) {
              value = value.substring(1, value.length-2);  // treat value is a string
              value = value.trim();
            }
            else if (value.indexOf("T") >= 0) {
              value = true;  // treat value as a boolean True
            }
            else if (value.indexOf("F") >= 0) {
              value = false;  // treat value as a boolean False
            }
            else if (value.indexOf(".") >= 0) {
              value = parseFloat(value);  // treat value as a float
            }
            else {
              value = parseInt(value);  // treat value as an int
            }
            header[key] = value;
          }
          console.log(header);
        } catch(e) {
          console.log("File does not have standard .fits format");
        }
        return header;
      },
      fillInFieldFromHeader: function(header, headerKeys, fieldName){
        headerKeys.forEach((headerKey) => {
          if (headerKey in header) {
            this.spectroscopy[fieldName] = header[headerKey];
            return;
          }
        });
      },
      fillInFromHeader: function(header) {
        if (header === {}) {
          return;
        }
        // Attempt to fill in the obs date
        this.fillInFieldFromHeader(header, ['DATE-OBS', 'MJD-OBS'], 'date_obs');
        // Attempt to fill in the exposure time
        this.fillInFieldFromHeader(header, ['EXPTIME'], 'exposure_time');
        // Attempt to fill in the observer
        this.fillInFieldFromHeader(header, ['USERID'], 'observer');
        // Attempt to fill in the instrument field
        this.fillInFieldFromHeader(header, ['INSTRUME'], 'instrument');
        // Attempt to fill in the telescope field
        this.fillInFieldFromHeader(header, ['TELESCOP', 'SITE', 'ORIGIN'], 'telescope');
        this.update();
      },
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
      },
      switchToRaw: function() {
        if (this.spectroscopy.flux.length == 0){
          this.spectroscopy.flux.push(null);
          this.spectroscopy.flux_error.push(0);
          this.spectroscopy.wavelength.push(null);
          this.update();
        }
      }
    }
  };
  </script>
    