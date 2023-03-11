<template>
  <b-container class="p-0" :id="id">
    <ocs-custom-alert v-for="error in errors" :key="error" alert-class="danger" :dismissible="false">
      {{ error }}
    </ocs-custom-alert>
    <b-form-row v-if="data.length == 0" class="text-center">
      <b-col>
        <b-button size="lg" class="mx-1" variant="secondary" @click="addNewRow">
          Add {{ datatype }}
        </b-button>
      </b-col>
    </b-form-row>
    <slot />
  </b-container>
</template>
<script>

export default {
  name: 'DataList',
  props: {
    id: {
      type: String,
      required: true
    },
    errors: {
      type: Object,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    datatype: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      show: true,
    }
  },
  methods: {
    addNewRow: function() {
      this.$emit('new-row');
    }
  }
};
</script>
