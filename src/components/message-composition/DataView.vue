<script setup>
import { computed } from 'vue';
import DataExtra from './DataExtra.vue';

const props = defineProps({
  data: {
    type: [ Object , String ],
    required: true
  },
  downloadText: {
    type: String,
    default: 'Download as JSON'
  },
  downloadFilename: {
    type: String,
    default: 'apiview.json'
  }
})

const getData = computed(() => {
  if (typeof props.data == Object){
      return JSON.stringify(props.data, null, 4);
  }
  else{
      return props.data;
  }
})

const dataAsEncodedStr = computed(() => {
  if (typeof props.data === 'object'){
      return 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(props.data));
  }
  else {
      return 'data:text/plain;charset=utf-8,' + encodeURIComponent(props.data);
  }
})

function download() {
  const link = document.createElement('a');
  link.href = dataAsEncodedStr.value;
  link.download = props.downloadFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

</script>
<template>
  <div>
    <v-btn class="float-right" color="primary" @click="download">{{ props.downloadText }}
    </v-btn>
    <pre>{{ getData }}</pre>
  </div>
</template>