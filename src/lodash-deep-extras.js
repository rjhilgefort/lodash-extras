import lodashUtils from 'wildcat/utils/lodash/_core/lodash-utils';
import lodashExtras from 'wildcat/utils/lodash/lodash-extras';
import lodashEmber from 'wildcat/utils/lodash/lodash-ember';
import lodashWildcat from 'wildcat/utils/lodash/lodash-wildcat';


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
(() => {
	// Determined if lodash key/method is valid to make deep (`is` methods that only have one argument)
	let validIsMethod = function(key) {
		return (_.startsWith(key, 'is') && (this[key].length === 1));
	};

	// Filter out all valid `is` methods from a namespace
	let filterIsMethods = (namespace) => {
		return _.chain(namespace)
			.keys()
			.filter(validIsMethod, namespace)
			.value();
	};

	// Overload normal lodash methods to handle deep syntax
	let overloadMethods = (methods, namespace) => {
		let oldMethod = {};

		_.forEach(methods, (method) => {
			// Save old method
			oldMethod[method] = namespace[method];

			// Make new method that also handles `deepGet`. Apply method to exports.
			lodashDeepExtras[method] = function(value, propString) {
				if (_.size(arguments) === 2) return namespace[method](_.get(...arguments));
				return oldMethod[method](...arguments);
			};
		});
	};

	// Build `isMethods`
	let buildIsMethods = (namespace) => overloadMethods(filterIsMethods(namespace), namespace);

	// Get all `is` methods from standard lodash
	buildIsMethods(_);

	// Make sure "extra" `is` methods are added as well
	buildIsMethods(lodashExtras);

	// Make sure "ember" `is` methods are added as well
	buildIsMethods(lodashEmber);

	// Make sure "wildcat" `is` methods are added as well
	buildIsMethods(lodashWildcat);
})();


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
