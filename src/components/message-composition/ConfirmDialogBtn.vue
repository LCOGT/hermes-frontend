<script setup>
import { ref, useAttrs, computed } from 'vue';

const props = defineProps({
  btnTooltip: {
    type: String,
    required: true
  },
  btnIcon: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    required: true
  },
  confirmAction: {
    type: String,
    required: true
  }
})

defineOptions({
  inheritAttrs: false
});

const attrs = useAttrs();

const emit = defineEmits(['confirmed']);

const dialog = ref(false);

const filteredAttrs = computed(() => ({
  variant: attrs.variant,
  density: attrs.density,
  rounded: attrs.rounded,
  class: attrs.class
}));

function confirm() {
  // emit here if confirmed
  dialog.value = false;
  emit('confirmed')
}
</script>
<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ props: activatorProps }">
      <!-- This button opens the dialog -->
      <v-btn :icon="props.btnIcon" v-tooltip="props.btnTooltip" v-bind="{...activatorProps, ...filteredAttrs}">
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">Are you sure?</v-card-title>
      <v-card-text>{{ props.confirmText }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- Button to cancel the action and close the dialog -->
        <v-btn color="grey" text @click="dialog = false">Cancel</v-btn>
        <!-- Button to confirm the action and close the dialog -->
        <v-btn color="red" text @click="confirm">{{ props.confirmAction }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>