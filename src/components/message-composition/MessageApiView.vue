<template>
    <div>
        <div class="button-holder">
        <b-button-group>
        <b-button class="mr-3" :href="dataAsEncodedStr" :download="downloadFilename" v-bind="extraDownloadButtonAttrs">
            <b-icon icon="pencil-square" aria-hidden="true"></b-icon>
        </b-button>
        <b-button :href="dataAsEncodedStr" :download="downloadFilename" v-bind="extraDownloadButtonAttrs">
                <b-icon icon="download" aria-hidden="true"></b-icon>
        </b-button>
        </b-button-group>
        </div>
        <pre>{{ JSON.stringify(messageData, null, 4) }}</pre>

    </div>
</template>
<script>
export default {
    name: 'MessageApiView',
    props: {
        messageData: {
            type: Object,
            required: true
        },
        extraDownloadButtonAttrs: {
            type: Object,
            default: () => {
                return {};
            }
        },
        downloadFilename: {
            type: String,
            default: 'hermes-apiview.json'
        }
    },
    computed: {
        dataAsEncodedStr: function () {
            return 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.messageData));
        }
    }
};
</script>
 
<style scoped>
.button-holder {
  position: absolute;
  right: 5em;
  top: 1em;
}
</style>