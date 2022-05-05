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
      var csvTable = this.csvToArray(newTable);
      var fullTable = this.getMainData
      csvTable.forEach(function(row){
        if (row != undefined){
          const newId = Date.now();
          row['id'] = newId;
          row['isActive'] = false;
          fullTable.push(row);
        }
      });
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
      reader.onload = (e) => {
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
      const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        // Skip blank lines
        if (!(values.length == 1 && values[0] == '')){
          const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
          }, {});
          return el;
        };
      });
      // return the array
      return arr;
    },
  }
}
</script>

<style scoped>
.outside-container {
  width: 75%;
  margin: auto;
}

.eventid-col {
  max-width: 20%;
  padding: 0;
  padding-right: 3%;
  padding-left: 15px;
}

.authors-col {
  max-width: 100%;
  padding: 0;
  padding-right: 15px;
}

.extra-input-col {
  max-width: 20%;
}
.submit-button {
  color: white
}
.import-button {
  color: white
}
</style>