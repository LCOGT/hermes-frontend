import _ from 'lodash';
import { mapGetters } from "vuex";

export var tnsUtilsMixin = {
  computed: {
    ...mapGetters(["getTnsOptions", "getProfile"]),
  },
  methods: {
    getTnsValuesList: function(category, addNull = false) {
      let tnsOptions = this.getTnsOptions;
      let outputArray = []
      if (category == 'groups' && this.isHermesBot()){
        return ['Hermes_group'];
      }
      if (addNull) {
          outputArray.push({value: null, text: ''})
      }
      if (_.isArray(tnsOptions[category])) {
          return outputArray.concat(tnsOptions[category].sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'})));
      }
      else {
          return outputArray.concat(_.values(tnsOptions[category]).sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'})));
      }
    },
    isHermesBot: function() {
      if (this.getProfile.tns_bot_name){
        return false;
      }
      return true;
    },
  }
};
