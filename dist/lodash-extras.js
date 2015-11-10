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

// Must be last to override above methods programmatically

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcmpoaWxnZWZvcnQvRHJvcGJveC9Qcm9qZWN0cy9sb2Rhc2gtZXh0cmFzL3NyYy9fY29yZS9sb2Rhc2gtdXRpbHMuanMiLCIvVXNlcnMvcmpoaWxnZWZvcnQvRHJvcGJveC9Qcm9qZWN0cy9sb2Rhc2gtZXh0cmFzL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1kZWVwLWV4dHJhcy5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1lbWJlci5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1leHRyYXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0dBLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7QUFTZCxJQUFJLFlBQVksR0FBRyxTQUFmLFlBQVksR0FBUztBQUMvQixTQUFPO0FBQ04sWUFBUSxFQUFFLEVBQUU7QUFDWixXQUFPLEVBQUUsRUFBRTtBQUNYLGlCQUFhLEVBQUUsRUFBRTtBQUNqQixhQUFTLEVBQUUsS0FBSztBQUNoQixZQUFRLEVBQUUsQ0FBQztHQUNYLENBQUM7Q0FDRixDQUFDOztBQUNGLFdBQVcsQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDOzs7Ozs7Ozs7QUFVakMsSUFBSSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUksS0FBSyxFQUFLO0FBQ2xDLFNBQU8sVUFBUyxLQUFLLEVBQUU7QUFDdEIsV0FBUSxLQUFLLFlBQVksS0FBSyxDQUFFO0dBQ2hDLENBQUM7Q0FDRixDQUFDOztBQUNGLFdBQVcsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFD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ZCxZQUFZIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ29sbGVjdGlvbiBvZiBhbGwgdGhlIHV0aWxzIGluIGhlcmUuIEFkZCB0byB0aGlzIGFzIHlvdSBnby5cbiAqL1xubGV0IGxvZGFzaFV0aWxzID0ge307XG5cblxuLyoqXG4gKiBIZWxwZXIgZm9yIEpTIHR5cGVzIGFuZCBkZWZhdWx0cyBmb3IgZWFjaCB0eXBlXG4gKlxuICogQG1ldGhvZCB0eXBlRGVmYXVsdHNcbiAqIEByZXR1cm4ge1BsYWluT2JqZWN0fVxuICovXG5leHBvcnQgdmFyIHR5cGVEZWZhdWx0cyA9ICgpID0+IHtcblx0cmV0dXJuIHtcblx0XHQnU3RyaW5nJzogJycsXG5cdFx0J0FycmF5JzogW10sXG5cdFx0J1BsYWluT2JqZWN0Jzoge30sXG5cdFx0J0Jvb2xlYW4nOiBmYWxzZSxcblx0XHQnTnVtYmVyJzogMVxuXHR9O1xufTtcbmxvZGFzaFV0aWxzLnR5cGVEZWZhdWx0cyA9IHR5cGVEZWZhdWx0cztcblxuXG4vKipcbiAqIEhlbHBlciB0byBtYWtlIGBfLmlzRW1iZXJ7Q2xhc3N9YFxuICpcbiAqIEBtZXRob2QgbWFrZUlzVHlwZVxuICogQHBhcmFtIHsqfSBrbGFzczogQSBjbGFzcyB0byBjaGVjayBpbnN0YW5jZW9mIGFnYWluc3RcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnQgdmFyIG1ha2VJc1R5cGUgPSAoa2xhc3MpID0+IHtcblx0cmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0cmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIGtsYXNzKTtcblx0fTtcbn07XG5sb2Rhc2hVdGlscy5tYWtlSXNUeXBlID0gbWFrZUlzVHlwZTtcblxuXG4vKipcbiAqIEhlbHBlciB0byBtYWtlIGBfLmVuc3VyZVR5cGVgXG4gKlxuICogQG1ldGhvZCBtYWtlRW5zdXJlVHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IGNvbmRpdGlvbjogTG9kYXNoIG1ldGhvZCB0byBhcHBseVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydCB2YXIgbWFrZUVuc3VyZVR5cGUgPSAoY29uZGl0aW9uKSA9PiB7XG5cdGxldCBkZWZhdWx0cyA9IGxvZGFzaFV0aWxzLnR5cGVEZWZhdWx0cygpO1xuXG5cdC8vIENoZWNrIHBhcmFtczogY29uZGl0aW9uXG5cdGlmICghXy5pc1N0cmluZyhjb25kaXRpb24pKSBjb25kaXRpb24gPSAnJztcblx0Y29uZGl0aW9uID0gXy5jYXBpdGFsaXplKGNvbmRpdGlvbik7XG5cdGlmICghXy5jb250YWlucyhfLmtleXMoZGVmYXVsdHMpLCBjb25kaXRpb24pKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBcXGBjb25kaXRpb25cXGAgbm90IHN1cHBvcnRlZDogJHtjb25kaXRpb259YCk7XG5cdH1cblxuXHQvLyBTaG9ydGN1dFxuXHRsZXQgaXNDb25kaXRpb24gPSBfW2BpcyR7Y29uZGl0aW9ufWBdO1xuXG5cdC8qKlxuXHQgKiBJbnRlcmZhY2UgZm9yIGBlbnN1cmVUeXBlYCBtZXRob2RzXG5cdCAqXG5cdCAqIEBtZXRob2QgYGVuc3VyZSR7dHlwZX1gXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWU6IFRvIGNoZWNrXG5cdCAqIEBwYXJhbSB7Kn0gW3ZhbHVlRGVmYXVsdD1kZWZhdWx0c1tjb25kaXRpb25dOiBXaGF0IHRvIGRlZmF1bHQgdG9cblx0ICogQHJldHVybiB7Kn0gRGVmYXVsdGVkIHZhbHVlLCBvciB0aGUgdmFsdWUgaXRzZWxmIGlmIHBhc3NcbiAgICovXG5cdHJldHVybiAodmFsdWUsIHZhbHVlRGVmYXVsdCkgPT4ge1xuXHRcdC8vIERldGVybWluZSBgdmFsdWVEZWZhdWx0YDogaWYgbm90aGluZyBwcm92aWRlZCwgb3IgcHJvdmlkZWQgZG9lc24ndCBtYXRjaCB0eXBlXG5cdFx0aWYgKF8uaXNVbmRlZmluZWQodmFsdWVEZWZhdWx0KSB8fCAhaXNDb25kaXRpb24odmFsdWVEZWZhdWx0KSkge1xuXHRcdFx0dmFsdWVEZWZhdWx0ID0gXy5jbG9uZShkZWZhdWx0c1tjb25kaXRpb25dKTtcblx0XHR9XG5cblx0XHQvLyBBY3R1YWwgXCJlbnN1cmVcIiBjaGVja1xuXHRcdGlmICghX1tgaXMke2NvbmRpdGlvbn1gXSh2YWx1ZSkpIHZhbHVlID0gdmFsdWVEZWZhdWx0O1xuXG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9O1xufTtcbmxvZGFzaFV0aWxzLm1ha2VFbnN1cmVUeXBlID0gbWFrZUVuc3VyZVR5cGU7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gbWFrZSBgXy5kZWVwRW5zdXJle1R5cGV9YFxuICpcbiAqIEBtZXRob2QgbWFrZURlZXBFbnN1cmVUeXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25kaXRpb246IExvZGFzaCBtZXRob2QgdG8gYXBwbHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWVEZWZhdWx0OiBXaGF0IHRvIGFzc2lnbiB3aGVuIG5vdCBvZiB0aGUgZGVzaXJlZCB0eXBlXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0IHZhciBtYWtlRGVlcEVuc3VyZVR5cGUgPSAoY29uZGl0aW9uKSA9PiB7XG5cdHJldHVybiAoY29sbGVjdGlvbiwgcHJvcFN0cmluZywgdmFsdWVEZWZhdWx0KSA9PiB7XG5cdFx0cmV0dXJuIF8uc2V0KFxuXHRcdFx0Y29sbGVjdGlvbixcblx0XHRcdHByb3BTdHJpbmcsXG5cdFx0XHRsb2Rhc2hVdGlscy5tYWtlRW5zdXJlVHlwZShjb25kaXRpb24pKFxuXHRcdFx0XHRfLmdldChjb2xsZWN0aW9uLCBwcm9wU3RyaW5nKSxcblx0XHRcdFx0dmFsdWVEZWZhdWx0XG5cdFx0XHQpXG5cdFx0KTtcblx0fTtcbn07XG5sb2Rhc2hVdGlscy5tYWtlRGVlcEVuc3VyZVR5cGUgPSBtYWtlRGVlcEVuc3VyZVR5cGU7XG5cblxuLyoqXG4gKiBEZXRlcm1pbmVkIGlmIGxvZGFzaCBrZXkvbWV0aG9kIGlzIHZhbGlkIHRvIG1ha2UgZGVlcCAoYGlzYCBtZXRob2RzIHRoYXQgb25seSBoYXZlIG9uZSBhcmd1bWVudClcbiAqIE5PVEU6IEFzc3VtZXMgYHRoaXNgID09PSBpcyB0aGUgbmFtZXNwYWNlIHRvIGNoZWNrIGZvciB0aGUgZnVuY3Rpb24gb25cbiAqXG4gKiBAbWV0aG9kIHZhbGlkSXNNZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXk6IG1ldGhvZCBuYW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIHZhbGlkSXNNZXRob2QgPSBmdW5jdGlvbihrZXkpIHtcbiAgcmV0dXJuIChcbiAgICBfLnN0YXJ0c1dpdGgoa2V5LCAnaXMnKSAmJlxuICAgICh0aGlzW2tleV0ubGVuZ3RoID09PSAxKVxuICApO1xufTtcbmxvZGFzaFV0aWxzLnZhbGlkSXNNZXRob2QgPSB2YWxpZElzTWV0aG9kO1xuXG5cbi8qKlxuICogRmlsdGVyIG91dCBhbGwgdmFsaWQgYGlzYCBtZXRob2RzIGZyb20gYSBuYW1lc3BhY2VcbiAqXG4gKiBAbWV0aG9kIGZpbHRlcklzTWV0aG9kc1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZTogQ29sbGVjdGlvbiBvZiBtZXRob2RzXG4gKiBAcmV0dXJuIHtPYmplY3R9IGBuYW1lc3BhY2VgIHdpdGgganVzdCB0aGUgXCJpc1wiIG1ldGhvZHNcbiAqL1xuZXhwb3J0IHZhciBmaWx0ZXJJc01ldGhvZHMgPSAobmFtZXNwYWNlKSA9PiB7XG4gIHJldHVybiBfLmNoYWluKG5hbWVzcGFjZSlcbiAgICAua2V5cygpXG4gICAgLmZpbHRlcih2YWxpZElzTWV0aG9kLCBuYW1lc3BhY2UpXG4gICAgLnZhbHVlKCk7XG59O1xubG9kYXNoVXRpbHMuZmlsdGVySXNNZXRob2RzID0gZmlsdGVySXNNZXRob2RzO1xuXG5cbi8qKlxuICogT3ZlcmxvYWQgbm9ybWFsIGxvZGFzaCBtZXRob2RzIHRvIGhhbmRsZSBkZWVwIHN5bnRheFxuICogVE9ETzogTm8gbmVlZCB0byB0YWtlIHRoZSBmaXJzdCBwYXJhbVxuICpcbiAqIEBtZXRob2Qgb3ZlcmxvYWRNZXRob2RzXG4gKiBAcGFyYW0ge09iamVjdH0gaXNNZXRob2RzOiBDb2xsZWN0aW9uIG9mIGlzIG1ldGhvZHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2U6IE9yaWdpbmFsIG5hbWVzcGFjZSBpc01ldGhvZHMgY2FtZSBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0OiBuYW1lc3BhY2UgdG8gb3ZlcmxvYWQgbWV0aG9kcyBvblxuICogQHJldHVybiB7VW5kZWZpbmVkfVxuICovXG5leHBvcnQgdmFyIG92ZXJsb2FkTWV0aG9kcyA9IChpc01ldGhvZHMsIG5hbWVzcGFjZSwgdGFyZ2V0KSA9PiB7XG4gIGxldCBvbGRNZXRob2QgPSB7fTtcblxuICBfLmZvckVhY2goaXNNZXRob2RzLCAobWV0aG9kKSA9PiB7XG4gICAgLy8gU2F2ZSBvbGQgbWV0aG9kXG4gICAgb2xkTWV0aG9kW21ldGhvZF0gPSBuYW1lc3BhY2VbbWV0aG9kXTtcblxuICAgIC8vIE1ha2UgbmV3IG1ldGhvZCB0aGF0IGFsc28gaGFuZGxlcyBgZ2V0YC4gQXBwbHkgbWV0aG9kIHRvIGV4cG9ydHMuXG4gICAgdGFyZ2V0W21ldGhvZF0gPSBmdW5jdGlvbih2YWx1ZSwgcHJvcFN0cmluZykge1xuICAgICAgaWYgKF8uc2l6ZShhcmd1bWVudHMpID09PSAyKSB7XG4gICAgICAgIHJldHVybiBuYW1lc3BhY2VbbWV0aG9kXShfLmdldCguLi5hcmd1bWVudHMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvbGRNZXRob2RbbWV0aG9kXSguLi5hcmd1bWVudHMpO1xuICAgIH07XG4gIH0pO1xufTtcbmxvZGFzaFV0aWxzLm92ZXJsb2FkTWV0aG9kcyA9IG92ZXJsb2FkTWV0aG9kcztcblxuXG4vKipcbiAqIEJ1aWxkIGBpc01ldGhvZHNgXG4gKlxuICogQG1ldGhvZCBidWlsZElzTWV0aG9kc1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZTogTmFtZXNwYWNlIHRvIHB1bGwgYGlzYCBtZXRob2RzIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQ6IG5hbWVzcGFjZSB0byBvdmVybG9hZCBtZXRob2RzIG9uXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9XG4gKi9cbmV4cG9ydCB2YXIgYnVpbGRJc01ldGhvZHMgPSAobmFtZXNwYWNlLCB0YXJnZXQpID0+IHtcbiAgb3ZlcmxvYWRNZXRob2RzKGZpbHRlcklzTWV0aG9kcyhuYW1lc3BhY2UpLCBuYW1lc3BhY2UsIHRhcmdldCk7XG59XG5sb2Rhc2hVdGlscy5idWlsZElzTWV0aG9kcyA9IGJ1aWxkSXNNZXRob2RzO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGxvZGFzaFV0aWxzO1xuIiwiaW1wb3J0IGxvZGFzaEV4dHJhcyBmcm9tICcuL2xvZGFzaC1leHRyYXMnO1xuXy5taXhpbihsb2Rhc2hFeHRyYXMpO1xuXG5pbXBvcnQgbG9kYXNoRW1iZXIgZnJvbSAnLi9sb2Rhc2gtZW1iZXInO1xuXy5taXhpbihsb2Rhc2hFbWJlcik7XG5cbi8vIE11c3QgYmUgbGFzdCB0byBvdmVycmlkZSBhYm92ZSBtZXRob2RzIHByb2dyYW1tYXRpY2FsbHlcbmltcG9ydCBsb2Rhc2hEZWVwRXh0cmFzIGZyb20gJy4vbG9kYXNoLWRlZXAtZXh0cmFzJztcbl8ubWl4aW4obG9kYXNoRGVlcEV4dHJhcyk7XG4iLCJpbXBvcnQgbG9kYXNoVXRpbHMgZnJvbSAnLi9fY29yZS9sb2Rhc2gtdXRpbHMnO1xuaW1wb3J0IGxvZGFzaEV4dHJhcyBmcm9tICcuL2xvZGFzaC1leHRyYXMnO1xuaW1wb3J0IGxvZGFzaEVtYmVyIGZyb20gJy4vbG9kYXNoLWVtYmVyJztcblxuXG4vLyBBbGwgbG9kYXNoIGV4dHJhRGVlcCBtZXRob2RzIHRvIGV4cG9ydFxubGV0IGxvZGFzaERlZXBFeHRyYXMgPSB7fTtcblxuXG4vKipcbiAqIEdlbmVyYXRlIGBkZWVwSXNgIG1ldGhvZHMgYW5kIG92ZXJyaWRlIHN0YW5kYXJkIG1ldGhvZHMgdG8gaGFuZGxlIGJvdGhcbiAqXG4gKiBAbWV0aG9kIGlze0NvbmRpdGlvbn1cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZTogQmFzZSB2YWx1ZSB0byBsb29rIHRocm91Z2hcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wU3RyaW5nOiBQcm9wZXJ0eSBzdHJpbmcgdG8gYXBwbHkgdG8gYGdldGBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmxvZGFzaFV0aWxzLmJ1aWxkSXNNZXRob2RzKF8sIGxvZGFzaERlZXBFeHRyYXMpO1xubG9kYXNoVXRpbHMuYnVpbGRJc01ldGhvZHMobG9kYXNoRXh0cmFzLCBsb2Rhc2hEZWVwRXh0cmFzKTtcbmxvZGFzaFV0aWxzLmJ1aWxkSXNNZXRob2RzKGxvZGFzaEVtYmVyLCBsb2Rhc2hEZWVwRXh0cmFzKTtcblxuLyoqXG4gKiBHZW5lcmF0ZSBgZW5zdXJlYCBtZXRob2RzLSBFbnN1cmUgdGhhdCB2YWx1ZSBpcyBvZiB0eXBlIHgsIGRlZXBseVxuICpcbiAqIEBtZXRob2QgZGVlcEVuc3VyZXtUeXBlfVxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGNvbGxlY3Rpb246IFRoZSByb290IGNvbGxlY3Rpb24gb2YgdGhlIHRyZWUuXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcFN0cmluZzogTmVzdGVkIHByb3BlcnR5IHBhdGggb2YgdmFsdWUgdG8gY2hlY2tcbiAqIEBwYXJhbSB7Kn0gW3ZhbHVlRGVmYXVsdD1kZWZhdWx0c1tjb25kaXRpb25dOiBXaGF0IHRvIGRlZmF1bHQgdG9cbiAqIEByZXR1cm4geyp9IENvbGxlY3Rpb24sIHdpdGggZW5zdXJlZCBwcm9wZXJ0eVxuICovXG5fLmZvckVhY2goXy5rZXlzKGxvZGFzaFV0aWxzLnR5cGVEZWZhdWx0cygpKSwgKHR5cGUpID0+IHtcblx0bG9kYXNoRXh0cmFzW2BkZWVwRW5zdXJlJHt0eXBlfWBdID0gbG9kYXNoVXRpbHMubWFrZURlZXBFbnN1cmVUeXBlKHR5cGUpO1xufSk7XG5cblxuLyoqXG4gKiBEZWxldGUgZGVlcGx5IG5lc3RlZCBwcm9wZXJ0aWVzIHdpdGhvdXQgY2hlY2tpbmcgZXhpc3RlbmNlIGRvd24gdGhlIHRyZWUgZmlyc3RcbiAqIFRPRE86IFRFU1QgVEVTVCBURVNULiBUaGlzIGlzIGV4cGVyaW1lbnRhbCAoV0lQKVxuICpcbiAqIEBtZXRob2QgZGVlcERlbGV0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wU3RyaW5nOiBQcm9wZXJ0eSBzdHJpbmcgdG8gYXBwbHkgdG8gYGdldGBcbiAqIEByZXR1cm4ge3VuZGVmaW5lZH0gRG9lc24ndCByZXR1cm4gc3VjY2Vzcy9mYWlsdXJlLCB0byBtYXRjaCBgZGVsZXRlYCdzIHJldHVyblxuICovXG5leHBvcnQgdmFyIGRlZXBEZWxldGUgPSBmdW5jdGlvbih2YWx1ZSwgcHJvcFN0cmluZykge1xuXHRsZXQgY3VycmVudFZhbHVlLCBpO1xuXG5cdC8vIERlbGV0ZSBpZiBwcmVzZW50XG5cdGlmIChfLmlzUHJlc2VudCh2YWx1ZSwgcHJvcFN0cmluZykpIHtcblx0XHRjdXJyZW50VmFsdWUgPSB2YWx1ZTtcblx0XHRwcm9wU3RyaW5nID0gXyhwcm9wU3RyaW5nKS50b1N0cmluZygpLnNwbGl0KCcuJyk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgKHByb3BTdHJpbmcubGVuZ3RoIC0gMSk7IGkrKykge1xuXHRcdFx0Y3VycmVudFZhbHVlID0gY3VycmVudFZhbHVlW3Byb3BTdHJpbmdbaV1dO1xuXHRcdH1cblxuXHRcdGRlbGV0ZSBjdXJyZW50VmFsdWVbcHJvcFN0cmluZ1tpXV07XG5cdH1cbn07XG5sb2Rhc2hEZWVwRXh0cmFzLmRlZXBEZWxldGUgPSBkZWVwRGVsZXRlO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGxvZGFzaERlZXBFeHRyYXM7XG4iLCIvKipcbiAqIFRoaXMgdXRpbGl0eSBhc3N1bWVzIGBFbWJlcmAgZXhpc3RzIGdsb2JhbGx5XG4gKi9cbmltcG9ydCBsb2Rhc2hVdGlscyBmcm9tICcuL19jb3JlL2xvZGFzaC11dGlscyc7XG5cblxuLyoqXG4gKiBDb2xsZWN0aW9uIG9mIGFsbCB0aGUgdXRpbHMgaW4gaGVyZS4gQWRkIHRvIHRoaXMgYXMgeW91IGdvLlxuICovXG5leHBvcnQgdmFyIGxvZGFzaEVtYmVyID0ge307XG5cblxuLyoqXG4gKiBDaGVjayB0aGF0IGEgdmFsdWUgaXMgYW4gaW5zdGFuY2UsIGFzIGRlc2lnbmF0ZWQgYnkgRW1iZXJcbiAqXG4gKiBAbWV0aG9kIGlzSW5zdGFuY2VcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzRW1iZXJJbnN0YW5jZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHJldHVybiAoRW1iZXIudHlwZU9mKHZhbHVlKSA9PT0gJ2luc3RhbmNlJyk7XG59O1xubG9kYXNoRW1iZXIuaXNFbWJlckluc3RhbmNlID0gaXNFbWJlckluc3RhbmNlO1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhIHZhbHVlIGlzLCBhdCBsZWFzdCwgYSBzdWJjbGFzcyBvZiBFbWJlci5PYmplY3RcbiAqXG4gKiBAbWV0aG9kIGlzRW1iZXJPYmplY3RcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzRW1iZXJPYmplY3QgPSBsb2Rhc2hVdGlscy5tYWtlSXNUeXBlKEVtYmVyLk9iamVjdCk7XG5sb2Rhc2hFbWJlci5pc0VtYmVyT2JqZWN0ID0gaXNFbWJlck9iamVjdDtcblxuXG4vKipcbiAqIE5PVEU6IGlzRW1iZXJBcnJheSBoYXMgYmVlbiBleGNsdWRlZCBhcyBFbWJlci5BcnJheSBpcyBub3QgYW4gRW1iZXIuT2JqZWN0XG4gKi9cblxuXG4vKipcbiAqIENoZWNrIHRoYXQgYSB2YWx1ZSBpcywgYXQgbGVhc3QsIGEgc3ViY2xhc3Mgb2YgRW1iZXIuT2JqZWN0UHJveHlcbiAqXG4gKiBAbWV0aG9kIGlzRW1iZXJPYmplY3RQcm94eVxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNFbWJlck9iamVjdFByb3h5ID0gbG9kYXNoVXRpbHMubWFrZUlzVHlwZShFbWJlci5PYmplY3RQcm94eSk7XG5sb2Rhc2hFbWJlci5pc0VtYmVyT2JqZWN0UHJveHkgPSBpc0VtYmVyT2JqZWN0UHJveHk7XG5cblxuLyoqXG4gKiBDaGVjayB0aGF0IGEgdmFsdWUgaXMsIGF0IGxlYXN0LCBhIHN1YmNsYXNzIG9mIEVtYmVyLkFycmF5UHJveHlcbiAqXG4gKiBAbWV0aG9kIGlzRW1iZXJBcnJheVByb3h5XG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc0VtYmVyQXJyYXlQcm94eSA9IGxvZGFzaFV0aWxzLm1ha2VJc1R5cGUoRW1iZXIuQXJyYXlQcm94eSk7XG5sb2Rhc2hFbWJlci5pc0VtYmVyQXJyYXlQcm94eSA9IGlzRW1iZXJBcnJheVByb3h5O1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCB0aGUgdmFsdWUgaXMgYSBkZXNjZW5kZW50IG9mIGFuIEVtYmVyIENsYXNzXG4gKiBUT0RPOiBDaGVjayB0aGF0IGBfLmlzRW1iZXJJbnN0YW5jZWAgZG9lc24ndCBhbHJlYWR5IHlpZWxkIHRoZSBzYW1lIHJlc3VsdFxuICpcbiAqIEBtZXRob2QgaXNFbWJlckNvbGxlY3Rpb25cbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzRW1iZXJDb2xsZWN0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcblx0cmV0dXJuIChcblx0XHRfLmlzRW1iZXJPYmplY3QodmFsdWUpIHx8XG5cdFx0Xy5pc0VtYmVyT2JqZWN0UHJveHkodmFsdWUpIHx8XG5cdFx0Xy5pc0VtYmVyQXJyYXlQcm94eSh2YWx1ZSlcblx0KTtcbn07XG5sb2Rhc2hFbWJlci5pc0VtYmVyQ29sbGVjdGlvbiA9IGlzRW1iZXJDb2xsZWN0aW9uO1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCB2YWx1ZSBpcyBFbWJlciBUcmFuc2l0aW9uXG4gKlxuICogQG1ldGhvZCBpc0VtYmVyVHJhbnNpdGlvblxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNFbWJlclRyYW5zaXRpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRyZXR1cm4gKFxuXHRcdF8uaXNGdW5jdGlvbih2YWx1ZSwgJ3RvU3RyaW5nJykgJiZcblx0XHRfLmNvbnRhaW5zKHZhbHVlLnRvU3RyaW5nKCksICdUcmFuc2l0aW9uJylcblx0KTtcbn07XG5sb2Rhc2hFbWJlci5pc0VtYmVyVHJhbnNpdGlvbiA9IGlzRW1iZXJUcmFuc2l0aW9uO1xuXG5cbi8qKlxuICogTG9kYXNoIGZvckVhY2hcbiAqXG4gKiBAbWV0aG9kIF9mb3JFYWNoXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8U3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xuZXhwb3J0IHZhciBfZm9yRWFjaCA9IF8uZm9yRWFjaDtcbmxvZGFzaEVtYmVyLl9mb3JFYWNoID0gX2ZvckVhY2g7XG5cblxuLyoqXG4gKiBPdmVycmlkZSBsb2Rhc2ggYGZvckVhY2hgIHRvIHN1cHBvcnQgZW1iZXIgYXJyYXlzL29iamVjdHNcbiAqXG4gKiBAbWV0aG9kIGZvckVhY2hcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG5leHBvcnQgdmFyIGZvckVhY2ggPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuXHRpZiAoXy5pc0VtYmVyQXJyYXlQcm94eShjb2xsZWN0aW9uKSkge1xuXHRcdHJldHVybiBjb2xsZWN0aW9uLmZvckVhY2goY2FsbGJhY2ssIHRoaXMpO1xuXHR9XG5cdGlmIChfLmlzRW1iZXJPYmplY3RQcm94eShjb2xsZWN0aW9uKSAmJiBfLmlzT2JqZWN0KGNvbGxlY3Rpb24uZ2V0KCdjb250ZW50JykpKSB7XG5cdFx0cmV0dXJuIF9mb3JFYWNoKGNvbGxlY3Rpb24uZ2V0KCdjb250ZW50JyksIGNhbGxiYWNrLCB0aGlzQXJnKTtcblx0fVxuXHRyZXR1cm4gX2ZvckVhY2goY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpO1xufTtcbmxvZGFzaEVtYmVyLmZvckVhY2ggPSBmb3JFYWNoO1xuXG5cbi8qKlxuICogTG9kYXNoIHJlZHVjZVxuICpcbiAqIEBtZXRob2QgX3JlZHVjZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsqfSBbY3VycmVudFZhbHVlXSB2YWx1ZSBhdCBiZWdpbm5pbmcgb2YgaXRlcmF0aW9uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8U3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xuZXhwb3J0IHZhciBfcmVkdWNlID0gXy5yZWR1Y2U7XG5sb2Rhc2hFbWJlci5fcmVkdWNlID0gX3JlZHVjZTtcblxuXG4vKipcbiAqIE92ZXJyaWRlIGxvZGFzaCBgcmVkdWNlYCB0byBzdXBwb3J0IGVtYmVyIGFycmF5cy9vYmplY3RzXG4gKlxuICogQG1ldGhvZCByZWR1Y2VcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW2N1cnJlbnRWYWx1ZV0gdmFsdWUgYXQgYmVnaW5uaW5nIG9mIGl0ZXJhdGlvblxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fFN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbmV4cG9ydCB2YXIgcmVkdWNlID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgY2FsbGJhY2ssIGN1cnJlbnRWYWx1ZSwgdGhpc0FyZykge1xuXHRpZiAoXy5pc0VtYmVyQXJyYXlQcm94eShjb2xsZWN0aW9uKSkge1xuXHRcdHJldHVybiBjb2xsZWN0aW9uLnJlZHVjZShjYWxsYmFjaywgY3VycmVudFZhbHVlLCB0aGlzKTtcblx0fVxuXHRpZiAoXy5pc0VtYmVyT2JqZWN0UHJveHkoY29sbGVjdGlvbikgJiYgXy5pc09iamVjdChjb2xsZWN0aW9uLmdldCgnY29udGVudCcpKSkge1xuXHRcdHJldHVybiBfcmVkdWNlKGNvbGxlY3Rpb24uZ2V0KCdjb250ZW50JyksIGNhbGxiYWNrLCBjdXJyZW50VmFsdWUsIHRoaXNBcmcpO1xuXHR9XG5cdHJldHVybiBfcmVkdWNlKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCBjdXJyZW50VmFsdWUsIHRoaXNBcmcpO1xufTtcbmxvZGFzaEVtYmVyLnJlZHVjZSA9IHJlZHVjZTtcblxuXG4vKipcbiAqIExvZGFzaCBtYXBcbiAqXG4gKiBAbWV0aG9kIF9tYXBcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG5leHBvcnQgdmFyIF9tYXAgPSBfLm1hcDtcbmxvZGFzaEVtYmVyLl9tYXAgPSBfbWFwO1xuXG5cbi8qKlxuICogT3ZlcnJpZGUgbG9kYXNoIGBtYXBgIHRvIHN1cHBvcnQgZW1iZXIgYXJyYXlzL29iamVjdHNcbiAqXG4gKiBAbWV0aG9kIG1hcFxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fFN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbmV4cG9ydCB2YXIgbWFwID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcblx0aWYgKF8uaXNFbWJlckFycmF5UHJveHkoY29sbGVjdGlvbikpIHtcblx0XHRyZXR1cm4gY29sbGVjdGlvbi5tYXAoY2FsbGJhY2ssIHRoaXMpO1xuXHR9XG5cdHJldHVybiBfbWFwKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKTtcbn07XG5sb2Rhc2hFbWJlci5tYXAgPSBtYXA7XG5cblxuLyoqXG4gKiBMb2Rhc2ggYGdldGAgYWxpYXMgdG8gcHJpdmF0ZSBuYW1lc3BhY2VcbiAqXG4gKiBAbWV0aG9kIF9nZXRcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb2xsZWN0aW9uOiBUaGUgcm9vdCBjb2xsZWN0aW9uIG9mIHRoZSB0cmVlLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHByb3BlcnR5UGF0aDogVGhlIHByb3BlcnR5IHBhdGggaW4gdGhlIGNvbGxlY3Rpb24uXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHZhbHVlLCBvciB1bmRlZmluZWQgaWYgaXQgZG9lc24ndCBleGlzdHMuXG4gKi9cbmV4cG9ydCB2YXIgX2dldCA9IF8uZ2V0O1xubG9kYXNoRW1iZXIuX2dldCA9IF9nZXQ7XG5cblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIHZhbHVlIG9mIGEgcHJvcGVydHkgaW4gYW4gb2JqZWN0IHRyZWUuXG4gKlxuICogQG1ldGhvZCBnZXRcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb2xsZWN0aW9uOiBUaGUgcm9vdCBjb2xsZWN0aW9uIG9mIHRoZSB0cmVlLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHByb3BlcnR5UGF0aDogVGhlIHByb3BlcnR5IHBhdGggaW4gdGhlIGNvbGxlY3Rpb24uXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHZhbHVlLCBvciB1bmRlZmluZWQgaWYgaXQgZG9lc24ndCBleGlzdHMuXG4gKi9cbmV4cG9ydCB2YXIgZ2V0ID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgcHJvcGVydHlQYXRoKSB7XG5cdC8vIEhhbmRsZSBFbWJlciBPYmplY3RzXG5cdGlmIChpc0VtYmVyT2JqZWN0KGNvbGxlY3Rpb24pIHx8IGlzRW1iZXJPYmplY3RQcm94eShjb2xsZWN0aW9uKSkge1xuXHRcdHJldHVybiBjb2xsZWN0aW9uLmdldChwcm9wZXJ0eVBhdGgpO1xuXHR9XG5cbiAgcmV0dXJuIF9nZXQoLi4uYXJndW1lbnRzKTtcbn07XG5sb2Rhc2hFbWJlci5nZXQgPSBnZXQ7XG5cblxuLyoqXG4gKiBMb2Rhc2ggYHNldGAgYWxpYXMgdG8gcHJpdmF0ZSBuYW1lc3BhY2VcbiAqXG4gKiBAbWV0aG9kIF9zZXRcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb2xsZWN0aW9uOiBUaGUgcm9vdCBjb2xsZWN0aW9uIG9mIHRoZSB0cmVlLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHByb3BlcnR5UGF0aDogVGhlIHByb3BlcnR5IHBhdGggaW4gdGhlIGNvbGxlY3Rpb24uXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBUaGUgcHJvcGVydHkgcGF0aCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqIEByZXR1cm5zIHsqfSBUaGUgYGNvbGxlY3Rpb25gIHBhc3NlZCBpbiB3aXRoIHZhbHVlIHNldC5cbiAqL1xuZXhwb3J0IHZhciBfc2V0ID0gXy5zZXQ7XG5sb2Rhc2hFbWJlci5fc2V0ID0gX3NldDtcblxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgdmFsdWUgb2YgYSBwcm9wZXJ0eSBpbiBhbiBvYmplY3QgdHJlZS5cbiAqXG4gKiBAbWV0aG9kIHNldFxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGNvbGxlY3Rpb246IFRoZSByb290IGNvbGxlY3Rpb24gb2YgdGhlIHRyZWUuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gcHJvcGVydHlQYXRoOiBUaGUgcHJvcGVydHkgcGF0aCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIHNldCBvbiB0aGUgY29sbGVjdGlvbi5cbiAqIEByZXR1cm5zIHsqfSBUaGUgYGNvbGxlY3Rpb25gIHBhc3NlZCBpbiB3aXRoIHZhbHVlIHNldC5cbiAqL1xuZXhwb3J0IHZhciBzZXQgPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBwcm9wZXJ0eVBhdGgsIHZhbHVlKSB7XG5cdC8vIEhhbmRsZSBFbWJlciBPYmplY3RzXG5cdGlmIChpc0VtYmVyT2JqZWN0KGNvbGxlY3Rpb24pIHx8IGlzRW1iZXJPYmplY3RQcm94eShjb2xsZWN0aW9uKSkge1xuXHRcdGNvbGxlY3Rpb24uc2V0KHByb3BlcnR5UGF0aCwgdmFsdWUpO1xuXHRcdHJldHVybiBjb2xsZWN0aW9uO1xuXHR9XG5cbiAgcmV0dXJuIF9zZXQoLi4uYXJndW1lbnRzKTtcbn07XG5sb2Rhc2hFbWJlci5zZXQgPSBzZXQ7XG5cblxuLyoqXG4gKiBPcmlnaW5hbCBsb2Rhc2ggaXNFbXB0eVxuICpcbiAqIEBtZXRob2QgX2lzRW1wdHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgX2lzRW1wdHkgPSBfLmlzRW1wdHk7XG5sb2Rhc2hFbWJlci5faXNFbXB0eSA9IF9pc0VtcHR5O1xuXG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiB0aGUgdmFsdWUgaXMgZW1wdHkgb3Igbm90XG4gKlxuICogQG1ldGhvZCBpc0VtcHR5XG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzRW1wdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAoXG5cdFx0Xy5pc0VtYmVyQXJyYXlQcm94eSh2YWx1ZSkgJiZcblx0XHRfLmlzRnVuY3Rpb24odmFsdWUuaXNFbXB0eSlcblx0KSB7XG5cdFx0cmV0dXJuIHZhbHVlLmlzRW1wdHkoKTtcblx0fVxuXG5cdHJldHVybiBfaXNFbXB0eSguLi5hcmd1bWVudHMpO1xufTtcbmxvZGFzaEVtYmVyLmlzRW1wdHkgPSBpc0VtcHR5O1xuXG5cbi8qKlxuICogT3JpZ2luYWwgbG9kYXNoIGNsb25lXG4gKlxuICogQG1ldGhvZCBfY2xvbmVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4geyp9XG4gKi9cbmV4cG9ydCB2YXIgX2Nsb25lID0gXy5jbG9uZTtcbmxvZGFzaEVtYmVyLl9jbG9uZSA9IF9jbG9uZTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBjbG9uZWQgY29weSBvZiB2YWx1ZVxuICpcbiAqIEBtZXRob2QgY2xvbmVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4geyp9XG4gKi9cbmV4cG9ydCB2YXIgY2xvbmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAoXy5pc1dpbGRjYXRPYmplY3QodmFsdWUpKSB7XG5cdFx0cmV0dXJuIHZhbHVlLmNsb25lKCk7XG5cdH1cblxuXHRyZXR1cm4gX2Nsb25lKC4uLmFyZ3VtZW50cyk7XG59O1xubG9kYXNoRW1iZXIuY2xvbmUgPSBjbG9uZTtcblxuXG4vKipcbiAqIEFsaWFzIGZvciBgYXJyYXkucG9wYCBvciBgYXJyYXlQcm94eS5wb3BPYmplY3RgXG4gKlxuICogQG1ldGhvZCBwb3BcbiAqIEBwYXJhbSB7QXJyYXl8RW1iZXIuQXJyYXlQcm94eX0gdmFsdWVcbiAqIEByZXR1cm4geyp9XG4gKi9cbmV4cG9ydCB2YXIgcG9wID0gZnVuY3Rpb24odmFsdWUpIHtcblx0cmV0dXJuIChfLmlzRW1iZXJBcnJheVByb3h5KHZhbHVlKSkgPyB2YWx1ZS5wb3BPYmplY3QoKSA6IHZhbHVlLnBvcCgpO1xufTtcbmxvZGFzaEVtYmVyLnBvcCA9IHBvcDtcblxuXG4vKipcbiAqIEFsaWFzIGZvciBgYXJyYXkuc2hpZnRgIG9yIGBhcnJheVByb3h5LnNoaWZ0T2JqZWN0YFxuICpcbiAqIEBtZXRob2Qgc2hpZnRcbiAqIEBwYXJhbSB7QXJyYXl8RW1iZXIuQXJyYXlQcm94eX0gdmFsdWVcbiAqIEByZXR1cm4geyp9XG4gKi9cbmV4cG9ydCB2YXIgc2hpZnQgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRyZXR1cm4gKF8uaXNFbWJlckFycmF5UHJveHkodmFsdWUpKSA/IHZhbHVlLnNoaWZ0T2JqZWN0KCkgOiB2YWx1ZS5zaGlmdCgpO1xufTtcbmxvZGFzaEVtYmVyLnNoaWZ0ID0gc2hpZnQ7XG5cblxuLyoqXG4gKiBFbWJlciBgdHlwZU9mYCBhbGlhc1xuICpcbiAqIEBtZXRob2QgdHlwZU9mXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7U3RyaW5nfSBUaGUgdHlwZSBvZiBgdmFsdWVgXG4gKi9cbmV4cG9ydCB2YXIgdHlwZU9mID0gKHZhbHVlKSA9PiBFbWJlci50eXBlT2YodmFsdWUpO1xubG9kYXNoRW1iZXIudHlwZU9mID0gdHlwZU9mO1xuXG5cbmV4cG9ydCB2YXIgbG9kYXNoRW1iZXI7XG5leHBvcnQgZGVmYXVsdCBsb2Rhc2hFbWJlcjtcbiIsImltcG9ydCBsb2Rhc2hVdGlscyBmcm9tICcuL19jb3JlL2xvZGFzaC11dGlscyc7XG5cblxuLyoqXG4gKiBDb2xsZWN0aW9uIG9mIGFsbCB0aGUgdXRpbHMgaW4gaGVyZS4gQWRkIHRvIHRoaXMgYXMgeW91IGdvLlxuICovXG5sZXQgbG9kYXNoRXh0cmFzID0ge307XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY2hlY2sgaWYgYSB2YXJpYWJsZSBpcyBkZWZpbmVkIGFuZCBwcmVzZW50XG4gKlxuICogQG1ldGhvZCBpc1ByZXNlbnRcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzUHJlc2VudCA9ICh2YWx1ZSkgPT4gKCFfLmlzVW5kZWZpbmVkKHZhbHVlKSAmJiAhXy5pc051bGwodmFsdWUpKTtcbmxvZGFzaEV4dHJhcy5pc1ByZXNlbnQgPSBpc1ByZXNlbnQ7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY2hlY2sgaWYgYSB2YXJpYWJsZSBpcyBkZWZpbmVkIGFuZCBwcmVzZW50XG4gKlxuICogQG1ldGhvZCBpc0JsYW5rXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc0JsYW5rID0gKHZhbHVlKSA9PiAhXy5pc1ByZXNlbnQodmFsdWUpO1xubG9kYXNoRXh0cmFzLmlzQmxhbmsgPSBpc0JsYW5rO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNoZWNrIGlmIGEgdmFyaWFibGUgaXMgYSBwcm9taXNlXG4gKlxuICogQG1ldGhvZCBpc1Byb21pc2VcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzUHJvbWlzZSA9ICh2YWx1ZSkgPT4gXy5pc0Z1bmN0aW9uKHZhbHVlLCAndGhlbicpO1xubG9kYXNoRXh0cmFzLmlzUHJvbWlzZSA9IGlzUHJvbWlzZTtcblxuXG4vKipcbiAqIEhlbHBlciB0byBjaGVjayBhIHZhbHVlIGZvciBhbiBhcnJheSBvZiBMb0Rhc2ggYm9vbGVhbiBjb25kaXRpb25zXG4gKiBUT0RPOiBOYW1lIHRoaXMgYGlzQW5kYCBhbmQgY3JlYXRlIGBpc09yYC4uLlxuICpcbiAqIEBtZXRob2QgaXNcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcGFyYW0ge0FycmF5fSBjb25kaXRpb25zOiBMb0Rhc2ggbWV0aG9kcyB0byBoYXZlIHZhbHVlIHRlc3RlZCBhZ2FpbnN0IChhcyBzdHJpbmdzKVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpcyA9IGZ1bmN0aW9uKHZhbHVlLCBjb25kaXRpb25zKSB7XG5cdGlmIChfLmlzU3RyaW5nKGNvbmRpdGlvbnMpKSBjb25kaXRpb25zID0gW2NvbmRpdGlvbnNdO1xuXHRpZiAoXy5pc1ByZXNlbnQoY29uZGl0aW9ucykgJiYgIV8uaXNBcnJheShjb25kaXRpb25zKSkgY29uZGl0aW9ucyA9IFtdO1xuXHRpZiAoY29uZGl0aW9ucy5sZW5ndGggPD0gMSkgY29uc29sZS5lcnJvcihcIkRvbid0IGNhbGwgYGlzYCBoZWxwZXIgd2l0aCBqdXN0IG9uZSBjb25kaXRpb24tIHVzZSB0aGF0IGNvbmRpdGlvbiBkaXJlY3RseVwiKTtcblx0cmV0dXJuIF8uZXZlcnkoY29uZGl0aW9ucywgZnVuY3Rpb24oY29uZGl0aW9uKSB7XG5cdFx0bGV0IHJlc3VsdCwgbm90O1xuXG5cdFx0Ly8gQ2hlY2sgZm9yIHZhbGlkIGNvbmRpdGlvblxuXHRcdGlmICghXy5pc1N0cmluZyhjb25kaXRpb24pKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJgY29uZGl0aW9uYCB3YXMgbm90IGEgc3RyaW5nOiBcIiArIGNvbmRpdGlvbik7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gSGFuZGxlIG5vdCBjb25kaXRpb25cblx0XHRub3QgPSBmYWxzZTtcblx0XHRpZiAoXy5zdGFydHNXaXRoKGNvbmRpdGlvbiwgJyEnKSkge1xuXHRcdFx0bm90ID0gdHJ1ZTtcblx0XHRcdGNvbmRpdGlvbiA9IGNvbmRpdGlvbi5yZXBsYWNlKCchJywgJycpO1xuXHRcdH1cblxuXHRcdC8vIEJlIEVYVFJBICh0b28pIGhlbHBmdWwgKHByZXBlbmQgJ2lzJyBpZiBvbW1pdHRlZClcblx0XHRpZiAoIV8uc3RhcnRzV2l0aChjb25kaXRpb24sICdpcycpKSB7XG5cdFx0XHRjb25kaXRpb24gPSAnaXMnICsgY29uZGl0aW9uO1xuXHRcdH1cblxuXHRcdC8vIE1ha2Ugc3VyZSBgY29uZGl0aW9uYCBpcyBhIHZhbGlkIGxvZGFzaCBtZXRob2Rcblx0XHRpZiAoIV8uaXNGdW5jdGlvbihfW2NvbmRpdGlvbl0pKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJgY29uZGl0aW9uYCB3YXMgbm90IGEgdmFsaWQgbG9kYXNoIG1ldGhvZDogXCIgKyBjb25kaXRpb24pO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVybWluZSByZXN1bHQgYW5kIHJldHVyblxuXHRcdHJlc3VsdCA9IF9bY29uZGl0aW9uXSh2YWx1ZSk7XG5cdFx0aWYgKG5vdCA9PT0gdHJ1ZSkgcmV0dXJuICFyZXN1bHQ7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9KTtcbn07XG5sb2Rhc2hFeHRyYXMuaXMgPSBpcztcblxuXG4vKipcbiAqIEdlbmVyYXRlIGBlbnN1cmVgIG1ldGhvZHMtIEVuc3VyZSB0aGF0IHZhbHVlIGlzIG9mIHR5cGUgeFxuICpcbiAqIEBtZXRob2QgZW5zdXJle1R5cGV9XG4gKiBAcGFyYW0geyp9IHZhbHVlOiBUbyBjaGVja1xuICogQHBhcmFtIHsqfSBbdmFsdWVEZWZhdWx0PWRlZmF1bHRzW2NvbmRpdGlvbl06IFdoYXQgdG8gZGVmYXVsdCB0b1xuICogQHJldHVybiB7Kn0gRW5zdXJlZCB2YWx1ZVxuICovXG5fLmZvckVhY2goXy5rZXlzKGxvZGFzaFV0aWxzLnR5cGVEZWZhdWx0cygpKSwgKHR5cGUpID0+IHtcblx0bG9kYXNoRXh0cmFzW2BlbnN1cmUke3R5cGV9YF0gPSBsb2Rhc2hVdGlscy5tYWtlRW5zdXJlVHlwZSh0eXBlKTtcbn0pO1xuXG5cbi8qKlxuICogSmF2YXNjcmlwdCBgdHlwZW9mYCBhbGlhc1xuICpcbiAqIEBtZXRob2QgdHlwZU9mXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7U3RyaW5nfSBUaGUgdHlwZSBvZiBgdmFsdWVgXG4gKi9cbmV4cG9ydCB2YXIgdHlwZU9mID0gKHZhbHVlKSA9PiB0eXBlb2YodmFsdWUpO1xubG9kYXNoRXh0cmFzLnR5cGVPZiA9IHR5cGVPZjtcblxuXG5leHBvcnQgZGVmYXVsdCBsb2Rhc2hFeHRyYXM7XG4iXX0=
