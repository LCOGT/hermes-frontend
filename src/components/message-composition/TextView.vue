<template>
    <div>
        <pre>
{{ message.title }}

{{ message.authors }}

{{  message.message_text }}
        </pre>
    </div>
</template>
<script>
export default {
    name: 'TextView',
    props: {
        message: {
            type: Object,
            required: true
        }
    },
    computed: {
        dataAsEncodedStr: function () {
            return 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.message));
        }
    }
};
</script>

<style scoped>
pre {
  overflow-x: auto;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
</style>
