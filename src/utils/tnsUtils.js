import { useStateStore } from '@/stores/state';
import _ from 'lodash';

export function useTnsUtils() {
  const stateStore = useStateStore();

  function getTnsValuesList(category, addNull=false) {
      let tnsOptions = stateStore.tns_options;
      let outputArray = []
      if (category == 'groups' && stateStore.isHermesBot){
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
  }

  return { getTnsValuesList };
}
