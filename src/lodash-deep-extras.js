import lodashUtils from './_core/lodash-utils';
import lodashExtras from './lodash-extras';
import lodashEmber from './lodash-ember';


// All lodash extraDeep methods to export
let lodashDeepExtras = {};


/**
 * Generate `deepIs` methods and override standard methods to handle both
 *
 * @namespace _
 * @method is{Condition}
 * @param {Object} value: Base value to look through
 * @param {String} propString: Property string to apply to deepGet
 * @return {Boolean}
 */
lodashUtils.buildIsMethods(_, lodashDeepExtras);
lodashUtils.buildIsMethods(lodashExtras, lodashDeepExtras);
lodashUtils.buildIsMethods(lodashEmber, lodashDeepExtras);


/**
 * Generate `ensure` methods- Ensure that value is of type x, deeply
 *
 * @namespace _
 * @method deepEnsure{Type}
 * @param {Object|Array} collection: The root collection of the tree.
 * @param {String} propString: Nested property path of value to check
 * @param {*} [valueDefault=defaults[condition]: What to default to
 * @return {*} Collection, with ensured property
 * @since v1.3.0
 */
_.forEach(_.keys(lodashUtils.typeDefaults()), (type) => {
	lodashExtras[`deepEnsure${type}`] = lodashUtils.makeDeepEnsureType(type);
});


/**
 * TODO: TEST TEST TEST. This is experimental (WIP)
 * Delete deeply nested properties without checking existence down the tree first
 *
 * @namespace _
 * @method deepDelete
 * @param {*} value: Value to check
 * @param {String} propString: Property string to apply to deepGet
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
