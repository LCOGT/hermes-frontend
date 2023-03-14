<template>
  <b-container class="p-0" :id="'data-' + section">
    <div class="accordion" role="tablist">
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-0" role="tab">
          <b-button-group class="w-100">
            <b-button block v-b-toggle:[tabName] variant="light">
              <b-row>
                <b-col class="text-left error-icon">
                  <b-icon v-if="hasErrors" icon="exclamation-circle-fill" variant="danger"
                    :title="getErrorTooltipString()"></b-icon>
                </b-col>
                <b-col class="text-center">
                  {{ capitalSection }}
                </b-col>
              </b-row>
            </b-button>
            <span v-if="sectionShowSimple" class="text-right">
              <b-button title="Advanced UI" :disabled="onlySimple" @click="toggleSectionShowSimple()">
                <b-icon icon="diagram3" aria-hidden="true"></b-icon>
              </b-button>
            </span>
            <span v-if="!sectionShowSimple && !onlySimple" class="text-right">
              <b-button title="Simple UI" @click="toggleSectionShowSimple()">
                <b-icon icon="card-list" aria-hidden="true"></b-icon>
              </b-button>
            </span>
          </b-button-group>
        </b-card-header>
        <b-collapse :id="tabName" :accordion="'accordion-' + tabName" role="tabpanel">
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
    onlySimple: {
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
      id: this.section,
      tabName: this.section.toLowerCase() + '-tab',
      capitalSection: _.capitalize(this.section),
      sectionShowSimple: true
    }
  },
  computed: {
    hasErrors: function() {
      return !_.isEmpty(this.errors);
    }
  },
  methods: {
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
    }
  }
};
</script>
  