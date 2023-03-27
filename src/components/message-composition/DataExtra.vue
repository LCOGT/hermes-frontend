<template>
  <div>
    <b-editable-table striped bordered class="extra-data-table" v-model="extra_data" :fields="fields"
      @input-change="handleInput">
      <template #cell(copy)="row">
        <!-- Copy Row -->
        <span v-if="field.key == 'copy'" :key="field.key + '-btn'">
          <b-button :title="'Copy Row'" @click="copy(data)">
            <b-icon icon="file-earmark-plus" aria-hidden="true"></b-icon>
          </b-button>
        </span>
      </template>
      <template #cell(delete)="row">
        <!-- Delete Row -->
        <span v-if="field.key == 'delete' && (allowEmpty || tableData.length > 1)" :key="field.key + '-btn'">
          <b-button :title="'Remove Row'" @click="remove(data)">
            <b-icon icon="trash" aria-hidden="true"></b-icon>
          </b-button>
        </span>
      </template>
    </b-editable-table>
  </div>
</template>
<script>
import BEditableTable from "bootstrap-vue-editable-table";
import { mapGetters } from "vuex";
import '@/assets/css/submissions.css';

export default {
  name: "AdditionalDataTable",
  components: {
    BEditableTable,
  },
  props: {
    extra_data: {
      type: Array,
      required: true
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fields: [
        {
          key: "key",
          label: "Key",
          type: 'text',
          editable: true,
          placeholder: "Key",
          class: "key-column"
        },
        {
          key: "value",
          label: "Value",
          type: 'text',
          editable: true,
          placeholder: "Value",
          class: "value-column"
        },
        {
          key: "copy",
          label: "",
          editable: false,
          headerTitle: "copy",
          class: "copy-column",
        },
        {
          key: "delete",
          label: "",
          editable: false,
          headerTitle: "delete",
          class: "delete-column",
        }
      ],
    };
  },
  methods: {
    remove: function (row) {
      this.$emit('remove', row.index);
    },
    copy: function (row) {
      this.$emit('copy', row.index);
    },
    handleInput: function (value, row) {
      this.update();
    },
    update: function () {
      this.$emit('message-updated');
    }
  }
}
</script>
