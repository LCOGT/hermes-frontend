<template>
  <b-container class="p-0" :id="id">
    <slot />
  </b-container>
</template>
<script>
export default {
  name: 'ShowWrapper',
  props: {
      id: {
        type: String,
        required: true
      }
  },
  data: function() {
    return {
      show: true,
    }
  }
};
</script>
