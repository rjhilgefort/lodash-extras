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

    // Make new method that also handles `deepGet`. Apply method to exports.
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

var _lodashDeepExtras = require('./lodash-deep-extras');

var _lodashDeepExtras2 = _interopRequireDefault(_lodashDeepExtras);

// import lodashEmber from './lodash-ember';

_.mixin(_lodashExtras2['default']);
_.mixin(_lodashDeepExtras2['default']);
// _.mixin(lodashEmber);

},{"./lodash-deep-extras":3,"./lodash-extras":5}],3:[function(require,module,exports){
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
 * @namespace _
 * @method is{Condition}
 * @param {Object} value: Base value to look through
 * @param {String} propString: Property string to apply to deepGet
 * @return {Boolean}
 */
_coreLodashUtils2['default'].buildIsMethods(_, lodashDeepExtras);
_coreLodashUtils2['default'].buildIsMethods(_lodashExtras2['default'], lodashDeepExtras);
_coreLodashUtils2['default'].buildIsMethods(_lodashEmber2['default'], lodashDeepExtras);

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
_.forEach(_.keys(_coreLodashUtils2['default'].typeDefaults()), function (type) {
  _lodashExtras2['default']['deepEnsure' + type] = _coreLodashUtils2['default'].makeDeepEnsureType(type);
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
 * @namespace _
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
 * @namespace _
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
 * @namespace _
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
 * @namespace _
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
 * @namespace _
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
 * @since v0.5.2
 */
var isEmberTransition = function isEmberTransition(value) {
  return _.isFunction(value, 'toString') && _.contains(value.toString(), 'Transition');
};
exports.isEmberTransition = isEmberTransition;
lodashEmber.isEmberTransition = isEmberTransition;

/**
 * Lodash forEach
 *
 * @namespace _
 * @method _forEach
 * @param {Array|Object|String} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|String} Returns `collection`.
 * @since v0.5.2
 */
var _forEach = _.forEach;
exports._forEach = _forEach;
lodashEmber._forEach = _forEach;

/**
 * Override lodash `forEach` to support ember arrays/objects
 *
 * @namespace _
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
 * @namespace _
 * @method _reduce
 * @param {Array|Object|String} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [currentValue] value at beginning of iteration
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|String} Returns `collection`.
 * @since v1.1.0
 */
var _reduce = _.reduce;
exports._reduce = _reduce;
lodashEmber._reduce = _reduce;

/**
 * Override lodash `reduce` to support ember arrays/objects
 *
 * @namespace _
 * @method reduce
 * @param {Array|Object|String} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [currentValue] value at beginning of iteration
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|String} Returns `collection`.
 * @since v1.1.0
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
 * @namespace _
 * @method _map
 * @param {Array|Object|String} collection The collection to iterate over.
 * @param {Function} [callback=identity] The function called per iteration.
 * @param {*} [thisArg] The `this` binding of `callback`.
 * @returns {Array|Object|String} Returns `collection`.
 * @since v0.5.2
 */
var _map = _.map;
exports._map = _map;
lodashEmber._map = _map;

/**
 * Override lodash `map` to support ember arrays/objects
 *
 * @namespace _
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
 * Lodash deepGet alias to private namespace
 *
 * @namespace _
 * @method _deepGet
 * @param {Object|Array} collection: The root collection of the tree.
 * @param {String|Array} propertyPath: The property path in the collection.
 * @returns {*} The value, or undefined if it doesn't exists.
 * @since v0.5.2
 */
var _deepGet = _.deepGet;
exports._deepGet = _deepGet;
lodashEmber._deepGet = _deepGet;

/**
 * Retrieves the value of a property in an object tree.
 *
 * @namespace _
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

  return _deepGet.apply(undefined, arguments);
};
exports.get = get;
lodashEmber.get = get;

/**
 * Lodash deepSet alias to private namespace
 *
 * @namespace _
 * @method _deepSet
 * @param {Object|Array} collection: The root collection of the tree.
 * @param {String|Array} propertyPath: The property path in the collection.
 * @param {*} value: The property path in the collection.
 * @returns {*} The `collection` passed in with value set.
 * @since v0.5.2
 */
var _deepSet = _.deepSet;
exports._deepSet = _deepSet;
lodashEmber._deepSet = _deepSet;

/**
 * Retrieves the value of a property in an object tree.
 *
 * @namespace _
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

  return _deepSet.apply(undefined, arguments);
};
exports.set = set;
lodashEmber.set = set;

// Don't use the deep prefix.
// If necessary, you can access the raw function at `_._deepGet`
(function () {
  delete _.deepGet;
  delete _.deepSet;
})();

/**
 * Original lodash isEmpty
 *
 * @namespace  _
 * @method _isEmpty
 * @param {*} value
 * @return {Boolean}
 * @since v0.5.3
 */
var _isEmpty = _.isEmpty;
exports._isEmpty = _isEmpty;
lodashEmber._isEmpty = _isEmpty;

/**
 * Determines if the value is empty or not
 *
 * @namespace  _
 * @method isEmpty
 * @param {*} value
 * @return {Boolean}
 * @since v0.5.3
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
 * @namespace  _
 * @method _clone
 * @param {*} value
 * @return {*}
 * @since v1.0.0
 */
var _clone = _.clone;
exports._clone = _clone;
lodashEmber._clone = _clone;

/**
 * Returns a cloned copy of value
 *
 * @namespace  _
 * @method clone
 * @param {*} value
 * @return {*}
 * @since v1.0.0
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
 * @namespace  _
 * @method pop
 * @param {Array|Ember.ArrayProxy} value
 * @return {*}
 * @since v1.3.0
 */
var pop = function pop(value) {
  return _.isEmberArrayProxy(value) ? value.popObject() : value.pop();
};
exports.pop = pop;
lodashEmber.pop = pop;

/**
 * Alias for `array.shift` or `arrayProxy.shiftObject`
 *
 * @namespace  _
 * @method shift
 * @param {Array|Ember.ArrayProxy} value
 * @return {*}
 * @since v1.3.0
 */
var shift = function shift(value) {
  return _.isEmberArrayProxy(value) ? value.shiftObject() : value.shift();
};
exports.shift = shift;
lodashEmber.shift = shift;

/**
 * Ember `typeOf` alias
 *
 * @namespace _
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcmpoaWxnZWZvcnQvRHJvcGJveC9Qcm9qZWN0cy9sb2Rhc2gtZXh0cmFzL3NyYy9fY29yZS9sb2Rhc2gtdXRpbHMuanMiLCIvVXNlcnMvcmpoaWxnZWZvcnQvRHJvcGJveC9Qcm9qZWN0cy9sb2Rhc2gtZXh0cmFzL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1kZWVwLWV4dHJhcy5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1lbWJlci5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1leHRyYXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0dBLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7O0FBVWQsSUFBSSxZQUFZLEdBQUcsU0FBZixZQUFZLEdBQVM7QUFDL0IsU0FBTztBQUNOLFlBQVEsRUFBRSxFQUFFO0FBQ1osV0FBTyxFQUFFLEVBQUU7QUFDWCxpQkFBYSxFQUFFLEVBQUU7QUFDakIsYUFBUyxFQUFFLEtBQUs7QUFDaEIsWUFBUSxFQUFFLENBQUM7R0FDWCxDQUFDO0NBQ0YsQ0FBQzs7QUFDRixXQUFXLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQzs7Ozs7Ozs7OztBQVdqQyxJQUFJLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBSSxLQUFLLEVBQUs7QUFDbEMsU0FBTyxVQUFTLEtBQUssRUFBRTtBQUN0QixXQUFRLEtBQUssWUFBWSxLQUFLLENBQUU7R0FDaEMsQ0FBQztDQUNGLENBQUM7O0FBQ0YsV0FBVyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7Ozs7Ozs7Ozs7QUFXN0IsSUFBSSxjQUFjLEdBQUcsU0FBakIsY0FBYyxDQUFJLFNBQVMsRUFBSztBQUMxQyxNQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsWUFBWSxFQUFFLENBQUM7OztBQUcxQyxNQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQzNDLFdBQVMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLE1BQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsU0FBUyxDQUFDLEVBQUU7QUFDN0MsVUFBTSxJQUFJLEtBQUssaUNBQWlDLFNBQVMsQ0FBRyxDQUFDO0dBQzdEOzs7QUFHRCxNQUFJLFdBQVcsR0FBRyxDQUFDLFFBQU0sU0FBUyxDQUFHLENBQUM7Ozs7Ozs7Ozs7O0FBV3RDLFNBQU8sVUFBQyxLQUFLLEVBQUUsWUFBWSxFQUFLOztBQUUvQixRQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDOUQsa0JBQVksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0tBQzVDOzs7QUFHRCxRQUFJLENBQUMsQ0FBQyxRQUFNLFNBQVMsQ0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssR0FBRyxZQUFZLENBQUM7O0FBRXRELFdBQU8sS0FBSyxDQUFDO0dBQ2IsQ0FBQztDQUNGLENBQUM7O0FBQ0YsV0FBVyxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7Ozs7Ozs7Ozs7O0FBWXJDLElBQUksa0JBQWtCLEdBQUcsU0FBckIsa0JBQWtCLENBQUksU0FBUyxFQUFLO0FBQzlDLFNBQU8sVUFBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBSztBQUNoRCxXQUFPLENBQUMsQ0FBQyxHQUFHLENBQ1gsVUFBVSxFQUNWLFVBQVUsRUFDVixXQUFXLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUNwQyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsRUFDN0IsWUFBWSxDQUNaLENBQ0QsQ0FBQztHQUNGLENBQUM7Q0FDRixDQUFDOztBQUNGLFdBQVcsQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQzs7Ozs7Ozs7OztBQVc3QyxJQUFJLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQVksR0FBRyxFQUFFO0FBQ3ZDLFNBQ0UsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxBQUFDLENBQ3hCO0NBQ0gsQ0FBQzs7QUFDRixXQUFXLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQzs7Ozs7Ozs7O0FBVW5DLElBQUksZUFBZSxHQUFHLFNBQWxCLGVBQWUsQ0FBSSxTQUFTLEVBQUs7QUFDMUMsU0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUN0QixJQUFJLEVBQUUsQ0FDTixNQUFNLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUNoQyxLQUFLLEVBQUUsQ0FBQztDQUNaLENBQUM7O0FBQ0YsV0FBVyxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7Ozs7Ozs7Ozs7OztBQWF2QyxJQUFJLGVBQWUsR0FBRyxTQUFsQixlQUFlLENBQUksU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUs7QUFDN0QsTUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVuQixHQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxVQUFDLE1BQU0sRUFBSzs7QUFFL0IsYUFBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7O0FBR3RDLFVBQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxVQUFTLEtBQUssRUFBRSxVQUFVLEVBQUU7QUFDM0MsVUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTs7O0FBQzNCLGVBQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQUEsQ0FBQyxFQUFDLEdBQUcsTUFBQSxPQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7T0FDL0M7QUFDRCxhQUFPLFNBQVMsQ0FBQyxNQUFNLE9BQUMsQ0FBakIsU0FBUyxFQUFZLFNBQVMsQ0FBQyxDQUFDO0tBQ3hDLENBQUM7R0FDSCxDQUFDLENBQUM7Q0FDSixDQUFDOztBQUNGLFdBQVcsQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDOzs7Ozs7Ozs7O0FBV3ZDLElBQUksY0FBYyxHQUFHLFNBQWpCLGNBQWMsQ0FBSSxTQUFTLEVBQUUsTUFBTSxFQUFLO0FBQ2pELGlCQUFlLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztDQUNoRSxDQUFBOztBQUNELFdBQVcsQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDOztxQkFHN0IsV0FBVzs7Ozs7Ozs0QkMxTEQsaUJBQWlCOzs7O2dDQUNiLHNCQUFzQjs7Ozs7O0FBR25ELENBQUMsQ0FBQyxLQUFLLDJCQUFjLENBQUM7QUFDdEIsQ0FBQyxDQUFDLEtBQUssK0JBQWtCLENBQUM7Ozs7Ozs7Ozs7OzsrQkNMRixzQkFBc0I7Ozs7NEJBQ3JCLGlCQUFpQjs7OzsyQkFDbEIsZ0JBQWdCOzs7OztBQUl4QyxJQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7QUFZMUIsNkJBQVksY0FBYyxDQUFDLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2hELDZCQUFZLGNBQWMsNEJBQWUsZ0JBQWdCLENBQUMsQ0FBQztBQUMzRCw2QkFBWSxjQUFjLDJCQUFjLGdCQUFnQixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7QUFjMUQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLDZCQUFZLFlBQVksRUFBRSxDQUFDLEVBQUUsVUFBQyxJQUFJLEVBQUs7QUFDdkQsMkNBQTBCLElBQUksQ0FBRyxHQUFHLDZCQUFZLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ3pFLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7O0FBYUksSUFBSSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQVksS0FBSyxFQUFFLFVBQVUsRUFBRTtBQUNuRCxNQUFJLFlBQVksWUFBQTtNQUFFLENBQUMsWUFBQSxDQUFDOzs7QUFHcEIsTUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsRUFBRTtBQUNuQyxnQkFBWSxHQUFHLEtBQUssQ0FBQztBQUNyQixjQUFVLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFakQsU0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQUFBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzdDLGtCQUFZLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNDOztBQUVELFdBQU8sWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ25DO0NBQ0QsQ0FBQzs7QUFDRixnQkFBZ0IsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDOztxQkFHMUIsZ0JBQWdCOzs7Ozs7Ozs7Ozs7OzsrQkNoRVAsc0JBQXNCOzs7Ozs7O0FBTXZDLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7QUFXckIsSUFBSSxlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFZLEtBQUssRUFBRTtBQUM1QyxTQUFRLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssVUFBVSxDQUFFO0NBQzVDLENBQUM7O0FBQ0YsV0FBVyxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7Ozs7Ozs7Ozs7QUFXdkMsSUFBSSxhQUFhLEdBQUcsNkJBQVksVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFDaEUsV0FBVyxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBZ0JuQyxJQUFJLGtCQUFrQixHQUFHLDZCQUFZLFVBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBQzFFLFdBQVcsQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQzs7Ozs7Ozs7OztBQVc3QyxJQUFJLGlCQUFpQixHQUFHLDZCQUFZLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBQ3hFLFdBQVcsQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQzs7Ozs7Ozs7Ozs7QUFZM0MsSUFBSSxpQkFBaUIsR0FBRyxTQUFwQixpQkFBaUIsQ0FBWSxLQUFLLEVBQUU7QUFDOUMsU0FDQyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUN0QixDQUFDLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLElBQzNCLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FDekI7Q0FDRixDQUFDOztBQUNGLFdBQVcsQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQzs7Ozs7Ozs7OztBQVczQyxJQUFJLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixDQUFZLEtBQUssRUFBRTtBQUM5QyxTQUNDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxJQUMvQixDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxZQUFZLENBQUMsQ0FDekM7Q0FDRixDQUFDOztBQUNGLFdBQVcsQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQzs7Ozs7Ozs7Ozs7OztBQWMzQyxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDOztBQUNoQyxXQUFXLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7Ozs7Ozs7Ozs7O0FBYXpCLElBQUksT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFZLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFO0FBQzVELE1BQUksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ3BDLFdBQU8sVUFBVSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7R0FDMUM7QUFDRCxNQUFJLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRTtBQUM5RSxXQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUM5RDtBQUNELFNBQU8sUUFBUSxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7Q0FDL0MsQ0FBQzs7QUFDRixXQUFXLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUFldkIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7QUFDOUIsV0FBVyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBZXZCLElBQUksTUFBTSxHQUFHLFNBQVQsTUFBTSxDQUFZLFVBQVUsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRTtBQUN6RSxNQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUNwQyxXQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztHQUN2RDtBQUNELE1BQUksQ0FBQyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFO0FBQzlFLFdBQU8sT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztHQUMzRTtBQUNELFNBQU8sT0FBTyxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0NBQzVELENBQUM7O0FBQ0YsV0FBVyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7Ozs7Ozs7Ozs7Ozs7QUFjckIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQzs7QUFDeEIsV0FBVyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Ozs7Ozs7Ozs7OztBQWFqQixJQUFJLEdBQUcsR0FBRyxTQUFOLEdBQUcsQ0FBWSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRTtBQUN4RCxNQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsRUFBRTtBQUNwQyxXQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0dBQ3RDO0FBQ0QsU0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztDQUMzQyxDQUFDOztBQUNGLFdBQVcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOzs7Ozs7Ozs7Ozs7QUFhZixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDOztBQUNoQyxXQUFXLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7Ozs7Ozs7Ozs7QUFZekIsSUFBSSxHQUFHLEdBQUcsU0FBTixHQUFHLENBQVksVUFBVSxFQUFFLFlBQVksRUFBRTs7QUFFbkQsTUFBSSxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksa0JBQWtCLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDaEUsV0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0dBQ3BDOztBQUVELFNBQU8sUUFBUSxrQkFBSSxTQUFTLENBQUMsQ0FBQztDQUM5QixDQUFDOztBQUNGLFdBQVcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOzs7Ozs7Ozs7Ozs7O0FBY2YsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQzs7QUFDaEMsV0FBVyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7Ozs7Ozs7Ozs7OztBQWF6QixJQUFJLEdBQUcsR0FBRyxTQUFOLEdBQUcsQ0FBWSxVQUFVLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRTs7QUFFMUQsTUFBSSxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksa0JBQWtCLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDaEUsY0FBVSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEMsV0FBTyxVQUFVLENBQUM7R0FDbEI7O0FBRUQsU0FBTyxRQUFRLGtCQUFJLFNBQVMsQ0FBQyxDQUFDO0NBQzlCLENBQUM7O0FBQ0YsV0FBVyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7Ozs7QUFLdEIsQ0FBQyxZQUFNO0FBQ04sU0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQ2pCLFNBQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQztDQUNqQixDQUFBLEVBQUcsQ0FBQzs7Ozs7Ozs7Ozs7QUFZRSxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDOztBQUNoQyxXQUFXLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7Ozs7Ozs7Ozs7QUFZekIsSUFBSSxPQUFPLEdBQUcsU0FBVixPQUFPLENBQVksS0FBSyxFQUFFO0FBQ3BDLE1BQ0MsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxJQUMxQixDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFDMUI7QUFDRCxXQUFPLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUN2Qjs7QUFFRCxTQUFPLFFBQVEsa0JBQUksU0FBUyxDQUFDLENBQUM7Q0FDOUIsQ0FBQzs7QUFDRixXQUFXLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7Ozs7Ozs7Ozs7QUFZdkIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFDNUIsV0FBVyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7Ozs7Ozs7Ozs7O0FBWXJCLElBQUksS0FBSyxHQUFHLFNBQVIsS0FBSyxDQUFZLEtBQUssRUFBRTtBQUNsQyxNQUFJLENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDN0IsV0FBTyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDckI7O0FBRUQsU0FBTyxNQUFNLGtCQUFJLFNBQVMsQ0FBQyxDQUFDO0NBQzVCLENBQUM7O0FBQ0YsV0FBVyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Ozs7Ozs7Ozs7O0FBWW5CLElBQUksR0FBRyxHQUFHLFNBQU4sR0FBRyxDQUFZLEtBQUssRUFBRTtBQUNoQyxTQUFPLEFBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxHQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7Q0FDdEUsQ0FBQzs7QUFDRixXQUFXLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQzs7Ozs7Ozs7Ozs7QUFZZixJQUFJLEtBQUssR0FBRyxTQUFSLEtBQUssQ0FBWSxLQUFLLEVBQUU7QUFDbEMsU0FBTyxBQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsR0FBSSxLQUFLLENBQUMsV0FBVyxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0NBQzFFLENBQUM7O0FBQ0YsV0FBVyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Ozs7Ozs7Ozs7QUFXbkIsSUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUksS0FBSztTQUFLLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0NBQUEsQ0FBQzs7QUFDbkQsV0FBVyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBR3JCLElBQUksV0FBVyxDQUFDOztxQkFDUixXQUFXOzs7Ozs7Ozs7OzsrQkNuWkYsc0JBQXNCOzs7Ozs7O0FBTTlDLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7OztBQVdmLElBQUksU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFJLEtBQUs7U0FBTSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztDQUFDLENBQUM7O0FBQzlFLFlBQVksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDOzs7Ozs7Ozs7O0FBVzVCLElBQUksT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLEtBQUs7U0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO0NBQUEsQ0FBQzs7QUFDcEQsWUFBWSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Ozs7Ozs7Ozs7QUFXeEIsSUFBSSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQUksS0FBSztTQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztDQUFBLENBQUM7O0FBQzlELFlBQVksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDOzs7Ozs7Ozs7Ozs7QUFhNUIsSUFBSSxFQUFFLEdBQUcsU0FBTCxFQUFFLENBQVksS0FBSyxFQUFFLFVBQVUsRUFBRTtBQUMzQyxNQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsVUFBVSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdEQsTUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3ZFLE1BQUksVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyw2RUFBNkUsQ0FBQyxDQUFDO0FBQ3pILFNBQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsVUFBUyxTQUFTLEVBQUU7QUFDOUMsUUFBSSxNQUFNLFlBQUE7UUFBRSxHQUFHLFlBQUEsQ0FBQzs7O0FBR2hCLFFBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQzNCLGFBQU8sQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLEdBQUcsU0FBUyxDQUFDLENBQUM7QUFDM0QsYUFBTyxLQUFLLENBQUM7S0FDYjs7O0FBR0QsT0FBRyxHQUFHLEtBQUssQ0FBQztBQUNaLFFBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLEVBQUU7QUFDakMsU0FBRyxHQUFHLElBQUksQ0FBQztBQUNYLGVBQVMsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUN2Qzs7O0FBR0QsUUFBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxFQUFFO0FBQ25DLGVBQVMsR0FBRyxJQUFJLEdBQUcsU0FBUyxDQUFDO0tBQzdCOzs7QUFHRCxRQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRTtBQUNoQyxhQUFPLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0FBQ3hFLGFBQU8sS0FBSyxDQUFDO0tBQ2I7OztBQUdELFVBQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0IsUUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUM7O0FBRWpDLFdBQU8sTUFBTSxDQUFDO0dBQ2QsQ0FBQyxDQUFDO0NBQ0gsQ0FBQzs7QUFDRixZQUFZLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7O0FBYXJCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyw2QkFBWSxZQUFZLEVBQUUsQ0FBQyxFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQ3ZELGNBQVksWUFBVSxJQUFJLENBQUcsR0FBRyw2QkFBWSxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDakUsQ0FBQyxDQUFDOzs7Ozs7Ozs7O0FBV0ksSUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUksS0FBSztTQUFLLE9BQU8sS0FBSyxBQUFDO0NBQUEsQ0FBQzs7QUFDN0MsWUFBWSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O3FCQUdkLFlBQVkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDb2xsZWN0aW9uIG9mIGFsbCB0aGUgdXRpbHMgaW4gaGVyZS4gQWRkIHRvIHRoaXMgYXMgeW91IGdvLlxuICovXG5sZXQgbG9kYXNoVXRpbHMgPSB7fTtcblxuXG4vKipcbiAqIEhlbHBlciBmb3IgSlMgdHlwZXMgYW5kIGRlZmF1bHRzIGZvciBlYWNoIHR5cGVcbiAqXG4gKiBAbWV0aG9kIHR5cGVEZWZhdWx0c1xuICogQHJldHVybiB7UGxhaW5PYmplY3R9XG4gKiBAc2luY2UgdjEuMy4wXG4gKi9cbmV4cG9ydCB2YXIgdHlwZURlZmF1bHRzID0gKCkgPT4ge1xuXHRyZXR1cm4ge1xuXHRcdCdTdHJpbmcnOiAnJyxcblx0XHQnQXJyYXknOiBbXSxcblx0XHQnUGxhaW5PYmplY3QnOiB7fSxcblx0XHQnQm9vbGVhbic6IGZhbHNlLFxuXHRcdCdOdW1iZXInOiAxXG5cdH07XG59O1xubG9kYXNoVXRpbHMudHlwZURlZmF1bHRzID0gdHlwZURlZmF1bHRzO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIG1ha2UgYF8uaXNFbWJlcntDbGFzc31gXG4gKlxuICogQG1ldGhvZCBtYWtlSXNUeXBlXG4gKiBAcGFyYW0geyp9IGtsYXNzOiBBIGNsYXNzIHRvIGNoZWNrIGluc3RhbmNlb2YgYWdhaW5zdFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAc2luY2UgdjAuNS4yXG4gKi9cbmV4cG9ydCB2YXIgbWFrZUlzVHlwZSA9IChrbGFzcykgPT4ge1xuXHRyZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRyZXR1cm4gKHZhbHVlIGluc3RhbmNlb2Yga2xhc3MpO1xuXHR9O1xufTtcbmxvZGFzaFV0aWxzLm1ha2VJc1R5cGUgPSBtYWtlSXNUeXBlO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIG1ha2UgYF8uZW5zdXJlVHlwZWBcbiAqXG4gKiBAbWV0aG9kIG1ha2VFbnN1cmVUeXBlXG4gKiBAcGFyYW0ge1N0cmluZ30gY29uZGl0aW9uOiBMb2Rhc2ggbWV0aG9kIHRvIGFwcGx5XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBzaW5jZSB2MS4zLjBcbiAqL1xuZXhwb3J0IHZhciBtYWtlRW5zdXJlVHlwZSA9IChjb25kaXRpb24pID0+IHtcblx0bGV0IGRlZmF1bHRzID0gbG9kYXNoVXRpbHMudHlwZURlZmF1bHRzKCk7XG5cblx0Ly8gQ2hlY2sgcGFyYW1zOiBjb25kaXRpb25cblx0aWYgKCFfLmlzU3RyaW5nKGNvbmRpdGlvbikpIGNvbmRpdGlvbiA9ICcnO1xuXHRjb25kaXRpb24gPSBfLmNhcGl0YWxpemUoY29uZGl0aW9uKTtcblx0aWYgKCFfLmNvbnRhaW5zKF8ua2V5cyhkZWZhdWx0cyksIGNvbmRpdGlvbikpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYFxcYGNvbmRpdGlvblxcYCBub3Qgc3VwcG9ydGVkOiAke2NvbmRpdGlvbn1gKTtcblx0fVxuXG5cdC8vIFNob3J0Y3V0XG5cdGxldCBpc0NvbmRpdGlvbiA9IF9bYGlzJHtjb25kaXRpb259YF07XG5cblx0LyoqXG5cdCAqIEludGVyZmFjZSBmb3IgYGVuc3VyZVR5cGVgIG1ldGhvZHNcblx0ICpcblx0ICogQG1ldGhvZCBgZW5zdXJlJHt0eXBlfWBcblx0ICogQHBhcmFtIHsqfSB2YWx1ZTogVG8gY2hlY2tcblx0ICogQHBhcmFtIHsqfSBbdmFsdWVEZWZhdWx0PWRlZmF1bHRzW2NvbmRpdGlvbl06IFdoYXQgdG8gZGVmYXVsdCB0b1xuXHQgKiBAcmV0dXJuIHsqfSBEZWZhdWx0ZWQgdmFsdWUsIG9yIHRoZSB2YWx1ZSBpdHNlbGYgaWYgcGFzc1xuXHQgKiBAc2luY2UgdjEuMy4wXG5cdCAqL1xuXHRyZXR1cm4gKHZhbHVlLCB2YWx1ZURlZmF1bHQpID0+IHtcblx0XHQvLyBEZXRlcm1pbmUgYHZhbHVlRGVmYXVsdGA6IGlmIG5vdGhpbmcgcHJvdmlkZWQsIG9yIHByb3ZpZGVkIGRvZXNuJ3QgbWF0Y2ggdHlwZVxuXHRcdGlmIChfLmlzVW5kZWZpbmVkKHZhbHVlRGVmYXVsdCkgfHwgIWlzQ29uZGl0aW9uKHZhbHVlRGVmYXVsdCkpIHtcblx0XHRcdHZhbHVlRGVmYXVsdCA9IF8uY2xvbmUoZGVmYXVsdHNbY29uZGl0aW9uXSk7XG5cdFx0fVxuXG5cdFx0Ly8gQWN0dWFsIFwiZW5zdXJlXCIgY2hlY2tcblx0XHRpZiAoIV9bYGlzJHtjb25kaXRpb259YF0odmFsdWUpKSB2YWx1ZSA9IHZhbHVlRGVmYXVsdDtcblxuXHRcdHJldHVybiB2YWx1ZTtcblx0fTtcbn07XG5sb2Rhc2hVdGlscy5tYWtlRW5zdXJlVHlwZSA9IG1ha2VFbnN1cmVUeXBlO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIG1ha2UgYF8uZGVlcEVuc3VyZXtUeXBlfWBcbiAqXG4gKiBAbWV0aG9kIG1ha2VEZWVwRW5zdXJlVHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY29uZGl0aW9uOiBMb2Rhc2ggbWV0aG9kIHRvIGFwcGx5XG4gKiBAcGFyYW0geyp9IHZhbHVlRGVmYXVsdDogV2hhdCB0byBhc3NpZ24gd2hlbiBub3Qgb2YgdGhlIGRlc2lyZWQgdHlwZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAc2luY2UgdjAuNS4yXG4gKi9cbmV4cG9ydCB2YXIgbWFrZURlZXBFbnN1cmVUeXBlID0gKGNvbmRpdGlvbikgPT4ge1xuXHRyZXR1cm4gKGNvbGxlY3Rpb24sIHByb3BTdHJpbmcsIHZhbHVlRGVmYXVsdCkgPT4ge1xuXHRcdHJldHVybiBfLnNldChcblx0XHRcdGNvbGxlY3Rpb24sXG5cdFx0XHRwcm9wU3RyaW5nLFxuXHRcdFx0bG9kYXNoVXRpbHMubWFrZUVuc3VyZVR5cGUoY29uZGl0aW9uKShcblx0XHRcdFx0Xy5nZXQoY29sbGVjdGlvbiwgcHJvcFN0cmluZyksXG5cdFx0XHRcdHZhbHVlRGVmYXVsdFxuXHRcdFx0KVxuXHRcdCk7XG5cdH07XG59O1xubG9kYXNoVXRpbHMubWFrZURlZXBFbnN1cmVUeXBlID0gbWFrZURlZXBFbnN1cmVUeXBlO1xuXG5cbi8qKlxuICogRGV0ZXJtaW5lZCBpZiBsb2Rhc2gga2V5L21ldGhvZCBpcyB2YWxpZCB0byBtYWtlIGRlZXAgKGBpc2AgbWV0aG9kcyB0aGF0IG9ubHkgaGF2ZSBvbmUgYXJndW1lbnQpXG4gKiBOT1RFOiBBc3N1bWVzIGB0aGlzYCA9PT0gaXMgdGhlIG5hbWVzcGFjZSB0byBjaGVjayBmb3IgdGhlIGZ1bmN0aW9uIG9uXG4gKlxuICogQG1ldGhvZCB2YWxpZElzTWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5OiBtZXRob2QgbmFtZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciB2YWxpZElzTWV0aG9kID0gZnVuY3Rpb24oa2V5KSB7XG4gIHJldHVybiAoXG4gICAgXy5zdGFydHNXaXRoKGtleSwgJ2lzJykgJiZcbiAgICAodGhpc1trZXldLmxlbmd0aCA9PT0gMSlcbiAgKTtcbn07XG5sb2Rhc2hVdGlscy52YWxpZElzTWV0aG9kID0gdmFsaWRJc01ldGhvZDtcblxuXG4vKipcbiAqIEZpbHRlciBvdXQgYWxsIHZhbGlkIGBpc2AgbWV0aG9kcyBmcm9tIGEgbmFtZXNwYWNlXG4gKlxuICogQG1ldGhvZCBmaWx0ZXJJc01ldGhvZHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2U6IENvbGxlY3Rpb24gb2YgbWV0aG9kc1xuICogQHJldHVybiB7T2JqZWN0fSBgbmFtZXNwYWNlYCB3aXRoIGp1c3QgdGhlIFwiaXNcIiBtZXRob2RzXG4gKi9cbmV4cG9ydCB2YXIgZmlsdGVySXNNZXRob2RzID0gKG5hbWVzcGFjZSkgPT4ge1xuICByZXR1cm4gXy5jaGFpbihuYW1lc3BhY2UpXG4gICAgLmtleXMoKVxuICAgIC5maWx0ZXIodmFsaWRJc01ldGhvZCwgbmFtZXNwYWNlKVxuICAgIC52YWx1ZSgpO1xufTtcbmxvZGFzaFV0aWxzLmZpbHRlcklzTWV0aG9kcyA9IGZpbHRlcklzTWV0aG9kcztcblxuXG4vKipcbiAqIE92ZXJsb2FkIG5vcm1hbCBsb2Rhc2ggbWV0aG9kcyB0byBoYW5kbGUgZGVlcCBzeW50YXhcbiAqIFRPRE86IE5vIG5lZWQgdG8gdGFrZSB0aGUgZmlyc3QgcGFyYW1cbiAqXG4gKiBAbWV0aG9kIG92ZXJsb2FkTWV0aG9kc1xuICogQHBhcmFtIHtPYmplY3R9IGlzTWV0aG9kczogQ29sbGVjdGlvbiBvZiBpcyBtZXRob2RzXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlOiBPcmlnaW5hbCBuYW1lc3BhY2UgaXNNZXRob2RzIGNhbWUgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldDogbmFtZXNwYWNlIHRvIG92ZXJsb2FkIG1ldGhvZHMgb25cbiAqIEByZXR1cm4ge1VuZGVmaW5lZH1cbiAqL1xuZXhwb3J0IHZhciBvdmVybG9hZE1ldGhvZHMgPSAoaXNNZXRob2RzLCBuYW1lc3BhY2UsIHRhcmdldCkgPT4ge1xuICBsZXQgb2xkTWV0aG9kID0ge307XG5cbiAgXy5mb3JFYWNoKGlzTWV0aG9kcywgKG1ldGhvZCkgPT4ge1xuICAgIC8vIFNhdmUgb2xkIG1ldGhvZFxuICAgIG9sZE1ldGhvZFttZXRob2RdID0gbmFtZXNwYWNlW21ldGhvZF07XG5cbiAgICAvLyBNYWtlIG5ldyBtZXRob2QgdGhhdCBhbHNvIGhhbmRsZXMgYGRlZXBHZXRgLiBBcHBseSBtZXRob2QgdG8gZXhwb3J0cy5cbiAgICB0YXJnZXRbbWV0aG9kXSA9IGZ1bmN0aW9uKHZhbHVlLCBwcm9wU3RyaW5nKSB7XG4gICAgICBpZiAoXy5zaXplKGFyZ3VtZW50cykgPT09IDIpIHtcbiAgICAgICAgcmV0dXJuIG5hbWVzcGFjZVttZXRob2RdKF8uZ2V0KC4uLmFyZ3VtZW50cykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9sZE1ldGhvZFttZXRob2RdKC4uLmFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfSk7XG59O1xubG9kYXNoVXRpbHMub3ZlcmxvYWRNZXRob2RzID0gb3ZlcmxvYWRNZXRob2RzO1xuXG5cbi8qKlxuICogQnVpbGQgYGlzTWV0aG9kc2BcbiAqXG4gKiBAbWV0aG9kIGJ1aWxkSXNNZXRob2RzXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlOiBOYW1lc3BhY2UgdG8gcHVsbCBgaXNgIG1ldGhvZHMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldDogbmFtZXNwYWNlIHRvIG92ZXJsb2FkIG1ldGhvZHMgb25cbiAqIEByZXR1cm4ge1VuZGVmaW5lZH1cbiAqL1xuZXhwb3J0IHZhciBidWlsZElzTWV0aG9kcyA9IChuYW1lc3BhY2UsIHRhcmdldCkgPT4ge1xuICBvdmVybG9hZE1ldGhvZHMoZmlsdGVySXNNZXRob2RzKG5hbWVzcGFjZSksIG5hbWVzcGFjZSwgdGFyZ2V0KTtcbn1cbmxvZGFzaFV0aWxzLmJ1aWxkSXNNZXRob2RzID0gYnVpbGRJc01ldGhvZHM7XG5cblxuZXhwb3J0IGRlZmF1bHQgbG9kYXNoVXRpbHM7XG4iLCJpbXBvcnQgbG9kYXNoRXh0cmFzIGZyb20gJy4vbG9kYXNoLWV4dHJhcyc7XG5pbXBvcnQgbG9kYXNoRGVlcEV4dHJhcyBmcm9tICcuL2xvZGFzaC1kZWVwLWV4dHJhcyc7XG4vLyBpbXBvcnQgbG9kYXNoRW1iZXIgZnJvbSAnLi9sb2Rhc2gtZW1iZXInO1xuXG5fLm1peGluKGxvZGFzaEV4dHJhcyk7XG5fLm1peGluKGxvZGFzaERlZXBFeHRyYXMpO1xuLy8gXy5taXhpbihsb2Rhc2hFbWJlcik7XG4iLCJpbXBvcnQgbG9kYXNoVXRpbHMgZnJvbSAnLi9fY29yZS9sb2Rhc2gtdXRpbHMnO1xuaW1wb3J0IGxvZGFzaEV4dHJhcyBmcm9tICcuL2xvZGFzaC1leHRyYXMnO1xuaW1wb3J0IGxvZGFzaEVtYmVyIGZyb20gJy4vbG9kYXNoLWVtYmVyJztcblxuXG4vLyBBbGwgbG9kYXNoIGV4dHJhRGVlcCBtZXRob2RzIHRvIGV4cG9ydFxubGV0IGxvZGFzaERlZXBFeHRyYXMgPSB7fTtcblxuXG4vKipcbiAqIEdlbmVyYXRlIGBkZWVwSXNgIG1ldGhvZHMgYW5kIG92ZXJyaWRlIHN0YW5kYXJkIG1ldGhvZHMgdG8gaGFuZGxlIGJvdGhcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgaXN7Q29uZGl0aW9ufVxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlOiBCYXNlIHZhbHVlIHRvIGxvb2sgdGhyb3VnaFxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BTdHJpbmc6IFByb3BlcnR5IHN0cmluZyB0byBhcHBseSB0byBkZWVwR2V0XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5sb2Rhc2hVdGlscy5idWlsZElzTWV0aG9kcyhfLCBsb2Rhc2hEZWVwRXh0cmFzKTtcbmxvZGFzaFV0aWxzLmJ1aWxkSXNNZXRob2RzKGxvZGFzaEV4dHJhcywgbG9kYXNoRGVlcEV4dHJhcyk7XG5sb2Rhc2hVdGlscy5idWlsZElzTWV0aG9kcyhsb2Rhc2hFbWJlciwgbG9kYXNoRGVlcEV4dHJhcyk7XG5cblxuLyoqXG4gKiBHZW5lcmF0ZSBgZW5zdXJlYCBtZXRob2RzLSBFbnN1cmUgdGhhdCB2YWx1ZSBpcyBvZiB0eXBlIHgsIGRlZXBseVxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBkZWVwRW5zdXJle1R5cGV9XG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gY29sbGVjdGlvbjogVGhlIHJvb3QgY29sbGVjdGlvbiBvZiB0aGUgdHJlZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wU3RyaW5nOiBOZXN0ZWQgcHJvcGVydHkgcGF0aCBvZiB2YWx1ZSB0byBjaGVja1xuICogQHBhcmFtIHsqfSBbdmFsdWVEZWZhdWx0PWRlZmF1bHRzW2NvbmRpdGlvbl06IFdoYXQgdG8gZGVmYXVsdCB0b1xuICogQHJldHVybiB7Kn0gQ29sbGVjdGlvbiwgd2l0aCBlbnN1cmVkIHByb3BlcnR5XG4gKiBAc2luY2UgdjEuMy4wXG4gKi9cbl8uZm9yRWFjaChfLmtleXMobG9kYXNoVXRpbHMudHlwZURlZmF1bHRzKCkpLCAodHlwZSkgPT4ge1xuXHRsb2Rhc2hFeHRyYXNbYGRlZXBFbnN1cmUke3R5cGV9YF0gPSBsb2Rhc2hVdGlscy5tYWtlRGVlcEVuc3VyZVR5cGUodHlwZSk7XG59KTtcblxuXG4vKipcbiAqIFRPRE86IFRFU1QgVEVTVCBURVNULiBUaGlzIGlzIGV4cGVyaW1lbnRhbCAoV0lQKVxuICogRGVsZXRlIGRlZXBseSBuZXN0ZWQgcHJvcGVydGllcyB3aXRob3V0IGNoZWNraW5nIGV4aXN0ZW5jZSBkb3duIHRoZSB0cmVlIGZpcnN0XG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGRlZXBEZWxldGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcFN0cmluZzogUHJvcGVydHkgc3RyaW5nIHRvIGFwcGx5IHRvIGRlZXBHZXRcbiAqIEByZXR1cm4ge3VuZGVmaW5lZH0gRG9lc24ndCByZXR1cm4gc3VjY2Vzcy9mYWlsdXJlLCB0byBtYXRjaCBgZGVsZXRlYCdzIHJldHVyblxuICovXG5leHBvcnQgdmFyIGRlZXBEZWxldGUgPSBmdW5jdGlvbih2YWx1ZSwgcHJvcFN0cmluZykge1xuXHRsZXQgY3VycmVudFZhbHVlLCBpO1xuXG5cdC8vIERlbGV0ZSBpZiBwcmVzZW50XG5cdGlmIChfLmlzUHJlc2VudCh2YWx1ZSwgcHJvcFN0cmluZykpIHtcblx0XHRjdXJyZW50VmFsdWUgPSB2YWx1ZTtcblx0XHRwcm9wU3RyaW5nID0gXyhwcm9wU3RyaW5nKS50b1N0cmluZygpLnNwbGl0KCcuJyk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgKHByb3BTdHJpbmcubGVuZ3RoIC0gMSk7IGkrKykge1xuXHRcdFx0Y3VycmVudFZhbHVlID0gY3VycmVudFZhbHVlW3Byb3BTdHJpbmdbaV1dO1xuXHRcdH1cblxuXHRcdGRlbGV0ZSBjdXJyZW50VmFsdWVbcHJvcFN0cmluZ1tpXV07XG5cdH1cbn07XG5sb2Rhc2hEZWVwRXh0cmFzLmRlZXBEZWxldGUgPSBkZWVwRGVsZXRlO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGxvZGFzaERlZXBFeHRyYXM7XG4iLCIvKipcbiAqIFRoaXMgdXRpbGl0eSBhc3N1bWVzIGBFbWJlcmAgZXhpc3RzIGdsb2JhbGx5XG4gKi9cbmltcG9ydCBsb2Rhc2hVdGlscyBmcm9tICcuL19jb3JlL2xvZGFzaC11dGlscyc7XG5cblxuLyoqXG4gKiBDb2xsZWN0aW9uIG9mIGFsbCB0aGUgdXRpbHMgaW4gaGVyZS4gQWRkIHRvIHRoaXMgYXMgeW91IGdvLlxuICovXG5leHBvcnQgdmFyIGxvZGFzaEVtYmVyID0ge307XG5cblxuLyoqXG4gKiBDaGVjayB0aGF0IGEgdmFsdWUgaXMgYW4gaW5zdGFuY2UsIGFzIGRlc2lnbmF0ZWQgYnkgRW1iZXJcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgaXNJbnN0YW5jZVxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNFbWJlckluc3RhbmNlID0gZnVuY3Rpb24odmFsdWUpIHtcblx0cmV0dXJuIChFbWJlci50eXBlT2YodmFsdWUpID09PSAnaW5zdGFuY2UnKTtcbn07XG5sb2Rhc2hFbWJlci5pc0VtYmVySW5zdGFuY2UgPSBpc0VtYmVySW5zdGFuY2U7XG5cblxuLyoqXG4gKiBDaGVjayB0aGF0IGEgdmFsdWUgaXMsIGF0IGxlYXN0LCBhIHN1YmNsYXNzIG9mIEVtYmVyLk9iamVjdFxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBpc0VtYmVyT2JqZWN0XG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc0VtYmVyT2JqZWN0ID0gbG9kYXNoVXRpbHMubWFrZUlzVHlwZShFbWJlci5PYmplY3QpO1xubG9kYXNoRW1iZXIuaXNFbWJlck9iamVjdCA9IGlzRW1iZXJPYmplY3Q7XG5cblxuLyoqXG4gKiBOT1RFOiBpc0VtYmVyQXJyYXkgaGFzIGJlZW4gZXhjbHVkZWQgYXMgRW1iZXIuQXJyYXkgaXMgbm90IGFuIEVtYmVyLk9iamVjdFxuICovXG5cblxuLyoqXG4gKiBDaGVjayB0aGF0IGEgdmFsdWUgaXMsIGF0IGxlYXN0LCBhIHN1YmNsYXNzIG9mIEVtYmVyLk9iamVjdFByb3h5XG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGlzRW1iZXJPYmplY3RQcm94eVxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNFbWJlck9iamVjdFByb3h5ID0gbG9kYXNoVXRpbHMubWFrZUlzVHlwZShFbWJlci5PYmplY3RQcm94eSk7XG5sb2Rhc2hFbWJlci5pc0VtYmVyT2JqZWN0UHJveHkgPSBpc0VtYmVyT2JqZWN0UHJveHk7XG5cblxuLyoqXG4gKiBDaGVjayB0aGF0IGEgdmFsdWUgaXMsIGF0IGxlYXN0LCBhIHN1YmNsYXNzIG9mIEVtYmVyLkFycmF5UHJveHlcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgaXNFbWJlckFycmF5UHJveHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzRW1iZXJBcnJheVByb3h5ID0gbG9kYXNoVXRpbHMubWFrZUlzVHlwZShFbWJlci5BcnJheVByb3h5KTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJBcnJheVByb3h5ID0gaXNFbWJlckFycmF5UHJveHk7XG5cblxuLyoqXG4gKiBDaGVjayB0aGF0IHRoZSB2YWx1ZSBpcyBhIGRlc2NlbmRlbnQgb2YgYW4gRW1iZXIgQ2xhc3NcbiAqIFRPRE86IENoZWNrIHRoYXQgYF8uaXNFbWJlckluc3RhbmNlYCBkb2Vzbid0IGFscmVhZHkgeWllbGQgdGhlIHNhbWUgcmVzdWx0XG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGlzRW1iZXJDb2xsZWN0aW9uXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc0VtYmVyQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHJldHVybiAoXG5cdFx0Xy5pc0VtYmVyT2JqZWN0KHZhbHVlKSB8fFxuXHRcdF8uaXNFbWJlck9iamVjdFByb3h5KHZhbHVlKSB8fFxuXHRcdF8uaXNFbWJlckFycmF5UHJveHkodmFsdWUpXG5cdCk7XG59O1xubG9kYXNoRW1iZXIuaXNFbWJlckNvbGxlY3Rpb24gPSBpc0VtYmVyQ29sbGVjdGlvbjtcblxuXG4vKipcbiAqIENoZWNrIHRoYXQgdmFsdWUgaXMgRW1iZXIgVHJhbnNpdGlvblxuICpcbiAqIEBtZXRob2QgaXNFbWJlclRyYW5zaXRpb25cbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQHNpbmNlIHYwLjUuMlxuICovXG5leHBvcnQgdmFyIGlzRW1iZXJUcmFuc2l0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcblx0cmV0dXJuIChcblx0XHRfLmlzRnVuY3Rpb24odmFsdWUsICd0b1N0cmluZycpICYmXG5cdFx0Xy5jb250YWlucyh2YWx1ZS50b1N0cmluZygpLCAnVHJhbnNpdGlvbicpXG5cdCk7XG59O1xubG9kYXNoRW1iZXIuaXNFbWJlclRyYW5zaXRpb24gPSBpc0VtYmVyVHJhbnNpdGlvbjtcblxuXG4vKipcbiAqIExvZGFzaCBmb3JFYWNoXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIF9mb3JFYWNoXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8U3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqIEBzaW5jZSB2MC41LjJcbiAqL1xuZXhwb3J0IHZhciBfZm9yRWFjaCA9IF8uZm9yRWFjaDtcbmxvZGFzaEVtYmVyLl9mb3JFYWNoID0gX2ZvckVhY2g7XG5cblxuLyoqXG4gKiBPdmVycmlkZSBsb2Rhc2ggYGZvckVhY2hgIHRvIHN1cHBvcnQgZW1iZXIgYXJyYXlzL29iamVjdHNcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgZm9yRWFjaFxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fFN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbmV4cG9ydCB2YXIgZm9yRWFjaCA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG5cdGlmIChfLmlzRW1iZXJBcnJheVByb3h5KGNvbGxlY3Rpb24pKSB7XG5cdFx0cmV0dXJuIGNvbGxlY3Rpb24uZm9yRWFjaChjYWxsYmFjaywgdGhpcyk7XG5cdH1cblx0aWYgKF8uaXNFbWJlck9iamVjdFByb3h5KGNvbGxlY3Rpb24pICYmIF8uaXNPYmplY3QoY29sbGVjdGlvbi5nZXQoJ2NvbnRlbnQnKSkpIHtcblx0XHRyZXR1cm4gX2ZvckVhY2goY29sbGVjdGlvbi5nZXQoJ2NvbnRlbnQnKSwgY2FsbGJhY2ssIHRoaXNBcmcpO1xuXHR9XG5cdHJldHVybiBfZm9yRWFjaChjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZyk7XG59O1xubG9kYXNoRW1iZXIuZm9yRWFjaCA9IGZvckVhY2g7XG5cblxuLyoqXG4gKiBMb2Rhc2ggcmVkdWNlXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIF9yZWR1Y2VcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW2N1cnJlbnRWYWx1ZV0gdmFsdWUgYXQgYmVnaW5uaW5nIG9mIGl0ZXJhdGlvblxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fFN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKiBAc2luY2UgdjEuMS4wXG4gKi9cbmV4cG9ydCB2YXIgX3JlZHVjZSA9IF8ucmVkdWNlO1xubG9kYXNoRW1iZXIuX3JlZHVjZSA9IF9yZWR1Y2U7XG5cblxuLyoqXG4gKiBPdmVycmlkZSBsb2Rhc2ggYHJlZHVjZWAgdG8gc3VwcG9ydCBlbWJlciBhcnJheXMvb2JqZWN0c1xuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCByZWR1Y2VcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW2N1cnJlbnRWYWx1ZV0gdmFsdWUgYXQgYmVnaW5uaW5nIG9mIGl0ZXJhdGlvblxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fFN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKiBAc2luY2UgdjEuMS4wXG4gKi9cbmV4cG9ydCB2YXIgcmVkdWNlID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgY2FsbGJhY2ssIGN1cnJlbnRWYWx1ZSwgdGhpc0FyZykge1xuXHRpZiAoXy5pc0VtYmVyQXJyYXlQcm94eShjb2xsZWN0aW9uKSkge1xuXHRcdHJldHVybiBjb2xsZWN0aW9uLnJlZHVjZShjYWxsYmFjaywgY3VycmVudFZhbHVlLCB0aGlzKTtcblx0fVxuXHRpZiAoXy5pc0VtYmVyT2JqZWN0UHJveHkoY29sbGVjdGlvbikgJiYgXy5pc09iamVjdChjb2xsZWN0aW9uLmdldCgnY29udGVudCcpKSkge1xuXHRcdHJldHVybiBfcmVkdWNlKGNvbGxlY3Rpb24uZ2V0KCdjb250ZW50JyksIGNhbGxiYWNrLCBjdXJyZW50VmFsdWUsIHRoaXNBcmcpO1xuXHR9XG5cdHJldHVybiBfcmVkdWNlKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCBjdXJyZW50VmFsdWUsIHRoaXNBcmcpO1xufTtcbmxvZGFzaEVtYmVyLnJlZHVjZSA9IHJlZHVjZTtcblxuXG4vKipcbiAqIExvZGFzaCBtYXBcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgX21hcFxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fFN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKiBAc2luY2UgdjAuNS4yXG4gKi9cbmV4cG9ydCB2YXIgX21hcCA9IF8ubWFwO1xubG9kYXNoRW1iZXIuX21hcCA9IF9tYXA7XG5cblxuLyoqXG4gKiBPdmVycmlkZSBsb2Rhc2ggYG1hcGAgdG8gc3VwcG9ydCBlbWJlciBhcnJheXMvb2JqZWN0c1xuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBtYXBcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG5leHBvcnQgdmFyIG1hcCA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG5cdGlmIChfLmlzRW1iZXJBcnJheVByb3h5KGNvbGxlY3Rpb24pKSB7XG5cdFx0cmV0dXJuIGNvbGxlY3Rpb24ubWFwKGNhbGxiYWNrLCB0aGlzKTtcblx0fVxuXHRyZXR1cm4gX21hcChjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZyk7XG59O1xubG9kYXNoRW1iZXIubWFwID0gbWFwO1xuXG5cbi8qKlxuICogTG9kYXNoIGRlZXBHZXQgYWxpYXMgdG8gcHJpdmF0ZSBuYW1lc3BhY2VcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgX2RlZXBHZXRcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb2xsZWN0aW9uOiBUaGUgcm9vdCBjb2xsZWN0aW9uIG9mIHRoZSB0cmVlLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHByb3BlcnR5UGF0aDogVGhlIHByb3BlcnR5IHBhdGggaW4gdGhlIGNvbGxlY3Rpb24uXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHZhbHVlLCBvciB1bmRlZmluZWQgaWYgaXQgZG9lc24ndCBleGlzdHMuXG4gKiBAc2luY2UgdjAuNS4yXG4gKi9cbmV4cG9ydCB2YXIgX2RlZXBHZXQgPSBfLmRlZXBHZXQ7XG5sb2Rhc2hFbWJlci5fZGVlcEdldCA9IF9kZWVwR2V0O1xuXG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSB2YWx1ZSBvZiBhIHByb3BlcnR5IGluIGFuIG9iamVjdCB0cmVlLlxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBnZXRcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb2xsZWN0aW9uOiBUaGUgcm9vdCBjb2xsZWN0aW9uIG9mIHRoZSB0cmVlLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHByb3BlcnR5UGF0aDogVGhlIHByb3BlcnR5IHBhdGggaW4gdGhlIGNvbGxlY3Rpb24uXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHZhbHVlLCBvciB1bmRlZmluZWQgaWYgaXQgZG9lc24ndCBleGlzdHMuXG4gKi9cbmV4cG9ydCB2YXIgZ2V0ID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgcHJvcGVydHlQYXRoKSB7XG5cdC8vIEhhbmRsZSBFbWJlciBPYmplY3RzXG5cdGlmIChpc0VtYmVyT2JqZWN0KGNvbGxlY3Rpb24pIHx8IGlzRW1iZXJPYmplY3RQcm94eShjb2xsZWN0aW9uKSkge1xuXHRcdHJldHVybiBjb2xsZWN0aW9uLmdldChwcm9wZXJ0eVBhdGgpO1xuXHR9XG5cblx0cmV0dXJuIF9kZWVwR2V0KC4uLmFyZ3VtZW50cyk7XG59O1xubG9kYXNoRW1iZXIuZ2V0ID0gZ2V0O1xuXG5cbi8qKlxuICogTG9kYXNoIGRlZXBTZXQgYWxpYXMgdG8gcHJpdmF0ZSBuYW1lc3BhY2VcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgX2RlZXBTZXRcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb2xsZWN0aW9uOiBUaGUgcm9vdCBjb2xsZWN0aW9uIG9mIHRoZSB0cmVlLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHByb3BlcnR5UGF0aDogVGhlIHByb3BlcnR5IHBhdGggaW4gdGhlIGNvbGxlY3Rpb24uXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBUaGUgcHJvcGVydHkgcGF0aCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqIEByZXR1cm5zIHsqfSBUaGUgYGNvbGxlY3Rpb25gIHBhc3NlZCBpbiB3aXRoIHZhbHVlIHNldC5cbiAqIEBzaW5jZSB2MC41LjJcbiAqL1xuZXhwb3J0IHZhciBfZGVlcFNldCA9IF8uZGVlcFNldDtcbmxvZGFzaEVtYmVyLl9kZWVwU2V0ID0gX2RlZXBTZXQ7XG5cblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIHZhbHVlIG9mIGEgcHJvcGVydHkgaW4gYW4gb2JqZWN0IHRyZWUuXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIHNldFxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGNvbGxlY3Rpb246IFRoZSByb290IGNvbGxlY3Rpb24gb2YgdGhlIHRyZWUuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gcHJvcGVydHlQYXRoOiBUaGUgcHJvcGVydHkgcGF0aCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIHNldCBvbiB0aGUgY29sbGVjdGlvbi5cbiAqIEByZXR1cm5zIHsqfSBUaGUgYGNvbGxlY3Rpb25gIHBhc3NlZCBpbiB3aXRoIHZhbHVlIHNldC5cbiAqL1xuZXhwb3J0IHZhciBzZXQgPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBwcm9wZXJ0eVBhdGgsIHZhbHVlKSB7XG5cdC8vIEhhbmRsZSBFbWJlciBPYmplY3RzXG5cdGlmIChpc0VtYmVyT2JqZWN0KGNvbGxlY3Rpb24pIHx8IGlzRW1iZXJPYmplY3RQcm94eShjb2xsZWN0aW9uKSkge1xuXHRcdGNvbGxlY3Rpb24uc2V0KHByb3BlcnR5UGF0aCwgdmFsdWUpO1xuXHRcdHJldHVybiBjb2xsZWN0aW9uO1xuXHR9XG5cblx0cmV0dXJuIF9kZWVwU2V0KC4uLmFyZ3VtZW50cyk7XG59O1xubG9kYXNoRW1iZXIuc2V0ID0gc2V0O1xuXG5cbi8vIERvbid0IHVzZSB0aGUgZGVlcCBwcmVmaXguXG4vLyBJZiBuZWNlc3NhcnksIHlvdSBjYW4gYWNjZXNzIHRoZSByYXcgZnVuY3Rpb24gYXQgYF8uX2RlZXBHZXRgXG4oKCkgPT4ge1xuXHRkZWxldGUgXy5kZWVwR2V0O1xuXHRkZWxldGUgXy5kZWVwU2V0O1xufSkoKTtcblxuXG4vKipcbiAqIE9yaWdpbmFsIGxvZGFzaCBpc0VtcHR5XG4gKlxuICogQG5hbWVzcGFjZSAgX1xuICogQG1ldGhvZCBfaXNFbXB0eVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBzaW5jZSB2MC41LjNcbiAqL1xuZXhwb3J0IHZhciBfaXNFbXB0eSA9IF8uaXNFbXB0eTtcbmxvZGFzaEVtYmVyLl9pc0VtcHR5ID0gX2lzRW1wdHk7XG5cblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIHRoZSB2YWx1ZSBpcyBlbXB0eSBvciBub3RcbiAqXG4gKiBAbmFtZXNwYWNlICBfXG4gKiBAbWV0aG9kIGlzRW1wdHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAc2luY2UgdjAuNS4zXG4gKi9cbmV4cG9ydCB2YXIgaXNFbXB0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmIChcblx0XHRfLmlzRW1iZXJBcnJheVByb3h5KHZhbHVlKSAmJlxuXHRcdF8uaXNGdW5jdGlvbih2YWx1ZS5pc0VtcHR5KVxuXHQpIHtcblx0XHRyZXR1cm4gdmFsdWUuaXNFbXB0eSgpO1xuXHR9XG5cblx0cmV0dXJuIF9pc0VtcHR5KC4uLmFyZ3VtZW50cyk7XG59O1xubG9kYXNoRW1iZXIuaXNFbXB0eSA9IGlzRW1wdHk7XG5cblxuLyoqXG4gKiBPcmlnaW5hbCBsb2Rhc2ggY2xvbmVcbiAqXG4gKiBAbmFtZXNwYWNlICBfXG4gKiBAbWV0aG9kIF9jbG9uZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7Kn1cbiAqIEBzaW5jZSB2MS4wLjBcbiAqL1xuZXhwb3J0IHZhciBfY2xvbmUgPSBfLmNsb25lO1xubG9kYXNoRW1iZXIuX2Nsb25lID0gX2Nsb25lO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIGNsb25lZCBjb3B5IG9mIHZhbHVlXG4gKlxuICogQG5hbWVzcGFjZSAgX1xuICogQG1ldGhvZCBjbG9uZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7Kn1cbiAqIEBzaW5jZSB2MS4wLjBcbiAqL1xuZXhwb3J0IHZhciBjbG9uZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdGlmIChfLmlzV2lsZGNhdE9iamVjdCh2YWx1ZSkpIHtcblx0XHRyZXR1cm4gdmFsdWUuY2xvbmUoKTtcblx0fVxuXG5cdHJldHVybiBfY2xvbmUoLi4uYXJndW1lbnRzKTtcbn07XG5sb2Rhc2hFbWJlci5jbG9uZSA9IGNsb25lO1xuXG5cbi8qKlxuICogQWxpYXMgZm9yIGBhcnJheS5wb3BgIG9yIGBhcnJheVByb3h5LnBvcE9iamVjdGBcbiAqXG4gKiBAbmFtZXNwYWNlICBfXG4gKiBAbWV0aG9kIHBvcFxuICogQHBhcmFtIHtBcnJheXxFbWJlci5BcnJheVByb3h5fSB2YWx1ZVxuICogQHJldHVybiB7Kn1cbiAqIEBzaW5jZSB2MS4zLjBcbiAqL1xuZXhwb3J0IHZhciBwb3AgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRyZXR1cm4gKF8uaXNFbWJlckFycmF5UHJveHkodmFsdWUpKSA/IHZhbHVlLnBvcE9iamVjdCgpIDogdmFsdWUucG9wKCk7XG59O1xubG9kYXNoRW1iZXIucG9wID0gcG9wO1xuXG5cbi8qKlxuICogQWxpYXMgZm9yIGBhcnJheS5zaGlmdGAgb3IgYGFycmF5UHJveHkuc2hpZnRPYmplY3RgXG4gKlxuICogQG5hbWVzcGFjZSAgX1xuICogQG1ldGhvZCBzaGlmdFxuICogQHBhcmFtIHtBcnJheXxFbWJlci5BcnJheVByb3h5fSB2YWx1ZVxuICogQHJldHVybiB7Kn1cbiAqIEBzaW5jZSB2MS4zLjBcbiAqL1xuZXhwb3J0IHZhciBzaGlmdCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHJldHVybiAoXy5pc0VtYmVyQXJyYXlQcm94eSh2YWx1ZSkpID8gdmFsdWUuc2hpZnRPYmplY3QoKSA6IHZhbHVlLnNoaWZ0KCk7XG59O1xubG9kYXNoRW1iZXIuc2hpZnQgPSBzaGlmdDtcblxuXG4vKipcbiAqIEVtYmVyIGB0eXBlT2ZgIGFsaWFzXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIHR5cGVPZlxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge1N0cmluZ30gVGhlIHR5cGUgb2YgYHZhbHVlYFxuICovXG5leHBvcnQgdmFyIHR5cGVPZiA9ICh2YWx1ZSkgPT4gRW1iZXIudHlwZU9mKHZhbHVlKTtcbmxvZGFzaEVtYmVyLnR5cGVPZiA9IHR5cGVPZjtcblxuXG5leHBvcnQgdmFyIGxvZGFzaEVtYmVyO1xuZXhwb3J0IGRlZmF1bHQgbG9kYXNoRW1iZXI7XG4iLCJpbXBvcnQgbG9kYXNoVXRpbHMgZnJvbSAnLi9fY29yZS9sb2Rhc2gtdXRpbHMnO1xuXG5cbi8qKlxuICogQ29sbGVjdGlvbiBvZiBhbGwgdGhlIHV0aWxzIGluIGhlcmUuIEFkZCB0byB0aGlzIGFzIHlvdSBnby5cbiAqL1xubGV0IGxvZGFzaEV4dHJhcyA9IHt9O1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNoZWNrIGlmIGEgdmFyaWFibGUgaXMgZGVmaW5lZCBhbmQgcHJlc2VudFxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBpc1ByZXNlbnRcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzUHJlc2VudCA9ICh2YWx1ZSkgPT4gKCFfLmlzVW5kZWZpbmVkKHZhbHVlKSAmJiAhXy5pc051bGwodmFsdWUpKTtcbmxvZGFzaEV4dHJhcy5pc1ByZXNlbnQgPSBpc1ByZXNlbnQ7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY2hlY2sgaWYgYSB2YXJpYWJsZSBpcyBkZWZpbmVkIGFuZCBwcmVzZW50XG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGlzQmxhbmtcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzQmxhbmsgPSAodmFsdWUpID0+ICFfLmlzUHJlc2VudCh2YWx1ZSk7XG5sb2Rhc2hFeHRyYXMuaXNCbGFuayA9IGlzQmxhbms7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY2hlY2sgaWYgYSB2YXJpYWJsZSBpcyBhIHByb21pc2VcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgaXNQcm9taXNlXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc1Byb21pc2UgPSAodmFsdWUpID0+IF8uaXNGdW5jdGlvbih2YWx1ZSwgJ3RoZW4nKTtcbmxvZGFzaEV4dHJhcy5pc1Byb21pc2UgPSBpc1Byb21pc2U7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY2hlY2sgYSB2YWx1ZSBmb3IgYW4gYXJyYXkgb2YgTG9EYXNoIGJvb2xlYW4gY29uZGl0aW9uc1xuICogVE9ETzogTmFtZSB0aGlzIGBpc0FuZGAgYW5kIGNyZWF0ZSBgaXNPcmAuLi5cbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgaXNcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcGFyYW0ge0FycmF5fSBjb25kaXRpb25zOiBMb0Rhc2ggbWV0aG9kcyB0byBoYXZlIHZhbHVlIHRlc3RlZCBhZ2FpbnN0IChhcyBzdHJpbmdzKVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpcyA9IGZ1bmN0aW9uKHZhbHVlLCBjb25kaXRpb25zKSB7XG5cdGlmIChfLmlzU3RyaW5nKGNvbmRpdGlvbnMpKSBjb25kaXRpb25zID0gW2NvbmRpdGlvbnNdO1xuXHRpZiAoXy5pc1ByZXNlbnQoY29uZGl0aW9ucykgJiYgIV8uaXNBcnJheShjb25kaXRpb25zKSkgY29uZGl0aW9ucyA9IFtdO1xuXHRpZiAoY29uZGl0aW9ucy5sZW5ndGggPD0gMSkgY29uc29sZS5lcnJvcihcIkRvbid0IGNhbGwgYGlzYCBoZWxwZXIgd2l0aCBqdXN0IG9uZSBjb25kaXRpb24tIHVzZSB0aGF0IGNvbmRpdGlvbiBkaXJlY3RseVwiKTtcblx0cmV0dXJuIF8uZXZlcnkoY29uZGl0aW9ucywgZnVuY3Rpb24oY29uZGl0aW9uKSB7XG5cdFx0bGV0IHJlc3VsdCwgbm90O1xuXG5cdFx0Ly8gQ2hlY2sgZm9yIHZhbGlkIGNvbmRpdGlvblxuXHRcdGlmICghXy5pc1N0cmluZyhjb25kaXRpb24pKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJgY29uZGl0aW9uYCB3YXMgbm90IGEgc3RyaW5nOiBcIiArIGNvbmRpdGlvbik7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gSGFuZGxlIG5vdCBjb25kaXRpb25cblx0XHRub3QgPSBmYWxzZTtcblx0XHRpZiAoXy5zdGFydHNXaXRoKGNvbmRpdGlvbiwgJyEnKSkge1xuXHRcdFx0bm90ID0gdHJ1ZTtcblx0XHRcdGNvbmRpdGlvbiA9IGNvbmRpdGlvbi5yZXBsYWNlKCchJywgJycpO1xuXHRcdH1cblxuXHRcdC8vIEJlIEVYVFJBICh0b28pIGhlbHBmdWwgKHByZXBlbmQgJ2lzJyBpZiBvbW1pdHRlZClcblx0XHRpZiAoIV8uc3RhcnRzV2l0aChjb25kaXRpb24sICdpcycpKSB7XG5cdFx0XHRjb25kaXRpb24gPSAnaXMnICsgY29uZGl0aW9uO1xuXHRcdH1cblxuXHRcdC8vIE1ha2Ugc3VyZSBgY29uZGl0aW9uYCBpcyBhIHZhbGlkIGxvZGFzaCBtZXRob2Rcblx0XHRpZiAoIV8uaXNGdW5jdGlvbihfW2NvbmRpdGlvbl0pKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oXCJgY29uZGl0aW9uYCB3YXMgbm90IGEgdmFsaWQgbG9kYXNoIG1ldGhvZDogXCIgKyBjb25kaXRpb24pO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVybWluZSByZXN1bHQgYW5kIHJldHVyblxuXHRcdHJlc3VsdCA9IF9bY29uZGl0aW9uXSh2YWx1ZSk7XG5cdFx0aWYgKG5vdCA9PT0gdHJ1ZSkgcmV0dXJuICFyZXN1bHQ7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9KTtcbn07XG5sb2Rhc2hFeHRyYXMuaXMgPSBpcztcblxuXG4vKipcbiAqIEdlbmVyYXRlIGBlbnN1cmVgIG1ldGhvZHMtIEVuc3VyZSB0aGF0IHZhbHVlIGlzIG9mIHR5cGUgeFxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBlbnN1cmV7VHlwZX1cbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFRvIGNoZWNrXG4gKiBAcGFyYW0geyp9IFt2YWx1ZURlZmF1bHQ9ZGVmYXVsdHNbY29uZGl0aW9uXTogV2hhdCB0byBkZWZhdWx0IHRvXG4gKiBAcmV0dXJuIHsqfSBFbnN1cmVkIHZhbHVlXG4gKiBAc2luY2UgdjEuMy4wXG4gKi9cbl8uZm9yRWFjaChfLmtleXMobG9kYXNoVXRpbHMudHlwZURlZmF1bHRzKCkpLCAodHlwZSkgPT4ge1xuXHRsb2Rhc2hFeHRyYXNbYGVuc3VyZSR7dHlwZX1gXSA9IGxvZGFzaFV0aWxzLm1ha2VFbnN1cmVUeXBlKHR5cGUpO1xufSk7XG5cblxuLyoqXG4gKiBKYXZhc2NyaXB0IGB0eXBlb2ZgIGFsaWFzXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIHR5cGVPZlxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge1N0cmluZ30gVGhlIHR5cGUgb2YgYHZhbHVlYFxuICovXG5leHBvcnQgdmFyIHR5cGVPZiA9ICh2YWx1ZSkgPT4gdHlwZW9mKHZhbHVlKTtcbmxvZGFzaEV4dHJhcy50eXBlT2YgPSB0eXBlT2Y7XG5cblxuZXhwb3J0IGRlZmF1bHQgbG9kYXNoRXh0cmFzO1xuIl19
