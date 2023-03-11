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
                      :options="getWritableTopics"
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
                  </b-col>
                </b-form-row>
              </b-form>
            </b-container>
          </show-wrapper>
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-0" role="tab">
                <b-button-group class="w-100">
                  <b-button block v-b-toggle.targets-tab variant="light">
                    <b-row>
                      <b-col class="text-left error-icon">
                        <b-icon v-if="getErrors('data.targets', null)" icon="exclamation-circle-fill" variant="danger" :title="getErrorTooltipString('data.targets')"></b-icon>
                      </b-col>
                      <b-col class="text-center">
                        Targets
                      </b-col>
                    </b-row>
                  </b-button>
                  <span v-if="sectionShowSimple.targets" class="text-right">
                    <b-button title="Advanced UI"  @click="toggleSectionShowSimple('targets')">
                      <b-icon icon="diagram3" aria-hidden="true"></b-icon>
                    </b-button>
                  </span>
                  <span v-if="!sectionShowSimple.targets" class="text-right">
                    <b-button title="Simple UI"  @click="toggleSectionShowSimple('targets')">
                      <b-icon icon="card-list" aria-hidden="true"></b-icon>
                    </b-button>
                  </span>
                </b-button-group>
              </b-card-header>
              <b-collapse id="targets-tab" accordion="accordion-2" role="tabpanel">
                <b-card-body>
                  <data-list
                    :data="hermesMessage.data.targets"
                    id="targets"
                    datatype="Target"
                    :errors="getErrors('data.targets.non_field_errors', {})"
                    @new-row="addSection('targets')"
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
                  </data-list>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-0" role="tab">
                <b-button-group class="w-100">
                  <b-button block v-b-toggle.photometry-tab variant="light">
                    <b-row>
                      <b-col class="text-left error-icon">
                        <b-icon v-if="getErrors('data.photometry', null)" icon="exclamation-circle-fill" variant="danger" :title="getErrorTooltipString('data.photometry')"></b-icon>
                      </b-col>
                      <b-col class="text-center">
                        Photometry
                      </b-col>
                    </b-row>
                  </b-button>
                  <span v-if="sectionShowSimple.photometry" class="text-right">
                    <b-button title="Advanced UI"  @click="toggleSectionShowSimple('photometry')">
                      <b-icon icon="diagram3" aria-hidden="true"></b-icon>
                    </b-button>
                  </span>
                  <span v-if="!sectionShowSimple.photometry" class="text-right">
                    <b-button title="Simple UI"  @click="toggleSectionShowSimple('photometry')">
                      <b-icon icon="card-list" aria-hidden="true"></b-icon>
                    </b-button>
                  </span>
                </b-button-group>
              </b-card-header>
              <b-collapse id="photometry-tab" accordion="accordion-3" role="tabpanel">
                <b-card-body style="overflow:scroll;">
                  <data-list
                    :data="hermesMessage.data.photometry"
                    id="photometry"
                    datatype="Photometry"
                    :errors="getErrors('data.photometry.non_field_errors', {})"
                    @new-row="addSection('photometry')"
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
                  </data-list>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-0" role="tab">
                <b-button-group class="w-100">
                  <b-button block v-b-toggle.spectroscopy-tab variant="light">
                    <b-row>
                      <b-col class="text-left error-icon">
                        <b-icon v-if="getErrors('data.spectroscopy', null)" icon="exclamation-circle-fill" variant="danger" :title="getErrorTooltipString('data.spectroscopy')"></b-icon>
                      </b-col>
                      <b-col class="text-center">
                        Spectroscopy
                      </b-col>
                    </b-row>
                  </b-button>
                  <b-button title="Advanced UI"  disabled>
                    <b-icon icon="diagram3" aria-hidden="true"></b-icon>
                  </b-button>
                </b-button-group>
              </b-card-header>
              <b-collapse id="spectroscopy-tab" accordion="accordion-4" role="tabpanel">
                <b-card-body style="overflow:scroll;">
                  <data-list
                    :data="hermesMessage.data.spectroscopy"
                    id="spectroscopy"
                    datatype="Spectroscopy"
                    :errors="getErrors('data.spectroscopy.non_field_errors', {})"
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
                  </data-list>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-0" role="tab">
                <b-button-group class="w-100">
                  <b-button block v-b-toggle.astrometry-tab variant="light">
                    <b-row>
                      <b-col class="text-left error-icon">
                        <b-icon v-if="getErrors('data.astrometry', null)" icon="exclamation-circle-fill" variant="danger" :title="getErrorTooltipString('data.astrometry')"></b-icon>
                      </b-col>
                      <b-col class="text-center">
                        Astrometry
                      </b-col>
                    </b-row>
                  </b-button>
                  <span v-if="sectionShowSimple.astrometry" class="text-right">
                    <b-button title="Advanced UI"  @click="toggleSectionShowSimple('astrometry')">
                      <b-icon icon="diagram3" aria-hidden="true"></b-icon>
                    </b-button>
                  </span>
                  <span v-if="!sectionShowSimple.astrometry" class="text-right">
                    <b-button title="Simple UI"  @click="toggleSectionShowSimple('astrometry')">
                      <b-icon icon="card-list" aria-hidden="true"></b-icon>
                    </b-button>
                  </span>
                </b-button-group>
              </b-card-header>
              <b-collapse id="astrometry-tab" accordion="accordion-5" role="tabpanel">
                <b-card-body style="overflow:scroll;">
                  <data-list
                    :data="hermesMessage.data.astrometry"
                    id="astrometry"
                    datatype="Astrometry"
                    :errors="getErrors('data.astrometry.non_field_errors', {})"
                    @new-row="addSection('astrometry')"
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
                  </data-list>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-0" role="tab">
                <b-button-group class="w-100">
                  <b-button block v-b-toggle.references-tab variant="light">
                    <b-row>
                      <b-col class="text-left error-icon">
                        <b-icon v-if="getErrors('data.references', null)" icon="exclamation-circle-fill" variant="danger" :title="getErrorTooltipString('data.references')"></b-icon>
                      </b-col>
                      <b-col class="text-center">
                        References
                      </b-col>
                    </b-row>
                  </b-button>
                  <span v-if="sectionShowSimple.references" class="text-right">
                    <b-button title="Advanced UI"  @click="toggleSectionShowSimple('references')">
                      <b-icon icon="diagram3" aria-hidden="true"></b-icon>
                    </b-button>
                  </span>
                  <span v-if="!sectionShowSimple.references" class="text-right">
                    <b-button title="Simple UI"  @click="toggleSectionShowSimple('references')">
                      <b-icon icon="card-list" aria-hidden="true"></b-icon>
                    </b-button>
                  </span>
                </b-button-group>
              </b-card-header>
              <b-collapse id="references-tab" accordion="accordion-1" role="tabpanel">
                <b-card-body>
                  <data-list
                    :data="hermesMessage.data.references"
                    id="references"
                    datatype="Reference"
                    :errors="getErrors('data.references.non_field_errors', {})"
                    @new-row="addSection('references')"
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
                  </data-list>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-0" role="tab">
                <b-button-group class="w-100">
                  <b-button block v-b-toggle.extra-data-tab variant="light">
                    <b-row>
                      <b-col class="text-left error-icon">
                        <b-icon v-if="getErrors('data.extra_data', null)" icon="exclamation-circle-fill" variant="danger" :title="getErrorTooltipString('data.extra_data')"></b-icon>
                      </b-col>
                      <b-col class="text-center">
                        Extra Data
                      </b-col>
                    </b-row>
                  </b-button>
                  <b-button title="Advanced UI"  disabled>
                    <b-icon icon="diagram3" aria-hidden="true"></b-icon>
                  </b-button>
                </b-button-group>
              </b-card-header>
              <b-collapse id="extra-data-tab" accordion="accordion-6" role="tabpanel">
                <b-card-body style="overflow:scroll;">
                  <data-list
                    :data="hermesMessage.data.extra_data"
                    id="extra_data"
                    datatype="Extra Data"
                    :errors="getErrors('data.extra_data.non_field_errors', {})"
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
                  </data-list>
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
          <div class="accordion" role="tablist">
            <b-card no-body class="mb-1">
              <b-card-header header-tag="header" class="p-0" role="tab">
                <b-button-group class="w-100">
                  <b-button block v-b-toggle.message-tab variant="light">
                    <b-row>
                      <b-col class="text-left error-icon">
                        <b-icon v-if="getErrors('message_text', null)" icon="exclamation-circle-fill" variant="danger" :title="getErrorTooltipString('data.message_text')"></b-icon>
                      </b-col>
                      <b-col class="text-center">
                        Message Text
                      </b-col>
                    </b-row>
                  </b-button>
                  <b-button title="Advanced UI"  disabled>
                    <b-icon icon="diagram3" aria-hidden="true"></b-icon>
                  </b-button>
                </b-button-group>
              </b-card-header>
              <b-collapse id="message-tab" accordion="accordion-7" role="tabpanel">
                <b-card-body>
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
                </b-card-body>
              </b-collapse>
            </b-card>
          </div>
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
      </b-tabs>
    </b-card>
  </template>
  <script>
  import _ from 'lodash';
  import { mapGetters } from "vuex";
  import '@/assets/css/submissions.css';
  import DataList from '@/components/message-composition/DataList.vue'
  import DataReference from '@/components/message-composition/DataReference.vue'
  import DataTable from '@/components/message-composition/DataTable.vue'
  import DataTarget from '@/components/message-composition/DataTarget.vue'
  import DataPhotometry from '@/components/message-composition/DataPhotometry.vue'
  import DataSpectroscopy from '@/components/message-composition/DataSpectroscopy.vue'
  import DataAstrometry from '@/components/message-composition/DataAstrometry.vue'
  import ShowWrapper from '@/components/message-composition/ShowWrapper.vue'
  import { messageFormatMixin } from '@/mixins/messageFormatMixin.js';

  export default {
    name: 'HermesMessage',
    components: {
      ShowWrapper,
      DataList,
      DataReference,
      DataTable,
      DataTarget,
      DataPhotometry,
      DataSpectroscopy,
      DataAstrometry
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
          'astrometry': true,
          'extra_data': true
        },
        referenceFields: [
          {
            key: 'source',
            label: 'Source',
            type: 'text',
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
      ...mapGetters(["getWritableTopics"]),
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
    methods: {
      update: function (data) {
        this.$emit('hermes-message-updated', data);
      },
      messageUpdated: function (data) {
        this.update(data);
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
        this.update();
      },
      getDataErrorsArray: function (section, idx) {
        return _.get(this.getErrors('data', {}), [section, idx], {});
      },
      getErrors: function (key, default_value) {
        return _.get(this.errors, key, default_value);
      },
      getErrorTooltipString: function(key) {
        let error = this.getErrors(key, null);
        if (error == null){
          return null;
        }
        let errorStr = 'Field Errors:\n';
        if (_.isArray(error)){
          for (var i = 0; i < error.length; i += 1) {
            if (!_.isEmpty(error[i])) {
              _.forEach(error[i], function(value, key) {
                errorStr += i + ': ' + key + '\n';
              });
            }
          }
        }
        return errorStr;
      },
      toggleSectionShowSimple: function (section) {
        this.sectionShowSimple[section] = !this.sectionShowSimple[section]
      }
    }
  };
  </script>
  