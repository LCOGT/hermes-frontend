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
                                    simple by using single-sign-on (SSO) technology.
                                    <br>
                                    Click on <em>Register</em> under the "HERMES Guest" username above. This will
                                    redirect you to <b>CILogon</b> where you can choose an identity provider like
                                    Google or ORCID. Sign into the provider, and you will be redirected to <a href="https://hop.scimma.org/">
                                    <b>hop.scimma.org</b></a>. Once you have accepted the use policy, you will now
                                    be registerd with SCiMMA and you will be redirected back to Hermes.
                                </p>
                                <p>
                                    If you wish to update your credentials or add topics to your account, you will
                                    need to sign into <a href="https://hop.scimma.org/"><b>SCiMMA Auth</b></a> using
                                    the same credentials you just used to register.
                                </p>
                            </b-card-text>
                        </b-card-body>
                    </b-collapse>
                </b-card>
                <b-card no-body border-variant="primary">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                        <b-button block v-b-toggle.accordion-3 variant="primary">How to access Hermes via an API</b-button>
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
                            </b-card-text>
                        </b-card-body>
                    </b-collapse>
                </b-card>
                <b-card no-body class="mb-2">
                    <b-button block v-b-toggle.accordion-schema variant="primary">API Schema</b-button>
                    <b-collapse id="accordion-schema" accordion="accordion-schema" role="tabpanel">
                        <b-table striped hover :items="items">
                            <template #cell(Field)="fieldData">
                                <span v-html="fieldData.value"></span>
                            </template>
                            <template #cell(Description)="data">
                                <span v-html="data.value"></span>
                            </template>
                        </b-table>
                        <b-card text-variant="danger">* Required.</b-card>
                        <b-card no-body class="mb-2">
                            <b-button block v-b-toggle.accordion-data variant="primary">Data</b-button>
                            <b-collapse id="accordion-data" accordion="accordion-data" role="tabpanel">
                                <b-table striped hover :items="data_items">
                                    <template #cell(Field)="fieldData">
                                        <span v-html="fieldData.value"></span>
                                    </template>
                                    <template #cell(Description)="data">
                                        <span v-html="data.value"></span>
                                    </template>
                                </b-table>
                                <b-card text-variant="danger">
                                    * At least one <code>target</code> is required when including <code>photometry</code>,
                                    <code>spectroscopy</code>, or <code>astrometry</code> data.
                                </b-card>
                                <b-card no-body class="mb-2">
                                    <b-button block v-b-toggle.accordion-reference variant="primary">Reference</b-button>
                                    <b-collapse id="accordion-reference" accordion="accordion-subdata" role="tabpanel">
                                        <b-table striped hover :items="reference_items">
                                            <template #cell(Field)="fieldData">
                                                <span v-html="fieldData.value"></span>
                                            </template>
                                            <template #cell(Description)="data">
                                                <span v-html="data.value"></span>
                                            </template>
                                        </b-table>
                                        <b-card text-variant="danger">
                                            <sup>1,2</sup> Either both <code>source</code> and <code>citation</code>, or
                                            a <code>url</code> is required.
                                        </b-card>
                                    </b-collapse>
                                </b-card>
                                <b-card no-body class="mb-2">
                                    <b-button block v-b-toggle.accordion-target variant="primary">Target</b-button>
                                    <b-collapse id="accordion-target" accordion="accordion-subdata" role="tabpanel">
                                        <b-table striped hover :items="target_items">
                                            <template #cell(Field)="fieldData">
                                                <span v-html="fieldData.value"></span>
                                            </template>
                                            <template #cell(Description)="data">
                                                <span v-html="data.value"></span>
                                            </template>
                                        </b-table>
                                        <b-card text-variant="danger">
                                            * Required. <br>
                                            <sup>1,2</sup> Either both <code>ra</code> and <code>dec</code>, or
                                            <code>orbital_elements</code> is required.
                                        </b-card>
                                        <b-card no-body class="mb-2 mx-4">
                                            <b-button block v-b-toggle.accordion-orbital-elements variant="primary">Orbital Elements</b-button>
                                            <b-collapse id="accordion-orbital-elements" accordion="accordion-subtarget" role="tabpanel">
                                                <b-table striped hover :items="orbital_items">
                                                    <template #cell(Field)="fieldData">
                                                        <span v-html="fieldData.value"></span>
                                                    </template>
                                                    <template #cell(Description)="data">
                                                        <span v-html="data.value"></span>
                                                    </template>
                                                </b-table>
                                                <b-card text-variant="danger">* Required. <br>
                                                    <sup>1,2</sup> Either both <code>semimajor_axis</code> and <code>mean_anomaly</code>, or
                                                    both <code>perihelion_distance</code> and <code>epoch_of_perihelion</code> are required.
                                                </b-card>
                                            </b-collapse>
                                        </b-card>
                                        <b-card no-body class="mb-2 mx-4">
                                            <b-button block v-b-toggle.accordion-discovery variant="primary">Discovery Info</b-button>
                                            <b-collapse id="accordion-discovery" accordion="accordion-subtarget" role="tabpanel">
                                                <b-table striped hover :items="discovery_items">
                                                    <template #cell(Field)="fieldData">
                                                        <span v-html="fieldData.value"></span>
                                                    </template>
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
                                    <b-collapse id="accordion-photometry" accordion="accordion-subdata" role="tabpanel">
                                        <b-table striped hover :items="photometry_items">
                                            <template #cell(Field)="fieldData">
                                                <span v-html="fieldData.value"></span>
                                            </template>
                                            <template #cell(Description)="data">
                                                <span v-html="data.value"></span>
                                            </template>
                                        </b-table>
                                        <b-card text-variant="danger">
                                            * Required. <br>
                                            <sup>1</sup> Either <code>telescope</code> or <code>instrument</code> is required. <br>
                                            <sup>2</sup> Either <code>brightness</code> or <code>limiting_brightness</code> is required.
                                        </b-card>
                                    </b-collapse>
                                </b-card>
                                <b-card no-body class="mb-2">
                                    <b-button block v-b-toggle.accordion-astrometry variant="primary">Astrometry</b-button>
                                    <b-collapse id="accordion-astrometry" accordion="accordion-subdata" role="tabpanel">
                                        <b-card>
                                            <b-table striped hover :items="astrometry_items">
                                                <template #cell(Field)="fieldData">
                                                    <span v-html="fieldData.value"></span>
                                                </template>
                                                <template #cell(Description)="data">
                                                    <span v-html="data.value"></span>
                                                </template>
                                            </b-table>
                                            <b-card text-variant="danger">
                                                * Required. <br>
                                                <sup>1</sup> Either <code>telescope</code> or <code>instrument</code> is required. <br>
                                            </b-card>
                                        </b-card>
                                    </b-collapse>
                                </b-card>
                                <b-card no-body class="mb-2">
                                    <b-button block v-b-toggle.accordion-spectroscopy variant="primary">Spectroscopy</b-button>
                                    <b-collapse id="accordion-spectroscopy" accordion="accordion-subdata" role="tabpanel">
                                        <b-table striped hover :items="spectroscopy_items">
                                            <template #cell(Field)="fieldData">
                                                <span v-html="fieldData.value"></span>
                                            </template>
                                            <template #cell(Description)="data">
                                                <span v-html="data.value"></span>
                                            </template>
                                        </b-table>
                                        <b-card text-variant="danger">
                                            * Required. <br>
                                            <sup>1</sup> Either <code>telescope</code> or <code>instrument</code> is required. <br>
                                        </b-card>
                                    </b-collapse>
                                </b-card>
                            </b-collapse>
                        </b-card>
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
                { Field: 'title<span class="text-danger">*</span>', Description: 'String: Title of the message.' },
                { Field: 'authors', Description: 'String: Authors of the message, required if message is set or if reporting to TNS.' },
                { Field: 'message_text', Description: 'String: Message text.' },
                { Field: 'data', Description: 'Object / Dict: Semi-structured message <code>Data</code>, format shown below.' },
                { Field: 'submit_to_tns', Description: 'Bool: Submit to the Transient Name Server?' },
                { Field: 'submit_to_mpc', Description: 'Bool: Submit to the Minor Planet Center?' },
            ],
            data_items: [
                { Field: 'event_id', Description: 'String: Non-localized event ID to associate this message e.g. S170817.' },
                { Field: 'references', Description: 'List of <code>Reference</code>s.' },
                { Field: 'targets<span class="text-danger">*</span>', Description: 'List of <code>Target</code>s to reference in the message.' },
                { Field: 'photometry', Description: 'List of <code>Photometry</code> measurements.' },
                { Field: 'spectroscopy', Description: 'List of <code>Spectroscopy</code> measurements.' },
                { Field: 'astrometry', Description: 'List of <code>Astrometry</code> measurements.' },
                { Field: 'key1, key2, ...', Description: 'Users can specify any other key-value pairs that are desired.' },
            ],
            reference_items: [
                { Field: 'source<sup class="text-danger">1</sup>', Description: 'String: Source of the reference, e.g. hop_uuid, doi, or gracedb_id.' },
                { Field: 'citation<sup class="text-danger">1</sup>', Description: 'String: Text to reference in th message, e.g. GCN number.' },
                { Field: 'url<sup class="text-danger">2</sup>', Description: 'String: URL to the reference e.g. https://doi.org/mydoi.' }
            ],
            target_items: [
                { Field: 'name<span class="text-danger">*</span>', Description: 'String: Name of target; will be referenced at the key in other sections like photometry.' },
                { Field: 'new_discovery', Description: 'Bool: Is this target a new discovery?' },
                { Field: 'ra<sup class="text-danger">1</sup>', Description: 'String or Float: RA of the target; Value can be in sexagesimal or decimal degrees; Required for reporting to the TNS.' },
                { Field: 'dec<sup class="text-danger">1</sup>', Description: 'String or Float: Dec of the target; Value can be in sexagesimal or decimal degrees; Required for reporting to the TNS.' },
                { Field: 'ra_error', Description: 'Float: Uncertainty on RA.' },
                { Field: 'dec_error', Description: 'Float: Uncertainty on Dec.' },
                { Field: 'ra_error_units', Description: 'String: Units for the error on RA; choices: [degree, arcmin, arcsec, mas].' },
                { Field: 'dec_error_units', Description: 'String: Units for the error on Dec; choices: [degree, arcmin, arcsec, mas].' },
                { Field: 'pm_ra', Description: 'Float: Proper motion in RA in mas/year.' },
                { Field: 'pm_dec', Description: 'Float: Proper motion in Dec in mas/year.' },
                { Field: 'epoch', Description: 'Float: Julian epoch of the coordinates; Default is 2000.'},
                { Field: 'orbital_elements<sup class="text-danger">2</sup>', Description: '<code>Orbital Elements</code>.' },
                { Field: 'discovery_info', Description: '<code>Discovery Info</code>.' },
                { Field: 'redshift', Description: 'Float: Redshift of the target.' },
                { Field: 'host_name', Description: 'String: Name of the host galaxy.' },
                { Field: 'host_redshift', Description: 'Float: Redshift of the host galaxy.' },
                { Field: 'distance', Description: 'Float: Distance to the target.' },
                { Field: 'distance_error', Description: 'Float: Uncertainty in distance to the target.' },
                { Field: 'distance_units', Description: 'String: Units of distance to the target; choices: [cm, m, km, au, ly, pc, kpc, Mpc, Gpc].' },
                { Field: 'aliases', Description: 'List of Strings: List of alternate names, e.g. internal names for the target.' },
            ],
            orbital_items: [
                { Field: 'epoch_of_elements<span class="text-danger">*</span>', Description: 'Date/Time: Epoch of the elements.' },
                { Field: 'orbital_inclination<span class="text-danger">*</span>', Description: 'Float: Orbital inclination in decimal degrees.' },
                { Field: 'longitude_of_the_ascending_node<span class="text-danger">*</span>', Description: 'Float: Longitude of the Ascending Node in decimal degrees.' },
                { Field: 'argument_of_the_perihelion<span class="text-danger">*</span>', Description: 'Float: Argument of the Perihelion in decimal degrees.' },
                { Field: 'eccentricity<span class="text-danger">*</sup>', Description: 'Float: Eccentricity of the orbit.' },
                { Field: 'semimajor_axis<sup class="text-danger">1</sup>', Description: 'Float: Semi-major axis in AU.' },
                { Field: 'mean_anomaly<sup class="text-danger">1</sup>', Description: 'Float: Mean Anomaly in decimal degrees.' },
                { Field: 'perihelion_distance<sup class="text-danger">2</sup>', Description: 'Float: Perihelion Distance in AU.' },
                { Field: 'epoch_of_perihelion<sup class="text-danger">2</sup>', Description: 'Date/Time: Epoch of the nearest perihelion passage, typically for comets.' }
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
                { Field: 'target_name<span class="text-danger">*</span>', Description: 'String: Name of the target. Must match the name of a target in the targets section.' },
                { Field: 'date_obs<span class="text-danger">*</span>', Description: 'Date/Time: Date/Time of the observation. Accepts either a float which is assumed JD/MJD depending on value, or an ISO format.' },
                { Field: 'telescope<sup class="text-danger">1</sup>', Description: 'String: Telescope used to obtain photometry.' },
                { Field: 'instrument<sup class="text-danger">1</sup>', Description: 'String: Instrument used to obtain photometry.' },
                { Field: 'discovery', Description: 'Bool: Should this point be used as the discovery announcement in TNS?' },
                { Field: 'brightness<sup class="text-danger">2</sup>', Description: 'Float: Brightness measurement.' },
                { Field: 'brightness_error', Description: 'Float: Error on the brightness measurement.' },
                { Field: 'unit', Description: 'Brightness unit; Accepted values are [AB mag, Vega mag, Jsky, erg/s/cm^2/&#8491].' },
                { Field: 'bandpass<span class="text-danger">*</span>', Description: 'String: Wavelength bandpass used for the observation, e.g. filter.' },
                { Field: 'exposure_time', Description: 'Float: Exposure time in seconds.' },
                { Field: 'observer', Description: 'String: Observer(s) of the data.' },
                { Field: 'limiting_brightness<sup class="text-danger">2</sup>', Description: 'Float: 3-sigma limiting brightness of the image.' },
                { Field: 'limiting_brightness_unit', Description: 'String: Limiting Brightness unit; Accepted values are [AB mag, Vega mag, Jsky, erg/s/cm^2/&#8491].' },
                { Field: 'group_associations', Description: 'String: Group associations for TNS.' },
                { Field: 'catalog', Description: 'String: Reference photometric catalog used, e.g. SDSS.' },
                { Field: 'comments', Description: 'String: Free form section for comments about the observation.' },
            ],
            astrometry_items: [
                { Field: 'target_name<span class="text-danger">*</span>', Description: 'String: Name of the target. Must match the name of a target in the targets section' },
                { Field: 'date_obs<span class="text-danger">*</span>', Description: 'Date/Time: Date/Time of the observation. Accepts either a float which is assumed JD/MJD depending on value, or an ISO format.' },
                { Field: 'telescope<sup class="text-danger">1</sup>', Description: 'String: Telescope used to obtain astrometry' },
                { Field: 'instrument<sup class="text-danger">1</sup>', Description: 'String: Instrument used to obtain astrometry' },
                { Field: 'ra<span class="text-danger">*</span>', Description: 'String or Float: RA of the target; Value can be in sexagesimal or decimal degrees' },
                { Field: 'dec<span class="text-danger">*</span>', Description: 'String or Float: Dec of the target; Value can be in sexagesimal or decimal degrees' },
                { Field: 'ra_error', Description: 'Float: Uncertainty on RA' },
                { Field: 'dec_error', Description: 'Float: Uncertainty on Dec' },
                { Field: 'ra_error_units', Description: 'String: Units for the error on RA; choices: [degree, arcmin, arcsec, mas]' },
                { Field: 'dec_error_units', Description: 'String: Units for the error on Dec; choices: [degree, arcmin, arcsec, mas]' },
                { Field: 'mpc_sitecode', Description: 'String: Site code to use to submit to the Minor Planet Center' },
                { Field: 'catalog', Description: 'String: Reference astrometric catalog used, e.g. GAIA-DR2' },
                { Field: 'comments', Description: 'String: Free form section for comments about the observation' },
            ],
            spectroscopy_items: [
                { Field: 'target_name<span class="text-danger">*</span>', Description: 'String: Name of the target. Must match the name of a target in the targets section.' },
                { Field: 'date_obs<span class="text-danger">*</span>', Description: 'Date/Time: Date/Time of the observation. Accepts either a float which is assumed JD/MJD depending on value, or an ISO format.' },
                { Field: 'telescope<sup class="text-danger">1</sup>', Description: 'String: Telescope used to obtain spectra.' },
                { Field: 'instrument<sup class="text-danger">1</sup>', Description: 'String: Instrument used to obtain spectra.' },
                { Field: 'setup', Description: 'String: Setup of the instrument.' },
                { Field: 'exposure_time', Description: 'Float: Exposure time in seconds.' },
                { Field: 'flux<span class="text-danger">*</span>', Description: 'Array of floats: the flux values of the spectrum.' },
                { Field: 'flux_unit', Description: 'String: Units of the flux values; Choices: [mJy, erg/s/cm<sup>2</sup>/&#8491].' },
                { Field: 'error', Description: 'Array of floats: the flux errors of the spectrum.' },
                { Field: 'wavelength<span class="text-danger">*</span>', Description: 'Array of floats: the wavelength values of the spectral bins.' },
                { Field: 'wavelegnth_unit', Description: 'String: Units of the wavelength values; Choices: [&#8491, nm, um, Hz, GHz, THz].' },
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
