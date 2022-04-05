<template>
  <div class="myform"  width="100%">
    <json-forms
        v-bind:data="data"
        v-bind:renderers="renderers"
        v-bind:schema="schema"
        v-bind:uischema="uischema"
        @change="onChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { JsonForms, JsonFormsChangeEvent } from "@jsonforms/vue2";
import { vuetifyRenderers } from '@jsonforms/vue2-vuetify';


// mergeStyles combines all classes from both styles definitions
import {defaultStyles, mergeStyles} from "@jsonforms/vue2-vanilla";

const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });
const renderers = [
  ...vuetifyRenderers,
  // here you can add custom renderers
];
const schema = {
  properties: {
    title: {
      type: "string",
      minLength: 1,
      title: "Title",
      description: "Title of the message"
    },
    authors: {
      title: "Authors",
      type: "string"
    },
    ra: {
      type: "string",
      title: "Right Ascension"
    },
    dec: {
      type: "string",
      title: "Declination"
    },
    discoveryDate: {
      type: "string",
      title: "Date/Time of Discovery",
      format: "date-time",
    },
    telescope: {
      type: "string",
    },
    instrument: {
      type: "string",
    },
    band: {
      type: "string"
    },
    brightness: {
      type: "number"
    },
    brightnessError: {
      type: "number"
    },
    message: {
      type: "string"
    }
  }
};

const uischema = {
  "type": "VerticalLayout",
  "elements": [
    {
      "type": "Control",
      "label": "Title",
      "scope": "#/properties/title"
    },
    {
      "type": "Control",
      "label": "Authors",
      "scope": "#/properties/authors"
    },
    {
      "type": "HorizontalLayout",
      "elements":
          [{
            "type": "Control",
            "label": "RA",
            "scope": "#/properties/ra"
          },
            {
              "type": "Control",
              "label": "Dec",
              "scope": "#/properties/dec"
            }]
    },
    {
      "type": "HorizontalLayout",
      "elements": [                    {
        "type": "Control",
        "label": "Discovery Date",
        "scope": "#/properties/discoveryDate"
      },
        {
          "type": "Control",
          "label": "Telescope",
          "scope": "#/properties/telescope"
        },
        {
          "type": "Control",
          "label": "Instrument",
          "scope": "#/properties/instrument"
        }]
    },
    { "type": "HorizontalLayout",
      "elements": [                    {
        "type": "Control",
        "label": "Band",
        "scope": "#/properties/band"
      },
        {
          "type": "Control",
          "label": "Brightness",
          "scope": "#/properties/brightness"
        },
        {
          "type": "Control",
          "label": "Brightness Error",
          "scope": "#/properties/brightnessError"
        }]},
    {
      "type": "Control",
      "label": "Message",
      "scope": "#/properties/message"
    }
  ]
}

export default defineComponent({
  name: "SubmitCandidates",
  components: {
    JsonForms
  },
  data() {
    return {
    // freeze renderers for performance gains
    renderers: Object.freeze(renderers),
    data: {
      title: "Message Title",
    },
    schema,
    uischema
  };
},
  methods: {
  onChange(event: JsonFormsChangeEvent) {
    this.data = event.data;
  }
},
provide() {
  return {
    styles: myStyles
  };
}
});

</script>

<style scoped>

</style>