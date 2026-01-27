import _ from 'lodash';

export function useSchemaDataUtils(emit) {
  function remove() {
    emit('remove');
  }
  
  function copy() {
    emit('copy');
  }
  
  function update() {
    emit('message-updated');
  }

  function getErrors(errors, key, default_value) {
    return _.get(errors, key, default_value);
  }

  return { remove, copy, update, getErrors };
}
