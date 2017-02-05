'use strict';

const padding = (string, length, patch, direction) => {
  string = String(string);
  const count = length - string.length;
  if (count > 0) {
    return direction === 'left' ?
      patch.repeat(count) + string :
      direction === 'right' ?
        string + patch.repeat(count) : string;
  }
  return string;
}

module.exports = padding;
