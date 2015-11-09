(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Collection of all the utils in here. Add to this as you go.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var lodashUtils = {};

/**
 * Helper for JS types and defaults for each type
 *
 * @method typeDefaults
 * @return {PlainObject}
 * @since v1.3.0
 */
var typeDefaults = function typeDefaults() {
	return {
		'String': '',
		'Array': [],
		'PlainObject': {},
		'Boolean': false,
		'Number': 1
	};
};
exports.typeDefaults = typeDefaults;
lodashUtils.typeDefaults = typeDefaults;

/**
 * Helper to make `_.isEmber{Class}`
 *
 * @method makeIsType
 * @param {*} klass: A class to check instanceof against
 * @return {Function}
 * @since v0.5.2
 */
var makeIsType = function makeIsType(klass) {
	return function (value) {
		return value instanceof klass;
	};
};
exports.makeIsType = makeIsType;
lodashUtils.makeIsType = makeIsType;

/**
 * Helper to make `_.ensureType`
 *
 * @method makeEnsureType
 * @param {String} condition: Lodash method to apply
 * @return {Function}
 * @since v1.3.0
 */
var makeEnsureType = function makeEnsureType(condition) {
	var defaults = lodashUtils.typeDefaults();

	// Check params: condition
	if (!_.isString(condition)) condition = '';
	condition = _.capitalize(condition);
	if (!_.contains(_.keys(defaults), condition)) {
		throw new Error('`condition` not supported: ' + condition);
	}

	// Shortcut
	var isCondition = _['is' + condition];

	/**
  * Interface for `ensureType` methods
  *
  * @method `ensure${type}`
  * @param {*} value: To check
  * @param {*} [valueDefault=defaults[condition]: What to default to
  * @return {*} Defaulted value, or the value itself if pass
  * @since v1.3.0
  */
	return function (value, valueDefault) {
		// Determine `valueDefault`: if nothing provided, or provided doesn't match type
		if (_.isUndefined(valueDefault) || !isCondition(valueDefault)) {
			valueDefault = _.clone(defaults[condition]);
		}

		// Actual "ensure" check
		if (!_['is' + condition](value)) value = valueDefault;

		return value;
	};
};
exports.makeEnsureType = makeEnsureType;
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
var makeDeepEnsureType = function makeDeepEnsureType(condition) {
	return function (collection, propString, valueDefault) {
		return _.set(collection, propString, lodashUtils.makeEnsureType(condition)(_.get(collection, propString), valueDefault));
	};
};
exports.makeDeepEnsureType = makeDeepEnsureType;
lodashUtils.makeDeepEnsureType = makeDeepEnsureType;

exports['default'] = lodashUtils;

},{}],2:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashExtras = require('./lodash-extras');

var _lodashExtras2 = _interopRequireDefault(_lodashExtras);

// import lodashDeepExtras from './lodash-deep-extras';
// import lodashEmber from './lodash-ember';

_.mixin(_lodashExtras2['default']);
// _.mixin(lodashDeepExtras);
// _.mixin(lodashEmber);

},{"./lodash-extras":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _coreLodashUtils = require('./_core/lodash-utils');

var _coreLodashUtils2 = _interopRequireDefault(_coreLodashUtils);

/**
 * Collection of all the utils in here. Add to this as you go.
 */
var lodashExtras = {};

/**
 * Helper to check if a variable is defined and present
 *
 * @namespace _
 * @method isPresent
 * @param {*} value: Value to check
 * @return {Boolean}
 */
var isPresent = function isPresent(value) {
  return !_.isUndefined(value) && !_.isNull(value);
};
exports.isPresent = isPresent;
lodashExtras.isPresent = isPresent;

/**
 * Helper to check if a variable is defined and present
 *
 * @namespace _
 * @method isBlank
 * @param {*} value: Value to check
 * @return {Boolean}
 */
var isBlank = function isBlank(value) {
  return !_.isPresent(value);
};
exports.isBlank = isBlank;
lodashExtras.isBlank = isBlank;

/**
 * Helper to check if a variable is a promise
 *
 * @namespace _
 * @method isPromise
 * @param {*} value: Value to check
 * @return {Boolean}
 */
var isPromise = function isPromise(value) {
  return _.isFunction(value, 'then');
};
exports.isPromise = isPromise;
lodashExtras.isPromise = isPromise;

/**
 * Helper to check a value for an array of LoDash boolean conditions
 * TODO: Name this `isAnd` and create `isOr`...
 *
 * @namespace _
 * @method is
 * @param {*} value: Value to check
 * @param {Array} conditions: LoDash methods to have value tested against (as strings)
 * @return {Boolean}
 */
var is = function is(value, conditions) {
  if (_.isString(conditions)) conditions = [conditions];
  if (_.isPresent(conditions) && !_.isArray(conditions)) conditions = [];
  if (conditions.length <= 1) console.error("Don't call `is` helper with just one condition- use that condition directly");
  return _.every(conditions, function (condition) {
    var result = undefined,
        not = undefined;

    // Check for valid condition
    if (!_.isString(condition)) {
      console.warn("`condition` was not a string: " + condition);
      return false;
    }

    // Handle not condition
    not = false;
    if (_.startsWith(condition, '!')) {
      not = true;
      condition = condition.replace('!', '');
    }

    // Be EXTRA (too) helpful (prepend 'is' if ommitted)
    if (!_.startsWith(condition, 'is')) {
      condition = 'is' + condition;
    }

    // Make sure `condition` is a valid lodash method
    if (!_.isFunction(_[condition])) {
      console.warn("`condition` was not a valid lodash method: " + condition);
      return false;
    }

    // Determine result and return
    result = _[condition](value);
    if (not === true) return !result;

    return result;
  });
};
exports.is = is;
lodashExtras.is = is;

/**
 * Generate `ensure` methods- Ensure that value is of type x
 *
 * @namespace _
 * @method ensure{Type}
 * @param {*} value: To check
 * @param {*} [valueDefault=defaults[condition]: What to default to
 * @return {*} Ensured value
 * @since v1.3.0
 */
_.forEach(_.keys(_coreLodashUtils2['default'].typeDefaults()), function (type) {
  lodashExtras['ensure' + type] = _coreLodashUtils2['default'].makeEnsureType(type);
});

/**
 * Javascript `typeof` alias
 *
 * @namespace _
 * @method typeOf
 * @param {*} value: Value to check
 * @return {String} The type of `value`
 */
var typeOf = function typeOf(value) {
  return typeof value;
};
exports.typeOf = typeOf;
lodashExtras.typeOf = typeOf;

exports['default'] = lodashExtras;

},{"./_core/lodash-utils":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcmpoaWxnZWZvcnQvRHJvcGJveC9Qcm9qZWN0cy9sb2Rhc2gtZXh0cmFzL3NyYy9fY29yZS9sb2Rhc2gtdXRpbHMuanMiLCIvVXNlcnMvcmpoaWxnZWZvcnQvRHJvcGJveC9Qcm9qZWN0cy9sb2Rhc2gtZXh0cmFzL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1leHRyYXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0dBLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7O0FBVWQsSUFBSSxZQUFZLEdBQUcsU0FBZixZQUFZLEdBQVM7QUFDL0IsUUFBTztBQUNOLFVBQVEsRUFBRSxFQUFFO0FBQ1osU0FBTyxFQUFFLEVBQUU7QUFDWCxlQUFhLEVBQUUsRUFBRTtBQUNqQixXQUFTLEVBQUUsS0FBSztBQUNoQixVQUFRLEVBQUUsQ0FBQztFQUNYLENBQUM7Q0FDRixDQUFDOztBQUNGLFdBQVcsQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDOzs7Ozs7Ozs7O0FBV2pDLElBQUksVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFZLEtBQUssRUFBRTtBQUN2QyxRQUFPLFVBQVMsS0FBSyxFQUFFO0FBQ3RCLFNBQVEsS0FBSyxZQUFZLEtBQUssQ0FBRTtFQUNoQyxDQUFDO0NBQ0YsQ0FBQzs7QUFDRixXQUFXLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQzs7Ozs7Ozs7OztBQVc3QixJQUFJLGNBQWMsR0FBRyxTQUFqQixjQUFjLENBQVksU0FBUyxFQUFFO0FBQy9DLEtBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7O0FBRzFDLEtBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FB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QUFhckIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLDZCQUFZLFlBQVksRUFBRSxDQUFDLEVBQUUsVUFBQyxJQUFJLEVBQUs7QUFDdkQsY0FBWSxZQUFVLElBQUksQ0FBRyxHQUFHLDZCQUFZLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUNqRSxDQUFDLENBQUM7Ozs7Ozs7Ozs7QUFXSSxJQUFJLE1BQU0sR0FBRyxTQUFULE1BQU0sQ0FBSSxLQUFLO1NBQUssT0FBTyxLQUFLLEFBQUM7Q0FBQSxDQUFDOztBQUM3QyxZQUFZLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7cUJBR2QsWUFBWSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENvbGxlY3Rpb24gb2YgYWxsIHRoZSB1dGlscyBpbiBoZXJlLiBBZGQgdG8gdGhpcyBhcyB5b3UgZ28uXG4gKi9cbmxldCBsb2Rhc2hVdGlscyA9IHt9O1xuXG5cbi8qKlxuICogSGVscGVyIGZvciBKUyB0eXBlcyBhbmQgZGVmYXVsdHMgZm9yIGVhY2ggdHlwZVxuICpcbiAqIEBtZXRob2QgdHlwZURlZmF1bHRzXG4gKiBAcmV0dXJuIHtQbGFpbk9iamVjdH1cbiAqIEBzaW5jZSB2MS4zLjBcbiAqL1xuZXhwb3J0IHZhciB0eXBlRGVmYXVsdHMgPSAoKSA9PiB7XG5cdHJldHVybiB7XG5cdFx0J1N0cmluZyc6ICcnLFxuXHRcdCdBcnJheSc6IFtdLFxuXHRcdCdQbGFpbk9iamVjdCc6IHt9LFxuXHRcdCdCb29sZWFuJzogZmFsc2UsXG5cdFx0J051bWJlcic6IDFcblx0fTtcbn07XG5sb2Rhc2hVdGlscy50eXBlRGVmYXVsdHMgPSB0eXBlRGVmYXVsdHM7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gbWFrZSBgXy5pc0VtYmVye0NsYXNzfWBcbiAqXG4gKiBAbWV0aG9kIG1ha2VJc1R5cGVcbiAqIEBwYXJhbSB7Kn0ga2xhc3M6IEEgY2xhc3MgdG8gY2hlY2sgaW5zdGFuY2VvZiBhZ2FpbnN0XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBzaW5jZSB2MC41LjJcbiAqL1xuZXhwb3J0IHZhciBtYWtlSXNUeXBlID0gZnVuY3Rpb24oa2xhc3MpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0cmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIGtsYXNzKTtcblx0fTtcbn07XG5sb2Rhc2hVdGlscy5tYWtlSXNUeXBlID0gbWFrZUlzVHlwZTtcblxuXG4vKipcbiAqIEhlbHBlciB0byBtYWtlIGBfLmVuc3VyZVR5cGVgXG4gKlxuICogQG1ldGhvZCBtYWtlRW5zdXJlVHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IGNvbmRpdGlvbjogTG9kYXNoIG1ldGhvZCB0byBhcHBseVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAc2luY2UgdjEuMy4wXG4gKi9cbmV4cG9ydCB2YXIgbWFrZUVuc3VyZVR5cGUgPSBmdW5jdGlvbihjb25kaXRpb24pIHtcblx0bGV0IGRlZmF1bHRzID0gbG9kYXNoVXRpbHMudHlwZURlZmF1bHRzKCk7XG5cblx0Ly8gQ2hlY2sgcGFyYW1zOiBjb25kaXRpb25cblx0aWYgKCFfLmlzU3RyaW5nKGNvbmRpdGlvbikpIGNvbmRpdGlvbiA9ICcnO1xuXHRjb25kaXRpb24gPSBfLmNhcGl0YWxpemUoY29uZGl0aW9uKTtcblx0aWYgKCFfLmNvbnRhaW5zKF8ua2V5cyhkZWZhdWx0cyksIGNvbmRpdGlvbikpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYFxcYGNvbmRpdGlvblxcYCBub3Qgc3VwcG9ydGVkOiAke2NvbmRpdGlvbn1gKTtcblx0fVxuXG5cdC8vIFNob3J0Y3V0XG5cdGxldCBpc0NvbmRpdGlvbiA9IF9bYGlzJHtjb25kaXRpb259YF07XG5cblx0LyoqXG5cdCAqIEludGVyZmFjZSBmb3IgYGVuc3VyZVR5cGVgIG1ldGhvZHNcblx0ICpcblx0ICogQG1ldGhvZCBgZW5zdXJlJHt0eXBlfWBcblx0ICogQHBhcmFtIHsqfSB2YWx1ZTogVG8gY2hlY2tcblx0ICogQHBhcmFtIHsqfSBbdmFsdWVEZWZhdWx0PWRlZmF1bHRzW2NvbmRpdGlvbl06IFdoYXQgdG8gZGVmYXVsdCB0b1xuXHQgKiBAcmV0dXJuIHsqfSBEZWZhdWx0ZWQgdmFsdWUsIG9yIHRoZSB2YWx1ZSBpdHNlbGYgaWYgcGFzc1xuXHQgKiBAc2luY2UgdjEuMy4wXG5cdCAqL1xuXHRyZXR1cm4gKHZhbHVlLCB2YWx1ZURlZmF1bHQpID0+IHtcblx0XHQvLyBEZXRlcm1pbmUgYHZhbHVlRGVmYXVsdGA6IGlmIG5vdGhpbmcgcHJvdmlkZWQsIG9yIHByb3ZpZGVkIGRvZXNuJ3QgbWF0Y2ggdHlwZVxuXHRcdGlmIChfLmlzVW5kZWZpbmVkKHZhbHVlRGVmYXVsdCkgfHwgIWlzQ29uZGl0aW9uKHZhbHVlRGVmYXVsdCkpIHtcblx0XHRcdHZhbHVlRGVmYXVsdCA9IF8uY2xvbmUoZGVmYXVsdHNbY29uZGl0aW9uXSk7XG5cdFx0fVxuXG5cdFx0Ly8gQWN0dWFsIFwiZW5zdXJlXCIgY2hlY2tcblx0XHRpZiAoIV9bYGlzJHtjb25kaXRpb259YF0odmFsdWUpKSB2YWx1ZSA9IHZhbHVlRGVmYXVsdDtcblxuXHRcdHJldHVybiB2YWx1ZTtcblx0fTtcbn07XG5sb2Rhc2hVdGlscy5tYWtlRW5zdXJlVHlwZSA9IG1ha2VFbnN1cmVUeXBlO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIG1ha2UgYF8uZGVlcEVuc3VyZXtUeXBlfWBcbiAqXG4gKiBAbWV0aG9kIG1ha2VEZWVwRW5zdXJlVHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY29uZGl0aW9uOiBMb2Rhc2ggbWV0aG9kIHRvIGFwcGx5XG4gKiBAcGFyYW0geyp9IHZhbHVlRGVmYXVsdDogV2hhdCB0byBhc3NpZ24gd2hlbiBub3Qgb2YgdGhlIGRlc2lyZWQgdHlwZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAc2luY2UgdjAuNS4yXG4gKi9cbmV4cG9ydCB2YXIgbWFrZURlZXBFbnN1cmVUeXBlID0gZnVuY3Rpb24oY29uZGl0aW9uKSB7XG5cdHJldHVybiAoY29sbGVjdGlvbiwgcHJvcFN0cmluZywgdmFsdWVEZWZhdWx0KSA9PiB7XG5cdFx0cmV0dXJuIF8uc2V0KFxuXHRcdFx0Y29sbGVjdGlvbixcblx0XHRcdHByb3BTdHJpbmcsXG5cdFx0XHRsb2Rhc2hVdGlscy5tYWtlRW5zdXJlVHlwZShjb25kaXRpb24pKFxuXHRcdFx0XHRfLmdldChjb2xsZWN0aW9uLCBwcm9wU3RyaW5nKSxcblx0XHRcdFx0dmFsdWVEZWZhdWx0XG5cdFx0XHQpXG5cdFx0KTtcblx0fTtcbn07XG5sb2Rhc2hVdGlscy5tYWtlRGVlcEVuc3VyZVR5cGUgPSBtYWtlRGVlcEVuc3VyZVR5cGU7XG5cblxuZXhwb3J0IGRlZmF1bHQgbG9kYXNoVXRpbHM7XG4iLCJpbXBvcnQgbG9kYXNoRXh0cmFzIGZyb20gJy4vbG9kYXNoLWV4dHJhcyc7XG4vLyBpbXBvcnQgbG9kYXNoRGVlcEV4dHJhcyBmcm9tICcuL2xvZGFzaC1kZWVwLWV4dHJhcyc7XG4vLyBpbXBvcnQgbG9kYXNoRW1iZXIgZnJvbSAnLi9sb2Rhc2gtZW1iZXInO1xuXG5fLm1peGluKGxvZGFzaEV4dHJhcyk7XG4vLyBfLm1peGluKGxvZGFzaERlZXBFeHRyYXMpO1xuLy8gXy5taXhpbihsb2Rhc2hFbWJlcik7XG4iLCJpbXBvcnQgbG9kYXNoVXRpbHMgZnJvbSAnLi9fY29yZS9sb2Rhc2gtdXRpbHMnO1xuXG5cbi8qKlxuICogQ29sbGVjdGlvbiBvZiBhbGwgdGhlIHV0aWxzIGluIGhlcmUuIEFkZCB0byB0aGlzIGFzIHlvdSBnby5cbiAqL1xubGV0IGxvZGFzaEV4dHJhcyA9IHt9O1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNoZWNrIGlmIGEgdmFyaWFibGUgaXMgZGVmaW5lZCBhbmQgcHJlc2VudFxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBpc1ByZXNlbnRcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzUHJlc2VudCA9ICh2YWx1ZSkgPT4gKCFfLmlzVW5kZWZpbmVkKHZhbHVlKSAmJiAhXy5pc051bGwodmFsdWUpKTtcbmxvZGFzaEV4dHJhcy5pc1ByZXNlbnQgPSBpc1ByZXNlbnQ7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY2hlY2sgaWYgYSB2YXJpYWJsZSBpcyBkZWZpbmVkIGFuZCBwcmVzZW50XG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGlzQmxhbmtcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzQmxhbmsgPSAodmFsdWUpID0+ICFfLmlzUHJlc2VudCh2YWx1ZSk7XG5sb2Rhc2hFeHRyYXMuaXNCbGFuayA9IGlzQmxhbms7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY2hlY2sgaWYgYSB2YXJpYWJsZSBpcyBhIHByb21pc2VcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgaXNQcm9taXNlXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc1Byb21pc2UgPSAodmFsdWUpID0+IF8uaXNGdW5jdGlvbih2YWx1ZSwgJ3RoZW4nKTtcbmxvZGFzaEV4dHJhcy5pc1Byb21pc2UgPSBpc1Byb21pc2U7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY2hlY2sgYSB2YWx1ZSBmb3IgYW4gYXJyYXkgb2YgTG9EYXNoIGJvb2xlYW4gY29uZGl0aW9uc1xuICogVE9ETzogTmFtZSB0aGlzIGBpc0FuZGAgYW5kIGNyZWF0ZSBgaXNPcmAuLi5cbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgaXNcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcGFyYW0ge0FycmF5fSBjb25kaXRpb25zOiBMb0Rhc2ggbWV0aG9kcyB0byBoYXZlIHZhbHVlIHRlc3RlZCBhZ2FpbnN0IChhcyBzdHJpbmdzKVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpcyA9IGZ1bmN0aW9uKHZhbHVlLCBjb25kaXRpb25zKSB7XG5cdGlmIChfLmlzU3RyaW5nKGNvbmRpdGlvbnMpKSBjb25kaXRpb25zID0gW2NvbmRpdGlvbnNdO1xuXHRpZiAoXy5pc1ByZXNlbnQoY29uZGl0aW9ucykgJiYgIV8uaXNBcnJheShjb25kaXRpb25zKSkgY29uZGl0aW9ucyA9IFtdO1xuXHRpZiAoY29uZGl0aW9ucy5sZW5ndGggPD0gMSkgY29uc29sZS5lcnJvcihcIkRvbid0IGNhbGwgYGlzYCBoZWxwZXIgd2l0aCBqdXN0IG9uZSBjb25kaXRpb24tIHVzZSB0aGF0IGNvbmRpdGlvbiBkaXJlY3RseVwiKTtcblx0cmV0dXJuIF8uZXZlcnkoY29uZGl0aW9ucywgZnVuY3Rpb24oY29uZGl0aW9uKSB7XG5cdFx0bGV0IHJlc3VsdCwgbm90O1xuXG5cdFx0Ly8gQ2hlY2sgZm9yIHZhbGlkIGNvbmRpdGlvblxuXHRcdGlmICghXy5pc1N0cmluZyhjb25kaXRpb24pKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJgY29uZGl0aW9uYCB3YXMgbm90IGEgc3RyaW5nOiBcIiArIGNvbmRpdGlvbik7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gSGFuZGxlIG5vdCBjb25kaXRpb25cblx0XHRub3QgPSBmYWxzZTtcblx0XHRpZiAoXy5zdGFydHNXaXRoKGNvbmRpdGlvbiwgJyEnKSkge1xuXHRcdFx0bm90ID0gdHJ1ZTtcblx0XHRcdGNvbmRpdGlvbiA9IGNvbmRpdGlvbi5yZXBsYWNlKCchJywgJycpO1xuXHRcdH1cblxuXHRcdC8vIEJlIEVYVFJBICh0b28pIGhlbHBmdWwgKHByZXBlbmQgJ2lzJyBpZiBvbW1pdHRlZClcblx0XHRpZiAoIV8uc3RhcnRzV2l0aChjb25kaXRpb24sICdpcycpKSB7XG5cdFx0XHRjb25kaXRpb24gPSAnaXMnICsgY29uZGl0aW9uO1xuXHRcdH1cblxuXHRcdC8vIE1ha2Ugc3VyZSBgY29uZGl0aW9uYCBpcyBhIHZhbGlkIGxvZGFzaCBtZXRob2Rcblx0XHRpZiAoIV8uaXNGdW5jdGlvbihfW2NvbmRpdGlvbl0pKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJgY29uZGl0aW9uYCB3YXMgbm90IGEgdmFsaWQgbG9kYXNoIG1ldGhvZDogXCIgKyBjb25kaXRpb24pO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVybWluZSByZXN1bHQgYW5kIHJldHVyblxuXHRcdHJlc3VsdCA9IF9bY29uZGl0aW9uXSh2YWx1ZSk7XG5cdFx0aWYgKG5vdCA9PT0gdHJ1ZSkgcmV0dXJuICFyZXN1bHQ7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9KTtcbn07XG5sb2Rhc2hFeHRyYXMuaXMgPSBpcztcblxuXG4vKipcbiAqIEdlbmVyYXRlIGBlbnN1cmVgIG1ldGhvZHMtIEVuc3VyZSB0aGF0IHZhbHVlIGlzIG9mIHR5cGUgeFxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBlbnN1cmV7VHlwZX1cbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFRvIGNoZWNrXG4gKiBAcGFyYW0geyp9IFt2YWx1ZURlZmF1bHQ9ZGVmYXVsdHNbY29uZGl0aW9uXTogV2hhdCB0byBkZWZhdWx0IHRvXG4gKiBAcmV0dXJuIHsqfSBFbnN1cmVkIHZhbHVlXG4gKiBAc2luY2UgdjEuMy4wXG4gKi9cbl8uZm9yRWFjaChfLmtleXMobG9kYXNoVXRpbHMudHlwZURlZmF1bHRzKCkpLCAodHlwZSkgPT4ge1xuXHRsb2Rhc2hFeHRyYXNbYGVuc3VyZSR7dHlwZX1gXSA9IGxvZGFzaFV0aWxzLm1ha2VFbnN1cmVUeXBlKHR5cGUpO1xufSk7XG5cblxuLyoqXG4gKiBKYXZhc2NyaXB0IGB0eXBlb2ZgIGFsaWFzXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIHR5cGVPZlxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge1N0cmluZ30gVGhlIHR5cGUgb2YgYHZhbHVlYFxuICovXG5leHBvcnQgdmFyIHR5cGVPZiA9ICh2YWx1ZSkgPT4gdHlwZW9mKHZhbHVlKTtcbmxvZGFzaEV4dHJhcy50eXBlT2YgPSB0eXBlT2Y7XG5cblxuZXhwb3J0IGRlZmF1bHQgbG9kYXNoRXh0cmFzO1xuIl19
