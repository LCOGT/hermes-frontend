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
                        <b-button block v-b-toggle.accordion-2 variant="primary">Logging In / Logging Out</b-button>
                    </b-card-header>
                    <b-collapse id="accordion-2" visible accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <b-card-text>
                                <p>
                                    If you already have an account with SCiMMA HopSkotch, simply click on
                                    <em>Log in</em> under the <b-icon icon="person-fill"></b-icon> menu above.
                                </p>
                                <p>
                                    If you are new to SCiMMA HopSkotch, you will need to make an account there
                                    before you can log into Hermes. We’ve worked hard to make signing up easy and
                                    simple by using single-sign-on (SSO) technology.
                                    <br>
                                    Click on <em>Register</em> under the <b-icon icon="person-fill"></b-icon> menu above. This will
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
                                <p><b>How do I log out of Hermes?</b><br>
                                Under your profile name you will see an option to log out. This will log you out of Hermes and you will become a guest user.
                                However, your computer will store the cookies from CILogon, and when you log back into Hermes, you will be automatically logged on
                                using the same profile as before. If you wish to log into Hermes using a different profile you will need to either close your browser
                                between sessions, clear your cookies, or <a href="https://cilogon.org/logout/"><b>logout from CILogon manually</b></a> before returning to Hermes.
                                </p>
                            </b-card-text>
                        </b-card-body>
                    </b-collapse>
                </b-card>
                <b-card no-body border-variant="primary">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                        <b-button block v-b-toggle.accordion-3 variant="primary">Access Hermes via an API</b-button>
                    </b-card-header>
                    <b-collapse id="accordion-3" visible accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <b-tabs class="message-tabs" content-class="mt-2">
                                <b-tab title="Basic API Post" active ref="basicTab">
                                    <b>HERMES message validation and submission can be accessed via API. The available endpoints are as follows:</b>
                                    <b-list-group>
                                        <b-list-group-item>
                                            <b>Validation:</b> <code><a :href="this.getHermesUrl + 'api/v0/submit_message/validate/'">{{ this.getHermesUrl}}api/v0/submit_message/validate/</a></code>
                                        </b-list-group-item>
                                        <b-list-group-item>
                                            <b>Submission:</b> <code><a :href="this.getHermesUrl + 'api/v0/submit_message/'">{{ this.getHermesUrl }}api/v0/submit_message/</a></code>
                                        </b-list-group-item>
                                    </b-list-group>
                                    <b-card-group>
                                        <b-card header="Submitting a message to Hermes API:">
                                            <b>Using your Hermes API Token and the above submission API path, you can use Hermes to submit a message to a kafka topic.</b>
                                            <li>Create a header for your submission including the API token from your <a :href="getHermesUrl + 'profile'">profile</a>.</li>
                                            <li>Build a message dictionary. This can just be as simple as a topic, a title, and a submitter.</li>
                                            <li>Post your request.</li>
                                            <br>
                                            <P>Note: During development, you can use the validation endpoint above to check that your message passes validation without submitting to the stream.</P>
                                        </b-card>
                                        <b-card header="Example Submission (Python Code):">
                                            <pre>
import requests

hermes_submit_url = '{{ this.getHermesUrl }}api/v0/submit_message/'
HERMES_API_KEY = '1234567890'  # Copied from your profile page

# Authenticate User in Request Headers
headers = {'Authorization': f'Token {HERMES_API_KEY}'}

# Define Your Message Dictionary
message = {
    'topic': 'test.topic',
    'title': 'Test Title',
    'submitter': 'YourNameHere',
    'data': {},
    'message_text': 'Sample Message',
}

# Submit to Hermes
response = requests.post(url=hermes_submit_url, json=message, headers=headers)
                                            </pre>
                                        </b-card>
                                    </b-card-group>
                                </b-tab>
                                <b-tab title="Hermes Data Table">
                                    <b-card-group>
                                        <b-card header="Construct your Data Dictionary:">
                                            <b>You can check the specifics of the API schema using the registry below.</b>
                                            <li>Build a <code>data</code> dictionary containing your desired tables.</li>
                                            <li><code>targets</code> can include a number of designated targets.</li>
                                            <li><code>photometry</code> and similar tables require a matching target name from the <code>targets</code> table.</li>
                                            <li><code>extra_info</code> is a dictionary that can contain any key/value pairs the user wants to include.</li>
                                            <li>Include the <code>data</code> dictionary in the message info prior to submission.</li>
                                        </b-card>
                                        <b-card header="Example Data Dictionary (Python Code):">
                                            <pre>
'data': {
    'targets': [{
        'name': target_name,
        'ra': target_ra,
        'dec': target_dec,
    },],
    'photometry': [{
        'target_name': target_name,
        'date_obs': photometry_date.isoformat(),
        'telescope': photometry_telescope,
        'instrument': photometry_instrument,
        'bandpass': photometry_filter,
        'brightness_unit': photometry_unit,
    },],
    'extra_info': {
        'key1': 'value1',
        'key2': 'value2',
    }
}
                                            </pre>
                                        </b-card>
                                    </b-card-group>
                                </b-tab>
                                <b-tab title="Referencing files">
                                    <b>Files referenced in the target and spectroscopy sections can be uploaded to be stored and accesible publicly from the Scimma Archive.</b>
                                    <b-card-group>
                                        <b-card header="Submitting a message with files to upload:">
                                            <li>Same as the basic submission, except files are separate from the json data, and filenames are referenced in the json data. Payload is submitted as multipart/form-data instead of json.</li>
                                            <li>Target and Spectroscopy sections contain an optional <code>file_info</code> list of file objects containing [<code>name, description, url</code>].</li>
                                            <li>Only file <code>name</code> is required, and must match the name of a file being uploaded if no url is supplied.</li>
                                            <li>If your file is already accessible on the web, you can choose not to upload it to the Scimma Archive and just reference it with the <code>url</code>.</li>
                                            <li>If not, after your file is uploaded to the Scimma Archive, its publicly accessible <code>url</code> will be inserted into the message before submission.</li>
                                            <li><font color="red">NOTE:</font> All files with <code>name</code>s matching an uploaded file will be uploaded to the Scimma Archive and publicly accessible if the proprietary period is unset or set to 0!</li>
                                            <br>
                                            <P>Note: During development, you can use the validation endpoint that your message passes validation without submitting to the stream. The validation endpoint expects only json data, as specified in the <b-link @click="activeTab1()">Build a Basic API Post</b-link> section</P>
                                        </b-card>
                                        <b-card header="Example Submission (Python Code):">
                                            <pre>
import requests
import json

hermes_submit_url = '{{ this.getHermesUrl }}api/v0/submit_message/'
HERMES_API_KEY = '1234567890'  # Copied from your profile page

# Authenticate User in Request Headers
headers = {'Authorization': f'Token {HERMES_API_KEY}'}

# Define Your Message Dictionary
message = {
    'topic': 'test.topic',
    'title': 'Test Title',
    'submitter': 'YourNameHere',
    'authors': 'First Last (Institution), First2 Last2 (Institution2)',
    'data': {
        'targets': [{
            'name': 'my-target-1',
            'ra': 22.0,
            'dec': 33.0,
            'file_info': [
            {
                'name': 'MyTargetFile.fits',
                'description': 'This is a finder chart for my target.'
            }],
        }],
        'spectroscopy': [{
            'target_name': 'my-target-1',
            'date_obs': 'JD, MJD, or ISO format date',
            'telescope': 'insert_telescope_name',
            'instrument': 'insert_instrument_name',
            'bandpass': 'insert_filter_name',
            'file_info': [
            {
                'name': 'MySpectrumFile1.fits',
                'description': 'This is a reduced spectrum of my target.'
            },
            {
                'name': 'MySpectrumData1.csv',
                'description': 'This is a csv file of data from my spectrum.'
            }],
        },
        {
            'target_name': 'my-target-1',
            'date_obs': 'JD, MJD, or ISO format date',
            'telescope': 'insert_telescope_name',
            'instrument': 'insert_instrument_name',
            'bandpass': 'insert_filter_name',
            'files': [{
                'name': 'MySpectrumFile2.fits',
                'description': 'This is an example of a file hosted on my own server.',
                'url': 'https://my-server/path-to-my-file/MySpectrumFile2.fits'
            }],
        }]
    },
    'message_text': 'Sample Spectroscopy Message',
}

# JSON encode message so it can be sent with files as part of multipart/form-data
data = {'data': json.dumps(message)}

# Define your files to upload to TNS
files = [
    ('files', ('MySpectrumData1.csv', open('insert_filepath_1.csv', 'rb'), 'text/csv')),
    ('files', ('MySpectrumFile1.fits', open('insert_filepath_2.fits', 'rb'), 'application/fits')),
    ('files', ('MyTargetFile.jpg', open('insert_filepath_3.jpg', 'rb'), 'image/jpeg'))
]

# Submit to Hermes
response = requests.post(url=hermes_submit_url, data=data, files=files, headers=headers)
                                            </pre>
                                        </b-card>
                                    </b-card-group>
                                </b-tab>
                                <b-tab title="TNS AT report">
                                    <b>HERMES messages submission can also trigger a submission to the <a href="https://www.wis-tns.org/">Transient Name Server (TNS)</a> as an AT Report. Related files can also be uploaded to the TNS during this type of submission.</b>
                                    <b-list-group>
                                        <b-list-group-item>
                                            <b>Validation:</b> <code><a :href="this.getHermesUrl + 'api/v0/submit_message/validate/'">{{ this.getHermesUrl}}api/v0/submit_message/validate/</a></code> (Only accepts json data without files)
                                        </b-list-group-item>
                                        <b-list-group-item>
                                            <b>Submission:</b> <code><a :href="this.getHermesUrl + 'api/v0/submit_message/'">{{ this.getHermesUrl }}api/v0/submit_message/</a></code>
                                        </b-list-group-item>
                                    </b-list-group>
                                    <b-card-group>
                                        <b-card header="Submitting a message to Hermes API and TNS:">
                                            <b>Using your Hermes API Token and the above submission API path, you can use Hermes to submit a message to a kafka topic.</b>
                                            <li>Create a header for your submission including the API token from your <a :href="getHermesUrl + 'profile'">profile</a>.</li>
                                            <li>Build a message dictionary. TNS submission requires certain fields, including title, authors, at least one target with group and discovery information, and at least one photometry datapoint and one limiting brightness.</li>
                                            <li>Certain fields are required to use one of the available <a href="https://www.wis-tns.org/api/values">TNS options values</a> when submitting to TNS.</li>
                                            <li>Related files can also be uploaded as part of the TNS submission. They will reside on the TNS and can be downloaded from the TNS object page. Their filenames must be included in Targets <code>file_info</code> section, and the file must be uploaded with the submission.</li>
                                            <li>A list of <code>file_info</code> objects must be added to each Target with at least the file <code>name</code> as a parameter, but optionally a <code>description</code> as well.</li>
                                            <li><font color="red">NOTE:</font> All files with <code>name</code>s matching an uploaded file will be uploaded to the Scimma Archive and publicly accessible if the proprietary period is unset or set to 0!</li>
                                            <li>The TNS object ID and a link to it's page will be added to the hermes message on submission</li>
                                            <br>
                                            <P>Note: During development, you can use the validation endpoint above to check that your message passes validation without submitting to the stream. The validation endpoint expects only json data, as specified in the <b-link @click="activeTab1()">Build a Basic API Post</b-link> section</P>
                                        </b-card>
                                        <b-card header="Example Submission (Python Code):">
                                            <pre>
import requests
import json

hermes_submit_url = '{{ this.getHermesUrl }}api/v0/submit_message/'
HERMES_API_KEY = '1234567890'  # Copied from your profile page

# Authenticate User in Request Headers
headers = {'Authorization': f'Token {HERMES_API_KEY}'}

# Define Your Message Dictionary
message = {
    'topic': 'test.topic',
    'title': 'Test Title',
    'submit_to_tns': True,
    'submitter': 'YourNameHere',
    'authors': 'First Last (Institution), First2 Last2 (Institution2)',
    'data': {
        'targets': [{
            'name': 'my-target-1',
            'ra': 22.0,
            'dec': 33.0,
            'discovery_info': {
                'discovery_source': 'insert_tns_group_name',
                'reporting_group': 'insert_tns_group_name',
            },
            'new_discovery': True,
            'group_association': ['tns_group_name1', 'tns_group_name2'],
            'comments': "The AT report remarks",
            'file_info': [{
                'name': 'insert_filename_1.csv',
                'description': 'This is my image data'  # Optional
            },
            {
                'name': 'insert_filename_2.fits',
                'description': 'This is my finder chart image'  # Optional
            }]
        }],
        'photometry': [{
            'target_name': 'my-target-1',
            'date_obs': 'JD, MJD, or ISO format date',
            'telescope': 'insert_tns_telescope_name',
            'instrument': 'insert_tns_instrument_name',
            'bandpass': 'insert_tns_filter_name',
            'brightness': '33',
            'brightness_unit': 'AB mag'
        },
        {
            'target_name': 'my-target-1',
            'date_obs': 'earlier JD, MJD, or ISO format date',
            'telescope': 'insert_tns_telescope_name',
            'instrument': 'insert_tns_instrument_name',
            'bandpass': 'insert_tns_filter_name',
            'limiting_brightness': '25',
            'brightness_unit': 'AB mag'
        }]
    },
    'message_text': 'Sample Message',
}

# JSON encode message so it can be sent with files as part of multipart/form-data
data = {'data': json.dumps(message)}

# Define your files to upload to TNS
files = [
    ('files', ('insert_filename_1.csv', open('/path/insert_filename_1.csv', 'rb'), 'text/csv')),
    ('files', ('insert_filename_2.fits', open('/path/insert_filename_2.fits', 'rb'), 'application/fits'))
]

# Submit to Hermes
response = requests.post(url=hermes_submit_url, data=data, files=files, headers=headers)
                                            </pre>
                                        </b-card>
                                    </b-card-group>
                                </b-tab>
                                <b-tab title="TNS classification">
                                    <b>HERMES messages submission can also trigger a submission to the <a href="https://www.wis-tns.org/">Transient Name Server (TNS)</a> as a Classification report. Related files and Spectra files can also be uploaded to the TNS during this type of submission.</b>
                                    <b-list-group>
                                        <b-list-group-item>
                                            <b>Validation:</b> <code><a :href="this.getHermesUrl + 'api/v0/submit_message/validate/'">{{ this.getHermesUrl}}api/v0/submit_message/validate/</a></code> (Only accepts json data without files)
                                        </b-list-group-item>
                                        <b-list-group-item>
                                            <b>Submission:</b> <code><a :href="this.getHermesUrl + 'api/v0/submit_message/'">{{ this.getHermesUrl }}api/v0/submit_message/</a></code>
                                        </b-list-group-item>
                                    </b-list-group>
                                    <b-card-group>
                                        <b-card header="Submitting a message to Hermes API and TNS:">
                                            <b>Using your Hermes API Token and the above submission API path, you can use Hermes to submit a message to a kafka topic.</b>
                                            <li>Create a header for your submission including the API token from your <a :href="getHermesUrl + 'profile'">profile</a>.</li>
                                            <li>Build a message dictionary. TNS submission requires certain fields, including title, authors, a target whose name matches an existing TNS object, and one or more spectroscopy sections with uploaded ascii spectrum files</li>
                                            <li>Certain fields are required to use one of the available <a href="https://www.wis-tns.org/api/values">TNS options values</a> when submitting to TNS.</li>
                                            <li>Related files can also be uploaded as part of the TNS classification report. They will reside on the TNS and can be downloaded from the TNS object page. Their filenames must be included in the Targets <code>file_info</code> section, and the file must be uploaded with the submission.</li>
                                            <li>A list of <code>file_info</code> objects must be added to each Spectroscopy entry with at least the file <code>name</code> as a parameter, but optionally a <code>description</code> as well.</li>
                                            <li>A .ascii or .txt file with spectral data in the format TNS expects is required for each Spectroscopy entry, and the report will also accept an optional .fits file per entry.</li>
                                            <li><font color="red">NOTE:</font> All files with <code>name</code>s matching an uploaded file will be uploaded to the Scimma Archive and publicly accessible if the proprietary period is unset or set to 0!</li>
                                            <li>The TNS object ID and a link to it's page will be added to the hermes message on submission</li>
                                            <br>
                                            <P>Note: During development, you can use the validation endpoint above to check that your message passes validation without submitting to the stream. The validation endpoint expects only json data, as specified in the <b-link @click="activeTab1()">Build a Basic API Post</b-link> section</P>
                                        </b-card>
                                        <b-card header="Example Submission (Python Code):">
                                            <pre>
import requests
import json

hermes_submit_url = '{{ this.getHermesUrl }}api/v0/submit_message/'
HERMES_API_KEY = '1234567890'  # Copied from your profile page

# Authenticate User in Request Headers
headers = {'Authorization': f'Token {HERMES_API_KEY}'}

# Define Your Message Dictionary
message = {
    'topic': 'test.topic',
    'title': 'Test Title',
    'submit_to_tns': True,
    'submitter': 'YourNameHere',
    'authors': 'First Last (Institution), First2 Last2 (Institution2)',
    'data': {
        'targets': [{
            'name': '2024abc',  # This should be the TNS object id
            'ra': 22.0,
            'dec': 33.0,
            'discovery_info': {
                'reporting_group': 'insert_tns_group_name',
            },
            'new_discovery': false,
            'group_association': ['tns_group_name1', 'tns_group_name2'],
            'comments': "The classification report remarks",
            'file_info': [{
                'name': 'insert_filename_1.csv',
                'description': 'This is my image data'  # Optional
            },
            {
                'name': 'insert_filename_2.fits',
                'description': 'This is my finder chart image'  # Optional
            }]
        }],
        'spectroscopy': [{
            'target_name': '2024abc',
            'date_obs': 'JD, MJD, or ISO format date',
            'telescope': 'insert_tns_telescope_name',
            'instrument': 'insert_tns_instrument_name',
            'classification': 'insert_tns_object_type',
            'spec_type': 'insert_tns_spectra_type',
            'observer': 'Observers name or designation',
            'reducer': 'Reducers name or designation',
            'exposure_time': 'exposure time of observation',
            'proprietary_period': '24',
            'proprietary_period_units': 'Days',
            'comments': 'The spectrograph section remarks',
            'file_info': [{
                'name': 'insert_spectra_1.txt',
                'description': 'This is my ascii TNS formatted spectra file'  # Required
            },
            {
                'name': 'insert_spectra_2.fits',
                'description': 'This is my fits version of my spectra image'  # Optional
            }]
        },
        {
            'target_name': 'my-target-1',
            'date_obs': 'earlier JD, MJD, or ISO format date',
            'telescope': 'insert_tns_telescope_name',
            'instrument': 'insert_tns_instrument_name',
            'bandpass': 'insert_tns_filter_name',
            'limiting_brightness': '25',
            'brightness_unit': 'AB mag'
        }]
    },
    'message_text': 'Sample Message',
}

# JSON encode message so it can be sent with files as part of multipart/form-data
data = {'data': json.dumps(message)}

# Define your files to upload to TNS
files = [
    ('files', ('insert_filename_1.csv', open('/path/insert_filename_1.csv', 'rb'), 'text/csv')),
    ('files', ('insert_spectra_1.txt', open('/path/insert_spectra_1.txt', 'rb'), 'text/plain')),
    ('files', ('insert_spectra_2.fits', open('/path/insert_spectra_2.fits', 'rb'), 'application/fits')),
    ('files', ('insert_filename_2.fits', open('/path/insert_filename_2.fits', 'rb'), 'application/fits'))
]

# Submit to Hermes
response = requests.post(url=hermes_submit_url, data=data, files=files, headers=headers)
                                            </pre>
                                        </b-card>
                                    </b-card-group>
                                </b-tab>
                                <b-tab title="Working with SCiMMA Credentials">
                                    <p>Hermes will create and store <b>SCiMMA Credentials</b> the first time you log in. These <b>SCiMMA Credentials</b> are what Hermes will use to send messages
                                    through HopSkotch on your behalf. They include a username that you can get from your <a :href="getHermesUrl + 'profile'">Hermes profile</a>. In general
                                    you shouldn't need to alter these credentials unless they somehow get in a bad state or you wish to add or remove topic permissions. If you want
                                    to reset your credentials, simply use the button on the profile page. If you wish to change your topic permissions, use the following steps:
                                    </p>
                                    <li>Sign into <a href="https://hop.scimma.org/"><b>SCiMMA Auth</b></a> using
                                    the same login details you used to register with Hermes.</li>
                                    <li>Find your Hermes credentials in your list. It will say "Created by HERMES" in the description, but if you have more than one, the credential
                                        username will match what's in your Hermes profile.</li>
                                    <li>Click the blue "Manage" button next to your credential username.</li>
                                    <li>Add, remove, or change your favorite topic permissions.</li>
                                    <li>Log out and return to Hermes.</li>
                                    <li>Log out and log back into Hermes to clear cache and update accesible topics.</li>
                                </b-tab>
                                </b-tabs>
                        </b-card-body>
                    </b-collapse>
                </b-card>
                <b-card no-body class="mb-2">
                    <b-button block v-b-toggle.accordion-schema variant="primary">API Schema Registry</b-button>
                    <b-collapse id="accordion-schema" accordion="accordion-schema" role="tabpanel">
                        <b-table striped hover :items="items">
                            <template #cell(Field)="fieldData">
                                <span v-html="fieldData.value"></span>
                            </template>
                            <template #cell(Description)="data">
                                <span v-html="data.value"></span>
                            </template>
                        </b-table>
                        <b-card text-variant="danger">
                            * Required. <br>
                            <p class="card-text text-info"><sup>&dagger;</sup> Required if <code>submit_to_tns</code> is set to true.</p>
                        </b-card>
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
                                    <p class="card-text text-info"><sup>&dagger;</sup> Required if <code>submit_to_tns</code> is set to true.</p>
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
                                            <p class="card-text text-info"><sup>&dagger;</sup> Required if <code>submit_to_tns</code> is set to true.</p>
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
                                                <b-card text-variant="danger">
                                                    <p class="card-text text-info"><sup>&dagger;</sup> Required if <code>submit_to_tns</code> is set to true.</p>
                                                </b-card>
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
                                            <p class="card-text text-info"><sup>&dagger;</sup> Required if <code>submit_to_tns</code> is set to true.</p>
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
                                            <sup>2</sup> Either <code>flux, wavelength</code> or <code>files</code> are required. <br>
                                            <p class="card-text text-info"><sup>&dagger;</sup> Required if <code>submit_to_tns</code> is set to true.</p>
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
                        <br />
                        <a href="https://github.com/LCOGT/hermes-frontend/issues"><em>Report Issues</em></a>
                    </b-col>
                </b-row>
            </div>
        </b-container>
    </b-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            items: [
                { Field: 'title<span class="text-danger">*</span>', Description: 'String: Title of the message.' },
                { Field: 'topic<span class="text-danger">*</span>', Description: 'String: Kafka topic for the message. (i.e. "hermes.test")' },
                { Field: 'submitter<span class="text-danger">*</span>', Description: 'String: Person or bot submitting the message.' },
                { Field: 'authors<sup class="text-info">&dagger;</sup>', Description: 'String: Authors of the message' },
                { Field: 'message_text', Description: 'String: Message text.' },
                { Field: 'data', Description: 'Object / Dict: Semi-structured message <code>Data</code>, format shown below.' },
                { Field: 'submit_to_tns', Description: 'Bool: Submit to the Transient Name Server?' },
                { Field: 'submit_to_mpc', Description: 'Bool: Submit to the Minor Planet Center?' },
            ],
            data_items: [
                { Field: 'event_id', Description: 'String: Non-localized event ID to associate this message e.g. S170817.' },
                { Field: 'references', Description: 'List of <code>Reference</code>s.' },
                { Field: 'targets<span class="text-danger">*</span><sup class="text-info">&dagger;</sup>', Description: 'List of <code>Target</code>s to reference in the message.' },
                { Field: 'photometry<sup class="text-info">&dagger;</sup>', Description: 'List of <code>Photometry</code> measurements.' },
                { Field: 'spectroscopy<sup class="text-info">&dagger;</sup>', Description: 'List of <code>Spectroscopy</code> measurements.' },
                { Field: 'astrometry', Description: 'List of <code>Astrometry</code> measurements.' },
                { Field: 'key1, key2, ...', Description: 'Users can specify any other key-value pairs that are desired.' },
            ],
            reference_items: [
                { Field: 'source<sup class="text-danger">1</sup>', Description: 'String: Source of the reference, e.g. hop_uuid, doi, gracedb_id, or gcn_circular.' },
                { Field: 'citation<sup class="text-danger">1</sup>', Description: 'String: Text to reference in th message, e.g. GCN number.' },
                { Field: 'url<sup class="text-danger">2</sup>', Description: 'String: URL to the reference e.g. https://doi.org/mydoi.' }
            ],
            target_items: [
                { Field: 'name<span class="text-danger">*</span>', Description: 'String: Name of target; will be referenced at the key in other sections like photometry.' },
                { Field: 'new_discovery', Description: 'Bool: Is this target a new discovery?' },
                { Field: 'ra<sup class="text-danger">1</sup>', Description: 'String or Float: RA of the target; Value can be in sexagesimal or decimal degrees.' },
                { Field: 'dec<sup class="text-danger">1</sup>', Description: 'String or Float: Dec of the target; Value can be in sexagesimal or decimal degrees.' },
                { Field: 'ra_error', Description: 'Float: Uncertainty on RA.' },
                { Field: 'dec_error', Description: 'Float: Uncertainty on Dec.' },
                { Field: 'ra_error_units', Description: 'String: Units for the error on RA; choices: [degree, arcmin, arcsec, mas].' },
                { Field: 'dec_error_units', Description: 'String: Units for the error on Dec; choices: [degree, arcmin, arcsec, mas].' },
                { Field: 'pm_ra', Description: 'Float: Proper motion in RA in mas/year.' },
                { Field: 'pm_dec', Description: 'Float: Proper motion in Dec in mas/year.' },
                { Field: 'epoch', Description: 'Float: Julian epoch of the coordinates; Default is 2000.'},
                { Field: 'orbital_elements<sup class="text-danger">2</sup>', Description: '<code>Orbital Elements</code>.' },
                { Field: 'discovery_info<sup class="text-info">&dagger;</sup>', Description: '<code>Discovery Info</code>.' },
                { Field: 'redshift', Description: 'Float: Redshift of the target.' },
                { Field: 'host_name', Description: 'String: Name of the host galaxy.' },
                { Field: 'host_redshift', Description: 'Float: Redshift of the host galaxy.' },
                { Field: 'distance', Description: 'Float: Distance to the target.' },
                { Field: 'distance_error', Description: 'Float: Uncertainty in distance to the target.' },
                { Field: 'distance_units', Description: 'String: Units of distance to the target; choices: [cm, m, km, au, ly, pc, kpc, Mpc, Gpc].' },
                { Field: 'aliases', Description: 'List of Strings: List of alternate names, e.g. internal names for the target.' },
                { Field: 'group_associations', Description: 'List of Strings: Groups to associate with this discovery on TNS.' },
                { Field: 'comments', Description: 'String: Free form section for comments about the target. Used in TNS reports.' },
                { Field: 'file_info', Description: 'List of Dicts: List of files to upload, with each entry containing 3 keys (name, description, url). References files to upload in multipart/form-data by name.' },
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
                { Field: 'reporting_group<sup class="text-info">&dagger;</sup>', Description: 'String: Reporting Group required for TNS Submission.' },
                { Field: 'discovery_source<sup class="text-info">&dagger;</sup>', Description: 'String: Discovery Data Source required for TNS Submission.' },
                { Field: 'transient_type', Description: 'String: Type of transient; Accepted values are the TNS accepted at_types.' },
                { Field: 'proprietary_period', Description: 'Float: Length of time discovery should remain proprietary on TNS.' },
                { Field: 'proprietary_period_unit', Description: 'Sring: Units for proprietary period; [Days, Months, Years].' },
                { Field: 'nondetection_source', Description: 'String: Source catalog for the last nondetection on this target. Used in TNS reports.' },
                { Field: 'nondetection_comments', Description: 'String: Comments on the last nondetection of this target. Used in TNS reports.' },
            ],
            photometry_items: [
                { Field: 'target_name<span class="text-danger">*</span>', Description: 'String: Name of the target. Must match the name of a target in the targets section.' },
                { Field: 'date_obs<span class="text-danger">*</span>', Description: 'Date/Time: Date/Time of the observation. Accepts either a float which is assumed JD or an ISO format. (Should be parseable with dateutil.parser.parse.)' },
                { Field: 'telescope<sup class="text-danger">1</sup>', Description: 'String: Telescope used to obtain photometry.' },
                { Field: 'instrument<sup class="text-danger">1</sup><sup class="text-info">&dagger;</sup>', Description: 'String: Instrument used to obtain photometry.' },
                { Field: 'discovery', Description: 'Bool: Should this point be used as the discovery announcement in TNS?' },
                { Field: 'brightness<sup class="text-danger">2</sup>', Description: 'Float: Brightness measurement.' },
                { Field: 'brightness_error', Description: 'Float: Error on the brightness measurement.' },
                { Field: 'unit', Description: 'Brightness unit; Accepted values are [AB mag, Vega mag, Jsky, erg / s / cm<sup>2</sup> / &#8491].' },
                { Field: 'bandpass<span class="text-danger">*</span>', Description: 'String: Wavelength bandpass used for the observation, e.g. filter.' },
                { Field: 'exposure_time', Description: 'Float: Exposure time in seconds.' },
                { Field: 'observer', Description: 'String: Observer(s) of the data.' },
                { Field: 'limiting_brightness<sup class="text-danger">2</sup>', Description: 'Float: 3-sigma limiting brightness of the image.' },
                { Field: 'limiting_brightness_unit', Description: 'String: Limiting Brightness unit; Accepted values are [AB mag, Vega mag, Jsky, erg / s / cm<sup>2</sup> / &#8491].' },
                { Field: 'catalog', Description: 'String: Reference photometric catalog used, e.g. SDSS.' },
                { Field: 'comments', Description: 'String: Free form section for comments about the observation.' },
            ],
            astrometry_items: [
                { Field: 'target_name<span class="text-danger">*</span>', Description: 'String: Name of the target. Must match the name of a target in the targets section' },
                { Field: 'date_obs<span class="text-danger">*</span>', Description: 'Date/Time: Date/Time of the observation. Accepts either a float which is assumed JD or an ISO format. (Should be parseable with dateutil.parser.parse.)' },
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
                { Field: 'date_obs<span class="text-danger">*</span>', Description: 'Date/Time: Date/Time of the observation. Accepts either a float which is assumed JD or an ISO format. (Should be parseable with dateutil.parser.parse.)' },
                { Field: 'telescope<sup class="text-danger">1</sup>', Description: 'String: Telescope used to obtain spectra.' },
                { Field: 'instrument<sup class="text-danger">1</sup><sup class="text-info">&dagger;</sup>', Description: 'String: Instrument used to obtain spectra.' },
                { Field: 'setup', Description: 'String: Setup of the instrument.' },
                { Field: 'exposure_time', Description: 'Float: Exposure time in seconds.' },
                { Field: 'flux<span class="text-danger">2</span>', Description: 'Array of floats: the flux values of the spectrum.' },
                { Field: 'flux_unit', Description: 'String: Units of the flux values; Choices: [mJy, erg / s / cm<sup>2</sup> / &#8491].' },
                { Field: 'error', Description: 'Array of floats: the flux errors of the spectrum.' },
                { Field: 'wavelength<span class="text-danger">2</span>', Description: 'Array of floats: the wavelength values of the spectral bins.' },
                { Field: 'wavelegnth_unit', Description: 'String: Units of the wavelength values; Choices: [&#8491, nm, &mu;m, Hz, GHz, THz].' },
                { Field: 'file_info<span class="text-danger">2</span>', Description: 'List of Dicts: List of files to upload, with each entry containing 3 keys (name, description, url). References files to upload in multipart/form-data by name.' },
                { Field: 'flux_type', Description: 'String: Type of flux in the reported spectrum; Choices: [F&lambda;, F&nu;, Flambda, Fnu].' },
                { Field: 'classification', Description: 'String: Classification of target. If submitting to TNS, classification must be a recognized TNS type.' },
                { Field: 'proprietary_period', Description: 'Float: Length of time spectrum/classification should remain proprietary on TNS.' },
                { Field: 'proprietary_period_unit', Description: 'Sring: Units for proprietary period; [Days, Months, Years].' },
                { Field: 'observer<sup class="text-info">&dagger;</sup>', Description: 'String: Observer(s) of the data.' },
                { Field: 'reducer', Description: 'String: Person who reduced the spectrum.' },
                { Field: 'spec_type<sup class="text-info">&dagger;</sup>', Description: 'String: Type of spectrum; Choices: [Object, Host, Synthetic, Sky, Arcs].' },
                { Field: 'comments', Description: 'String: Free form section for comments about the observation.' },
            ]
        }
    },
    computed: {
        ...mapGetters(["getHermesUrl"])
    },
    methods: {
        activeTab1: function() {
            this.$refs['basicTab'].activate();
        }
    }
}
</script>

<style scoped>
button {
    color: white;
}
</style>
