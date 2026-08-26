<script setup>
import { computed } from 'vue';
import { useDoiCartStore } from '@/stores/doiCart';

const emit = defineEmits(['open-mint-dialog']);

const cart = useDoiCartStore();

const sizeLabel = computed(() => {
  const mb = cart.totalSizeBytes / (1024 * 1024);
  return mb < 0.1 ? '< 0.1 MB' : `${mb.toFixed(1)} MB`;
});

const warningText = computed(() => {
  if (cart.exceedsItemLimit) {
    return `Package exceeds the ${cart.limits.maxItems}-message limit.`;
  }
  if (cart.exceedsSizeLimit) {
    const maxMb = (cart.limits.maxTotalSizeBytes / (1024 * 1024)).toFixed(0);
    return `Package exceeds the ${maxMb} MB size limit.`;
  }
  return null;
});
</script>

<template>
  <v-card v-if="!cart.isEmpty" class="doi-cart-bar mb-2" :color="warningText ? 'error' : 'secondary'" variant="tonal">
    <v-card-text class="d-flex align-center justify-space-between flex-wrap ga-2">
      <div>
        <v-icon icon="mdi-package-variant-closed" class="mr-2"></v-icon>
        <span>
          <b>{{ cart.count }}</b> message{{ cart.count === 1 ? '' : 's' }} in DOI package
          <span class="text-medium-emphasis">({{ sizeLabel }})</span>
        </span>
        <div v-if="warningText" class="text-caption mt-1">
          <v-icon icon="mdi-alert" size="small" class="mr-1"></v-icon>{{ warningText }}
        </div>
      </div>
      <div>
        <v-btn variant="text" size="small" class="mr-2" @click="cart.clear()">
          Clear
        </v-btn>
        <v-btn color="primary" variant="flat" :disabled="!cart.isValidForMinting" @click="emit('open-mint-dialog')">
          Mint DOI for Package
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.doi-cart-bar {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>