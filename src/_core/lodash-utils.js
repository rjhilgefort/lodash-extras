/**
 * Collection of all the utils in here. Add to this as you go.
 */
let lodashUtils = {};


/**
 * Helper for JS types and defaults for each type
 *
 * @method typeDefaults
 * @return {PlainObject}
 * @since v1.3.0
 */
export var typeDefaults = () => {
	return {
		'String': '',
		'Array': [],
		'PlainObject': {},
		'Boolean': false,
		'Number': 1
	};
};
lodashUtils.typeDefaults = typeDefaults;


/**
 * Helper to make `_.isEmber{Class}`
 *
 * @method makeIsType
 * @param {*} klass: A class to check instanceof against
 * @return {Function}
 * @since v0.5.2
 */
export var makeIsType = function(klass) {
	return function(value) {
		return (value instanceof klass);
	};
};
lodashUtils.makeIsType = makeIsType;


/**
 * Helper to make `_.ensureType`
 *
 * @method makeEnsureType
 * @param {String} condition: Lodash method to apply
 * @return {Function}
 * @since v1.3.0
 */
export var makeEnsureType = function(condition) {
	let defaults = lodashUtils.typeDefaults();

	// Check params: condition
	if (!_.isString(condition)) condition = '';
	condition = _.capitalize(condition);
	if (!_.contains(_.keys(defaults), condition)) {
		throw new Error(`\`condition\` not supported: ${condition}`);
	}

	// Shortcut
	let isCondition = _[`is${condition}`];

	/**
	 * Interface for `ensureType` methods
	 *
	 * @method `ensure${type}`
	 * @param {*} value: To check
	 * @param {*} [valueDefault=defaults[condition]: What to default to
	 * @return {*} Defaulted value, or the value itself if pass
	 * @since v1.3.0
	 */
	return (value, valueDefault) => {
		// Determine `valueDefault`: if nothing provided, or provided doesn't match type
		if (_.isUndefined(valueDefault) || !isCondition(valueDefault)) {
			valueDefault = _.clone(defaults[condition]);
		}

		// Actual "ensure" check
		if (!_[`is${condition}`](value)) value = valueDefault;

		return value;
	};
};
lodashUtils.makeEnsureType = makeEnsureType;


/**
 * Helper to make `_.deepEnsure{Type}`
 *
 * @method makeDeepEnsureType
 * @param {Function} condition: Lodash method to apply
 * @param {*} valueDefault: What to assign when not of the desired type
 * @return {Function}
 * @since v0.5.2
 */
export var makeDeepEnsureType = function(condition) {
	return (collection, propString, valueDefault) => {
		return _.set(
			collection,
			propString,
			lodashUtils.makeEnsureType(condition)(
				_.get(collection, propString),
				valueDefault
			)
		);
	};
};
lodashUtils.makeDeepEnsureType = makeDeepEnsureType;


export default lodashUtils;
