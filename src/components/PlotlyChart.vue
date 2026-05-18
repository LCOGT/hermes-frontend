<script setup>
import { ref, onMounted, watch } from 'vue';
import Plotly from 'plotly.js-dist'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  layout: {
    type: Object,
    required: true,
  }
})

const plotElementDiv = ref(null);

onMounted(() => {
  Plotly.newPlot(plotElementDiv.value, props.data, props.layout);
})

watch([() => props.data, () => props.layout], () => {
  Plotly.react(plotElementDiv.value, props.data, props.layout);
}, { deep: true })

</script>
<template>
  <div ref="plotElementDiv"></div>
</template>
