<template>
  <b-container class="p-0" :id="'data-reference-' + index">
    <b-form-row>
      <b-col md="1" class="text-center data-label-text">
        <b>{{ index }}</b>
      </b-col>
      <b-col md="3">
        <ocs-custom-field v-model="reference.source" field="source" label="Source:" :hide=false
          :errors="errors.source" @input="update" />
      </b-col>
      <b-col md="3">
        <ocs-custom-field v-model="reference.citation" field="citation" label="Citation:" :hide=false
          :errors="errors.citation" @input="update" />
      </b-col>
      <b-col md="4">
        <ocs-custom-field v-model="reference.url" field="url" label="Url:" :hide=false :errors="errors.url"
          @input="update" />
      </b-col>
      <b-col md="1" class="text-right">
        <b-button-toolbar>
          <b-button-group class="mr-1">
            <b-button title="Copy this Reference" @click="copy">
              <b-icon icon="file-earmark-plus" aria-hidden="true"></b-icon>
            </b-button>
            <b-button title="Remove this Reference" @click="confirm('Are you sure you want to remove this Reference?', remove)">
              <b-icon icon="trash" aria-hidden="true"></b-icon>
            </b-button>
          </b-button-group>
        </b-button-toolbar>
      </b-col>
    </b-form-row>
  </b-container>
</template>
<script>
import { OCSMixin } from 'ocs-component-lib';
import '@/assets/css/submissions.css';
import {schemaDataMixin} from '@/mixins/schemaDataMixin.js';

export default {
  name: 'DataReference',
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
    reference: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      id: 'reference-' + this.index
    }
  }
};
</script>
  