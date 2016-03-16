'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.before = exports.after = exports.ensureMoment = exports.isMoment = undefined;

var _lodashUtils = require('./_core/lodash-utils');

var _lodashUtils2 = _interopRequireDefault(_lodashUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Collection of all the utils in here. Add to this as you go.
 */
var lodashMoment = {};

/**
 * Check if a variable is a moment date object
 *
 * @method isMoment
 * @param {*} value: Value to check
 * @return {Boolean}
 */
/**
 * This utility assumes `Ember` exists globally
 */
var isMoment = exports.isMoment = function isMoment(value) {
  return moment.isMoment(value);
};
lodashMoment.isMoment = isMoment;

/**
 * Ensure value is a moment object.
 * If not, tries to create a moment object from value,
 * otherwise returns moment().
 *
 * @method ensureMoment
 * @param {*} value: Value to check
 * @param {*} valueDefault: What to default to
 * @return {Moment}
 */
var ensureMoment = exports.ensureMoment = function ensureMoment(value, valueDefault) {
  if (isMoment(value)) return value;
  value = moment(value);
  if (value.isValid()) return value;
  if (isMoment(valueDefault)) return valueDefault;
  return moment();
};
lodashMoment.ensureMoment = ensureMoment;

/**
 * Check if `date` is after or same as `dateToCompare`
 * Returns false if either is not `Moment`
 *
 * @method after
 * @param {Moment|String|Number|Date|Array} date
 * @param {Moment|String|Number|Date|Array} dateToCompare
 * @return {Boolean}
 */
var after = exports.after = _lodashUtils2.default.buildInclusiveCompare('isAfter', lodashMoment);
lodashMoment.after = after;

/**
 * Check if `date` is before or same as `dateToCompare`
 * Returns false if either is not `Moment`
 *
 * @method before
 * @param {Moment|String|Number|Date|Array} date
 * @param {Moment|String|Number|Date|Array} dateToCompare
 * @return {Boolean}
 */
var before = exports.before = _lodashUtils2.default.buildInclusiveCompare('isBefore', lodashMoment);
lodashMoment.before = before;

/**
 * Generate deep `is` methods and override standard methods to handle both
 *
 * @method is{Condition}
 * @param {Object} value: Base value to look through
 * @param {String} propString: Property string to apply to `get`
 * @return {Boolean}
 */
_lodashUtils2.default.buildIsMethods(lodashMoment, lodashMoment);

exports.default = lodashMoment;