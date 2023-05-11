<template>
    <div>
      <b-button :href="dataAsEncodedStr" :download="downloadFilename" v-bind="extraDownloadButtonAttrs">
        <slot name="download-button-content"> <i class="fa fa-download" /> {{ downloadText }} </slot>
      </b-button>
      <pre>{{ getData }}</pre>
    </div>
  </template>
  <script>
  export default {
    name: 'DataView',
    props: {
      data: {
        type: [ Object , String ],
        required: true
      },
      extraDownloadButtonAttrs: {
        type: Object,
        default: () => {
          return {};
        }
      },
      downloadText: {
        type: String,
        default: 'Download as JSON'
      },
      downloadFilename: {
        type: String,
        default: 'apiview.json'
      }
    },
    computed: {
      getData() {
        if (typeof this.data == Object){
            return JSON.stringify(this.data, null, 4);
        }
        else{
            return this.data;
        }

      },
      dataAsEncodedStr() {
        if (typeof this.data == Object){
            return 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.data));
        }
        else {
            return 'data:test/plain;charset=utf-8,' + encodeURIComponent(this.data);
        }
      }
    }
  };
  </script>
  