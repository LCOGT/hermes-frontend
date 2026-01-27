<script setup>
import { ref, onMounted} from 'vue';
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
  renderChart();
})

function renderChart() {
  Plotly.newPlot(plotElementDiv.value, this.data, this.layout);
}

</script>
<template>
  <div ref="plotElementDiv"></div>
</template>
