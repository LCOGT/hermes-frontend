<template>
    <b-container fluid class="outside-container">
        <b-container fluid class="inside-container">
            <div class="accordion" role="tablist">
                <b-card no-body border-variant="primary">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                        <b-button block v-b-toggle.accordion-1 variant="primary">What is Hermes?</b-button>
                    </b-card-header>
                    <b-collapse id="accordion-1" visible accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <b-card-text>
                                HERMES is a Message Exchange Service for Multi-Messenger Astronomy
                                applications that allow users to both send and review messages related
                                to a variety of events and targets of interest as well as understand
                                opportunities for follow-up.
                            </b-card-text>
                        </b-card-body>
                    </b-collapse>
                </b-card>
                <b-card no-body border-variant="primary">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                        <b-button block v-b-toggle.accordion-2 variant="primary">How do I log in?</b-button>
                    </b-card-header>
                    <b-collapse id="accordion-2" visible accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <b-card-text>
                                <p>
                                    If you already have an account with SCiMMA HopSkotch, simply click on
                                    <em>Log in</em> under the "HERMES Guest" username above.
                                </p>
                                <p>
                                    If you are new to SCiMMA HopSkotch, you will need to make an account there
                                    before you can log into Hermes. We’ve worked hard to make signing up easy and
                                    simple by using single-sign-on (SSO) technology. Hermes uses accounts in the
                                    SCiMMA HopSkotch system. Once you have reached <a href="https://hop.scimma.org/">
                                        <b>hop.scimma.org</b></a>, click <em>Sign Up</em> (in the middle of the page) and
                                    use
                                    CILogon to select an Identity Provider of your choice.
                                </p>
                                <p>
                                    Once this is done, you can return to Hermes and log in using the same Identity
                                    Provider you chose for accessing SCiMMA.
                                </p>
                            </b-card-text>
                        </b-card-body>
                    </b-collapse>
                </b-card>
                <b-card no-body border-variant="primary">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                        <b-button block v-b-toggle.accordion-3 variant="primary">Can I access Hermes via an API?</b-button>
                    </b-card-header>
                    <b-collapse id="accordion-3" visible accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <b-card-text>
                                HERMES message validation and submission can be accessed via API. The available endpoints are as follows:
                                <b-list-group>
                                    <b-list-group-item>
                                        <b>Validation:</b> <code>{{ baseUrl }}api/v0/submit_message/validate/</code>
                                    </b-list-group-item>
                                    <b-list-group-item>
                                        <b>Submission:</b> <code>{{ baseUrl }}api/v0/submit_message/</code>
                                    </b-list-group-item>
                                </b-list-group>
                                <b-card no-body class="mb-2">
                                    <b-button block v-b-toggle.accordion-schema variant="primary">API Schema</b-button>
                                    <b-collapse id="accordion-schema" accordion="accordion-schema" role="tabpanel">
                                        <b-table striped hover :items="items">
                                            <template #cell(Description)="data">
                                                <span v-html="data.value"></span>
                                            </template>
                                        </b-table>
                                        <b-card no-body class="mb-2">
                                            <b-button block v-b-toggle.accordion-data variant="primary">Data</b-button>
                                            <b-collapse id="accordion-data" accordion="accordion-data" role="tabpanel">
                                                <b-table striped hover :items="data_items">
                                                    <template #cell(Description)="data">
                                                        <span v-html="data.value"></span>
                                                    </template>
                                                </b-table>
                                                <b-card no-body class="mb-2">
                                                    <b-button block v-b-toggle.accordion-reference variant="primary">Reference</b-button>
                                                    <b-collapse id="accordion-reference" accordion="accordion-reference" role="tabpanel">
                                                        <b-table striped hover :items="reference_items">
                                                            <template #cell(Description)="data">
                                                                <span v-html="data.value"></span>
                                                            </template>
                                                        </b-table>
                                                    </b-collapse>
                                                </b-card>
                                                <b-card no-body class="mb-2">
                                                    <b-button block v-b-toggle.accordion-target variant="primary">Target</b-button>
                                                    <b-collapse id="accordion-target" accordion="accordion-target" role="tabpanel">
                                                        <b-card>Note that either RA and Dec or orbital elements are required.</b-card>
                                                        <b-table striped hover :items="target_items">
                                                            <template #cell(Description)="data">
                                                                <span v-html="data.value"></span>
                                                            </template>
                                                        </b-table>
                                                        <b-card no-body class="mb-2">
                                                            <b-button block v-b-toggle.accordion-orbital-elements variant="primary">Orbital Elements</b-button>
                                                            <b-collapse id="accordion-orbital-elements" accordion="accordion-orbital-elements" role="tabpanel">
                                                                <b-table striped hover :items="orbital_items">
                                                                    <template #cell(Description)="data">
                                                                        <span v-html="data.value"></span>
                                                                    </template>
                                                                </b-table>
                                                            </b-collapse>
                                                        </b-card>
                                                        <b-card no-body class="mb-2">
                                                            <b-button block v-b-toggle.accordion-discovery variant="primary">Discovery Info</b-button>
                                                            <b-collapse id="accordion-discovery" accordion="accordion-discovery" role="tabpanel">
                                                                <b-table striped hover :items="discovery_items">
                                                                    <template #cell(Description)="data">
                                                                        <span v-html="data.value"></span>
                                                                    </template>
                                                                </b-table>
                                                            </b-collapse>
                                                        </b-card>
                                                    </b-collapse>
                                                </b-card>
                                                <b-card no-body class="mb-2">
                                                    <b-button block v-b-toggle.accordion-photometry variant="primary">Photometry</b-button>
                                                    <b-collapse id="accordion-photometry" accordion="accordion-photometry" role="tabpanel">
                                                        <b-table striped hover :items="photometry_items">
                                                            <template #cell(Description)="data">
                                                                <span v-html="data.value"></span>
                                                            </template>
                                                        </b-table>
                                                    </b-collapse>
                                                </b-card>
                                                <b-card no-body class="mb-2">
                                                    <b-button block v-b-toggle.accordion-astrometry variant="primary">Astrometry</b-button>
                                                    <b-collapse id="accordion-astrometry" accordion="accordion-astrometry" role="tabpanel">
                                                        <b-card>
                                                            <b-table striped hover :items="astrometry_items">
                                                                <template #cell(Description)="data">
                                                                    <span v-html="data.value"></span>
                                                                </template>
                                                            </b-table>
                                                        </b-card>
                                                    </b-collapse>
                                                </b-card>
                                                <b-card no-body class="mb-2">
                                                    <b-button block v-b-toggle.accordion-spectroscopy variant="primary">Spectroscopy</b-button>
                                                    <b-collapse id="accordion-spectroscopy" accordion="accordion-spectroscopy" role="tabpanel">
                                                        <b-table striped hover :items="spectroscopy_items">
                                                            <template #cell(Description)="data">
                                                                <span v-html="data.value"></span>
                                                            </template>
                                                        </b-table>
                                                    </b-collapse>
                                                </b-card>
                                            </b-collapse>
                                        </b-card>
                                    </b-collapse>
                                </b-card>

                            </b-card-text>
                        </b-card-body>
                    </b-collapse>
                </b-card>
            </div>
            <div>
                <hr />
                <b-row>
                    <b-col class="text-primary text-left">
                        An <a href="https://lco.global/" target="_blank" rel="noopener noreferrer"><b>LCO</b></a> project
                        built in
                        <br />
                        collaboration with <a href="https://scimma.org/index.html" target="_blank"
                            rel="noopener noreferrer"><b>SCiMMA</b></a>.
                    </b-col>
                    <b-col class="text-primary text-right">
                        <a href="mailto:hermes@lco.global">Contact <b>HERMES</b></a>
                    </b-col>
                </b-row>
            </div>
        </b-container>
    </b-container>
</template>

<script>
import getEnv from "@/utils/env.js";
export default {
    data() {
        return {
            items: [
                { Field: 'title', Description: 'String, required: Title of the message.' },
                { Field: 'authors', Description: 'String: Authors of the message, required if message is set or if reporting to TNS.' },
                { Field: 'message_text', Description: 'String: Message text.' },
                { Field: 'data', Description: 'Object / Dict: Semi-structured message <code>Data</code>, format shown below.' },
                { Field: 'submit_to_tns', Description: 'bool: Submit to the Transient Name Server?' },
                { Field: 'submit_to_mpc', Description: 'bool: Submit to the Minor Planet Center?' },
            ],
            data_items: [
                { Field: 'event_id', Description: 'String: Non-localized event ID to associate this message e.g. S170817.' },
                { Field: 'references', Description: 'List of <code>Reference</code>s.' },
                { Field: 'targets', Description: 'List of <code>Target</code>s to reference in the message.' },
                { Field: 'photometry', Description: 'List of <code>Photometry</code> measurements.' },
                { Field: 'spectroscopy', Description: 'List of <code>Spectroscopy</code> measurements.' },
                { Field: 'astrometry', Description: 'List of <code>Astrometry</code> measurements.' },
                { Field: 'key1, key2, ...', Description: 'Users can specify any other key-value pairs that are desired.' },
            ],
            reference_items: [
                { Field: 'source', Description: 'String, required: Source of the reference, e.g. hop_uuid, doi, or gracedb_id.' },
                { Field: 'citation', Description: 'String, required: Text to reference in th message, e.g. GCN number.' },
                { Field: 'url', Description: 'String, required: URL to the reference e.g. https://doi.org/mydoi.' }
            ],
            target_items: [
                { Field: 'name', Description: 'String, required: Name of target; will be referenced at the key in other sections like photometry.' },
                { Field: 'new_discovery', Description: 'bool: Is this target a new discovery?' },
                { Field: 'ra', Description: 'String or Float: RA of the target; Value can be in sexagesimal or decimal degrees; Required for reporting to the TNS.' },
                { Field: 'dec', Description: 'String or Float: Dec of the target; Value can be in sexagesimal or decimal degrees; Required for reporting to the TNS.' },
                { Field: 'ra_error', Description: 'Float: Uncertainty on RA.' },
                { Field: 'dec_error', Description: 'Float: Uncertainty on Dec.' },
                { Field: 'ra_error_units', Description: 'String: Units for the error on RA; choices: [degree, arcmin, arcsec].' },
                { Field: 'dec_error_units', Description: 'String: Units for the error on Dec; choices: [degree, arcmin, arcsec].' },
                { Field: 'pm_ra', Description: 'Float: Proper motion in RA in mas/year.' },
                { Field: 'pm_dec', Description: 'Float: Proper motion in Dec in mas/year.' },
                { Field: 'epoch', Description: 'Float: Julian epoch of the coordinates; Default is 2000.'},
                { Field: 'orbital_elements', Description: '<code>Orbital Elements</code>.' },
                { Field: 'discovery_info', Description: '<code>Discovery Info</code>.' },
                { Field: 'redshift', Description: 'Float: redshift of the target.' },
                { Field: 'host_name', Description: 'String: Name of the host galaxy.' },
                { Field: 'host_redshift', Description: 'Float: redshift of the host galaxy.' },
                { Field: 'distance', Description: 'Float: distance to the target.' },
                { Field: 'distance_error', Description: 'Float: Uncertainty in distance to the target.' },
                { Field: 'distance_units', Description: 'String: Units of distance to the target; choices: [cm, m, km, ].' },
                { Field: 'aliases', Description: 'List of Strings: List of alternate names, e.g. internal names for the target.' },
            ],
            orbital_items: [
                { Field: 'epoch_of_elements', Description: 'Date/Time: Epoch of the elements.' },
                { Field: 'orbital_inclination', Description: 'Float: Orbital elements in decimal degrees.' },
                { Field: 'longitude_of_the_ascending_node', Description: 'Float: Longitude of the Ascending Node in decimal degrees.' },
                { Field: 'argument_of_the_perihelion', Description: 'Float: Argument of the Perihelion in decimal degrees.' },
                { Field: 'eccentricity', Description: 'Float: eccentricity of the orbit.' },
                { Field: 'semimajor_axis', Description: 'Float: Semi-major axis in AU.' },
                { Field: 'mean_anomaly', Description: 'Float: Mean Anomaly in decimal degrees.' },
                { Field: 'perihelion_distance', Description: 'Float: Perihelion Distance in AU.' },
                { Field: 'epoch_of_perihelion', Description: 'Date/Time: Epoch of the Perihelion, typically for comets.' }
            ],
            discovery_items: [
                { Field: 'reporting_group', Description: 'String: Reporting Group required for TNS Submission.' },
                { Field: 'discovery_source', Description: 'String: Discovery Data Source required for TNS Submission.' },
                { Field: 'transient_type', Description: 'String: Type of transient; TNS accepts any of [PSN, nuc, PNV, AGN, Other].' },
                { Field: 'proprietary_period', Description: 'Float: Length of time discovery should remain proprietary on TNS.' },
                { Field: 'proprietary_period_unit', Description: 'Sring: Units for proprietary period; [Days, Months, Years].' },
                { Field: 'group_associations', Description: 'String: Groups to associate with this discovery on TNS.' },
            ],
            photometry_items: [
                { Field: 'target_name', Description: 'String: Name of the target. Must match the name of a target in the targets section.' },
                { Field: 'date_obs', Description: 'Date/Time: Date/Time of the observation. Excepts either a float which is assumed JD/MJD depending on value, or an ISO format.' },
                { Field: 'telescope', Description: 'String: Telescope used to obtain photometry.' },
                { Field: 'instrument', Description: 'String: Instrument used to obtain photometry.' },
                { Field: 'discovery', Description: 'bool: Should this point be used as the discovery announcement in TNS?' },
                { Field: 'brightness', Description: 'Float: Brightness measurement.' },
                { Field: 'brightness_error', Description: 'Float: Error on the brightness measurement.' },
                { Field: 'unit', Description: 'Brightness unit; Accepted values are [AB mag, Vega mag, Jsky, erg/s/cm^2/A].' },
                { Field: 'bandpass', Description: 'String: Wavelength bandpass used for the observation, e.g. filter.' },
                { Field: 'exposure_time', Description: 'Float: Exposure time in seconds.' },
                { Field: 'observer', Description: 'String: Observer(s) of the data.' },
                { Field: 'limiting_brightness', Description: 'Float: 3-sigma limiting brightness of the image.' },
                { Field: 'limiting_brightness_unit', Description: 'String: Limiting Brightness unit; Accepted values are [AB mag, Vega mag, Jsky, erg/s/cm^2/A].' },
                { Field: 'group_associations', Description: 'String: Group associations for TNS.' },
                { Field: 'catalog', Description: 'String: Reference photometric catalog used, e.g. SDSS.' },
                { Field: 'comments', Description: 'String: Free form section for comments about the observation.' },
            ],
            astrometry_items: [
                { Field: 'target_name', Description: 'String: Name of the target. Must match the name of a target in the targets section' },
                { Field: 'date_obs', Description: 'Date / Time: Date/ Time of the observation. Excepts either a float which is assumed JD/MJD depending on value, or an ISO format.' },
                { Field: 'telescope', Description: 'String: Telescope used to obtain astrometry' },
                { Field: 'instrument', Description: 'String: Instrument used to obtain astrometry' },
                { Field: 'ra', Description: 'String or Float: RA of the target; Value can be in sexagesimal or decimal degrees' },
                { Field: 'dec', Description: 'String or Float: Dec of the target; Value can be in sexagesimal or decimal degrees' },
                { Field: 'ra_error', Description: 'Float: Uncertainty on RA' },
                { Field: 'dec_error', Description: 'Float: Uncertainty on Dec' },
                { Field: 'ra_error_units', Description: 'String: Units for the error on RA; choices: [degree, arcmin, arcsec]' },
                { Field: 'dec_error_units', Description: 'String: Units for the error on Dec; choices: [degree, arcmin, arcsec]' },
                { Field: 'mpc_sitecode', Description: 'String: Site code to use to submit to the Minor Planet Center' },
                { Field: 'catalog', Description: 'String: Reference astrometric catalog used, e.g. GAIA-DR2' },
                { Field: 'comments', Description: 'String: Free form section for comments about the observation' },
            ],
            spectroscopy_items: [
                { Field: 'target_name', Description: 'String: Name of the target. Must match the name of a target in the targets section.' },
                { Field: 'date_obs', Description: 'Date / Time: Date/ Time of the observation. Excepts either a float which is assumed JD/MJD depending on value, or an ISO format.' },
                { Field: 'telescope', Description: 'String: Telescope used to obtain spectra.' },
                { Field: 'instrument', Description: 'String: Instrument used to obtain spectra.' },
                { Field: 'setup', Description: 'String: Setup of the instrument.' },
                { Field: 'exposure_time', Description: 'Float: Exposure time in seconds.' },
                { Field: 'flux', Description: 'Array of floats: the flux values of the spectrum.' },
                { Field: 'error', Description: 'Array of floats: the flux errors of the spectrum.' },
                { Field: 'wavelength', Description: 'Array of floats: the wavelength values of the spectral bins.' },
                { Field: 'wavelegnth_unit', Description: 'String: Units of the wavelength values; Choices: [A, nm, um, Hz, GHz, THz].' },
                { Field: 'flux_type', Description: 'String: Type of flux in the reported spectrum; Choices: [Flambda, Fnu].' },
                { Field: 'classification', Description: 'String: Classification of target. If submitting to TNS, classification must be a recognized TNS type.' },
                { Field: 'proprietary_period', Description: 'Float: Length of time spectrum/classification should remain proprietary on TNS.' },
                { Field: 'proprietary_period_unit', Description: 'Sring: Units for proprietary period; [Days, Months, Years].' },
                { Field: 'observer', Description: 'String: Observer(s) of the data.' },
                { Field: 'reducer', Description: 'String: Person who reduced the spectrum.' },
                { Field: 'group_associations', Description: 'String: Group associations for TNS.' },
                { Field: 'spec_type', Description: 'String: Type of spectrum; Choices: [Object, Host, Synthetic, Sky, Arcs].' },
                { Field: 'comments', Description: 'String: Free form section for comments about the observation.' },
            ],
            baseUrl: getEnv("VUE_APP_HERMES_BACKEND_ROOT_URL")
        }
    }
}
</script>

<style scoped>
button {
    color: white;
}
</style>
