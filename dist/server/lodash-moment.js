'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureMoment = exports.isMoment = void 0;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

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
var isMoment = exports.isMoment = function isMoment(value) {
  return _moment2.default.isMoment(value);
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
  value = (0, _moment2.default)(value);
  if (value.isValid()) return value;
  if (isMoment(valueDefault)) return valueDefault;
  return value;
};
lodashMoment.ensureMoment = ensureMoment;

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