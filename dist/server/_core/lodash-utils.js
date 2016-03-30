'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildIsMethods = exports.overloadMethods = exports.filterIsMethods = exports.validIsMethod = exports.makeDeepEnsureType = exports.makeEnsureType = exports.makeIsType = exports.typeDefaults = void 0;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Collection of all the utils in here. Add to this as you go.
 */
var lodashUtils = {};

/**
 * Helper for JS types and defaults for each type
 *
 * @method typeDefaults
 * @return {PlainObject}
 */
var typeDefaults = exports.typeDefaults = function typeDefaults() {
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
 */
var makeIsType = exports.makeIsType = function makeIsType(klass) {
  return function (value) {
    return value instanceof klass;
  };
};
lodashUtils.makeIsType = makeIsType;

/**
 * Helper to make `_.ensureType`
 *
 * @method makeEnsureType
 * @param {String} condition: Lodash method to apply
 * @return {Function}
 */
var makeEnsureType = exports.makeEnsureType = function makeEnsureType(condition) {
  var defaults = lodashUtils.typeDefaults();

  // Check params: condition
  if (!_lodash2.default.isString(condition)) condition = '';
  condition = _lodash2.default.upperFirst(condition);
  if (!_lodash2.default.includes(_lodash2.default.keys(defaults), condition)) {
    throw new Error('`condition` not supported: ' + condition);
  }

  // Shortcut
  var isCondition = _lodash2.default['is' + condition];

  /**
   * Interface for `ensureType` methods
   *
   * @method `ensure${type}`
   * @param {*} value: To check
   * @param {*} [valueDefault=defaults[condition]: What to default to
   * @return {*} Defaulted value, or the value itself if pass
   */
  return function (value, valueDefault) {
    // Determine `valueDefault`: if nothing provided, or provided doesn't match type
    if (_lodash2.default.isUndefined(valueDefault) || !isCondition(valueDefault)) {
      valueDefault = _lodash2.default.clone(defaults[condition]);
    }

    // Actual "ensure" check
    if (!_lodash2.default['is' + condition](value)) value = valueDefault;

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
 */
var makeDeepEnsureType = exports.makeDeepEnsureType = function makeDeepEnsureType(condition) {
  return function (collection, propString, valueDefault) {
    return _lodash2.default.set(collection, propString, lodashUtils.makeEnsureType(condition)(_lodash2.default.get(collection, propString), valueDefault));
  };
};
lodashUtils.makeDeepEnsureType = makeDeepEnsureType;

/**
 * Determined if lodash key/method is valid to make deep (`is` methods that only have one argument)
 * NOTE: Assumes `this` === is the namespace to check for the function on
 *
 * @method validIsMethod
 * @param {String} key: method name
 * @return {Boolean}
 */
var validIsMethod = exports.validIsMethod = function validIsMethod(key) {
  return _lodash2.default.startsWith(key, 'is') && this[key].length === 1;
};
lodashUtils.validIsMethod = validIsMethod;

/**
 * Filter out all valid `is` methods from a namespace
 *
 * @method filterIsMethods
 * @param {String} namespace: Collection of methods
 * @return {Object} `namespace` with just the "is" methods
 */
var filterIsMethods = exports.filterIsMethods = function filterIsMethods(namespace) {
  return _lodash2.default.chain(namespace).keys().filter(_lodash2.default.bind(validIsMethod, namespace)).value();
};
lodashUtils.filterIsMethods = filterIsMethods;

/**
 * Overload normal lodash methods to handle deep syntax
 * TODO: No need to take the first param
 *
 * @method overloadMethods
 * @param {Object} isMethods: Collection of is methods
 * @param {String} namespace: Original namespace isMethods came from
 * @param {Object} target: namespace to overload methods on
 * @return {Undefined}
 */
var overloadMethods = exports.overloadMethods = function overloadMethods(isMethods, namespace, target) {
  var oldMethod = {};
  _lodash2.default.forEach(isMethods, function (method) {
    // Save old method
    oldMethod[method] = namespace[method];

    // Make new method that also handles `get`. Apply method to exports.
    target[method] = function (value, propString) {
      if (_lodash2.default.size(arguments) === 2) {
        return namespace[method](_lodash2.default.get.apply(_lodash2.default, arguments));
      }
      return oldMethod[method].apply(oldMethod, arguments);
    };
  });
};
lodashUtils.overloadMethods = overloadMethods;

/**
 * Build `isMethods`
 *
 * @method buildIsMethods
 * @param {String} namespace: Namespace to pull `is` methods from
 * @param {Object} target: namespace to overload methods on
 * @return {Undefined}
 */
var buildIsMethods = exports.buildIsMethods = function buildIsMethods(namespace, target) {
  overloadMethods(filterIsMethods(namespace), namespace, target);
};
lodashUtils.buildIsMethods = buildIsMethods;

exports.default = lodashUtils;