'use strict';

const camelToSplitName = (camelName, split) => {
  if (!camelName || camelName.length === 0) return camelName;

  let result = '';
  split = split || '-';

  for (let i = 0, l = camelName.length; i < l; i++) {
    const char = camelName.charAt(i);
    if (char <= 'Z' && char >= 'A') {
      result += (i ? split : '') + char.toLowerCase();
    } else {
      result += char;
    }
  }
  return result;
};

const isCamelStyle = string => {
  for (let i = 0, l = string.length; i < l; i++) {
    const char = string.charAt(i);
    // first char is not upper case
    if (!i && !(char <= 'Z' && char >= 'A')) {
      return false;
    }
    // include extra character
    if (char > 'Z' || char < 'a') {
      return false;
    }
  }
  return true;
}

module.exports = {
  camelToSplitName,
  isCamelStyle
};
