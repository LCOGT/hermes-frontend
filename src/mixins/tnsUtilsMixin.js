import _ from 'lodash';
import { mapGetters } from "vuex";

export var tnsUtilsMixin = {
  computed: {
    ...mapGetters(["getTnsOptions"]),
  },
  methods: {
    getTnsValuesList: function(category, addNull = false) {
      let tnsOptions = this.getTnsOptions;
      let outputArray = []
      if (addNull) {
          outputArray.push({value: null, text: ''})
      }
      if (_.isArray(tnsOptions[category])) {
          return outputArray.concat(tnsOptions[category].sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'})));
      }
      else {
          return outputArray.concat(_.values(tnsOptions[category]).sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'})));
      }
    }
  }
};
