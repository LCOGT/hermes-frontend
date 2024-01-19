<template>
  <div class="mb-2">
    <b-row>
      <b-col md="11">
        <b-form-file v-model="filesModel" :state="validationState" :multiple="multiple" placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here..." @input="addFiles">
        </b-form-file>
        <span v-for="error in errors" :key="error" class="errors text-danger">
          {{ error }}
        </span>
      </b-col>
      <b-col md="1">
        <b-button title="Clear all files" @click="clearFiles"><b-icon icon="trash" aria-hidden="true"></b-icon></b-button>
      </b-col>
    </b-row>
    <b-list-group v-for="(file, index) in localFiles" :key="id + '-file-' + index" flush>
      <b-list-group-item class="pr-0">
        <b-row>
          <b-col md="3" align-self="center" class="pr-2">
              <b>{{ file.name }}</b>
          </b-col>
          <b-col md="1" align-self="center" class="pl-2 pr-0">
              {{ getFileSize(file.size) }}
          </b-col>
          <b-col md="7">
              <b-form-input v-model="localDescriptions[index]" placeholder="Description" @input="updateFileDescriptions"></b-form-input>
          </b-col>
          <b-col md="1">
              <b-button title="Remove this file" @click="removeFile(index)"><b-icon icon="trash" aria-hidden="true"></b-icon></b-button>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script>
  import {filesize} from "filesize";

  export default {
    name: 'FilesWithDescriptions',
    props: {
      id: {
        type: String,
        required: true
      },
      errors: {
        type: Array,
        required: true
      },
      multiple: {
        type: Boolean,
        default: true
      },
      files: {
        type: Array,
        required: true,
        default: () => {
          return [];
        }
      },
      fileDescriptions: {
        type: Array,
        required: true,
        default: () => {
          return [];
        }
      },
    },
    data: function() {
      return {
        filesModel: this.files,
        localDescriptions: this.fileDescriptions
      };
    },
    computed: {
      // Need to juggle filesModel (used in the file component), localFiles (list of selected files), and files (input/output files list) because
      // this component works with single file or multiple file selection
      localFiles: function() {
        if (Array.isArray(this.filesModel)) {
          return this.filesModel;
        }
        else {
          if (this.filesModel == null) {
            return [];
          }
          else {
            return [this.filesModel];
          }
        }
      },
      validationState: function() {
        if (this.errors === null || this.errors.length == 0) {
          // No validation displayed
          return null;
        }
        // If we have an error, show bad state (red outline)
        return false;
      },
    },
    methods: {
      removeFile: function(idx) {
        if (this.multiple) {
          if (idx < this.filesModel.length) {
            this.filesModel.splice(idx, 1);
            this.localDescriptions.splice(idx, 1);
          }
          this.updateFiles();
          this.updateFileDescriptions();
        }
        else {
          this.clearFiles();
        }
      },
      clearFiles: function() {
        if (this.multiple) {
          this.filesModel = [];
          this.localDescriptions = [];
        }
        else {
          this.filesModel = null;
          this.localDescriptions = [];
        }
        
        this.updateFiles();
        this.updateFileDescriptions();
      },
      addFiles: function() {
        // need to update the parent prop of files
        this.updateFiles();
        // If we change files, we should just clear all comments to be safe
        this.localDescriptions = [];
        // Then add an empty comment for each file that exists
        while (this.localDescriptions.length < this.localFiles.length) {
          this.localDescriptions.push('');
        }
        this.updateFileDescriptions();
      },
      getFileSize: function(size) {
        return filesize(size, {standard: 'jedec'})
      },
      updateFiles: function() {
        this.$emit('update:files', this.localFiles);
      },
      updateFileDescriptions: function() {
        this.$emit('update:fileDescriptions', this.localDescriptions);
        this.update();
      },
      update: function () {
        this.$emit('message-updated');
      }
    }
  };
</script>
<style scoped>
.errors {
  font-size: 90%;
}
</style>