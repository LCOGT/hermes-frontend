import _ from 'lodash';

export var schemaDataMixin = {
  methods: {
    remove: function () {
      this.$emit('remove');
    },
    copy: function () {
      this.$emit('copy');
    },
    update: function () {
      this.$emit('message-updated');
    },
    toggleCollapse: function () {
      this.advancedOptionsCollapsed = !this.advancedOptionsCollapsed;
    },
    getErrors: function (key, default_value) {
      return _.get(this.errors, key, default_value);
    }
  }
};
