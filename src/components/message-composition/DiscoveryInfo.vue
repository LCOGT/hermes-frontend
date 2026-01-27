<script setup>
import { useTnsUtils } from '@/utils/tnsUtils.js';

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  errors: {
    type: Object,
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  isTns: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['message-updated']);

const { getTnsValuesList } = useTnsUtils();

const proprietaryPeriodUnits = ['Days', 'Months', 'Years']

function update() {
  emit('message-updated');
}
</script>
<template>
  <v-card no-body class="mt-2" variant="outlined">
    <v-card-title class="p-1">
      <b>Discovery Info</b>
    </v-card-title>
    <v-card-text>
      <v-alert v-for="error in errors.non_field_errors" :key="error" type="error" :text="error" title="Discovery Info Errors:">
      </v-alert>
      <v-row>
        <v-col md="3">
          <v-text-field v-if="!props.isTns" v-model="props.data.reporting_group" label="Reporting Group" variant="outlined" :error-messages="props.errors.reporting_group" @update:modelValue="update" />
          <v-autocomplete
            v-else
            v-model="props.data.reporting_group"
            label="Reporting Group"
            variant="outlined"
            :items="getTnsValuesList('groups', false)"
            clearable
            :error-messages="props.errors.reporting_group"
            @update:modelValue="update"
          />
        </v-col>
        <v-col md="3">
          <v-text-field v-if="!props.isTns" v-model="props.data.discovery_source" label="Source" variant="outlined" :error-messages="props.errors.discovery_source" @update:modelValue="update" />
          <v-autocomplete
            v-else
            v-model="props.data.discovery_source"
            label="Source"
            variant="outlined"
            :items="getTnsValuesList('groups', false)"
            clearable
            :error-messages="props.errors.discovery_source"
            @update:modelValue="update"
          />
        </v-col>
        <v-col md="3">
          <v-select
            v-model="props.data.transient_type"
            label="Transient Type"
            variant="outlined"
            :items="getTnsValuesList('at_types', false)"
            clearable
            :error-messages="props.errors.transient_type"
            @update:modelValue="update"
          />
        </v-col>
        <v-col md="3">
          <v-text-field v-model="props.data.proprietary_period" label="Proprietary" variant="outlined" rounded="0" :error-messages="props.errors.proprietary_period" @update:modelValue="update" >
            <template v-slot:append>
              <v-select v-model="props.data.proprietary_period_units" label="Units" class="appended-element" variant="outlined" rounded="0" :items="proprietaryPeriodUnits" hide-details @update:modelValue="update" style="min-width:100px;"></v-select>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="4">
          <v-text-field v-if="!props.isTns" v-model="props.data.nondetection_source" label="Nondetection Source" variant="outlined" :error-messages="props.errors.nondetection_source" @update:modelValue="update" />
          <v-select
            v-else
            v-model="props.data.nondetection_source"
            label="Nondetection Source"
            variant="outlined"
            :items="getTnsValuesList('archives', false)"
            clearable
            :error-messages="props.errors.nondetection_source"
            @update:modelValue="update"
          />
        </v-col>
        <v-col md="8">
          <v-text-field v-model="props.data.nondetection_comments" label="Nondetection Comments" variant="outlined" :error-messages="props.errors.nondetection_comments" @update:modelValue="update" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>