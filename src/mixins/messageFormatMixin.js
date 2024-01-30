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
    hasAnyFiles: function(message) {
      if (message.files.length > 0) {
        return true;
      }
      for (var i = 0; i < message.data.spectroscopy.length; i += 1) {
        if (message.data.spectroscopy[i].files.length > 0) {
          return true;
        }
      }
      return false;
    },
    sanitizeMessageSection: function(message) {
      for(var i = 0; i < message.length; i += 1) {
        if (!_.isEmpty(message[i].discovery_info)){
          message[i].discovery_info = _.omitBy(message[i].discovery_info, field => field === null || (_.isEmpty(field) && !_.isBoolean(field)));
        }
        if (!_.isEmpty(message[i].orbital_elements)){
          message[i].orbital_elements = _.omitBy(message[i].orbital_elements, field => field === null || (_.isEmpty(field) && !_.isBoolean(field)));
        }
        message[i] = _.omitBy(message[i], (value, key) => key.includes('unit') && key.replace('_unit', '')  in message[i] && message[i][key.replace('_unit', '')] === null);
        message[i] = _.omitBy(message[i], field => field === null || (_.isEmpty(field) && !_.isBoolean(field)));
        if (!_.isEmpty(message[i].group_associations) && _.isString(message[i].group_associations)){
          message[i].group_associations = message[i].group_associations.split(',');
        }
        if (!_.isEmpty(message[i].aliases)  && _.isString(message[i].aliases)){
          message[i].aliases = message[i].aliases.split(',');
        }
      }
      // Remove empty objects
      return message.filter(obj => Object.keys(obj).length !== 0);
    },
    flattenExtraData: function(extra_data) {
      const keywordSections = ['targets', 'references', 'event_id', 'astrometry', 'spectroscopy'];
      let flattenedExtraData = {};
      for(var i = 0; i < extra_data.length; i += 1) {
        if (!_.isEmpty(extra_data[i].key) && !_.isEmpty(extra_data[i].value) && !keywordSections.includes(extra_data[i].key)) {
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

      // Clean up the general file sections into what the serializer expects
      let cleanGeneralFiles = [];
      for (var i = 0; i < cleanMessage.files.length; i += 1){
        cleanGeneralFiles.push({
          'name': cleanMessage.files[i].name,
          'description': cleanMessage.file_descriptions[i]
        });
      }
      cleanMessage.file_info = cleanGeneralFiles;
      delete cleanMessage.file_descriptions;
      delete cleanMessage.files;
      if (_.isEmpty(cleanMessage.file_info)) {
        delete cleanMessage.file_info;
      }

      // Remove target type from the message
      for (i = 0; i < cleanMessage.data.targets.length; i += 1) {
        delete cleanMessage.data.targets[i].type;
      }

      // Clean up the spectroscopy file sections into what the serializer expects
      for (i = 0; i < cleanMessage.data.spectroscopy.length; i += 1) {
        if (cleanMessage.data.spectroscopy[i].files.length > 0) {
          let cleanFiles = [];
          for (var j = 0; j < cleanMessage.data.spectroscopy[i].files.length; j += 1) {
            cleanFiles.push({
              'name': cleanMessage.data.spectroscopy[i].files[j].name,
              'description': cleanMessage.data.spectroscopy[i].file_descriptions[j]
            });
          }
          cleanMessage.data.spectroscopy[i].file_info = cleanFiles;
          delete cleanMessage.data.spectroscopy[i].files;
          delete cleanMessage.data.spectroscopy[i].file_descriptions;
        }
      }
      cleanMessage.data.references = this.sanitizeMessageSection(cleanMessage.data.references);
      cleanMessage.data.targets = this.sanitizeMessageSection(cleanMessage.data.targets);
      cleanMessage.data.photometry = this.sanitizeMessageSection(cleanMessage.data.photometry);
      cleanMessage.data.spectroscopy = this.sanitizeMessageSection(cleanMessage.data.spectroscopy);
      cleanMessage.data.astrometry = this.sanitizeMessageSection(cleanMessage.data.astrometry);
      cleanMessage.data = _.assign(cleanMessage.data, this.flattenExtraData(cleanMessage.data.extra_data));
      delete cleanMessage.data.extra_data;
      if (!_.isEmpty(cleanMessage.message_text)){
        cleanMessage.message_text = this.formattedMessage;
      }
      return cleanMessage;
    }
  }
};
