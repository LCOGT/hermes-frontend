<template>
  <b-container fluid class="outside-container">
    <!-- Form Title -->
    <h1>{{ pageTitle }}</h1>
    <!-- Basic Info Form -->
    <b-card class="mb-2 shadow" border-variant="primary">
      <b-row class=p-2>
        <b-col>
          <label for="title-input">Title:</label>
          <b-form-input class="title-input" v-model="title" placeholder="Title"></b-form-input>
        </b-col>
        <b-col>
          <div>
            <label for="topic-input">Topic:</label>
            <b-form-select class="topic-input" v-model="topic" :options="['hermes.test']">Topic</b-form-select>
          </div>
        </b-col>
      </b-row>
      <b-row class=p-2>
        <b-col class="eventid-col">
          <label for="eventid-input">Event ID:</label>
          <b-form-input class="eventid-input" v-model="eventid" placeholder="Event ID"></b-form-input>
        </b-col>
        <b-col class="authors-col">
          <label for="authors-input">Authors:</label>
          <b-form-input class="authors-input" v-model="authors" placeholder="Authors"></b-form-input>
        </b-col>
      </b-row>
    </b-card>
    <!-- Data Tables -->
    <b-card class="mb-2 shadow" border-variant="primary">
      <b-row>
        <b-col class="input-table-col">
        <slot></slot>
        </b-col>
        <b-col class="extra-input-col">
          <label for="extra-input-table">Additional Data Elements:</label>
          <additional-data-input-table class="extra-input-table"></additional-data-input-table>
        </b-col>
      </b-row>
    </b-card>
    <!-- Message Form -->
    <b-card class="mb-2 shadow" border-variant="primary">
      <b-row class="p-3">
        <label for="message-input">Message:</label>
        <b-form-textarea v-model="message" id="message-input" placeholder="Message" rows="3" max-rows="6"></b-form-textarea>
      </b-row>
    </b-card>
    <!-- Submit -->
    <b-row>
      <b-col>
        <div class="submit-container">
          <b-button class="submit-button shadow" variant="success" @click="submitMessage">Submit</b-button>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import AdditionalDataTable from "@/components/AdditionalDataTable";

export default {
  name: "MessageForm",
  methods: {
    submitMessage() {
      this.$emit("submit_message")
    }
  },
  props: ["pageTitle"],
  mounted() {
    this.topic = 'hermes.test'
  },
  data() {
    return {
      title: '',
      authors: '',
      topic: null,
      message: '',
      eventid: '',
      user: 'Hermes User.guest',
    };
  },
  components: {
    "additional-data-input-table": AdditionalDataTable
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
</style>