// =========
// = humps =
// =========
// Underscore-to-camelCase converter (and vice versa)
// for strings and object keys

// humps is copyright © 2012+ Dom Christie
// Released under the MIT license.
//
// https://github.com/domchristie/humps/blob/master/humps.js

/* eslint-disable */

const _processKeys = function (convert, obj, options) {
  if (
    !_isObject(obj) ||
    _isDate(obj) ||
    _isRegExp(obj) ||
    _isBoolean(obj) ||
    _isFunction(obj)
  ) {
    return obj;
  }

  var output,
    i = 0,
    l = 0;

  if (_isArray(obj)) {
    output = [];
    for (l = obj.length; i < l; i++) {
      output.push(_processKeys(convert, obj[i], options));
    }
  } else {
    output = {};
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        output[convert(key, options)] = _processKeys(convert, obj[key], options);
      }
    }
  }
  return output;
};

// String conversion methods

const separateWords = function (string, options) {
  options = options || {};
  var separator = options.separator || "_";
  var split = options.split || /(?=[A-Z])/;

  return string.split(split).join(separator);
};

export const camelize = function (string) {
  if (_isNumerical(string)) {
    return string;
  }
  string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
    return chr ? chr.toUpperCase() : "";
  });
  // Ensure 1st char is always lowercase
  return string.substr(0, 1).toLowerCase() + string.substr(1);
};

export const pascalize = function (string) {
  var camelized = camelize(string);
  // Ensure 1st char is always uppercase
  return camelized.substr(0, 1).toUpperCase() + camelized.substr(1);
};

export const decamelize = function (string, options) {
  return separateWords(string, options).toLowerCase();
};

// Utilities
// Taken from Underscore.js

const toString = Object.prototype.toString;

const _isFunction = function (obj) {
  return typeof obj === "function";
};
const _isObject = function (obj) {
  return obj === Object(obj);
};
const _isArray = function (obj) {
  return toString.call(obj) == "[object Array]";
};
const _isDate = function (obj) {
  return toString.call(obj) == "[object Date]";
};
const _isRegExp = function (obj) {
  return toString.call(obj) == "[object RegExp]";
};
const _isBoolean = function (obj) {
  return toString.call(obj) == "[object Boolean]";
};

// Performant way to determine if obj coerces to a number
const _isNumerical = function (obj) {
  obj = obj - 0;
  return obj === obj;
};

// Sets up function which handles processing keys
// allowing the convert function to be modified by a callback
const _processor = function (convert, options) {
  var callback = options && "process" in options ? options.process : options;

  if (typeof callback !== "function") {
    return convert;
  }

  return function (string, options) {
    return callback(string, convert, options);
  };
};

export const camelizeKeys = function (object, options) {
  return _processKeys(_processor(camelize, options), object);
};

export const decamelizeKeys = function (object, options) {
  return _processKeys(_processor(decamelize, options), object, options);
};

export const pascalizeKeys = function (object, options) {
  return _processKeys(_processor(pascalize, options), object);
};

export const depascalize = decamelize;

export const depascalizeKeys = function () {
  return decamelizeKeys.apply(this, arguments);
};

// Default export for compatibility
const humps = {
  camelize,
  decamelize,
  pascalize,
  depascalize,
  camelizeKeys,
  decamelizeKeys,
  pascalizeKeys,
  depascalizeKeys
};

export default humps;
