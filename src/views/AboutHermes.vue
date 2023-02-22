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
                                HERMES is a Message Exchange Service for Multi-Messenger Astronomy applications that allow users to both send and review messages related to a variety of events and targets of interest.
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
                                To log into HERMES, you have to do a bunch of SCiMMA stuff. Just email Lindy, and he'll help you figure it out. :D
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