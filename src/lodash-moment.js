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
  return (
    _.isObject(value) &&
    value._isAMomentObject === true
  );
};
lodashMoment.isMoment = isMoment;


/**
 * Ensure value is a moment object.
 * If not, tries to create a moment object from value,
 * otherwise returns moment().
 *
 * @method ensureMoment
 * @param {*} value: Value to check
 * @return {Moment}
 */
export var ensureMoment = (value, default) => {
  if (isMoment(value)) return value;
  value = moment(value);
  if (value.isValid()) return value;
  if (isMoment(default)) return default;
  return moment();
};
lodashMoment.ensureMoment = ensureMoment;


export default lodashMoment;
