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
