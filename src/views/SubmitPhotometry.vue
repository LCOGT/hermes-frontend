<template>
  <message-form page-title="Photometry Reporting Form">
    <photometry-input-table></photometry-input-table>
    <!-- Upload Data Card -->
    <b-card title="Upload Data" class="upload-card my-2" border-variant="light">
      <b-card-text>
        This space will contain information explaining the procedure for uploading a text file that will automatically fill the photometry table below.
      </b-card-text>
      <form enctype="multipart/form-data">
        <input type="file" @change="onFileChange">
      </form>
    </b-card>
  </message-form>
</template>

<script>

import PhotometryInputTable from "@/components/PhotometryInputTable.vue"
import MessageForm from "@/components/MessageForm";
import { mapGetters } from "vuex";

export default {
  name: "SubmitPhotometry",
  components: {
    MessageForm,
    "photometry-input-table": PhotometryInputTable,
  },
  computed: {
    ...mapGetters(["getMainData"])
  },
  data() {
    return {
      fileinput: '',
    }
  },
  watch: {
    fileinput(newTable) {
      const loaded_array = this.csvToArray(newTable)
      this.$store.commit("SET_MAIN_DATA", loaded_array)
    }
  },
  methods: {
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
          return;
      this.createInput(files[0]);
    },
    createInput(file) {
      var reader = new FileReader();
      var vm = this;
      reader.onload = () => {
      vm.fileinput = reader.result;
      }
      reader.readAsText(file);
    },
    csvToArray(str, delimiter = ",") {
      // slice from start of text to the first \n index
      // use split to create an array from string by delimiter
      const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
      // slice from \n index + 1 to the end of the text
      // use split to create an array of each csv value row
      const rows = str.slice(str.indexOf("\n") + 1).split("\n");
      // Map the rows
      // split values from each row into an array
      // use headers.reduce to create an object
      // object properties derived from headers:values
      // the object passed as an element of the array
      const arr = rows.filter(function (row) {
        // skip blank lines
        return !(row.length === 0)
      }).map(function (row, rowindex) {
        const values = row.split(delimiter);
        return headers.reduce(function (object, header, index) {
            object[header] = values[index];
            object['id'] = rowindex;
            return object;
          }, {});
      });
      // return the array
      return arr;
    },
  }
}
</script>

<style scoped>

</style>