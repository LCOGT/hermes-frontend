import _ from 'lodash';

function sanitizeMessageSection(section) {
  for(var i = 0; i < section.length; i += 1) {
    if (section[i].files && section[i].files.length > 0) {
      let cleanFiles = [];
      for (var j = 0; j < section[i].files.length; j += 1) {
        cleanFiles.push({
          'name': section[i].files[j].name,
          'description': section[i].file_descriptions[j]
        });
      }
      section[i].file_info = cleanFiles;
      delete section[i].files;
      delete section[i].file_descriptions;
    }

    if (!_.isEmpty(section[i].discovery_info)){
      section[i].discovery_info = _.omitBy(section[i].discovery_info, field => field === null || (_.isEmpty(field) && !_.isBoolean(field)));
    }
    if (!_.isEmpty(section[i].orbital_elements)){
      section[i].orbital_elements = _.omitBy(section[i].orbital_elements, field => field === null || (_.isEmpty(field) && !_.isBoolean(field)));
    }
    section[i] = _.omitBy(section[i], (value, key) => key.includes('unit') && key.replace('_unit', '')  in section[i] && section[i][key.replace('_unit', '')] === null);
    section[i] = _.omitBy(section[i], field => field === null || (_.isEmpty(field) && !_.isBoolean(field)));
    if (!_.isEmpty(section[i].group_associations) && _.isString(section[i].group_associations)){
      section[i].group_associations = section[i].group_associations.split(',');
    }
    if (!_.isEmpty(section[i].aliases)  && _.isString(section[i].aliases)){
      section[i].aliases = section[i].aliases.split(',');
    }
  }
  // Remove empty objects
  return section.filter(obj => Object.keys(obj).length !== 0);
}

function flattenExtraData(extra_data) {
  const keywordSections = ['targets', 'references', 'event_id', 'astrometry', 'spectroscopy'];
  let flattenedExtraData = {};
  for(var i = 0; i < extra_data.length; i += 1) {
    if (!_.isEmpty(extra_data[i].key) && !_.isEmpty(extra_data[i].value) && !keywordSections.includes(extra_data[i].key)) {
      flattenedExtraData[extra_data[i].key] = extra_data[i].value;
    }
  }
  return flattenedExtraData;
}

export const formattedMessageText = (message) => {
  // Convert message to plaintext with values inserted
  let formatted_string = _.clone(message.message_text);
  // This nasty regex makes a list of elements that are in curly brackets
  const keys_to_format = formatted_string.match(/[^{}]+(?=})/g);
  // Store comparison lists for keys
  const extraDataObj = Object.assign({}, ...message.data.extra_data.map(extra_data => {
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
      formatted_string = formatted_string.replace(RegExp('{' + keys_to_format[i] + '}', 'g'), message[keyChain[0]]);
    }
    else {
      // Attempt to get the value from the data structure... if it fails, do nothing
      let value = _.get(message.data, keys_to_format[i])
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

export const sanitizeMessage = (message) => {
  let cleanMessage = _.cloneDeep(message);
  if (_.isEmpty(cleanMessage.data.event_id)) {
    delete cleanMessage.data.event_id;
  }

  // Remove target type from the message
  for (var i = 0; i < cleanMessage.data.targets.length; i += 1) {
    delete cleanMessage.data.targets[i].type;
  }

  cleanMessage.data.references = sanitizeMessageSection(cleanMessage.data.references);
  cleanMessage.data.targets = sanitizeMessageSection(cleanMessage.data.targets);
  cleanMessage.data.photometry = sanitizeMessageSection(cleanMessage.data.photometry);
  cleanMessage.data.spectroscopy = sanitizeMessageSection(cleanMessage.data.spectroscopy);
  cleanMessage.data.astrometry = sanitizeMessageSection(cleanMessage.data.astrometry);
  cleanMessage.data = _.assign(cleanMessage.data, flattenExtraData(cleanMessage.data.extra_data));
  delete cleanMessage.data.extra_data;
  if (!_.isEmpty(cleanMessage.message_text)){
    cleanMessage.message_text = formattedMessageText(message);
  }
  return cleanMessage;
}
