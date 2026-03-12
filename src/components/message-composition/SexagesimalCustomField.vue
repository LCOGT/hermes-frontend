<script setup>
import { ref } from 'vue'
import { useCoordinateUtils } from '@/utils/coordinateUtils';

const props = defineProps({
    coordinate: {
      type: String,
      required: true,
      validator: value => {
        return ['ra', 'dec'].indexOf(value) > -1;
      }
    },
    label: {
      type: String,
      required: true
    },
    variant: {
      type: String,
      default: 'outlined'
    },
    description: {
      type: String,
      default: ''
    },
    errors: {
      validator: function(value) {
        return value === null || typeof value === 'object';
      },
      default: function() {
        return null;
      }
    }
})

const emit = defineEmits(['update']);

const { sexagesimalDecToDecimal, sexagesimalRaToDecimal, decimalRaToSexigesimal, decimalDecToSexigesimal } = useCoordinateUtils();
const baseValue = defineModel()
const displayValue = ref(baseValue.value)
const helpText = ref(getHelpText(baseValue.value))

function update() {
  let displayValueAsDecimal;
  if (props.coordinate === 'ra') {
    displayValueAsDecimal = sexagesimalRaToDecimal(displayValue.value);
  } else {
    displayValueAsDecimal = sexagesimalDecToDecimal(displayValue.value);
  }
  if (baseValue.value !== displayValueAsDecimal) {
    baseValue.value = displayValueAsDecimal;
  }
  helpText.value = getHelpText(displayValue.value);
}

function getHelpText(coordValue) {
  if (props.coordinate === 'ra') {
    return getRaHelpText(coordValue);
  } else {
    return getDecHelpText(coordValue);
  }
}

function getRaHelpText(coordValue) {
  if (isNaN(Number(coordValue))) {
    return 'Decimal: ' + Number(sexagesimalRaToDecimal(coordValue));
  } else {
    return 'Sexagesimal: ' + decimalRaToSexigesimal(coordValue).str;
  }
}

function getDecHelpText(coordValue) {
  if (isNaN(Number(coordValue))) {
    return 'Decimal: ' + Number(sexagesimalDecToDecimal(coordValue));
  } else {
    return 'Sexagesimal: ' + decimalDecToSexigesimal(coordValue).str;
  }
}
</script>
<template>
  <v-text-field
    v-model="displayValue"
    :label="props.label"
    v-tooltip="props.description"
    :variant="props.variant"
    :hint="helpText"
    :persistent-hint="displayValue ? true: false"
    :error-messages="props.errors"
    @update:modelValue="update()"
  >
    <template v-for="(_, slot) of $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </v-text-field>
</template>