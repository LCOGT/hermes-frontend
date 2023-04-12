  <template>
    <b-card no-body>
      <b-tabs card>
        <b-tab active>
          <template slot="title">
            <span><i class="far fa-edit" />Submission Form</span>
          </template>
          <show-wrapper id="main-fields">
            <ocs-custom-alert v-for="error in errors.non_field_errors" :key="error" alert-class="danger" :dismissible="false">
              {{ error }}
            </ocs-custom-alert>
            <b-container class="p-0">
              <b-form>
                <b-form-row class="mb-2">
                  <b-col md="8">
                    <ocs-custom-field
                      v-model="hermesMessage.title"
                      field="title"
                      label="Title:"
                      :desc="''"
                      :hide="false"
                      :errors="errors.title"
                      @input="update"
                    />
                  </b-col>
                  <b-col md="4">
                    <ocs-custom-select
                      v-model="hermesMessage.topic"
                      field="topic"
                      label="Topic:"
                      :desc="''"
                      :hide="false"
                      :errors="errors.topic"
                      :options="getProfile.writable_topics"
                      @input="update"
                    />
                  </b-col>
                </b-form-row>
                <b-form-row>
                  <b-col md="3">
                    <ocs-custom-field
                      v-model="hermesMessage.data.event_id"
                      field="event_id"
                      label="Event ID:"
                      :desc="'Nonlocalized event ID (if applicable)'"
                      :hide="false"
                      :errors="getErrors('data.event_id', {})"
                      @input="update"
                    />
                  </b-col>
                  <b-col md="6">
                    <ocs-custom-field
                      v-model="hermesMessage.authors"
                      field="authors"
                      label="Authors:"
                      :desc="''"
                      :hide="false"
                      :errors="errors.authors"
                      @input="update"
                    />
                  </b-col>
                  <b-col md="2" offset-md="1">
                    <b-form-checkbox
                        id="submit-to-tns"
                        v-model="hermesMessage.submit_to_tns"
                        name="submit-to-tns"
                        switch
                        @input="update"
                    > Submit to TNS
                    </b-form-checkbox>
                    <b-form-checkbox
                        id="submit-to-mpc"
                        v-model="hermesMessage.submit_to_mpc"
                        name="submit-to-mpc"
                        switch
                        @input="update"
                    > Submit to MPC
                    </b-form-checkbox>  
                    <b-form-checkbox
                        id="submit-to-gcn"
                        v-model="hermesMessage.submit_to_gcn"
                        name="submit-to-gcn"
                        switch
                        @input="update"
                    > Submit to GCN
                    </b-form-checkbox>
                  </b-col>
                </b-form-row>
              </b-form>
            </b-container>
          </show-wrapper>
          <data-section
            section="targets"
            datatype="Target"
            :errors="getErrors('data.targets', [])"
            :isEmpty="isSectionEmpty('targets')"
            :allowLoading=true
            ref="targetsSection"
            @new-row="addSection('targets')"
            @copy-headers="copyHeaders"
            @parse-csv="parseCsv"
            @toggle-section-show-simple="toggleSectionShowSimple"
          >
            <data-table
              v-if="sectionShowSimple.targets && hermesMessage.data.targets.length > 0"
              id="target"
              :tableData="hermesMessage.data.targets"
              :fields="targetFields"
              :errors="getErrors('data.targets', [])"
              @remove="removeSection('targets', $event)"
              @copy="copySection('targets', $event)"
              @message-updated="messageUpdated"
            >
            </data-table>
            <span v-if="!sectionShowSimple.targets">
              <div v-for="(target, idx) in hermesMessage.data.targets" :key="'target' + idx">
                <data-target
                  :index="idx"
                  :target="target"
                  :errors="getDataErrorsArray('targets', idx)"
                  @remove="removeSection('targets', idx)"
                  @copy="copySection('targets', idx)"
                  @message-updated="messageUpdated"
                >
                </data-target>
              </div>
            </span>
          </data-section>
          <data-section
            section="photometry"
            datatype="Photometry"
            :errors="getErrors('data.photometry', [])"
            :isEmpty="isSectionEmpty('photometry')"
            :allowLoading=true
            ref="photometrySection"
            @new-row="addSection('photometry')"
            @copy-headers="copyHeaders"
            @parse-csv="parseCsv"
            @toggle-section-show-simple="toggleSectionShowSimple"
          >
            <data-table
                v-if="sectionShowSimple.photometry && hermesMessage.data.photometry.length > 0"
                id="photometry"
                :tableData="hermesMessage.data.photometry"
                :fields="photometryFields"
                :errors="getErrors('data.photometry', [])"
                @remove="removeSection('photometry', $event)"
                @copy="copySection('photometry', $event)"
                @message-updated="messageUpdated"
              >
            </data-table>
            <span v-if="!sectionShowSimple.photometry">
              <div v-for="(photometry, idx) in hermesMessage.data.photometry" :key="'photometry' + idx">
                <data-photometry
                  :index="idx"
                  :photometry="photometry"
                  :targets="hermesMessage.data.targets"
                  :errors="getDataErrorsArray('photometry', idx)"
                  @remove="removeSection('photometry', idx)"
                  @copy="copySection('photometry', idx)"
                  @message-updated="messageUpdated"
                >
                </data-photometry>
              </div>
            </span>
          </data-section>
          <data-section
            section="spectroscopy"
            datatype="Spectroscopy"
            :errors="getErrors('data.spectroscopy', [])"
            :isEmpty="isSectionEmpty('spectroscopy')"
            :onlySimple=true
            ref="spectroscopySection"
            @new-row="addSection('spectroscopy')"
          >
            <div v-for="(spectroscopy, idx) in hermesMessage.data.spectroscopy" :key="'spectroscopy' + idx">
              <data-spectroscopy
                :index="idx"
                :spectroscopy="spectroscopy"
                :targets="hermesMessage.data.targets"
                :errors="getDataErrorsArray('spectroscopy', idx)"
                @remove="removeSection('spectroscopy', idx)"
                @copy="copySection('spectroscopy', idx)"
                @message-updated="messageUpdated"
              >
              </data-spectroscopy>
            </div>
          </data-section>
          <data-section
            section="astrometry"
            datatype="Astrometry"
            :errors="getErrors('data.astrometry', [])"
            :isEmpty="isSectionEmpty('astrometry')"
            :allowLoading=true
            ref="astrometrySection"
            @new-row="addSection('astrometry')"
            @copy-headers="copyHeaders"
            @parse-csv="parseCsv"
            @toggle-section-show-simple="toggleSectionShowSimple"
          >
            <data-table
                v-if="sectionShowSimple.astrometry && hermesMessage.data.astrometry.length > 0"
                id="astrometry"
                :tableData="hermesMessage.data.astrometry"
                :fields="astrometryFields"
                :errors="getErrors('data.astrometry', [])"
                @remove="removeSection('astrometry', $event)"
                @copy="copySection('astrometry', $event)"
                @message-updated="messageUpdated"
              >
            </data-table>
            <span v-if="!sectionShowSimple.astrometry">
              <div v-for="(astrometry, idx) in hermesMessage.data.astrometry" :key="'astrometry' + idx">
                <data-astrometry
                  :index="idx"
                  :astrometry="astrometry"
                  :targets="hermesMessage.data.targets"
                  :errors="getDataErrorsArray('astrometry', idx)"
                  @remove="removeSection('astrometry', idx)"
                  @copy="copySection('astrometry', idx)"
                  @message-updated="messageUpdated"
                >
                </data-astrometry>
              </div>
            </span>
          </data-section>
          <data-section
            section="references"
            datatype="Reference"
            :errors="getErrors('data.references', [])"
            :isEmpty="isSectionEmpty('references')"
            :allowLoading=true
            ref="referencesSection"
            @new-row="addSection('references')"
            @copy-headers="copyHeaders"
            @parse-csv="parseCsv"
            @toggle-section-show-simple="toggleSectionShowSimple"
          >
            <data-table
              v-if="sectionShowSimple.references && hermesMessage.data.references.length > 0"
              id="reference"
              :tableData="hermesMessage.data.references"
              :fields="referenceFields"
              :errors="getErrors('data.references', [])"
              @remove="removeSection('references', $event)"
              @copy="copySection('references', $event)"
              @message-updated="messageUpdated"
            >
            </data-table>
            <span v-if="!sectionShowSimple.references" >
              <div v-for="(reference, idx) in hermesMessage.data.references" :key="'reference' + idx">
                <data-reference
                  :index="idx"
                  :reference="reference"
                  :errors="getDataErrorsArray('references', idx)"
                  @remove="removeSection('references', idx)"
                  @copy="copySection('references', idx)"
                  @message-updated="messageUpdated"
                >
                </data-reference>
                <hr v-if="(idx + 1) < hermesMessage.data.references.length"/>
              </div>
            </span>
          </data-section>
          <data-section
            section="extra_data"
            datatype="Extra Data"
            :errors="getErrors('data.extra_data', [])"
            :onlySimple=true
            :isEmpty="isSectionEmpty('extra_data')"
            ref="extra_dataSection"
            @new-row="addSection('extra_data')"
          >
            <data-table
              v-if="sectionShowSimple.extra_data && hermesMessage.data.extra_data.length > 0"
              id="extra_data"
              :tableData="hermesMessage.data.extra_data"
              :fields="extraDataFields"
              :errors="getErrors('data.extra_data', [])"
              @remove="removeSection('extra_data', $event)"
              @copy="copySection('extra_data', $event)"
              @message-updated="messageUpdated"
            >
            </data-table>
          </data-section>
          <data-section
            section="message"
            datatype="Message"
            ref="messageSection"
            :errors="getErrors('message_text', null)"
            :isEmpty="hermesMessage.message_text === ''"
            :onlySimple=true
          >
            <b-tabs class="message-tabs" content-class="mt-2">
              <b-tab title="Edit" active>
                <b-form-textarea v-model="hermesMessage.message_text" id="message-input" placeholder="Enter Message. Use '{key}' to reference values in Additional Data Table." rows="3" max-rows="6" @input="update"></b-form-textarea>
                <b-form-invalid-feedback id="message-input-feedback">{{ getErrors('message_text', '') }}</b-form-invalid-feedback>
              </b-tab>
              <b-tab title="Preview">
                <span style="white-space: pre;">
                {{ formattedMessage }}
                </span>
              </b-tab>
              <b-tab title="Help">
                <ul>
                  <li>
                    Inject elements of the message data using the api key surrounded by curly braces <code>{}</code>.
                    <ul class="ml-4">
                      <li>
                        Ex. <code>{authors}</code> injects the values of the Authors field
                      </li>
                    </ul>
                  </li>
                  <li>
                    Dot notation is used to reference elements of a list or nested data structure.
                    <ul class="ml-4">
                      <li>
                        Ex. <code>{targets.0.ra}</code> injects the first Targets RA value
                      </li>
                    </ul>
                  </li>
                  <li>
                    If the dot notation references an array or nested structure, a string representation of the whole structure will be injected.
                    <ul class="ml-4">
                      <li>
                        Ex. <code>{targets}</code> injects the entire Targets table and all filled out associated fields
                      </li>
                    </ul>
                  </li>
                  <li>
                    For `Extra Data`, reference the key directly in the curly braces to substitute its value. These keys should not overlap with existing API structures.
                  </li>
                  <li>
                    If the dot notation does not match anything, nothing will be substituted into the message text. Key dotpaths are case sensitive.
                  </li>
                  <li>
                    Check out the <b>API View</b> tab on this page, or the <b-link to="/about" active>About page</b-link> for API documentation for the available message fields.
                  </li>
                </ul>
              </b-tab>
            </b-tabs>
          </data-section>
        </b-tab>
        <b-tab>
          <template slot="title">
            <span><i class="fas fa-code" /> API View</span>
          </template>
          <b-container class="p-0 mt-2">
            <b-form-row>
              <b-col class="bg-light rounded">
                <ocs-request-group-api-display
                  class="p-4"
                  :request-group="this.sanitizedMessageData()"
                  :extra-download-button-attrs="{ class: 'float-right', variant: 'primary' }"
                />
              </b-col>
            </b-form-row>
          </b-container>
        </b-tab>
        <b-tab>
          <template slot="title">
            <span><i class="fas fa-code" /> Text View</span>
          </template>
          <b-container class="p-0 mt-2">
            <b-form-row>
              <b-col class="bg-light rounded">
                <text-view
                  class="p-4"
                  :request-group="this.sanitizedMessageData()"
                  :extra-download-button-attrs="{ class: 'float-right', variant: 'primary' }"
                />
              </b-col>
            </b-form-row>
          </b-container>
        </b-tab>
      </b-tabs>
    </b-card>
  </template>
  <script>
  import _ from 'lodash';
  import { mapGetters } from "vuex";
  import '@/assets/css/submissions.css';
  import DataSection from '@/components/message-composition/DataSection.vue'
  import DataReference from '@/components/message-composition/DataReference.vue'
  import DataTable from '@/components/message-composition/DataTable.vue'
  import DataTarget from '@/components/message-composition/DataTarget.vue'
  import DataPhotometry from '@/components/message-composition/DataPhotometry.vue'
  import DataSpectroscopy from '@/components/message-composition/DataSpectroscopy.vue'
  import DataAstrometry from '@/components/message-composition/DataAstrometry.vue'
  import ShowWrapper from '@/components/message-composition/ShowWrapper.vue'
  import TextView from '@/components/message-composition/TextView.vue'
  import { messageFormatMixin } from '@/mixins/messageFormatMixin.js';

  export default {
    name: 'HermesMessage',
    components: {
      ShowWrapper,
      DataSection,
      DataReference,
      DataTable,
      DataTarget,
      DataPhotometry,
      DataSpectroscopy,
      DataAstrometry,
      TextView
    },
    mixins: [messageFormatMixin],
    props: {
      errors: {
        type: Object,
        required: true
      },
      hermesMessage: {
        type: Object,
        required: true
      }
    },
    data: function () {
      return {
        sectionShowSimple: {
          'references': true,
          'targets': true,
          'photometry': true,
          'spectroscopy': true,
          'astrometry': true,
          'extra_data': true,
          'message': true
        },
        referenceFields: [
          {
            key: 'source',
            label: 'Source',
            type: 'text',
            list: [
              { value: "hop_uuid", text: "Hop UUID" },
              { value: "doi", text: "DOI" },
              { value: "gracedb_id", text: "GraceDB ID" },
            ],
            placeholder: "Source",
            class: "source-column"
          },
          {
            key: "citation",
            label: "Citation",
            type: 'text',
            placeholder: "Citation",
            class: "citation-column"
          },
          {
            key: "url",
            label: "Url",
            type: 'text',
            placeholder: "Url",
            class: "url-column"
          },
          {
            key: "copy",
            label: "",
            headerTitle: "copy",
            class: "copy-column",
          },
          {
            key: "delete",
            label: "",
            headerTitle: "delete",
            class: "delete-column",
          }],
        extraDataFields: [
          {
            key: 'key',
            label: 'Key',
            type: 'text',
            placeholder: "Key",
            class: "key-column"
          },
          {
            key: 'value',
            label: 'Value',
            type: 'text',
            placeholder: "Value",
            class: "value-column"
          },
          {
            key: "copy",
            label: "",
            headerTitle: "copy",
            class: "copy-column",
          },
          {
            key: "delete",
            label: "",
            headerTitle: "delete",
            class: "delete-column",
          }],
        targetFields: [
          {
            key: 'index',
            label: '',
            class: 'index-column'
          },
          {
            key: 'name',
            label: 'Name',
            type: 'text',
            placeholder: "Name",
            class: "target-name-column"
          },
          {
            key: "ra",
            label: "RA",
            type: 'text',
            placeholder: "RA",
            class: "ra-column"
          },
          {
            key: "dec",
            label: "Dec",
            type: 'text',
            placeholder: "Dec",
            class: "dec-column"
          },
          {
            key: "new_discovery",
            label: "New Discovery",
            type: 'checkbox',
            default: false,
            class: "new-discovery-column"
          },
          {
            key: "copy",
            label: "",
            headerTitle: "copy",
            class: "copy-column",
          },
          {
            key: "delete",
            label: "",
            headerTitle: "delete",
            class: "delete-column",
          }],
        emptySections: {
          'references': {
            'source': null,
            'citation': null,
            'url': null
          },
          'targets': {
            'name': null,
            'discovery_info': {
              'reporting_group': null,
              'discovery_source': null,
              'transient_type': null,
              'proprietary_period': null,
              'proprietary_period_units': null
            },
            'ra': null,
            'dec': null,
            'ra_error': null,
            'dec_error': null,
            'ra_error_units': 'degrees',
            'dec_error_units': 'degrees',
            'pm_ra': null,
            'pm_dec': null,
            'epoch': null,
            'new_discovery': false,
            'orbital_elements': {
              'epoch_of_elements': null,
              'orbinc': null,
              'longascnode': null,
              'argofperih': null,
              'eccentricity': null,
              'meandist': null,
              'meananom': null,
              'perihdist': null,
              'epochofperih': null
            },
            'redshift': null,
            'host_name': null,
            'host_redshift': null,
            'distance': null,
            'distance_error': null,
            'distance_units': null,
            'aliases': null,
            'group_associations': null
          },
          'photometry': {
            'target_name': null,
            'date_obs': '',
            'telescope': null,
            'instrument': null,
            'bandpass': null,
            'brightness': null,
            'brightness_error': null,
            'brightness_unit': 'AB mag',
            'exposure_time': null,
            'observer': null,
            'comments': null,
            'catalog': null,
            'limiting_brightness': null,
            'limiting_brightness_error': null,
            'limiting_brightness_unit': 'AB mag',
            'group_associations': null
          },
          'spectroscopy': {
            'target_name': null,
            'date_obs': '',
            'telescope': null,
            'instrument': null,
            'flux': [null],
            'flux_error': [0],
            'wavelength': [null],
            'flux_units': 'mJy',
            'wavelength_units': 'nm',
            'flux_type': 'Fλ',
            'setup': null,
            'classification': null,
            'proprietary_period': null,
            'proprietary_period_units': 'Days',
            'exposure_time': null,
            'observer': null,
            'comments': null,
            'reducer': null,
            'spec_type': null,
            'group_associations': null
          },
          'astrometry': {
            'target_name': null,
            'date_obs': '',
            'telescope': null,
            'instrument': null,
            'ra': null,
            'dec': null,
            'ra_error': null,
            'dec_error': null,
            'ra_error_units': 'degrees',
            'dec_error_units': 'degrees',
            'mpc_sitecode': null,
            'catalog': null,
            'comments': null,
          },
          'extra_data': {
            'key': null,
            'value': null
          }
        },
        show: true,
        id: 'hermes-message'
      };
    },
    computed: {
      ...mapGetters(["getProfile"]),
      photometryFields: function () {
        return [
          {
            key: 'index',
            label: '',
            class: 'index-column'
          },
          {
            key: 'target_name',
            label: 'Target',
            type: 'select',
            options: this.targetNames,
            class: "target-select-column"
          },
          {
            key: "date_obs",
            label: "Observation Date",
            type: 'text',
            placeholder: "date",
            class: "date-obs-column"
          },
          {
            key: "telescope",
            label: "Telescope",
            type: 'text',
            placeholder: "tst",
            class: "telescope-column"
          },
          {
            key: "instrument",
            label: "Instrument",
            type: 'text',
            placeholder: "instrument",
            class: "instrument-column"
          },
          {
            key: "bandpass",
            label: "Band",
            type: 'text',
            placeholder: "",
            class: "bandpass-column"
          },
          {
            key: "brightness",
            label: "Brightness",
            type: 'text',
            placeholder: "",
            class: "brightness-column"
          },
          {
            key: "brightness_unit",
            label: "Units",
            type: 'select',
            options: [
              { value: "AB mag", text: "AB mag" },
              { value: "Vega mag", text: "Vega mag" },
              { value: "mJy", text: "mJy" },
              { value: "erg / s / cm² / Å", text: "erg / s / cm² / Å" },
            ],
            class: "brightness-units-column"
          },
          {
            key: "brightness_error",
            label: "Error",
            type: 'text',
            placeholder: "",
            class: "brightness-error-column"
          },
          {
            key: "copy",
            label: "",
            headerTitle: "copy",
            class: "copy-column",
          },
          {
            key: "delete",
            label: "",
            headerTitle: "delete",
            class: "delete-column",
          }];
      },
      astrometryFields: function () {
        return [
          {
            key: 'index',
            label: '',
            class: 'index-column'
          },
          {
            key: 'target_name',
            label: 'Target',
            type: 'select',
            options: this.targetNames,
            class: "target-select-column"
          },
          {
            key: "date_obs",
            label: "Observation Date",
            type: 'text',
            placeholder: "date",
            class: "date-obs-column"
          },
          {
            key: "telescope",
            label: "Telescope",
            type: 'text',
            placeholder: "tst",
            class: "telescope-column"
          },
          {
            key: "instrument",
            label: "Instrument",
            type: 'text',
            placeholder: "instrument",
            class: "instrument-column"
          },
          {
            key: "ra",
            label: "RA",
            type: 'text',
            placeholder: "RA",
            class: "ra-column"
          },
          {
            key: "ra_error",
            label: "Error",
            type: 'text',
            placeholder: "",
            class: "ra-error-column"
          },
          {
            key: "ra_error_units",
            label: "Units",
            type: 'select',
            options: [
              { value: "degrees", text: "Degrees" },
              { value: "marcsec", text: "marcsec" },
              { value: "arcsec", text: "arcsec" },
              { value: "arcmin", text: "arcmin" },
            ],
            class: "ra-error-units-column"
          },
          {
            key: "dec",
            label: "Dec",
            type: 'text',
            placeholder: "Dec",
            class: "dec-column"
          },
          {
            key: "dec_error",
            label: "Error",
            type: 'text',
            placeholder: "",
            class: "dec-error-column"
          },
          {
            key: "dec_error_units",
            label: "Units",
            type: 'select',
            options: [
              { value: "degrees", text: "Degrees" },
              { value: "marcsec", text: "marcsec" },
              { value: "arcsec", text: "arcsec" },
              { value: "arcmin", text: "arcmin" },
            ],
            class: "dec-error-units-column"
          },
          {
            key: "copy",
            label: "",
            headerTitle: "copy",
            class: "copy-column",
          },
          {
            key: "delete",
            label: "",
            headerTitle: "delete",
            class: "delete-column",
          }];
      },
      targetNames: function () {
        return _.map(this.hermesMessage.data.targets, 'name');
      }
    },
    watch: {
      'hermesMessage.data': function() {
        for (const section in this.sectionShowSimple){
          this.$refs[section + 'Section'].forceVisibility(false);
        }
      }
    },
    methods: {
      update: function (data) {
        this.$emit('hermes-message-updated', data);
      },
      messageUpdated: function (data) {
        this.update(data);
      },
      isSectionEmpty: function (section) {
        return _.isEmpty(this.hermesMessage.data[section]);
      },
      addSection: function (section) {
        let emptySection = _.cloneDeep(this.emptySections[section]);
        if (!(section in this.hermesMessage.data)) {
          this.hermesMessage.data[section] = [];
        }
        this.hermesMessage.data[section].push(emptySection);
        this.update();
      },
      copySection: function (section, idx) {
        let newSection = _.cloneDeep(this.hermesMessage.data[section][idx]);
        this.hermesMessage.data[section].push(newSection);
        this.update();
      },
      removeSection: function (section, idx) {
        this.hermesMessage.data[section].splice(idx, 1);
        if (_.isEmpty(this.hermesMessage.data[section])) {
          this.$refs[section + 'Section'].forceVisibility(false);
        }
        this.update();
      },
      getDataErrorsArray: function (section, idx) {
        return _.get(this.getErrors('data', {}), [section, idx], {});
      },
      getErrors: function (key, default_value) {
        return _.get(this.errors, key, default_value);
      },
      toggleSectionShowSimple: function (section) {
        this.sectionShowSimple[section] = !this.sectionShowSimple[section]
      },
      copyHeaders: function (section) {
        const keys = _.keys(_.omitBy(this.emptySections[section], _.isObject));
        const deepkeys = _.flatMap(_.pickBy(this.emptySections[section], _.isObject), _.keys);

        navigator.clipboard.writeText(_.concat(keys, deepkeys));
        this.$bvToast.toast(section.charAt(0).toUpperCase() + section.slice(1) + ' csv headers copied to clipboard!', {
          title: 'Success!',
          variant: 'success',
          autoHideDelay: '1000',
          solid: true
        });
      },
      parseCsv: function(section, fileInput) {
        const lines = fileInput.split("\n");
        let headers = [];
        let dataLines = [];
        _.forEach(lines, function(line){
          const splitLine = line.split(',');
          if (_.every(splitLine, v => v === '')){
            // Saving from excel can yield empty lines at the top, so we skip those lines
            return;
          }
          else if(_.isEmpty(headers)) {
            // Set the headers array
            headers = splitLine;
          }
          else {
            // Save the data lines - this will be an array of arrays
            dataLines.push(splitLine);
          }
        });
        let loadedSection = [];
        let nestedSections = _.pickBy(this.emptySections[section], _.isObject);
        for (let i = 0; i < dataLines.length; i += 1) {
          let newSection = _.cloneDeep(this.emptySections[section]);
          for (let j = 0; j < headers.length; j+= 1) {
            if (dataLines[i][j] != '') {
              if (headers[j] in newSection) {
                newSection[headers[j]] = dataLines[i][j];
              }
              else {
                // Go through the nested objects and check if those keys are present
                _.forEach(nestedSections, function(value, key) {
                  if (headers[j] in value) {
                    newSection[key][headers[j]] = dataLines[i][j];
                  }
                });
              }
            }
          }
          loadedSection.push(newSection);
        }
        if (!_.isEmpty(loadedSection)) {
          this.hermesMessage.data[section] = loadedSection;
          this.$refs[section + 'Section'].forceVisibility(true);
          this.update();
        }
      }
    }
  };
  </script>
  