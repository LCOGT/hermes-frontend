<template>
    <b-container fluid class="outside-container">
        <b-container fluid class="inside-container">
            <div class="accordion" role="tablist">
                <b-card no-body class="mb-1" border-variant="primary">
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
                <b-card no-body class="mb-1" border-variant="primary">
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
                                SCiMMA HopSkotch system. Once you have reached <a href=https://hop.scimma.org/>
                                hop.scimma.org</a>, click <em>Sign Up</em> (in the middle of the page) and use
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
                <b-card no-body class="mb-1" border-variant="primary">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                        <b-button block v-b-toggle.accordion-3 variant="primary">Can I access Hermes via an API?</b-button>
                    </b-card-header>
                    <b-collapse id="accordion-3" visible accordion="my-accordion" role="tabpanel">
                        <b-card-body>
                            <b-card-text>
                                HERMES message validation and submission can be accessed via API.
                            </b-card-text>
                        </b-card-body>
                    </b-collapse>
                </b-card>
            </div>
              <div>
                <hr/>
                <b-row>
                <b-col class="text-primary text-left">
                    An <a href="https://lco.global/" target="_blank" rel="noopener noreferrer"><b>LCO</b></a> project built in
                    <br/>
                    collaboration with <a href="https://scimma.org/index.html" target="_blank" rel="noopener noreferrer"><b>SCiMMA</b></a>.
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

</script>

<style scoped>
button {
  color: white;
}
</style>