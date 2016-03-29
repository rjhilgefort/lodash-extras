'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeOf = exports.is = exports.isPromise = exports.isDate = exports.isBlank = exports.isPresent = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodashUtils = require('./_core/lodash-utils');

var _lodashUtils2 = _interopRequireDefault(_lodashUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Collection of all the utils in here. Add to this as you go.
 */
var lodashExtras = {};

/**
 * Helper to check if a variable is defined and present
 *
 * @method isPresent
 * @param {*} value: Value to check
 * @return {Boolean}
 */
var isPresent = exports.isPresent = function isPresent(value) {
  return !_lodash2.default.isUndefined(value) && !_lodash2.default.isNull(value);
};
lodashExtras.isPresent = isPresent;

/**
 * Helper to check if a variable is defined and present
 *
 * @method isBlank
 * @param {*} value: Value to check
 * @return {Boolean}
 */
var isBlank = exports.isBlank = function isBlank(value) {
  return !_lodash2.default.isPresent(value);
};
lodashExtras.isBlank = isBlank;

/**
 * Helper to check if a variable is a date
 *
 * @method isDate
 * @param {*} value: Value to check
 * @return {Boolean}
 */
var isDate = exports.isDate = function isDate(value) {
  return _lodash2.default.typeOf(value) === 'date';
};
lodashExtras.isDate = isDate;

/**
 * Helper to check if a variable is a promise
 *
 * @method isPromise
 * @param {*} value: Value to check
 * @return {Boolean}
 */
var isPromise = exports.isPromise = function isPromise(value) {
  return _lodash2.default.isFunction(value, 'then');
};
lodashExtras.isPromise = isPromise;

/**
 * Helper to check a value for an array of LoDash boolean conditions
 * TODO: Name this `isAnd` and create `isOr`...
 *
 * @method is
 * @param {*} value: Value to check
 * @param {Array} conditions: LoDash methods to have value tested against (as strings)
 * @return {Boolean}
 */
var is = exports.is = function is(value, conditions) {
  if (_lodash2.default.isString(conditions)) conditions = [conditions];
  if (_lodash2.default.isPresent(conditions) && !_lodash2.default.isArray(conditions)) conditions = [];
  if (conditions.length <= 1) console.error("Don't call `is` helper with just one condition- use that condition directly");
  return _lodash2.default.every(conditions, function (condition) {
    var result = void 0,
        not = void 0;

    // Check for valid condition
    if (!_lodash2.default.isString(condition)) {
      console.warn("`condition` was not a string: " + condition);
      return false;
    }

    // Handle not condition
    not = false;
    if (_lodash2.default.startsWith(condition, '!')) {
      not = true;
      condition = condition.replace('!', '');
    }

    // Be EXTRA (too) helpful (prepend 'is' if ommitted)
    if (!_lodash2.default.startsWith(condition, 'is')) {
      condition = 'is' + condition;
    }

    // Make sure `condition` is a valid lodash method
    if (!_lodash2.default.isFunction(_lodash2.default[condition])) {
      console.warn("`condition` was not a valid lodash method: " + condition);
      return false;
    }

    // Determine result and return
    result = _lodash2.default[condition](value);
    if (not === true) return !result;

    return result;
  });
};
lodashExtras.is = is;

/**
 * Generate `ensure` methods- Ensure that value is of type x
 *
 * @method ensure{Type}
 * @param {*} value: To check
 * @param {*} [valueDefault=defaults[condition]: What to default to
 * @return {*} Ensured value
 */
_lodash2.default.forEach(_lodash2.default.keys(_lodashUtils2.default.typeDefaults()), function (type) {
  lodashExtras['ensure' + type] = _lodashUtils2.default.makeEnsureType(type);
});

/**
 * Javascript `typeof` alias
 *
 * @method typeOf
 * @param {*} value: Value to check
 * @return {String} The type of `value`
 */
var typeOf = exports.typeOf = function typeOf(value) {
  return typeof value === 'undefined' ? 'undefined' : _typeof(value);
};
lodashExtras.typeOf = typeOf;

exports.default = lodashExtras;