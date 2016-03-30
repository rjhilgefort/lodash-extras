import _ from 'lodash';
import moment from 'moment';
import lodashUtils from './_core/lodash-utils';

/**
 * Collection of all the utils in here. Add to this as you go.
 */
let lodashMoment = {};

/**
 * Check if a variable is a moment date object
 *
 * @method isMoment
 * @param {*} value: Value to check
 * @return {Boolean}
 */
export var isMoment = (value) => {
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
export var ensureMoment = (value, valueDefault) => {
  if (isMoment(value)) return value;
  value = moment(value);
  if (!value.isValid() && isMoment(valueDefault)) return valueDefault;
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
lodashUtils.buildIsMethods(lodashMoment, lodashMoment);

export default lodashMoment;
