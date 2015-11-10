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
 */
var makeDeepEnsureType = function makeDeepEnsureType(condition) {
  return function (collection, propString, valueDefault) {
    return _.set(collection, propString, lodashUtils.makeEnsureType(condition)(_.get(collection, propString), valueDefault));
  };
};
exports.makeDeepEnsureType = makeDeepEnsureType;
lodashUtils.makeDeepEnsureType = makeDeepEnsureType;

/**
 * Determined if lodash key/method is valid to make deep (`is` methods that only have one argument)
 * NOTE: Assumes `this` === is the namespace to check for the function on
 *
 * @method validIsMethod
 * @param {String} key: method name
 * @return {Boolean}
 */
var validIsMethod = function validIsMethod(key) {
  return _.startsWith(key, 'is') && this[key].length === 1;
};
exports.validIsMethod = validIsMethod;
lodashUtils.validIsMethod = validIsMethod;

/**
 * Filter out all valid `is` methods from a namespace
 *
 * @method filterIsMethods
 * @param {String} namespace: Collection of methods
 * @return {Object} `namespace` with just the "is" methods
 */
var filterIsMethods = function filterIsMethods(namespace) {
  return _.chain(namespace).keys().filter(validIsMethod, namespace).value();
};
exports.filterIsMethods = filterIsMethods;
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
var overloadMethods = function overloadMethods(isMethods, namespace, target) {
  var oldMethod = {};

  _.forEach(isMethods, function (method) {
    // Save old method
    oldMethod[method] = namespace[method];

    // Make new method that also handles `get`. Apply method to exports.
    target[method] = function (value, propString) {
      if (_.size(arguments) === 2) {
        var _ref;

        return namespace[method]((_ref = _).get.apply(_ref, arguments));
      }
      return oldMethod[method].apply(oldMethod, arguments);
    };
  });
};
exports.overloadMethods = overloadMethods;
lodashUtils.overloadMethods = overloadMethods;

/**
 * Build `isMethods`
 *
 * @method buildIsMethods
 * @param {String} namespace: Namespace to pull `is` methods from
 * @param {Object} target: namespace to overload methods on
 * @return {Undefined}
 */
var buildIsMethods = function buildIsMethods(namespace, target) {
  overloadMethods(filterIsMethods(namespace), namespace, target);
};
exports.buildIsMethods = buildIsMethods;
lodashUtils.buildIsMethods = buildIsMethods;

exports['default'] = lodashUtils;

},{}],2:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashExtras = require('./lodash-extras');

var _lodashExtras2 = _interopRequireDefault(_lodashExtras);

var _lodashEmber = require('./lodash-ember');

var _lodashEmber2 = _interopRequireDefault(_lodashEmber);

var _lodashDeepExtras = require('./lodash-deep-extras');

var _lodashDeepExtras2 = _interopRequireDefault(_lodashDeepExtras);

_.mixin(_lodashExtras2['default']);

_.mixin(_lodashEmber2['default']);

_.mixin(_lodashDeepExtras2['default']);

},{"./lodash-deep-extras":3,"./lodash-ember":4,"./lodash-extras":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _coreLodashUtils = require('./_core/lodash-utils');

var _coreLodashUtils2 = _interopRequireDefault(_coreLodashUtils);

var _lodashExtras = require('./lodash-extras');

var _lodashExtras2 = _interopRequireDefault(_lodashExtras);

var _lodashEmber = require('./lodash-ember');

var _lodashEmber2 = _interopRequireDefault(_lodashEmber);

// All lodash extraDeep methods to export
var lodashDeepExtras = {};

/**
 * Generate `deepIs` methods and override standard methods to handle both
 *
 * @method is{Condition}
 * @param {Object} value: Base value to look through
 * @param {String} propString: Property string to apply to `get`
 * @return {Boolean}
 */
_coreLodashUtils2['default'].buildIsMethods(_, lodashDeepExtras);
_coreLodashUtils2['default'].buildIsMethods(_lodashExtras2['default'], lodashDeepExtras);
_coreLodashUtils2['default'].buildIsMethods(_lodashEmber2['default'], lodashDeepExtras);

/**
 * Generate `ensure` methods- Ensure that value is of type x, deeply
 *
 * @method deepEnsure{Type}
 * @param {Object|Array} collection: The root collection of the tree.
 * @param {String} propString: Nested property path of value to check
 * @param {*} [valueDefault=defaults[condition]: What to default to
 * @return {*} Collection, with ensured property
 */
_.forEach(_.keys(_coreLodashUtils2['default'].typeDefaults()), function (type) {
  _lodashExtras2['default']['deepEnsure' + type] = _coreLodashUtils2['default'].makeDeepEnsureType(type);
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
var deepDelete = function deepDelete(value, propString) {
  var currentValue = undefined,
      i = undefined;

  // Delete if present
  if (_.isPresent(value, propString)) {
    currentValue = value;
    propString = _(propString).toString().split('.');

    for (i = 0; i < propString.length - 1; i++) {
      currentValue = currentValue[propString[i]];
    }

    delete currentValue[propString[i]];
  }
};
exports.deepDelete = deepDelete;
lodashDeepExtras.deepDelete = deepDelete;

exports['default'] = lodashDeepExtras;

},{"./_core/lodash-utils":1,"./lodash-ember":4,"./lodash-extras":5}],4:[function(require,module,exports){
/**
 * This utility assumes `Ember` exists globally
 */
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
var lodashEmber = {};

exports.lodashEmber = lodashEmber;
/**
 * Check that a value is an instance, as designated by Ember
 *
 * @method isInstance
 * @param {*} value: Value to check
 * @return {Boolean}
 */
var isEmberInstance = function isEmberInstance(value) {
  return Ember.typeOf(value) === 'instance';
};
exports.isEmberInstance = isEmberInstance;
lodashEmber.isEmberInstance = isEmberInstance;

/**
 * Check that a value is, at least, a subclass of Ember.Object
 *
 * @method isEmberObject
 * @param {*} value: Value to check
 * @return {Boolean}
 */
var isEmberObject = _coreLodashUtils2['default'].makeIsType(Ember.Object);
exports.isEmberObject = isEmberObject;
lodashEmber.isEmberObject = isEmberObject;

/**
 * NOTE: isEmberArray has been excluded as Ember.Array is not an Ember.Object
 */

/**
 * Check that a value is, at least, a subclass of Ember.ObjectProxy
 *
 * @method isEmberObjectProxy
 * @param {*} value: Value to check
 * @return {Boolean}
 */
var isEmberObjectProxy = _coreLodashUtils2['default'].makeIsType(Ember.ObjectProxy);
exports.isEmberObjectProxy = isEmberObjectProxy;
lodashEmber.isEmberObjectProxy = isEmberObjectProxy;

/**
 * Check that a value is, at least, a subclass of Ember.ArrayProxy
 *
 * @method isEmberArrayProxy
 * @param {*} value: Value to check
 * @return {Boolean}
 */
var isEmberArrayProxy = _coreLodashUtils2['default'].makeIsType(Ember.ArrayProxy);
exports.isEmberArrayProxy = isEmberArrayProxy;
lodashEmber.isEmberArrayProxy = isEmberArrayProxy;

/**
 * Check that the value is a descendent of an Ember Class
 * TODO: Check that `_.isEmberInstance` doesn't already yield the same result
 *
 * @method isEmberCollection
 * @param {*} value: Value to check
 * @return {Boolean}
 */
var isEmberCollection = function isEmberCollection(value) {
  return _.isEmberObject(value) || _.isEmberObjectProxy(value) || _.isEmberArrayProxy(value);
};
exports.isEmberCollection = isEmberCollection;
lodashEmber.isEmberCollection = isEmberCollection;

/**
 * Check that value is Ember Transition
 *
 * @method isEmberTransition
 * @param {*} value: Value to check
 * @return {Boolean}
 */
var isEmberTransition = function isEmberTransition(value) {
  return _.isFunction(value, 'toString') && _.contains(value.toString(), 'Transition');
};
exports.isEmberTransition = isEmberTransition;
lodashEmber.isEmberTransition = isEmberTransition;

/**
 * Lodash forEach
 *
 * @method _forEach
 * @param {Array|Object|String} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|String} Returns `collection`.
 */
var _forEach = _.forEach;
exports._forEach = _forEach;
lodashEmber._forEach = _forEach;

/**
 * Override lodash `forEach` to support ember arrays/objects
 *
 * @method forEach
 * @param {Array|Object|String} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|String} Returns `collection`.
 */
var forEach = function forEach(collection, callback, thisArg) {
  if (_.isEmberArrayProxy(collection)) {
    return collection.forEach(callback, this);
  }
  if (_.isEmberObjectProxy(collection) && _.isObject(collection.get('content'))) {
    return _forEach(collection.get('content'), callback, thisArg);
  }
  return _forEach(collection, callback, thisArg);
};
exports.forEach = forEach;
lodashEmber.forEach = forEach;

/**
 * Lodash reduce
 *
 * @method _reduce
 * @param {Array|Object|String} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [currentValue] value at beginning of iteration
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|String} Returns `collection`.
 */
var _reduce = _.reduce;
exports._reduce = _reduce;
lodashEmber._reduce = _reduce;

/**
 * Override lodash `reduce` to support ember arrays/objects
 *
 * @method reduce
 * @param {Array|Object|String} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [currentValue] value at beginning of iteration
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|String} Returns `collection`.
 */
var reduce = function reduce(collection, callback, currentValue, thisArg) {
  if (_.isEmberArrayProxy(collection)) {
    return collection.reduce(callback, currentValue, this);
  }
  if (_.isEmberObjectProxy(collection) && _.isObject(collection.get('content'))) {
    return _reduce(collection.get('content'), callback, currentValue, thisArg);
  }
  return _reduce(collection, callback, currentValue, thisArg);
};
exports.reduce = reduce;
lodashEmber.reduce = reduce;

/**
 * Lodash map
 *
 * @method _map
 * @param {Array|Object|String} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|String} Returns `collection`.
 */
var _map = _.map;
exports._map = _map;
lodashEmber._map = _map;

/**
 * Override lodash `map` to support ember arrays/objects
 *
 * @method map
 * @param {Array|Object|String} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|String} Returns `collection`.
 */
var map = function map(collection, callback, thisArg) {
  if (_.isEmberArrayProxy(collection)) {
    return collection.map(callback, this);
  }
  return _map(collection, callback, thisArg);
};
exports.map = map;
lodashEmber.map = map;

/**
 * Lodash `get` alias to private namespace
 *
 * @method _get
 * @param {Object|Array} collection: The root collection of the tree.
 * @param {String|Array} propertyPath: The property path in the collection.
 * @returns {*} The value, or undefined if it doesn't exists.
 */
var _get = _.get;
exports._get = _get;
lodashEmber._get = _get;

/**
 * Retrieves the value of a property in an object tree.
 *
 * @method get
 * @param {Object|Array} collection: The root collection of the tree.
 * @param {String|Array} propertyPath: The property path in the collection.
 * @returns {*} The value, or undefined if it doesn't exists.
 */
var get = function get(collection, propertyPath) {
  // Handle Ember Objects
  if (isEmberObject(collection) || isEmberObjectProxy(collection)) {
    return collection.get(propertyPath);
  }

  return _get.apply(undefined, arguments);
};
exports.get = get;
lodashEmber.get = get;

/**
 * Lodash `set` alias to private namespace
 *
 * @method _set
 * @param {Object|Array} collection: The root collection of the tree.
 * @param {String|Array} propertyPath: The property path in the collection.
 * @param {*} value: The property path in the collection.
 * @returns {*} The `collection` passed in with value set.
 */
var _set = _.set;
exports._set = _set;
lodashEmber._set = _set;

/**
 * Retrieves the value of a property in an object tree.
 *
 * @method set
 * @param {Object|Array} collection: The root collection of the tree.
 * @param {String|Array} propertyPath: The property path in the collection.
 * @param {*} value: Value to set on the collection.
 * @returns {*} The `collection` passed in with value set.
 */
var set = function set(collection, propertyPath, value) {
  // Handle Ember Objects
  if (isEmberObject(collection) || isEmberObjectProxy(collection)) {
    collection.set(propertyPath, value);
    return collection;
  }

  return _set.apply(undefined, arguments);
};
exports.set = set;
lodashEmber.set = set;

/**
 * Original lodash isEmpty
 *
 * @method _isEmpty
 * @param {*} value
 * @return {Boolean}
 */
var _isEmpty = _.isEmpty;
exports._isEmpty = _isEmpty;
lodashEmber._isEmpty = _isEmpty;

/**
 * Determines if the value is empty or not
 *
 * @method isEmpty
 * @param {*} value
 * @return {Boolean}
 */
var isEmpty = function isEmpty(value) {
  if (_.isEmberArrayProxy(value) && _.isFunction(value.isEmpty)) {
    return value.isEmpty();
  }

  return _isEmpty.apply(undefined, arguments);
};
exports.isEmpty = isEmpty;
lodashEmber.isEmpty = isEmpty;

/**
 * Original lodash clone
 *
 * @method _clone
 * @param {*} value
 * @return {*}
 */
var _clone = _.clone;
exports._clone = _clone;
lodashEmber._clone = _clone;

/**
 * Returns a cloned copy of value
 *
 * @method clone
 * @param {*} value
 * @return {*}
 */
var clone = function clone(value) {
  if (_.isWildcatObject(value)) {
    return value.clone();
  }

  return _clone.apply(undefined, arguments);
};
exports.clone = clone;
lodashEmber.clone = clone;

/**
 * Alias for `array.pop` or `arrayProxy.popObject`
 *
 * @method pop
 * @param {Array|Ember.ArrayProxy} value
 * @return {*}
 */
var pop = function pop(value) {
  return _.isEmberArrayProxy(value) ? value.popObject() : value.pop();
};
exports.pop = pop;
lodashEmber.pop = pop;

/**
 * Alias for `array.shift` or `arrayProxy.shiftObject`
 *
 * @method shift
 * @param {Array|Ember.ArrayProxy} value
 * @return {*}
 */
var shift = function shift(value) {
  return _.isEmberArrayProxy(value) ? value.shiftObject() : value.shift();
};
exports.shift = shift;
lodashEmber.shift = shift;

/**
 * Ember `typeOf` alias
 *
 * @method typeOf
 * @param {*} value: Value to check
 * @return {String} The type of `value`
 */
var typeOf = function typeOf(value) {
  return Ember.typeOf(value);
};
exports.typeOf = typeOf;
lodashEmber.typeOf = typeOf;

var lodashEmber;
exports.lodashEmber = lodashEmber;
exports['default'] = lodashEmber;

},{"./_core/lodash-utils":1}],5:[function(require,module,exports){
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
 * @method ensure{Type}
 * @param {*} value: To check
 * @param {*} [valueDefault=defaults[condition]: What to default to
 * @return {*} Ensured value
 */
_.forEach(_.keys(_coreLodashUtils2['default'].typeDefaults()), function (type) {
  lodashExtras['ensure' + type] = _coreLodashUtils2['default'].makeEnsureType(type);
});

/**
 * Javascript `typeof` alias
 *
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcmpoaWxnZWZvcnQvRHJvcGJveC9Qcm9qZWN0cy9sb2Rhc2gtZXh0cmFzL3NyYy9fY29yZS9sb2Rhc2gtdXRpbHMuanMiLCIvVXNlcnMvcmpoaWxnZWZvcnQvRHJvcGJveC9Qcm9qZWN0cy9sb2Rhc2gtZXh0cmFzL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1kZWVwLWV4dHJhcy5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1lbWJlci5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1leHRyYXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0dBLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7QUFTZCxJQUFJLFlBQVksR0FBRyxTQUFmLFlBQVksR0FBUztBQUMvQixTQUFPO0FBQ04sWUFBUSxFQUFFLEVBQUU7QUFDWixXQUFPLEVBQUUsRUFBRTtBQUNYLGlCQUFhLEVBQUUsRUFBRTtBQUNqQixhQUFTLEVBQUUsS0FBSztBQUNoQixZQUFRLEVBQUUsQ0FBQztHQUNYLENBQUM7Q0FDRixDQUFDOztBQUNGLFdBQVcsQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDOzs7Ozs7Ozs7QUFVakMsSUFBSSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUksS0FBSyxFQUFLO0FBQ2xDLFNBQU8sVUFBUyxLQUFLLEVBQUU7QUFDdEIsV0FBUSxLQUFLLFlBQVksS0FBSyxDQUFFO0dBQ2hDLENBQUM7Q0FDRixDQUFDOztBQUNGLFdBQVcsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFD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LFlBQVkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDb2xsZWN0aW9uIG9mIGFsbCB0aGUgdXRpbHMgaW4gaGVyZS4gQWRkIHRvIHRoaXMgYXMgeW91IGdvLlxuICovXG5sZXQgbG9kYXNoVXRpbHMgPSB7fTtcblxuXG4vKipcbiAqIEhlbHBlciBmb3IgSlMgdHlwZXMgYW5kIGRlZmF1bHRzIGZvciBlYWNoIHR5cGVcbiAqXG4gKiBAbWV0aG9kIHR5cGVEZWZhdWx0c1xuICogQHJldHVybiB7UGxhaW5PYmplY3R9XG4gKi9cbmV4cG9ydCB2YXIgdHlwZURlZmF1bHRzID0gKCkgPT4ge1xuXHRyZXR1cm4ge1xuXHRcdCdTdHJpbmcnOiAnJyxcblx0XHQnQXJyYXknOiBbXSxcblx0XHQnUGxhaW5PYmplY3QnOiB7fSxcblx0XHQnQm9vbGVhbic6IGZhbHNlLFxuXHRcdCdOdW1iZXInOiAxXG5cdH07XG59O1xubG9kYXNoVXRpbHMudHlwZURlZmF1bHRzID0gdHlwZURlZmF1bHRzO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIG1ha2UgYF8uaXNFbWJlcntDbGFzc31gXG4gKlxuICogQG1ldGhvZCBtYWtlSXNUeXBlXG4gKiBAcGFyYW0geyp9IGtsYXNzOiBBIGNsYXNzIHRvIGNoZWNrIGluc3RhbmNlb2YgYWdhaW5zdFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydCB2YXIgbWFrZUlzVHlwZSA9IChrbGFzcykgPT4ge1xuXHRyZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRyZXR1cm4gKHZhbHVlIGluc3RhbmNlb2Yga2xhc3MpO1xuXHR9O1xufTtcbmxvZGFzaFV0aWxzLm1ha2VJc1R5cGUgPSBtYWtlSXNUeXBlO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIG1ha2UgYF8uZW5zdXJlVHlwZWBcbiAqXG4gKiBAbWV0aG9kIG1ha2VFbnN1cmVUeXBlXG4gKiBAcGFyYW0ge1N0cmluZ30gY29uZGl0aW9uOiBMb2Rhc2ggbWV0aG9kIHRvIGFwcGx5XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0IHZhciBtYWtlRW5zdXJlVHlwZSA9IChjb25kaXRpb24pID0+IHtcblx0bGV0IGRlZmF1bHRzID0gbG9kYXNoVXRpbHMudHlwZURlZmF1bHRzKCk7XG5cblx0Ly8gQ2hlY2sgcGFyYW1zOiBjb25kaXRpb25cblx0aWYgKCFfLmlzU3RyaW5nKGNvbmRpdGlvbikpIGNvbmRpdGlvbiA9ICcnO1xuXHRjb25kaXRpb24gPSBfLmNhcGl0YWxpemUoY29uZGl0aW9uKTtcblx0aWYgKCFfLmNvbnRhaW5zKF8ua2V5cyhkZWZhdWx0cyksIGNvbmRpdGlvbikpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYFxcYGNvbmRpdGlvblxcYCBub3Qgc3VwcG9ydGVkOiAke2NvbmRpdGlvbn1gKTtcblx0fVxuXG5cdC8vIFNob3J0Y3V0XG5cdGxldCBpc0NvbmRpdGlvbiA9IF9bYGlzJHtjb25kaXRpb259YF07XG5cblx0LyoqXG5cdCAqIEludGVyZmFjZSBmb3IgYGVuc3VyZVR5cGVgIG1ldGhvZHNcblx0ICpcblx0ICogQG1ldGhvZCBgZW5zdXJlJHt0eXBlfWBcblx0ICogQHBhcmFtIHsqfSB2YWx1ZTogVG8gY2hlY2tcblx0ICogQHBhcmFtIHsqfSBbdmFsdWVEZWZhdWx0PWRlZmF1bHRzW2NvbmRpdGlvbl06IFdoYXQgdG8gZGVmYXVsdCB0b1xuXHQgKiBAcmV0dXJuIHsqfSBEZWZhdWx0ZWQgdmFsdWUsIG9yIHRoZSB2YWx1ZSBpdHNlbGYgaWYgcGFzc1xuICAgKi9cblx0cmV0dXJuICh2YWx1ZSwgdmFsdWVEZWZhdWx0KSA9PiB7XG5cdFx0Ly8gRGV0ZXJtaW5lIGB2YWx1ZURlZmF1bHRgOiBpZiBub3RoaW5nIHByb3ZpZGVkLCBvciBwcm92aWRlZCBkb2Vzbid0IG1hdGNoIHR5cGVcblx0XHRpZiAoXy5pc1VuZGVmaW5lZCh2YWx1ZURlZmF1bHQpIHx8ICFpc0NvbmRpdGlvbih2YWx1ZURlZmF1bHQpKSB7XG5cdFx0XHR2YWx1ZURlZmF1bHQgPSBfLmNsb25lKGRlZmF1bHRzW2NvbmRpdGlvbl0pO1xuXHRcdH1cblxuXHRcdC8vIEFjdHVhbCBcImVuc3VyZVwiIGNoZWNrXG5cdFx0aWYgKCFfW2BpcyR7Y29uZGl0aW9ufWBdKHZhbHVlKSkgdmFsdWUgPSB2YWx1ZURlZmF1bHQ7XG5cblx0XHRyZXR1cm4gdmFsdWU7XG5cdH07XG59O1xubG9kYXNoVXRpbHMubWFrZUVuc3VyZVR5cGUgPSBtYWtlRW5zdXJlVHlwZTtcblxuXG4vKipcbiAqIEhlbHBlciB0byBtYWtlIGBfLmRlZXBFbnN1cmV7VHlwZX1gXG4gKlxuICogQG1ldGhvZCBtYWtlRGVlcEVuc3VyZVR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbmRpdGlvbjogTG9kYXNoIG1ldGhvZCB0byBhcHBseVxuICogQHBhcmFtIHsqfSB2YWx1ZURlZmF1bHQ6IFdoYXQgdG8gYXNzaWduIHdoZW4gbm90IG9mIHRoZSBkZXNpcmVkIHR5cGVcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnQgdmFyIG1ha2VEZWVwRW5zdXJlVHlwZSA9IChjb25kaXRpb24pID0+IHtcblx0cmV0dXJuIChjb2xsZWN0aW9uLCBwcm9wU3RyaW5nLCB2YWx1ZURlZmF1bHQpID0+IHtcblx0XHRyZXR1cm4gXy5zZXQoXG5cdFx0XHRjb2xsZWN0aW9uLFxuXHRcdFx0cHJvcFN0cmluZyxcblx0XHRcdGxvZGFzaFV0aWxzLm1ha2VFbnN1cmVUeXBlKGNvbmRpdGlvbikoXG5cdFx0XHRcdF8uZ2V0KGNvbGxlY3Rpb24sIHByb3BTdHJpbmcpLFxuXHRcdFx0XHR2YWx1ZURlZmF1bHRcblx0XHRcdClcblx0XHQpO1xuXHR9O1xufTtcbmxvZGFzaFV0aWxzLm1ha2VEZWVwRW5zdXJlVHlwZSA9IG1ha2VEZWVwRW5zdXJlVHlwZTtcblxuXG4vKipcbiAqIERldGVybWluZWQgaWYgbG9kYXNoIGtleS9tZXRob2QgaXMgdmFsaWQgdG8gbWFrZSBkZWVwIChgaXNgIG1ldGhvZHMgdGhhdCBvbmx5IGhhdmUgb25lIGFyZ3VtZW50KVxuICogTk9URTogQXNzdW1lcyBgdGhpc2AgPT09IGlzIHRoZSBuYW1lc3BhY2UgdG8gY2hlY2sgZm9yIHRoZSBmdW5jdGlvbiBvblxuICpcbiAqIEBtZXRob2QgdmFsaWRJc01ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IGtleTogbWV0aG9kIG5hbWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgdmFsaWRJc01ldGhvZCA9IGZ1bmN0aW9uKGtleSkge1xuICByZXR1cm4gKFxuICAgIF8uc3RhcnRzV2l0aChrZXksICdpcycpICYmXG4gICAgKHRoaXNba2V5XS5sZW5ndGggPT09IDEpXG4gICk7XG59O1xubG9kYXNoVXRpbHMudmFsaWRJc01ldGhvZCA9IHZhbGlkSXNNZXRob2Q7XG5cblxuLyoqXG4gKiBGaWx0ZXIgb3V0IGFsbCB2YWxpZCBgaXNgIG1ldGhvZHMgZnJvbSBhIG5hbWVzcGFjZVxuICpcbiAqIEBtZXRob2QgZmlsdGVySXNNZXRob2RzXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlOiBDb2xsZWN0aW9uIG9mIG1ldGhvZHNcbiAqIEByZXR1cm4ge09iamVjdH0gYG5hbWVzcGFjZWAgd2l0aCBqdXN0IHRoZSBcImlzXCIgbWV0aG9kc1xuICovXG5leHBvcnQgdmFyIGZpbHRlcklzTWV0aG9kcyA9IChuYW1lc3BhY2UpID0+IHtcbiAgcmV0dXJuIF8uY2hhaW4obmFtZXNwYWNlKVxuICAgIC5rZXlzKClcbiAgICAuZmlsdGVyKHZhbGlkSXNNZXRob2QsIG5hbWVzcGFjZSlcbiAgICAudmFsdWUoKTtcbn07XG5sb2Rhc2hVdGlscy5maWx0ZXJJc01ldGhvZHMgPSBmaWx0ZXJJc01ldGhvZHM7XG5cblxuLyoqXG4gKiBPdmVybG9hZCBub3JtYWwgbG9kYXNoIG1ldGhvZHMgdG8gaGFuZGxlIGRlZXAgc3ludGF4XG4gKiBUT0RPOiBObyBuZWVkIHRvIHRha2UgdGhlIGZpcnN0IHBhcmFtXG4gKlxuICogQG1ldGhvZCBvdmVybG9hZE1ldGhvZHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBpc01ldGhvZHM6IENvbGxlY3Rpb24gb2YgaXMgbWV0aG9kc1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZTogT3JpZ2luYWwgbmFtZXNwYWNlIGlzTWV0aG9kcyBjYW1lIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQ6IG5hbWVzcGFjZSB0byBvdmVybG9hZCBtZXRob2RzIG9uXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9XG4gKi9cbmV4cG9ydCB2YXIgb3ZlcmxvYWRNZXRob2RzID0gKGlzTWV0aG9kcywgbmFtZXNwYWNlLCB0YXJnZXQpID0+IHtcbiAgbGV0IG9sZE1ldGhvZCA9IHt9O1xuXG4gIF8uZm9yRWFjaChpc01ldGhvZHMsIChtZXRob2QpID0+IHtcbiAgICAvLyBTYXZlIG9sZCBtZXRob2RcbiAgICBvbGRNZXRob2RbbWV0aG9kXSA9IG5hbWVzcGFjZVttZXRob2RdO1xuXG4gICAgLy8gTWFrZSBuZXcgbWV0aG9kIHRoYXQgYWxzbyBoYW5kbGVzIGBnZXRgLiBBcHBseSBtZXRob2QgdG8gZXhwb3J0cy5cbiAgICB0YXJnZXRbbWV0aG9kXSA9IGZ1bmN0aW9uKHZhbHVlLCBwcm9wU3RyaW5nKSB7XG4gICAgICBpZiAoXy5zaXplKGFyZ3VtZW50cykgPT09IDIpIHtcbiAgICAgICAgcmV0dXJuIG5hbWVzcGFjZVttZXRob2RdKF8uZ2V0KC4uLmFyZ3VtZW50cykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9sZE1ldGhvZFttZXRob2RdKC4uLmFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfSk7XG59O1xubG9kYXNoVXRpbHMub3ZlcmxvYWRNZXRob2RzID0gb3ZlcmxvYWRNZXRob2RzO1xuXG5cbi8qKlxuICogQnVpbGQgYGlzTWV0aG9kc2BcbiAqXG4gKiBAbWV0aG9kIGJ1aWxkSXNNZXRob2RzXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlOiBOYW1lc3BhY2UgdG8gcHVsbCBgaXNgIG1ldGhvZHMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldDogbmFtZXNwYWNlIHRvIG92ZXJsb2FkIG1ldGhvZHMgb25cbiAqIEByZXR1cm4ge1VuZGVmaW5lZH1cbiAqL1xuZXhwb3J0IHZhciBidWlsZElzTWV0aG9kcyA9IChuYW1lc3BhY2UsIHRhcmdldCkgPT4ge1xuICBvdmVybG9hZE1ldGhvZHMoZmlsdGVySXNNZXRob2RzKG5hbWVzcGFjZSksIG5hbWVzcGFjZSwgdGFyZ2V0KTtcbn1cbmxvZGFzaFV0aWxzLmJ1aWxkSXNNZXRob2RzID0gYnVpbGRJc01ldGhvZHM7XG5cblxuZXhwb3J0IGRlZmF1bHQgbG9kYXNoVXRpbHM7XG4iLCJpbXBvcnQgbG9kYXNoRXh0cmFzIGZyb20gJy4vbG9kYXNoLWV4dHJhcyc7XG5fLm1peGluKGxvZGFzaEV4dHJhcyk7XG5cbmltcG9ydCBsb2Rhc2hFbWJlciBmcm9tICcuL2xvZGFzaC1lbWJlcic7XG5fLm1peGluKGxvZGFzaEVtYmVyKTtcblxuaW1wb3J0IGxvZGFzaERlZXBFeHRyYXMgZnJvbSAnLi9sb2Rhc2gtZGVlcC1leHRyYXMnO1xuXy5taXhpbihsb2Rhc2hEZWVwRXh0cmFzKTtcbiIsImltcG9ydCBsb2Rhc2hVdGlscyBmcm9tICcuL19jb3JlL2xvZGFzaC11dGlscyc7XG5pbXBvcnQgbG9kYXNoRXh0cmFzIGZyb20gJy4vbG9kYXNoLWV4dHJhcyc7XG5pbXBvcnQgbG9kYXNoRW1iZXIgZnJvbSAnLi9sb2Rhc2gtZW1iZXInO1xuXG5cbi8vIEFsbCBsb2Rhc2ggZXh0cmFEZWVwIG1ldGhvZHMgdG8gZXhwb3J0XG5sZXQgbG9kYXNoRGVlcEV4dHJhcyA9IHt9O1xuXG5cbi8qKlxuICogR2VuZXJhdGUgYGRlZXBJc2AgbWV0aG9kcyBhbmQgb3ZlcnJpZGUgc3RhbmRhcmQgbWV0aG9kcyB0byBoYW5kbGUgYm90aFxuICpcbiAqIEBtZXRob2QgaXN7Q29uZGl0aW9ufVxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlOiBCYXNlIHZhbHVlIHRvIGxvb2sgdGhyb3VnaFxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BTdHJpbmc6IFByb3BlcnR5IHN0cmluZyB0byBhcHBseSB0byBgZ2V0YFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xubG9kYXNoVXRpbHMuYnVpbGRJc01ldGhvZHMoXywgbG9kYXNoRGVlcEV4dHJhcyk7XG5sb2Rhc2hVdGlscy5idWlsZElzTWV0aG9kcyhsb2Rhc2hFeHRyYXMsIGxvZGFzaERlZXBFeHRyYXMpO1xubG9kYXNoVXRpbHMuYnVpbGRJc01ldGhvZHMobG9kYXNoRW1iZXIsIGxvZGFzaERlZXBFeHRyYXMpO1xuXG4vKipcbiAqIEdlbmVyYXRlIGBlbnN1cmVgIG1ldGhvZHMtIEVuc3VyZSB0aGF0IHZhbHVlIGlzIG9mIHR5cGUgeCwgZGVlcGx5XG4gKlxuICogQG1ldGhvZCBkZWVwRW5zdXJle1R5cGV9XG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gY29sbGVjdGlvbjogVGhlIHJvb3QgY29sbGVjdGlvbiBvZiB0aGUgdHJlZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wU3RyaW5nOiBOZXN0ZWQgcHJvcGVydHkgcGF0aCBvZiB2YWx1ZSB0byBjaGVja1xuICogQHBhcmFtIHsqfSBbdmFsdWVEZWZhdWx0PWRlZmF1bHRzW2NvbmRpdGlvbl06IFdoYXQgdG8gZGVmYXVsdCB0b1xuICogQHJldHVybiB7Kn0gQ29sbGVjdGlvbiwgd2l0aCBlbnN1cmVkIHByb3BlcnR5XG4gKi9cbl8uZm9yRWFjaChfLmtleXMobG9kYXNoVXRpbHMudHlwZURlZmF1bHRzKCkpLCAodHlwZSkgPT4ge1xuXHRsb2Rhc2hFeHRyYXNbYGRlZXBFbnN1cmUke3R5cGV9YF0gPSBsb2Rhc2hVdGlscy5tYWtlRGVlcEVuc3VyZVR5cGUodHlwZSk7XG59KTtcblxuXG4vKipcbiAqIERlbGV0ZSBkZWVwbHkgbmVzdGVkIHByb3BlcnRpZXMgd2l0aG91dCBjaGVja2luZyBleGlzdGVuY2UgZG93biB0aGUgdHJlZSBmaXJzdFxuICogVE9ETzogVEVTVCBURVNUIFRFU1QuIFRoaXMgaXMgZXhwZXJpbWVudGFsIChXSVApXG4gKlxuICogQG1ldGhvZCBkZWVwRGVsZXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHBhcmFtIHtTdHJpbmd9IHByb3BTdHJpbmc6IFByb3BlcnR5IHN0cmluZyB0byBhcHBseSB0byBgZ2V0YFxuICogQHJldHVybiB7dW5kZWZpbmVkfSBEb2Vzbid0IHJldHVybiBzdWNjZXNzL2ZhaWx1cmUsIHRvIG1hdGNoIGBkZWxldGVgJ3MgcmV0dXJuXG4gKi9cbmV4cG9ydCB2YXIgZGVlcERlbGV0ZSA9IGZ1bmN0aW9uKHZhbHVlLCBwcm9wU3RyaW5nKSB7XG5cdGxldCBjdXJyZW50VmFsdWUsIGk7XG5cblx0Ly8gRGVsZXRlIGlmIHByZXNlbnRcblx0aWYgKF8uaXNQcmVzZW50KHZhbHVlLCBwcm9wU3RyaW5nKSkge1xuXHRcdGN1cnJlbnRWYWx1ZSA9IHZhbHVlO1xuXHRcdHByb3BTdHJpbmcgPSBfKHByb3BTdHJpbmcpLnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCAocHJvcFN0cmluZy5sZW5ndGggLSAxKTsgaSsrKSB7XG5cdFx0XHRjdXJyZW50VmFsdWUgPSBjdXJyZW50VmFsdWVbcHJvcFN0cmluZ1tpXV07XG5cdFx0fVxuXG5cdFx0ZGVsZXRlIGN1cnJlbnRWYWx1ZVtwcm9wU3RyaW5nW2ldXTtcblx0fVxufTtcbmxvZGFzaERlZXBFeHRyYXMuZGVlcERlbGV0ZSA9IGRlZXBEZWxldGU7XG5cblxuZXhwb3J0IGRlZmF1bHQgbG9kYXNoRGVlcEV4dHJhcztcbiIsIi8qKlxuICogVGhpcyB1dGlsaXR5IGFzc3VtZXMgYEVtYmVyYCBleGlzdHMgZ2xvYmFsbHlcbiAqL1xuaW1wb3J0IGxvZGFzaFV0aWxzIGZyb20gJy4vX2NvcmUvbG9kYXNoLXV0aWxzJztcblxuXG4vKipcbiAqIENvbGxlY3Rpb24gb2YgYWxsIHRoZSB1dGlscyBpbiBoZXJlLiBBZGQgdG8gdGhpcyBhcyB5b3UgZ28uXG4gKi9cbmV4cG9ydCB2YXIgbG9kYXNoRW1iZXIgPSB7fTtcblxuXG4vKipcbiAqIENoZWNrIHRoYXQgYSB2YWx1ZSBpcyBhbiBpbnN0YW5jZSwgYXMgZGVzaWduYXRlZCBieSBFbWJlclxuICpcbiAqIEBtZXRob2QgaXNJbnN0YW5jZVxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNFbWJlckluc3RhbmNlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0cmV0dXJuIChFbWJlci50eXBlT2YodmFsdWUpID09PSAnaW5zdGFuY2UnKTtcbn07XG5sb2Rhc2hFbWJlci5pc0VtYmVySW5zdGFuY2UgPSBpc0VtYmVySW5zdGFuY2U7XG5cblxuLyoqXG4gKiBDaGVjayB0aGF0IGEgdmFsdWUgaXMsIGF0IGxlYXN0LCBhIHN1YmNsYXNzIG9mIEVtYmVyLk9iamVjdFxuICpcbiAqIEBtZXRob2QgaXNFbWJlck9iamVjdFxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNFbWJlck9iamVjdCA9IGxvZGFzaFV0aWxzLm1ha2VJc1R5cGUoRW1iZXIuT2JqZWN0KTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJPYmplY3QgPSBpc0VtYmVyT2JqZWN0O1xuXG5cbi8qKlxuICogTk9URTogaXNFbWJlckFycmF5IGhhcyBiZWVuIGV4Y2x1ZGVkIGFzIEVtYmVyLkFycmF5IGlzIG5vdCBhbiBFbWJlci5PYmplY3RcbiAqL1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhIHZhbHVlIGlzLCBhdCBsZWFzdCwgYSBzdWJjbGFzcyBvZiBFbWJlci5PYmplY3RQcm94eVxuICpcbiAqIEBtZXRob2QgaXNFbWJlck9iamVjdFByb3h5XG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc0VtYmVyT2JqZWN0UHJveHkgPSBsb2Rhc2hVdGlscy5tYWtlSXNUeXBlKEVtYmVyLk9iamVjdFByb3h5KTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJPYmplY3RQcm94eSA9IGlzRW1iZXJPYmplY3RQcm94eTtcblxuXG4vKipcbiAqIENoZWNrIHRoYXQgYSB2YWx1ZSBpcywgYXQgbGVhc3QsIGEgc3ViY2xhc3Mgb2YgRW1iZXIuQXJyYXlQcm94eVxuICpcbiAqIEBtZXRob2QgaXNFbWJlckFycmF5UHJveHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzRW1iZXJBcnJheVByb3h5ID0gbG9kYXNoVXRpbHMubWFrZUlzVHlwZShFbWJlci5BcnJheVByb3h5KTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJBcnJheVByb3h5ID0gaXNFbWJlckFycmF5UHJveHk7XG5cblxuLyoqXG4gKiBDaGVjayB0aGF0IHRoZSB2YWx1ZSBpcyBhIGRlc2NlbmRlbnQgb2YgYW4gRW1iZXIgQ2xhc3NcbiAqIFRPRE86IENoZWNrIHRoYXQgYF8uaXNFbWJlckluc3RhbmNlYCBkb2Vzbid0IGFscmVhZHkgeWllbGQgdGhlIHNhbWUgcmVzdWx0XG4gKlxuICogQG1ldGhvZCBpc0VtYmVyQ29sbGVjdGlvblxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNFbWJlckNvbGxlY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRyZXR1cm4gKFxuXHRcdF8uaXNFbWJlck9iamVjdCh2YWx1ZSkgfHxcblx0XHRfLmlzRW1iZXJPYmplY3RQcm94eSh2YWx1ZSkgfHxcblx0XHRfLmlzRW1iZXJBcnJheVByb3h5KHZhbHVlKVxuXHQpO1xufTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJDb2xsZWN0aW9uID0gaXNFbWJlckNvbGxlY3Rpb247XG5cblxuLyoqXG4gKiBDaGVjayB0aGF0IHZhbHVlIGlzIEVtYmVyIFRyYW5zaXRpb25cbiAqXG4gKiBAbWV0aG9kIGlzRW1iZXJUcmFuc2l0aW9uXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc0VtYmVyVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHJldHVybiAoXG5cdFx0Xy5pc0Z1bmN0aW9uKHZhbHVlLCAndG9TdHJpbmcnKSAmJlxuXHRcdF8uY29udGFpbnModmFsdWUudG9TdHJpbmcoKSwgJ1RyYW5zaXRpb24nKVxuXHQpO1xufTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJUcmFuc2l0aW9uID0gaXNFbWJlclRyYW5zaXRpb247XG5cblxuLyoqXG4gKiBMb2Rhc2ggZm9yRWFjaFxuICpcbiAqIEBtZXRob2QgX2ZvckVhY2hcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG5leHBvcnQgdmFyIF9mb3JFYWNoID0gXy5mb3JFYWNoO1xubG9kYXNoRW1iZXIuX2ZvckVhY2ggPSBfZm9yRWFjaDtcblxuXG4vKipcbiAqIE92ZXJyaWRlIGxvZGFzaCBgZm9yRWFjaGAgdG8gc3VwcG9ydCBlbWJlciBhcnJheXMvb2JqZWN0c1xuICpcbiAqIEBtZXRob2QgZm9yRWFjaFxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fFN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbmV4cG9ydCB2YXIgZm9yRWFjaCA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG5cdGlmIChfLmlzRW1iZXJBcnJheVByb3h5KGNvbGxlY3Rpb24pKSB7XG5cdFx0cmV0dXJuIGNvbGxlY3Rpb24uZm9yRWFjaChjYWxsYmFjaywgdGhpcyk7XG5cdH1cblx0aWYgKF8uaXNFbWJlck9iamVjdFByb3h5KGNvbGxlY3Rpb24pICYmIF8uaXNPYmplY3QoY29sbGVjdGlvbi5nZXQoJ2NvbnRlbnQnKSkpIHtcblx0XHRyZXR1cm4gX2ZvckVhY2goY29sbGVjdGlvbi5nZXQoJ2NvbnRlbnQnKSwgY2FsbGJhY2ssIHRoaXNBcmcpO1xuXHR9XG5cdHJldHVybiBfZm9yRWFjaChjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZyk7XG59O1xubG9kYXNoRW1iZXIuZm9yRWFjaCA9IGZvckVhY2g7XG5cblxuLyoqXG4gKiBMb2Rhc2ggcmVkdWNlXG4gKlxuICogQG1ldGhvZCBfcmVkdWNlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFtjdXJyZW50VmFsdWVdIHZhbHVlIGF0IGJlZ2lubmluZyBvZiBpdGVyYXRpb25cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG5leHBvcnQgdmFyIF9yZWR1Y2UgPSBfLnJlZHVjZTtcbmxvZGFzaEVtYmVyLl9yZWR1Y2UgPSBfcmVkdWNlO1xuXG5cbi8qKlxuICogT3ZlcnJpZGUgbG9kYXNoIGByZWR1Y2VgIHRvIHN1cHBvcnQgZW1iZXIgYXJyYXlzL29iamVjdHNcbiAqXG4gKiBAbWV0aG9kIHJlZHVjZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsqfSBbY3VycmVudFZhbHVlXSB2YWx1ZSBhdCBiZWdpbm5pbmcgb2YgaXRlcmF0aW9uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8U3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xuZXhwb3J0IHZhciByZWR1Y2UgPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBjYWxsYmFjaywgY3VycmVudFZhbHVlLCB0aGlzQXJnKSB7XG5cdGlmIChfLmlzRW1iZXJBcnJheVByb3h5KGNvbGxlY3Rpb24pKSB7XG5cdFx0cmV0dXJuIGNvbGxlY3Rpb24ucmVkdWNlKGNhbGxiYWNrLCBjdXJyZW50VmFsdWUsIHRoaXMpO1xuXHR9XG5cdGlmIChfLmlzRW1iZXJPYmplY3RQcm94eShjb2xsZWN0aW9uKSAmJiBfLmlzT2JqZWN0KGNvbGxlY3Rpb24uZ2V0KCdjb250ZW50JykpKSB7XG5cdFx0cmV0dXJuIF9yZWR1Y2UoY29sbGVjdGlvbi5nZXQoJ2NvbnRlbnQnKSwgY2FsbGJhY2ssIGN1cnJlbnRWYWx1ZSwgdGhpc0FyZyk7XG5cdH1cblx0cmV0dXJuIF9yZWR1Y2UoY29sbGVjdGlvbiwgY2FsbGJhY2ssIGN1cnJlbnRWYWx1ZSwgdGhpc0FyZyk7XG59O1xubG9kYXNoRW1iZXIucmVkdWNlID0gcmVkdWNlO1xuXG5cbi8qKlxuICogTG9kYXNoIG1hcFxuICpcbiAqIEBtZXRob2QgX21hcFxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fFN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbmV4cG9ydCB2YXIgX21hcCA9IF8ubWFwO1xubG9kYXNoRW1iZXIuX21hcCA9IF9tYXA7XG5cblxuLyoqXG4gKiBPdmVycmlkZSBsb2Rhc2ggYG1hcGAgdG8gc3VwcG9ydCBlbWJlciBhcnJheXMvb2JqZWN0c1xuICpcbiAqIEBtZXRob2QgbWFwXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8U3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xuZXhwb3J0IHZhciBtYXAgPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuXHRpZiAoXy5pc0VtYmVyQXJyYXlQcm94eShjb2xsZWN0aW9uKSkge1xuXHRcdHJldHVybiBjb2xsZWN0aW9uLm1hcChjYWxsYmFjaywgdGhpcyk7XG5cdH1cblx0cmV0dXJuIF9tYXAoY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpO1xufTtcbmxvZGFzaEVtYmVyLm1hcCA9IG1hcDtcblxuXG4vKipcbiAqIExvZGFzaCBgZ2V0YCBhbGlhcyB0byBwcml2YXRlIG5hbWVzcGFjZVxuICpcbiAqIEBtZXRob2QgX2dldFxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGNvbGxlY3Rpb246IFRoZSByb290IGNvbGxlY3Rpb24gb2YgdGhlIHRyZWUuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gcHJvcGVydHlQYXRoOiBUaGUgcHJvcGVydHkgcGF0aCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqIEByZXR1cm5zIHsqfSBUaGUgdmFsdWUsIG9yIHVuZGVmaW5lZCBpZiBpdCBkb2Vzbid0IGV4aXN0cy5cbiAqL1xuZXhwb3J0IHZhciBfZ2V0ID0gXy5nZXQ7XG5sb2Rhc2hFbWJlci5fZ2V0ID0gX2dldDtcblxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgdmFsdWUgb2YgYSBwcm9wZXJ0eSBpbiBhbiBvYmplY3QgdHJlZS5cbiAqXG4gKiBAbWV0aG9kIGdldFxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGNvbGxlY3Rpb246IFRoZSByb290IGNvbGxlY3Rpb24gb2YgdGhlIHRyZWUuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gcHJvcGVydHlQYXRoOiBUaGUgcHJvcGVydHkgcGF0aCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqIEByZXR1cm5zIHsqfSBUaGUgdmFsdWUsIG9yIHVuZGVmaW5lZCBpZiBpdCBkb2Vzbid0IGV4aXN0cy5cbiAqL1xuZXhwb3J0IHZhciBnZXQgPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBwcm9wZXJ0eVBhdGgpIHtcblx0Ly8gSGFuZGxlIEVtYmVyIE9iamVjdHNcblx0aWYgKGlzRW1iZXJPYmplY3QoY29sbGVjdGlvbikgfHwgaXNFbWJlck9iamVjdFByb3h5KGNvbGxlY3Rpb24pKSB7XG5cdFx0cmV0dXJuIGNvbGxlY3Rpb24uZ2V0KHByb3BlcnR5UGF0aCk7XG5cdH1cblxuICByZXR1cm4gX2dldCguLi5hcmd1bWVudHMpO1xufTtcbmxvZGFzaEVtYmVyLmdldCA9IGdldDtcblxuXG4vKipcbiAqIExvZGFzaCBgc2V0YCBhbGlhcyB0byBwcml2YXRlIG5hbWVzcGFjZVxuICpcbiAqIEBtZXRob2QgX3NldFxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGNvbGxlY3Rpb246IFRoZSByb290IGNvbGxlY3Rpb24gb2YgdGhlIHRyZWUuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gcHJvcGVydHlQYXRoOiBUaGUgcHJvcGVydHkgcGF0aCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFRoZSBwcm9wZXJ0eSBwYXRoIGluIHRoZSBjb2xsZWN0aW9uLlxuICogQHJldHVybnMgeyp9IFRoZSBgY29sbGVjdGlvbmAgcGFzc2VkIGluIHdpdGggdmFsdWUgc2V0LlxuICovXG5leHBvcnQgdmFyIF9zZXQgPSBfLnNldDtcbmxvZGFzaEVtYmVyLl9zZXQgPSBfc2V0O1xuXG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSB2YWx1ZSBvZiBhIHByb3BlcnR5IGluIGFuIG9iamVjdCB0cmVlLlxuICpcbiAqIEBtZXRob2Qgc2V0XG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gY29sbGVjdGlvbjogVGhlIHJvb3QgY29sbGVjdGlvbiBvZiB0aGUgdHJlZS5cbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBwcm9wZXJ0eVBhdGg6IFRoZSBwcm9wZXJ0eSBwYXRoIGluIHRoZSBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gc2V0IG9uIHRoZSBjb2xsZWN0aW9uLlxuICogQHJldHVybnMgeyp9IFRoZSBgY29sbGVjdGlvbmAgcGFzc2VkIGluIHdpdGggdmFsdWUgc2V0LlxuICovXG5leHBvcnQgdmFyIHNldCA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIHByb3BlcnR5UGF0aCwgdmFsdWUpIHtcblx0Ly8gSGFuZGxlIEVtYmVyIE9iamVjdHNcblx0aWYgKGlzRW1iZXJPYmplY3QoY29sbGVjdGlvbikgfHwgaXNFbWJlck9iamVjdFByb3h5KGNvbGxlY3Rpb24pKSB7XG5cdFx0Y29sbGVjdGlvbi5zZXQocHJvcGVydHlQYXRoLCB2YWx1ZSk7XG5cdFx0cmV0dXJuIGNvbGxlY3Rpb247XG5cdH1cblxuICByZXR1cm4gX3NldCguLi5hcmd1bWVudHMpO1xufTtcbmxvZGFzaEVtYmVyLnNldCA9IHNldDtcblxuXG4vKipcbiAqIE9yaWdpbmFsIGxvZGFzaCBpc0VtcHR5XG4gKlxuICogQG1ldGhvZCBfaXNFbXB0eVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBfaXNFbXB0eSA9IF8uaXNFbXB0eTtcbmxvZGFzaEVtYmVyLl9pc0VtcHR5ID0gX2lzRW1wdHk7XG5cblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIHRoZSB2YWx1ZSBpcyBlbXB0eSBvciBub3RcbiAqXG4gKiBAbWV0aG9kIGlzRW1wdHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNFbXB0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmIChcblx0XHRfLmlzRW1iZXJBcnJheVByb3h5KHZhbHVlKSAmJlxuXHRcdF8uaXNGdW5jdGlvbih2YWx1ZS5pc0VtcHR5KVxuXHQpIHtcblx0XHRyZXR1cm4gdmFsdWUuaXNFbXB0eSgpO1xuXHR9XG5cblx0cmV0dXJuIF9pc0VtcHR5KC4uLmFyZ3VtZW50cyk7XG59O1xubG9kYXNoRW1iZXIuaXNFbXB0eSA9IGlzRW1wdHk7XG5cblxuLyoqXG4gKiBPcmlnaW5hbCBsb2Rhc2ggY2xvbmVcbiAqXG4gKiBAbWV0aG9kIF9jbG9uZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7Kn1cbiAqL1xuZXhwb3J0IHZhciBfY2xvbmUgPSBfLmNsb25lO1xubG9kYXNoRW1iZXIuX2Nsb25lID0gX2Nsb25lO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIGNsb25lZCBjb3B5IG9mIHZhbHVlXG4gKlxuICogQG1ldGhvZCBjbG9uZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7Kn1cbiAqL1xuZXhwb3J0IHZhciBjbG9uZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmIChfLmlzV2lsZGNhdE9iamVjdCh2YWx1ZSkpIHtcblx0XHRyZXR1cm4gdmFsdWUuY2xvbmUoKTtcblx0fVxuXG5cdHJldHVybiBfY2xvbmUoLi4uYXJndW1lbnRzKTtcbn07XG5sb2Rhc2hFbWJlci5jbG9uZSA9IGNsb25lO1xuXG5cbi8qKlxuICogQWxpYXMgZm9yIGBhcnJheS5wb3BgIG9yIGBhcnJheVByb3h5LnBvcE9iamVjdGBcbiAqXG4gKiBAbWV0aG9kIHBvcFxuICogQHBhcmFtIHtBcnJheXxFbWJlci5BcnJheVByb3h5fSB2YWx1ZVxuICogQHJldHVybiB7Kn1cbiAqL1xuZXhwb3J0IHZhciBwb3AgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRyZXR1cm4gKF8uaXNFbWJlckFycmF5UHJveHkodmFsdWUpKSA/IHZhbHVlLnBvcE9iamVjdCgpIDogdmFsdWUucG9wKCk7XG59O1xubG9kYXNoRW1iZXIucG9wID0gcG9wO1xuXG5cbi8qKlxuICogQWxpYXMgZm9yIGBhcnJheS5zaGlmdGAgb3IgYGFycmF5UHJveHkuc2hpZnRPYmplY3RgXG4gKlxuICogQG1ldGhvZCBzaGlmdFxuICogQHBhcmFtIHtBcnJheXxFbWJlci5BcnJheVByb3h5fSB2YWx1ZVxuICogQHJldHVybiB7Kn1cbiAqL1xuZXhwb3J0IHZhciBzaGlmdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHJldHVybiAoXy5pc0VtYmVyQXJyYXlQcm94eSh2YWx1ZSkpID8gdmFsdWUuc2hpZnRPYmplY3QoKSA6IHZhbHVlLnNoaWZ0KCk7XG59O1xubG9kYXNoRW1iZXIuc2hpZnQgPSBzaGlmdDtcblxuXG4vKipcbiAqIEVtYmVyIGB0eXBlT2ZgIGFsaWFzXG4gKlxuICogQG1ldGhvZCB0eXBlT2ZcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSB0eXBlIG9mIGB2YWx1ZWBcbiAqL1xuZXhwb3J0IHZhciB0eXBlT2YgPSAodmFsdWUpID0+IEVtYmVyLnR5cGVPZih2YWx1ZSk7XG5sb2Rhc2hFbWJlci50eXBlT2YgPSB0eXBlT2Y7XG5cblxuZXhwb3J0IHZhciBsb2Rhc2hFbWJlcjtcbmV4cG9ydCBkZWZhdWx0IGxvZGFzaEVtYmVyO1xuIiwiaW1wb3J0IGxvZGFzaFV0aWxzIGZyb20gJy4vX2NvcmUvbG9kYXNoLXV0aWxzJztcblxuXG4vKipcbiAqIENvbGxlY3Rpb24gb2YgYWxsIHRoZSB1dGlscyBpbiBoZXJlLiBBZGQgdG8gdGhpcyBhcyB5b3UgZ28uXG4gKi9cbmxldCBsb2Rhc2hFeHRyYXMgPSB7fTtcblxuXG4vKipcbiAqIEhlbHBlciB0byBjaGVjayBpZiBhIHZhcmlhYmxlIGlzIGRlZmluZWQgYW5kIHByZXNlbnRcbiAqXG4gKiBAbWV0aG9kIGlzUHJlc2VudFxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNQcmVzZW50ID0gKHZhbHVlKSA9PiAoIV8uaXNVbmRlZmluZWQodmFsdWUpICYmICFfLmlzTnVsbCh2YWx1ZSkpO1xubG9kYXNoRXh0cmFzLmlzUHJlc2VudCA9IGlzUHJlc2VudDtcblxuXG4vKipcbiAqIEhlbHBlciB0byBjaGVjayBpZiBhIHZhcmlhYmxlIGlzIGRlZmluZWQgYW5kIHByZXNlbnRcbiAqXG4gKiBAbWV0aG9kIGlzQmxhbmtcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzQmxhbmsgPSAodmFsdWUpID0+ICFfLmlzUHJlc2VudCh2YWx1ZSk7XG5sb2Rhc2hFeHRyYXMuaXNCbGFuayA9IGlzQmxhbms7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY2hlY2sgaWYgYSB2YXJpYWJsZSBpcyBhIHByb21pc2VcbiAqXG4gKiBAbWV0aG9kIGlzUHJvbWlzZVxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNQcm9taXNlID0gKHZhbHVlKSA9PiBfLmlzRnVuY3Rpb24odmFsdWUsICd0aGVuJyk7XG5sb2Rhc2hFeHRyYXMuaXNQcm9taXNlID0gaXNQcm9taXNlO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNoZWNrIGEgdmFsdWUgZm9yIGFuIGFycmF5IG9mIExvRGFzaCBib29sZWFuIGNvbmRpdGlvbnNcbiAqIFRPRE86IE5hbWUgdGhpcyBgaXNBbmRgIGFuZCBjcmVhdGUgYGlzT3JgLi4uXG4gKlxuICogQG1ldGhvZCBpc1xuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEBwYXJhbSB7QXJyYXl9IGNvbmRpdGlvbnM6IExvRGFzaCBtZXRob2RzIHRvIGhhdmUgdmFsdWUgdGVzdGVkIGFnYWluc3QgKGFzIHN0cmluZ3MpXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzID0gZnVuY3Rpb24odmFsdWUsIGNvbmRpdGlvbnMpIHtcblx0aWYgKF8uaXNTdHJpbmcoY29uZGl0aW9ucykpIGNvbmRpdGlvbnMgPSBbY29uZGl0aW9uc107XG5cdGlmIChfLmlzUHJlc2VudChjb25kaXRpb25zKSAmJiAhXy5pc0FycmF5KGNvbmRpdGlvbnMpKSBjb25kaXRpb25zID0gW107XG5cdGlmIChjb25kaXRpb25zLmxlbmd0aCA8PSAxKSBjb25zb2xlLmVycm9yKFwiRG9uJ3QgY2FsbCBgaXNgIGhlbHBlciB3aXRoIGp1c3Qgb25lIGNvbmRpdGlvbi0gdXNlIHRoYXQgY29uZGl0aW9uIGRpcmVjdGx5XCIpO1xuXHRyZXR1cm4gXy5ldmVyeShjb25kaXRpb25zLCBmdW5jdGlvbihjb25kaXRpb24pIHtcblx0XHRsZXQgcmVzdWx0LCBub3Q7XG5cblx0XHQvLyBDaGVjayBmb3IgdmFsaWQgY29uZGl0aW9uXG5cdFx0aWYgKCFfLmlzU3RyaW5nKGNvbmRpdGlvbikpIHtcblx0XHRcdGNvbnNvbGUud2FybihcImBjb25kaXRpb25gIHdhcyBub3QgYSBzdHJpbmc6IFwiICsgY29uZGl0aW9uKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBIYW5kbGUgbm90IGNvbmRpdGlvblxuXHRcdG5vdCA9IGZhbHNlO1xuXHRcdGlmIChfLnN0YXJ0c1dpdGgoY29uZGl0aW9uLCAnIScpKSB7XG5cdFx0XHRub3QgPSB0cnVlO1xuXHRcdFx0Y29uZGl0aW9uID0gY29uZGl0aW9uLnJlcGxhY2UoJyEnLCAnJyk7XG5cdFx0fVxuXG5cdFx0Ly8gQmUgRVhUUkEgKHRvbykgaGVscGZ1bCAocHJlcGVuZCAnaXMnIGlmIG9tbWl0dGVkKVxuXHRcdGlmICghXy5zdGFydHNXaXRoKGNvbmRpdGlvbiwgJ2lzJykpIHtcblx0XHRcdGNvbmRpdGlvbiA9ICdpcycgKyBjb25kaXRpb247XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBzdXJlIGBjb25kaXRpb25gIGlzIGEgdmFsaWQgbG9kYXNoIG1ldGhvZFxuXHRcdGlmICghXy5pc0Z1bmN0aW9uKF9bY29uZGl0aW9uXSkpIHtcblx0XHRcdGNvbnNvbGUud2FybihcImBjb25kaXRpb25gIHdhcyBub3QgYSB2YWxpZCBsb2Rhc2ggbWV0aG9kOiBcIiArIGNvbmRpdGlvbik7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZXJtaW5lIHJlc3VsdCBhbmQgcmV0dXJuXG5cdFx0cmVzdWx0ID0gX1tjb25kaXRpb25dKHZhbHVlKTtcblx0XHRpZiAobm90ID09PSB0cnVlKSByZXR1cm4gIXJlc3VsdDtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0pO1xufTtcbmxvZGFzaEV4dHJhcy5pcyA9IGlzO1xuXG5cbi8qKlxuICogR2VuZXJhdGUgYGVuc3VyZWAgbWV0aG9kcy0gRW5zdXJlIHRoYXQgdmFsdWUgaXMgb2YgdHlwZSB4XG4gKlxuICogQG1ldGhvZCBlbnN1cmV7VHlwZX1cbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFRvIGNoZWNrXG4gKiBAcGFyYW0geyp9IFt2YWx1ZURlZmF1bHQ9ZGVmYXVsdHNbY29uZGl0aW9uXTogV2hhdCB0byBkZWZhdWx0IHRvXG4gKiBAcmV0dXJuIHsqfSBFbnN1cmVkIHZhbHVlXG4gKi9cbl8uZm9yRWFjaChfLmtleXMobG9kYXNoVXRpbHMudHlwZURlZmF1bHRzKCkpLCAodHlwZSkgPT4ge1xuXHRsb2Rhc2hFeHRyYXNbYGVuc3VyZSR7dHlwZX1gXSA9IGxvZGFzaFV0aWxzLm1ha2VFbnN1cmVUeXBlKHR5cGUpO1xufSk7XG5cblxuLyoqXG4gKiBKYXZhc2NyaXB0IGB0eXBlb2ZgIGFsaWFzXG4gKlxuICogQG1ldGhvZCB0eXBlT2ZcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSB0eXBlIG9mIGB2YWx1ZWBcbiAqL1xuZXhwb3J0IHZhciB0eXBlT2YgPSAodmFsdWUpID0+IHR5cGVvZih2YWx1ZSk7XG5sb2Rhc2hFeHRyYXMudHlwZU9mID0gdHlwZU9mO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGxvZGFzaEV4dHJhcztcbiJdfQ==
