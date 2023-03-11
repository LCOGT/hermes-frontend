import _ from 'lodash';

export var messageFormatMixin = {
  computed: {
    formattedMessage: function () {
      // Convert message to plaintext with values inserted
      let formatted_string = _.clone(this.hermesMessage.message_text);
      // This nasty regex makes a list of elements that are in curly brackets
      const keys_to_format = formatted_string.match(/[^{}]+(?=})/g);
      // Store comparison lists for keys
      const extraDataObj = Object.assign({}, ...this.hermesMessage.data.extra_data.map(extra_data => {
        return { [extra_data.key]: extra_data.value };
      }))
      const generalDataKeys = ['title', 'authors', 'topic', 'submitter'];
      // Loop through potential keys to search for matches
      for (let i in keys_to_format) {
        // Check for row references and convert to Camel Case
        var keyChain = keys_to_format[i].split(".")
        if (keyChain[0] in extraDataObj) {
          formatted_string = formatted_string.replace(RegExp('{' + keys_to_format[i] + '}', 'g'), extraDataObj[keyChain[0]]);
        }
        else if (generalDataKeys.includes(keyChain[0])) {
          formatted_string = formatted_string.replace(RegExp('{' + keys_to_format[i] + '}', 'g'), this.hermesMessage[keyChain[0]]);
        }
        else {
          // Attempt to get the value from the data structure... if it fails, do nothing
          let value = _.get(this.hermesMessage.data, keys_to_format[i])
          if (_.isObjectLike(value)) {
            value = JSON.stringify(value);
          }
          if (value != undefined) {
            formatted_string = formatted_string.replace(RegExp('{' + keys_to_format[i] + '}', 'g'), value);
          }
        }
      }
      return formatted_string;
    }
  },
  methods: {
    sanitizeMessageSection: function(message) {
      for(var i = 0; i < message.length; i += 1) {
        if (!_.isEmpty(message[i].discovery_info)){
          message[i].discovery_info = _.omitBy(message[i].discovery_info, field => field === null || _.isEmpty(field));
        }
        if (!_.isEmpty(message[i].orbital_elements)){
          message[i].orbital_elements = _.omitBy(message[i].orbital_elements, field => field === null || _.isEmpty(field));
        }
        message[i] = _.omitBy(message[i], field => field === null || _.isEmpty(field));
        if (!_.isEmpty(message[i].aliases)){
          message[i].aliases = message[i].aliases.split(',');
        }
      }
      return message;
    },
    flattenExtraData: function(extra_data) {
      let flattenedExtraData = {};
      for(var i = 0; i < extra_data.length; i += 1) {
        if (!_.isEmpty(extra_data[i].key) && !_.isEmpty(extra_data[i].value)) {
          flattenedExtraData[extra_data[i].key] = extra_data[i].value;
        }
      }
      return flattenedExtraData;
    },
    sanitizedMessageData: function() {
      let cleanMessage = _.cloneDeep(this.hermesMessage);
      if (_.isEmpty(cleanMessage.data.event_id)) {
        delete cleanMessage.data.event_id;
      }
      cleanMessage.data.references = this.sanitizeMessageSection(cleanMessage.data.references);
      cleanMessage.data.targets = this.sanitizeMessageSection(cleanMessage.data.targets);
      cleanMessage.data.photometry = this.sanitizeMessageSection(cleanMessage.data.photometry);
      cleanMessage.data.spectroscopy = this.sanitizeMessageSection(cleanMessage.data.spectroscopy);
      cleanMessage.data.astrometry = this.sanitizeMessageSection(cleanMessage.data.astrometry);
      cleanMessage.data.extra_data = this.flattenExtraData(cleanMessage.data.extra_data);
      if (!_.isEmpty(cleanMessage.message_text)){
        cleanMessage.message_text = this.formattedMessage;
      }
      return cleanMessage;
    }
  }
};
