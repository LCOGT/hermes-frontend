<template>
  <b-container class="p-0" :id="'data-' + section">
    <div class="accordion" role="tablist">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-0" role="tab">
          <b-button-group class="w-100">
            <b-button block v-b-toggle:[tabName] :variant="getVariant" @click="addNewRowIfEmpty">
              <b-row>
                <b-col class="text-left error-icon">
                  <b-icon v-if="!isEmpty && hasErrors" icon="exclamation-circle-fill" variant="danger"
                    :title="getErrorTooltipString()"></b-icon>
                </b-col>
                <b-col v-if="isEmpty" class="text-center" :style="textStyle">
                  Add {{ datatype }}
                </b-col>
                <b-col v-else class="text-center" :style="textStyle">
                  {{ capitalSection }}
                </b-col>
              </b-row>
            </b-button>
            <span v-if="allowLoading" class="text-right">
              <b-button class="br-0" title="Copy Headers" @click="copyHeaders()">
                <b-icon icon="clipboard" aria-hidden="true"></b-icon>
              </b-button>
            </span>
            <span v-if="allowLoading" class="text-right">
              <b-button class="br-0" title="Load CSV File" @click="pickCsv()">
                <b-icon icon="upload" aria-hidden="true"></b-icon>
                <input @change="loadCsv" type="file" :ref="section + 'File'" accept=".csv" hidden/>
              </b-button>
            </span>
            <span v-if="sectionShowSimple" class="text-right">
              <b-button class="br-0" title="Advanced UI" :disabled="onlySimple" @click="toggleSectionShowSimple()">
                <b-icon icon="diagram3" aria-hidden="true"></b-icon>
              </b-button>
            </span>
            <span v-if="!sectionShowSimple && !onlySimple" class="text-right">
              <b-button class="br-0" title="Simple UI" @click="toggleSectionShowSimple()">
                <b-icon icon="card-list" aria-hidden="true"></b-icon>
              </b-button>
            </span>
          </b-button-group>
        </b-card-header>
        <b-collapse :id="tabName" v-model="visible" :accordion="'accordion-' + tabName" role="tabpanel">
          <b-card-body>
              <slot />
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </b-container>
</template>
<script>
import _ from 'lodash';
import '@/assets/css/submissions.css';

export default {
  name: 'DataSection',
  props: {
    errors: {
      required: true
    },
    datatype: {
      type: String,
      required: true
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    onlySimple: {
      type: Boolean,
      default: false
    },
    allowLoading: {
      type: Boolean,
      default: false
    },
    section: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      show: true,
      visible: false,
      id: this.section,
      tabName: this.section.toLowerCase() + '-tab',
      capitalSection: _.capitalize(this.section),
      fileInput: null,
      sectionShowSimple: true
    }
  },
  watch: {
    fileInput(newTable) {
      // emit event to parse csv when file is loaded
      this.$emit('parse-csv', this.section, newTable);
    }
  },
  computed: {
    hasErrors: function() {
      return !_.isEmpty(this.errors);
    },
    textStyle: function() {
      if (this.allowLoading) {
        return '';
      }
      else {
        return 'margin-right: 92px !important;';
      }
    },
    getVariant: function () {
      if (this.isEmpty) {
        return 'empty';
      }
      else{
        if (this.hasErrors) {
          return 'errors';
        }
        return 'valid';
      }
    }
  },
  methods: {
    forceVisibility: function(shouldShow) {
      this.visible = shouldShow;
    },
    addNewRowIfEmpty: function() {
      if (this.isEmpty) {
        this.$emit('new-row');
      }
    },
    getErrorTooltipString: function() {
      if (_.isEmpty(this.errors)){
        return null;
      }
      let errorStr = 'Field Errors:\n';
      if (_.isArray(this.errors)){
        for (var i = 0; i < this.errors.length; i += 1) {
          if (!_.isEmpty(this.errors[i])) {
            _.forEach(this.errors[i], function(value, key) {
              errorStr += i + ': ' + key + '\n';
            });
          }
        }
      }
      return errorStr;
    },
    toggleSectionShowSimple: function() {
      this.$emit('toggle-section-show-simple', this.section);
    },
    copyHeaders: function() {
      this.$emit('copy-headers', this.section);
    },
    pickCsv: function() {
      _.get(this.$refs, this.section + 'File').click();
    },
    loadCsv: function(event) {
      // Upload CSV from file and return text
      let files = event.target.files || event.dataTransfer.files;
      if (!files.length)
        return;
      let reader = new FileReader();
      reader.onload = () => {
        this.fileInput = reader.result;
      }
      reader.readAsText(files[0]);
    }
  }
};
</script>
  