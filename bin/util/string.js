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

module.exports = {
  camelToSplitName
};
