<template>
    <b-container class="p-0" :id="'data-target-' + index">
      <b-card header-tag="header">
        <template #header>
          <b-form-row>
            <b-col md="2" class=" text-center data-label-text">
              <b>Target {{ index }}</b>
            </b-col>
            <b-col md="3">
              <ocs-custom-field v-model="target.name" field="name" label="Name:" :hide=false
                :errors="errors.name" @input="update" />
            </b-col>
            <b-col md="3">
              <ocs-custom-select
                  v-model="type"
                  field="type"
                  label="Type:"
                  :hide=false
                  :options="typeOptions"
                  @change="onTypeChange"
              />
            </b-col>
            <b-col md="2" offset-md="2">
              <b-button-toolbar>
                <b-button-group class="mr-1">
                  <b-button title="Advanced Target Fields" v-b-toggle="'advanced-target-collapse-' + index" @click="toggleCollapse">
                    <span v-if="advancedOptionsCollapsed">
                      <b-icon icon="arrows-expand" aria-hidden="true"></b-icon>
                    </span>
                    <span v-if="!advancedOptionsCollapsed">
                      <b-icon icon="arrows-collapse" aria-hidden="true"></b-icon>
                    </span>
                  </b-button>
                  <b-button title="Copy this Target" @click="copy">
                    <b-icon icon="file-earmark-plus" aria-hidden="true"></b-icon>
                  </b-button>
                  <b-button title="Remove this Target" @click="confirm('Are you sure you want to remove this Target?', remove)">
                    <b-icon icon="trash" aria-hidden="true"></b-icon>
                  </b-button>
                </b-button-group>
              </b-button-toolbar>
            </b-col>
          </b-form-row>
        </template>
        <span v-show="type === 'Sidereal'" class="sidereal">
          <b-form-row>
            <b-col md="3">
              <ocs-sexagesimal-custom-field
                v-model="target.ra"
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
              <ocs-custom-field v-model="target.ra_error" field="ra_error" label="Error:" :hide=false
                :errors="errors.ra_error" @input="update" >
                <b-input-group-append slot="inline-input">
                  <b-form-select
                    :id="'ra-error-units-select-' + this.index"
                    v-model="target.ra_error_units"
                    :options="errorUnits"
                    @input="update"
                  />
                </b-input-group-append>
              </ocs-custom-field>
            </b-col>
            <b-col md="3">
              <ocs-sexagesimal-custom-field
                v-model="target.dec"
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
              <ocs-custom-field v-model="target.dec_error" field="dec_error" label="Error:" :hide=false
                :errors="errors.dec_error" @input="update" >
                <b-input-group-append slot="inline-input">
                  <b-form-select
                    :id="'dec-error-units-select-' + this.index"
                    v-model="target.dec_error_units"
                    :options="errorUnits"
                    @input="update"
                  />
                </b-input-group-append>
              </ocs-custom-field>
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col md="3">
              <ocs-custom-field v-model="target.pm_ra" field="pm_ra" label="Proper Motion RA:" :hide=false
                :errors="errors.pm_ra" @input="update" />
            </b-col>
            <b-col md="3">
              <ocs-custom-field v-model="target.pm_dec" field="pm_dec" label="Proper Motion Dec:" :hide=false
                :errors="errors.pm_dec" @input="update" />
            </b-col>
            <b-col md="3">
              <ocs-custom-field v-model="target.epoch" field="epoch" label="Epoch:" :hide=false
                :errors="errors.pm_ra" @input="update" />
            </b-col>
            <b-col md="2" offset-md="1" align-self="center">
              <b-form-checkbox
                :id="'target-new-discovery-' + index"
                v-model="target.new_discovery"
                name="new_discovery"
                switch
                @input="update"
              >
                New Discovery
              </b-form-checkbox>
            </b-col>
          </b-form-row>
        </span>
        <span v-show="type === 'Non-Sidereal'" class="non-sidereal">
          <ocs-custom-alert v-for="error in getErrors('orbital_elements.non_field_errors', [])" :key="error" alert-class="danger" :dismissible="false">
            {{ error }}
          </ocs-custom-alert>
          <b-form-row>
            <b-col md="4">
              <ocs-custom-field v-model="target.orbital_elements.epoch_of_elements" field="epoch_of_elements" label="Epoch of Elements:" :hide=false
                :errors="getErrors('orbital_elements.epoch_of_elements', {})" @input="update" />
            </b-col>
            <b-col md="4">
              <ocs-custom-field v-model="target.orbital_elements.orbital_inclination" field="orbital_inclination" label="Orbital Inclination:" :hide=false
                :errors="getErrors('orbital_elements.orbital_inclination', {})" @input="update" />
            </b-col>
            <b-col md="4">
              <ocs-custom-field v-model="target.orbital_elements.longitude_of_the_ascending_node" field="longitude_of_the_ascending_node" label="Longitude of Ascending Node:" :hide=false
                :errors="getErrors('orbital_elements.longitude_of_the_ascending_node', {})" @input="update" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col md="4">
              <ocs-custom-field v-model="target.orbital_elements.argument_of_the_perihelion" field="argument_of_the_perihelion" label="Argument of Perihelion:" :hide=false
                :errors="getErrors('orbital_elements.argument_of_the_perihelion', {})" @input="update" />
            </b-col>
            <b-col md="4">
              <ocs-custom-field v-model="target.orbital_elements.eccentricity" field="eccentricity" label="Eccentricity:" :hide=false
                :errors="getErrors('orbital_elements.eccentricity', {})" @input="update" />
            </b-col>
            <b-col md="4">
              <ocs-custom-field v-model="target.orbital_elements.semimajor_axis" field="semimajor_axis" label="SemiMajor Axis:" :hide=false
                :errors="getErrors('orbital_elements.semimajor_axis', {})" @input="update" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col md="4">
              <ocs-custom-field v-model="target.orbital_elements.mean_anomaly" field="mean_anomaly" label="Mean Anomaly:" :hide=false
                :errors="getErrors('orbital_elements.mean_anomaly', {})" @input="update" />
            </b-col>
            <b-col md="4">
              <ocs-custom-field v-model="target.orbital_elements.perihelion_distance" field="perihelion_distance" label="Perihelion Distance:" :hide=false
                :errors="getErrors('orbital_elements.perihelion_distance', {})" @input="update" />
            </b-col>
            <b-col md="4">
              <ocs-custom-field v-model="target.orbital_elements.epoch_of_perihelion" field="epoch_of_perihelion" label="Epoch of Perihelion:" :hide=false
                :errors="getErrors('orbital_elements.epoch_of_perihelion', {})" @input="update" />
            </b-col>
          </b-form-row>
        </span>
        <b-collapse :id="'advanced-target-collapse-' + index">
          <b-form-row>
            <b-col md="3">
              <ocs-custom-field v-model="target.redshift" field="redshift" label="Redshift:" :hide=false
                :errors="errors.redshift" @input="update" />
            </b-col>
            <b-col md="3">
              <ocs-custom-field v-model="target.host_name" field="host_name" label="Host:" :hide=false
                :errors="errors.host_name" @input="update" />
            </b-col>
            <b-col md="3">
              <ocs-custom-field v-model="target.host_redshift" field="host_redshift" label="Host Redshift:" :hide=false
                :errors="errors.host_redshift" @input="update" />
            </b-col>
            <b-col md="3">
              <ocs-custom-field v-model="target.group_associations" field="group_associations" label="Group Association:" :hide=false
                :errors="errors.group_associations" @input="update" />
            </b-col>
          </b-form-row>
          <b-form-row class="mb-3">
            <b-col md="3">
              <ocs-custom-field v-model="target.distance" field="distance" label="Distance:" :hide=false
                :errors="errors.distance" @input="update" >
                <b-input-group-append slot="inline-input">
                  <b-form-select
                    :id="'distance-units-select-' + this.index"
                    v-model="target.distance_units"
                    :options="distanceUnits"
                    @input="update"
                  />
                </b-input-group-append>
              </ocs-custom-field>
            </b-col>
            <b-col md="3">
              <ocs-custom-field v-model="target.distance_error" field="distance_error" label="Error:" :hide=false
                :errors="errors.distance_error" @input="update" />
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col md="12">
              <ocs-custom-field v-model="target.aliases" field="aliases" label="Aliases:" desc="Comma separated list of aliases for this Target" :hide=false
                :errors="errors.aliases" @input="update" />
            </b-col>
          </b-form-row>
          <discovery-info :data="target.discovery_info" :errors="getErrors('discovery_info', {})" :index="index" @message-updated="update">
          </discovery-info>
        </b-collapse>
      </b-card>
    </b-container>
  </template>
  <script>
  import _ from 'lodash';
  import { OCSMixin } from 'ocs-component-lib';
  import DiscoveryInfo from '@/components/message-composition/DiscoveryInfo.vue'
  import {schemaDataMixin} from '@/mixins/schemaDataMixin.js';

  export default {
    name: 'DataTarget',
    components: {
      DiscoveryInfo
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
      target: {
        type: Object,
        required: true
      }
    },
    data: function() {
      return {
        type: 'Sidereal',
        typeOptions: ['Sidereal', 'Non-Sidereal'],
        errorUnits: ['marcsec', 'arcsec', 'arcmin', 'degrees'],
        distanceUnits: ['cm', 'm', 'km', 'pc', 'kpc', 'Mpc', 'Gpc', 'ly', 'au'],
        advancedOptionsCollapsed: true,
        show: true,
        id: 'target-' + this.index
      };
    },
    created() {
      this.type = this.getDefaultType;
    },
    computed: {
      getDefaultType: function() {
        if (_.isEmpty(_.omitBy(this.target.orbital_elements, field => field === null || (_.isEmpty(field) && !_.isBoolean(field))))) {
          return 'Sidereal';
        }
        else{
          return 'Non-Sidereal';
        }
      },
      getErrorAlignment: function () {
        if (!_.isEmpty(this.target.ra) || !_.isEmpty(this.target.dec)){
          return "center";
        }
        else{
          return "baseline";
        }
      }
    },
    methods: {
      onTypeChange: function() {
        if (this.type === 'Sidereal') {
          this.target.orbital_elements = {
            'epoch_of_elements': null,
            'orbinc': null,
            'longascnode': null,
            'argofperih': null,
            'eccentricity': null,
            'meandist': null,
            'meananom': null,
            'perihdist': null,
            'epochofperih': null
          }
        }
        else {
          this.target.ra = null;
          this.target.ra_error = null;
          this.target.pm_ra = null;
          this.target.dec = null;
          this.target.dec_error = null;
          this.target.pm_dec = null;
        }
        this.update();
      }
    }
  };
  </script>
    