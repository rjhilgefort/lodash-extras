import _ from 'lodash';
import lodashUtils from './_core/lodash-utils';
import lodashExtras from './lodash-extras';

// All lodash extraDeep methods to export
let lodashDeepExtras = {};

/**
 * Generate deep `is` methods and override standard methods to handle both
 *
 * @method is{Condition}
 * @param {Object} value: Base value to look through
 * @param {String} propString: Property string to apply to `get`
 * @return {Boolean}
 */
lodashUtils.buildIsMethods(_, lodashDeepExtras);
lodashUtils.buildIsMethods(lodashExtras, lodashDeepExtras);

/**
 * Generate `ensure` methods- Ensure that value is of type x, deeply
 *
 * @method deepEnsure{Type}
 * @param {Object|Array} collection: The root collection of the tree.
 * @param {String} propString: Nested property path of value to check
 * @param {*} [valueDefault=defaults[condition]: What to default to
 * @return {*} Collection, with ensured property
 */
_.forEach(_.keys(lodashUtils.typeDefaults()), (type) => {
  lodashExtras[`deepEnsure${type}`] = lodashUtils.makeDeepEnsureType(type);
});

/**
 * Delete deeply nested properties without checking existence down the tree first
 * TODO: TEST TEST TEST. This is experimental (WIP)
 *
 * @method deepDelete
 * @param {*} value: Value to check
 * @param {String} propString: Property string to apply to `get`
 * @return {undefined} Doesn't return success/failure, to match `delete`'s return
 */
export var deepDelete = function(value, propString) {
  let currentValue, i;

  // Delete if present
  if (_.isPresent(value, propString)) {
    currentValue = value;
    propString = _(propString).toString().split('.');

    for (i = 0; i < (propString.length - 1); i++) {
      currentValue = currentValue[propString[i]];
    }

    delete currentValue[propString[i]];
  }
};
lodashDeepExtras.deepDelete = deepDelete;

export default lodashDeepExtras;
