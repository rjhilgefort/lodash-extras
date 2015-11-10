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
(function () {
  // Get all `is` methods from standard lodash
  _coreLodashUtils2['default'].buildIsMethods(_, lodashDeepExtras);

  // Make sure "extra" `is` methods are added as well
  _coreLodashUtils2['default'].buildIsMethods(_lodashExtras2['default'], lodashDeepExtras);

  // Make sure "ember" `is` methods are added as well
  _coreLodashUtils2['default'].buildIsMethods(_lodashEmber2['default'], lodashDeepExtras);
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
// import Ember from 'ember';
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
 * isEmberArray has been excluded as Ember.Array is not an Ember.Object
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcmpoaWxnZWZvcnQvRHJvcGJveC9Qcm9qZWN0cy9sb2Rhc2gtZXh0cmFzL3NyYy9fY29yZS9sb2Rhc2gtdXRpbHMuanMiLCIvVXNlcnMvcmpoaWxnZWZvcnQvRHJvcGJveC9Qcm9qZWN0cy9sb2Rhc2gtZXh0cmFzL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1kZWVwLWV4dHJhcy5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1lbWJlci5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1leHRyYXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0dBLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7O0FBVWQsSUFBSSxZQUFZLEdBQUcsU0FBZixZQUFZLEdBQVM7QUFDL0IsU0FBTztBQUNOLFlBQVEsRUFBRSxFQUFFO0FBQ1osV0FBTyxFQUFFLEVBQUU7QUFDWCxpQkFBYSxFQUFFLEVBQUU7QUFDakIsYUFBUyxFQUFFLEtBQUs7QUFDaEIsWUFBUSxFQUFFLENBQUM7R0FDWCxDQUFDO0NBQ0YsQ0FBQzs7QUFDRixXQUFXLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQzs7Ozs7Ozs7OztBQVdqQyxJQUFJLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBSSxLQUFLLEVBQUs7QUFDbEMsU0FBTyxVQUFTLEtBQUssRUFBRTtBQUN0QixXQUFRLEtBQUssWUFBWSxLQUFLLENBQUU7R0FDaEMsQ0FBQztDQUNGLENBQUM7O0FBQ0YsV0FBVyxDQUFDLFVBQVUsR0FBRyxVQUFVLENB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Q0FBQztDQUNqRSxDQUFDLENBQUM7Ozs7Ozs7Ozs7QUFXSSxJQUFJLE1BQU0sR0FBRyxTQUFULE1BQU0sQ0FBSSxLQUFLO1NBQUssT0FBTyxLQUFLLEFBQUM7Q0FBQSxDQUFDOztBQUM3QyxZQUFZLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7cUJBR2QsWUFBWSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENvbGxlY3Rpb24gb2YgYWxsIHRoZSB1dGlscyBpbiBoZXJlLiBBZGQgdG8gdGhpcyBhcyB5b3UgZ28uXG4gKi9cbmxldCBsb2Rhc2hVdGlscyA9IHt9O1xuXG5cbi8qKlxuICogSGVscGVyIGZvciBKUyB0eXBlcyBhbmQgZGVmYXVsdHMgZm9yIGVhY2ggdHlwZVxuICpcbiAqIEBtZXRob2QgdHlwZURlZmF1bHRzXG4gKiBAcmV0dXJuIHtQbGFpbk9iamVjdH1cbiAqIEBzaW5jZSB2MS4zLjBcbiAqL1xuZXhwb3J0IHZhciB0eXBlRGVmYXVsdHMgPSAoKSA9PiB7XG5cdHJldHVybiB7XG5cdFx0J1N0cmluZyc6ICcnLFxuXHRcdCdBcnJheSc6IFtdLFxuXHRcdCdQbGFpbk9iamVjdCc6IHt9LFxuXHRcdCdCb29sZWFuJzogZmFsc2UsXG5cdFx0J051bWJlcic6IDFcblx0fTtcbn07XG5sb2Rhc2hVdGlscy50eXBlRGVmYXVsdHMgPSB0eXBlRGVmYXVsdHM7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gbWFrZSBgXy5pc0VtYmVye0NsYXNzfWBcbiAqXG4gKiBAbWV0aG9kIG1ha2VJc1R5cGVcbiAqIEBwYXJhbSB7Kn0ga2xhc3M6IEEgY2xhc3MgdG8gY2hlY2sgaW5zdGFuY2VvZiBhZ2FpbnN0XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBzaW5jZSB2MC41LjJcbiAqL1xuZXhwb3J0IHZhciBtYWtlSXNUeXBlID0gKGtsYXNzKSA9PiB7XG5cdHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuXHRcdHJldHVybiAodmFsdWUgaW5zdGFuY2VvZiBrbGFzcyk7XG5cdH07XG59O1xubG9kYXNoVXRpbHMubWFrZUlzVHlwZSA9IG1ha2VJc1R5cGU7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gbWFrZSBgXy5lbnN1cmVUeXBlYFxuICpcbiAqIEBtZXRob2QgbWFrZUVuc3VyZVR5cGVcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb25kaXRpb246IExvZGFzaCBtZXRob2QgdG8gYXBwbHlcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQHNpbmNlIHYxLjMuMFxuICovXG5leHBvcnQgdmFyIG1ha2VFbnN1cmVUeXBlID0gKGNvbmRpdGlvbikgPT4ge1xuXHRsZXQgZGVmYXVsdHMgPSBsb2Rhc2hVdGlscy50eXBlRGVmYXVsdHMoKTtcblxuXHQvLyBDaGVjayBwYXJhbXM6IGNvbmRpdGlvblxuXHRpZiAoIV8uaXNTdHJpbmcoY29uZGl0aW9uKSkgY29uZGl0aW9uID0gJyc7XG5cdGNvbmRpdGlvbiA9IF8uY2FwaXRhbGl6ZShjb25kaXRpb24pO1xuXHRpZiAoIV8uY29udGFpbnMoXy5rZXlzKGRlZmF1bHRzKSwgY29uZGl0aW9uKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcihgXFxgY29uZGl0aW9uXFxgIG5vdCBzdXBwb3J0ZWQ6ICR7Y29uZGl0aW9ufWApO1xuXHR9XG5cblx0Ly8gU2hvcnRjdXRcblx0bGV0IGlzQ29uZGl0aW9uID0gX1tgaXMke2NvbmRpdGlvbn1gXTtcblxuXHQvKipcblx0ICogSW50ZXJmYWNlIGZvciBgZW5zdXJlVHlwZWAgbWV0aG9kc1xuXHQgKlxuXHQgKiBAbWV0aG9kIGBlbnN1cmUke3R5cGV9YFxuXHQgKiBAcGFyYW0geyp9IHZhbHVlOiBUbyBjaGVja1xuXHQgKiBAcGFyYW0geyp9IFt2YWx1ZURlZmF1bHQ9ZGVmYXVsdHNbY29uZGl0aW9uXTogV2hhdCB0byBkZWZhdWx0IHRvXG5cdCAqIEByZXR1cm4geyp9IERlZmF1bHRlZCB2YWx1ZSwgb3IgdGhlIHZhbHVlIGl0c2VsZiBpZiBwYXNzXG5cdCAqIEBzaW5jZSB2MS4zLjBcblx0ICovXG5cdHJldHVybiAodmFsdWUsIHZhbHVlRGVmYXVsdCkgPT4ge1xuXHRcdC8vIERldGVybWluZSBgdmFsdWVEZWZhdWx0YDogaWYgbm90aGluZyBwcm92aWRlZCwgb3IgcHJvdmlkZWQgZG9lc24ndCBtYXRjaCB0eXBlXG5cdFx0aWYgKF8uaXNVbmRlZmluZWQodmFsdWVEZWZhdWx0KSB8fCAhaXNDb25kaXRpb24odmFsdWVEZWZhdWx0KSkge1xuXHRcdFx0dmFsdWVEZWZhdWx0ID0gXy5jbG9uZShkZWZhdWx0c1tjb25kaXRpb25dKTtcblx0XHR9XG5cblx0XHQvLyBBY3R1YWwgXCJlbnN1cmVcIiBjaGVja1xuXHRcdGlmICghX1tgaXMke2NvbmRpdGlvbn1gXSh2YWx1ZSkpIHZhbHVlID0gdmFsdWVEZWZhdWx0O1xuXG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9O1xufTtcbmxvZGFzaFV0aWxzLm1ha2VFbnN1cmVUeXBlID0gbWFrZUVuc3VyZVR5cGU7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gbWFrZSBgXy5kZWVwRW5zdXJle1R5cGV9YFxuICpcbiAqIEBtZXRob2QgbWFrZURlZXBFbnN1cmVUeXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25kaXRpb246IExvZGFzaCBtZXRob2QgdG8gYXBwbHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWVEZWZhdWx0OiBXaGF0IHRvIGFzc2lnbiB3aGVuIG5vdCBvZiB0aGUgZGVzaXJlZCB0eXBlXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBzaW5jZSB2MC41LjJcbiAqL1xuZXhwb3J0IHZhciBtYWtlRGVlcEVuc3VyZVR5cGUgPSAoY29uZGl0aW9uKSA9PiB7XG5cdHJldHVybiAoY29sbGVjdGlvbiwgcHJvcFN0cmluZywgdmFsdWVEZWZhdWx0KSA9PiB7XG5cdFx0cmV0dXJuIF8uc2V0KFxuXHRcdFx0Y29sbGVjdGlvbixcblx0XHRcdHByb3BTdHJpbmcsXG5cdFx0XHRsb2Rhc2hVdGlscy5tYWtlRW5zdXJlVHlwZShjb25kaXRpb24pKFxuXHRcdFx0XHRfLmdldChjb2xsZWN0aW9uLCBwcm9wU3RyaW5nKSxcblx0XHRcdFx0dmFsdWVEZWZhdWx0XG5cdFx0XHQpXG5cdFx0KTtcblx0fTtcbn07XG5sb2Rhc2hVdGlscy5tYWtlRGVlcEVuc3VyZVR5cGUgPSBtYWtlRGVlcEVuc3VyZVR5cGU7XG5cblxuLyoqXG4gKiBEZXRlcm1pbmVkIGlmIGxvZGFzaCBrZXkvbWV0aG9kIGlzIHZhbGlkIHRvIG1ha2UgZGVlcCAoYGlzYCBtZXRob2RzIHRoYXQgb25seSBoYXZlIG9uZSBhcmd1bWVudClcbiAqIE5PVEU6IEFzc3VtZXMgYHRoaXNgID09PSBpcyB0aGUgbmFtZXNwYWNlIHRvIGNoZWNrIGZvciB0aGUgZnVuY3Rpb24gb25cbiAqXG4gKiBAbWV0aG9kIHZhbGlkSXNNZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXk6IG1ldGhvZCBuYW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIHZhbGlkSXNNZXRob2QgPSBmdW5jdGlvbihrZXkpIHtcbiAgcmV0dXJuIChcbiAgICBfLnN0YXJ0c1dpdGgoa2V5LCAnaXMnKSAmJlxuICAgICh0aGlzW2tleV0ubGVuZ3RoID09PSAxKVxuICApO1xufTtcbmxvZGFzaFV0aWxzLnZhbGlkSXNNZXRob2QgPSB2YWxpZElzTWV0aG9kO1xuXG5cbi8qKlxuICogRmlsdGVyIG91dCBhbGwgdmFsaWQgYGlzYCBtZXRob2RzIGZyb20gYSBuYW1lc3BhY2VcbiAqXG4gKiBAbWV0aG9kIGZpbHRlcklzTWV0aG9kc1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZTogQ29sbGVjdGlvbiBvZiBtZXRob2RzXG4gKiBAcmV0dXJuIHtPYmplY3R9IGBuYW1lc3BhY2VgIHdpdGgganVzdCB0aGUgXCJpc1wiIG1ldGhvZHNcbiAqL1xuZXhwb3J0IHZhciBmaWx0ZXJJc01ldGhvZHMgPSAobmFtZXNwYWNlKSA9PiB7XG4gIHJldHVybiBfLmNoYWluKG5hbWVzcGFjZSlcbiAgICAua2V5cygpXG4gICAgLmZpbHRlcih2YWxpZElzTWV0aG9kLCBuYW1lc3BhY2UpXG4gICAgLnZhbHVlKCk7XG59O1xubG9kYXNoVXRpbHMuZmlsdGVySXNNZXRob2RzID0gZmlsdGVySXNNZXRob2RzO1xuXG5cbi8qKlxuICogT3ZlcmxvYWQgbm9ybWFsIGxvZGFzaCBtZXRob2RzIHRvIGhhbmRsZSBkZWVwIHN5bnRheFxuICogVE9ETzogTm8gbmVlZCB0byB0YWtlIHRoZSBmaXJzdCBwYXJhbVxuICpcbiAqIEBtZXRob2Qgb3ZlcmxvYWRNZXRob2RzXG4gKiBAcGFyYW0ge09iamVjdH0gaXNNZXRob2RzOiBDb2xsZWN0aW9uIG9mIGlzIG1ldGhvZHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2U6IE9yaWdpbmFsIG5hbWVzcGFjZSBpc01ldGhvZHMgY2FtZSBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0OiBuYW1lc3BhY2UgdG8gb3ZlcmxvYWQgbWV0aG9kcyBvblxuICogQHJldHVybiB7VW5kZWZpbmVkfVxuICovXG5leHBvcnQgdmFyIG92ZXJsb2FkTWV0aG9kcyA9IChpc01ldGhvZHMsIG5hbWVzcGFjZSwgdGFyZ2V0KSA9PiB7XG4gIGxldCBvbGRNZXRob2QgPSB7fTtcblxuICBfLmZvckVhY2goaXNNZXRob2RzLCAobWV0aG9kKSA9PiB7XG4gICAgLy8gU2F2ZSBvbGQgbWV0aG9kXG4gICAgb2xkTWV0aG9kW21ldGhvZF0gPSBuYW1lc3BhY2VbbWV0aG9kXTtcblxuICAgIC8vIE1ha2UgbmV3IG1ldGhvZCB0aGF0IGFsc28gaGFuZGxlcyBgZGVlcEdldGAuIEFwcGx5IG1ldGhvZCB0byBleHBvcnRzLlxuICAgIHRhcmdldFttZXRob2RdID0gZnVuY3Rpb24odmFsdWUsIHByb3BTdHJpbmcpIHtcbiAgICAgIGlmIChfLnNpemUoYXJndW1lbnRzKSA9PT0gMikge1xuICAgICAgICByZXR1cm4gbmFtZXNwYWNlW21ldGhvZF0oXy5nZXQoLi4uYXJndW1lbnRzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb2xkTWV0aG9kW21ldGhvZF0oLi4uYXJndW1lbnRzKTtcbiAgICB9O1xuICB9KTtcbn07XG5sb2Rhc2hVdGlscy5vdmVybG9hZE1ldGhvZHMgPSBvdmVybG9hZE1ldGhvZHM7XG5cblxuLyoqXG4gKiBCdWlsZCBgaXNNZXRob2RzYFxuICpcbiAqIEBtZXRob2QgYnVpbGRJc01ldGhvZHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2U6IE5hbWVzcGFjZSB0byBwdWxsIGBpc2AgbWV0aG9kcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0OiBuYW1lc3BhY2UgdG8gb3ZlcmxvYWQgbWV0aG9kcyBvblxuICogQHJldHVybiB7VW5kZWZpbmVkfVxuICovXG5leHBvcnQgdmFyIGJ1aWxkSXNNZXRob2RzID0gKG5hbWVzcGFjZSwgdGFyZ2V0KSA9PiB7XG4gIG92ZXJsb2FkTWV0aG9kcyhmaWx0ZXJJc01ldGhvZHMobmFtZXNwYWNlKSwgbmFtZXNwYWNlLCB0YXJnZXQpO1xufVxubG9kYXNoVXRpbHMuYnVpbGRJc01ldGhvZHMgPSBidWlsZElzTWV0aG9kcztcblxuXG5leHBvcnQgZGVmYXVsdCBsb2Rhc2hVdGlscztcbiIsImltcG9ydCBsb2Rhc2hFeHRyYXMgZnJvbSAnLi9sb2Rhc2gtZXh0cmFzJztcbmltcG9ydCBsb2Rhc2hEZWVwRXh0cmFzIGZyb20gJy4vbG9kYXNoLWRlZXAtZXh0cmFzJztcbi8vIGltcG9ydCBsb2Rhc2hFbWJlciBmcm9tICcuL2xvZGFzaC1lbWJlcic7XG5cbl8ubWl4aW4obG9kYXNoRXh0cmFzKTtcbl8ubWl4aW4obG9kYXNoRGVlcEV4dHJhcyk7XG4vLyBfLm1peGluKGxvZGFzaEVtYmVyKTtcbiIsImltcG9ydCBsb2Rhc2hVdGlscyBmcm9tICcuL19jb3JlL2xvZGFzaC11dGlscyc7XG5pbXBvcnQgbG9kYXNoRXh0cmFzIGZyb20gJy4vbG9kYXNoLWV4dHJhcyc7XG5pbXBvcnQgbG9kYXNoRW1iZXIgZnJvbSAnLi9sb2Rhc2gtZW1iZXInO1xuXG5cbi8vIEFsbCBsb2Rhc2ggZXh0cmFEZWVwIG1ldGhvZHMgdG8gZXhwb3J0XG5sZXQgbG9kYXNoRGVlcEV4dHJhcyA9IHt9O1xuXG5cbi8qKlxuICogR2VuZXJhdGUgYGRlZXBJc2AgbWV0aG9kcyBhbmQgb3ZlcnJpZGUgc3RhbmRhcmQgbWV0aG9kcyB0byBoYW5kbGUgYm90aFxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBpc3tDb25kaXRpb259XG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWU6IEJhc2UgdmFsdWUgdG8gbG9vayB0aHJvdWdoXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcFN0cmluZzogUHJvcGVydHkgc3RyaW5nIHRvIGFwcGx5IHRvIGRlZXBHZXRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbigoKSA9PiB7XG4gIC8vIEdldCBhbGwgYGlzYCBtZXRob2RzIGZyb20gc3RhbmRhcmQgbG9kYXNoXG4gIGxvZGFzaFV0aWxzLmJ1aWxkSXNNZXRob2RzKF8sIGxvZGFzaERlZXBFeHRyYXMpO1xuXG5cdC8vIE1ha2Ugc3VyZSBcImV4dHJhXCIgYGlzYCBtZXRob2RzIGFyZSBhZGRlZCBhcyB3ZWxsXG4gIGxvZGFzaFV0aWxzLmJ1aWxkSXNNZXRob2RzKGxvZGFzaEV4dHJhcywgbG9kYXNoRGVlcEV4dHJhcyk7XG5cblx0Ly8gTWFrZSBzdXJlIFwiZW1iZXJcIiBgaXNgIG1ldGhvZHMgYXJlIGFkZGVkIGFzIHdlbGxcbiAgbG9kYXNoVXRpbHMuYnVpbGRJc01ldGhvZHMobG9kYXNoRW1iZXIsIGxvZGFzaERlZXBFeHRyYXMpO1xufSkoKTtcblxuXG4vKipcbiAqIEdlbmVyYXRlIGBlbnN1cmVgIG1ldGhvZHMtIEVuc3VyZSB0aGF0IHZhbHVlIGlzIG9mIHR5cGUgeCwgZGVlcGx5XG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGRlZXBFbnN1cmV7VHlwZX1cbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb2xsZWN0aW9uOiBUaGUgcm9vdCBjb2xsZWN0aW9uIG9mIHRoZSB0cmVlLlxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BTdHJpbmc6IE5lc3RlZCBwcm9wZXJ0eSBwYXRoIG9mIHZhbHVlIHRvIGNoZWNrXG4gKiBAcGFyYW0geyp9IFt2YWx1ZURlZmF1bHQ9ZGVmYXVsdHNbY29uZGl0aW9uXTogV2hhdCB0byBkZWZhdWx0IHRvXG4gKiBAcmV0dXJuIHsqfSBDb2xsZWN0aW9uLCB3aXRoIGVuc3VyZWQgcHJvcGVydHlcbiAqIEBzaW5jZSB2MS4zLjBcbiAqL1xuXy5mb3JFYWNoKF8ua2V5cyhsb2Rhc2hVdGlscy50eXBlRGVmYXVsdHMoKSksICh0eXBlKSA9PiB7XG5cdGxvZGFzaEV4dHJhc1tgZGVlcEVuc3VyZSR7dHlwZX1gXSA9IGxvZGFzaFV0aWxzLm1ha2VEZWVwRW5zdXJlVHlwZSh0eXBlKTtcbn0pO1xuXG5cbi8qKlxuICogVE9ETzogVEVTVCBURVNUIFRFU1QuIFRoaXMgaXMgZXhwZXJpbWVudGFsIChXSVApXG4gKiBEZWxldGUgZGVlcGx5IG5lc3RlZCBwcm9wZXJ0aWVzIHdpdGhvdXQgY2hlY2tpbmcgZXhpc3RlbmNlIGRvd24gdGhlIHRyZWUgZmlyc3RcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgZGVlcERlbGV0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wU3RyaW5nOiBQcm9wZXJ0eSBzdHJpbmcgdG8gYXBwbHkgdG8gZGVlcEdldFxuICogQHJldHVybiB7dW5kZWZpbmVkfSBEb2Vzbid0IHJldHVybiBzdWNjZXNzL2ZhaWx1cmUsIHRvIG1hdGNoIGBkZWxldGVgJ3MgcmV0dXJuXG4gKi9cbmV4cG9ydCB2YXIgZGVlcERlbGV0ZSA9IGZ1bmN0aW9uKHZhbHVlLCBwcm9wU3RyaW5nKSB7XG5cdGxldCBjdXJyZW50VmFsdWUsIGk7XG5cblx0Ly8gRGVsZXRlIGlmIHByZXNlbnRcblx0aWYgKF8uaXNQcmVzZW50KHZhbHVlLCBwcm9wU3RyaW5nKSkge1xuXHRcdGN1cnJlbnRWYWx1ZSA9IHZhbHVlO1xuXHRcdHByb3BTdHJpbmcgPSBfKHByb3BTdHJpbmcpLnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCAocHJvcFN0cmluZy5sZW5ndGggLSAxKTsgaSsrKSB7XG5cdFx0XHRjdXJyZW50VmFsdWUgPSBjdXJyZW50VmFsdWVbcHJvcFN0cmluZ1tpXV07XG5cdFx0fVxuXG5cdFx0ZGVsZXRlIGN1cnJlbnRWYWx1ZVtwcm9wU3RyaW5nW2ldXTtcblx0fVxufTtcbmxvZGFzaERlZXBFeHRyYXMuZGVlcERlbGV0ZSA9IGRlZXBEZWxldGU7XG5cblxuZXhwb3J0IGRlZmF1bHQgbG9kYXNoRGVlcEV4dHJhcztcbiIsIi8vIGltcG9ydCBFbWJlciBmcm9tICdlbWJlcic7XG5pbXBvcnQgbG9kYXNoVXRpbHMgZnJvbSAnLi9fY29yZS9sb2Rhc2gtdXRpbHMnO1xuXG5cbi8qKlxuICogQ29sbGVjdGlvbiBvZiBhbGwgdGhlIHV0aWxzIGluIGhlcmUuIEFkZCB0byB0aGlzIGFzIHlvdSBnby5cbiAqL1xuZXhwb3J0IHZhciBsb2Rhc2hFbWJlciA9IHt9O1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhIHZhbHVlIGlzIGFuIGluc3RhbmNlLCBhcyBkZXNpZ25hdGVkIGJ5IEVtYmVyXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGlzSW5zdGFuY2VcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzRW1iZXJJbnN0YW5jZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHJldHVybiAoRW1iZXIudHlwZU9mKHZhbHVlKSA9PT0gJ2luc3RhbmNlJyk7XG59O1xubG9kYXNoRW1iZXIuaXNFbWJlckluc3RhbmNlID0gaXNFbWJlckluc3RhbmNlO1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhIHZhbHVlIGlzLCBhdCBsZWFzdCwgYSBzdWJjbGFzcyBvZiBFbWJlci5PYmplY3RcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgaXNFbWJlck9iamVjdFxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNFbWJlck9iamVjdCA9IGxvZGFzaFV0aWxzLm1ha2VJc1R5cGUoRW1iZXIuT2JqZWN0KTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJPYmplY3QgPSBpc0VtYmVyT2JqZWN0O1xuXG5cbi8qKlxuICogaXNFbWJlckFycmF5IGhhcyBiZWVuIGV4Y2x1ZGVkIGFzIEVtYmVyLkFycmF5IGlzIG5vdCBhbiBFbWJlci5PYmplY3RcbiAqL1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhIHZhbHVlIGlzLCBhdCBsZWFzdCwgYSBzdWJjbGFzcyBvZiBFbWJlci5PYmplY3RQcm94eVxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBpc0VtYmVyT2JqZWN0UHJveHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzRW1iZXJPYmplY3RQcm94eSA9IGxvZGFzaFV0aWxzLm1ha2VJc1R5cGUoRW1iZXIuT2JqZWN0UHJveHkpO1xubG9kYXNoRW1iZXIuaXNFbWJlck9iamVjdFByb3h5ID0gaXNFbWJlck9iamVjdFByb3h5O1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhIHZhbHVlIGlzLCBhdCBsZWFzdCwgYSBzdWJjbGFzcyBvZiBFbWJlci5BcnJheVByb3h5XG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGlzRW1iZXJBcnJheVByb3h5XG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc0VtYmVyQXJyYXlQcm94eSA9IGxvZGFzaFV0aWxzLm1ha2VJc1R5cGUoRW1iZXIuQXJyYXlQcm94eSk7XG5sb2Rhc2hFbWJlci5pc0VtYmVyQXJyYXlQcm94eSA9IGlzRW1iZXJBcnJheVByb3h5O1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCB0aGUgdmFsdWUgaXMgYSBkZXNjZW5kZW50IG9mIGFuIEVtYmVyIENsYXNzXG4gKiBUT0RPOiBDaGVjayB0aGF0IGBfLmlzRW1iZXJJbnN0YW5jZWAgZG9lc24ndCBhbHJlYWR5IHlpZWxkIHRoZSBzYW1lIHJlc3VsdFxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBpc0VtYmVyQ29sbGVjdGlvblxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNFbWJlckNvbGxlY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRyZXR1cm4gKFxuXHRcdF8uaXNFbWJlck9iamVjdCh2YWx1ZSkgfHxcblx0XHRfLmlzRW1iZXJPYmplY3RQcm94eSh2YWx1ZSkgfHxcblx0XHRfLmlzRW1iZXJBcnJheVByb3h5KHZhbHVlKVxuXHQpO1xufTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJDb2xsZWN0aW9uID0gaXNFbWJlckNvbGxlY3Rpb247XG5cblxuLyoqXG4gKiBDaGVjayB0aGF0IHZhbHVlIGlzIEVtYmVyIFRyYW5zaXRpb25cbiAqXG4gKiBAbWV0aG9kIGlzRW1iZXJUcmFuc2l0aW9uXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBzaW5jZSB2MC41LjJcbiAqL1xuZXhwb3J0IHZhciBpc0VtYmVyVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHJldHVybiAoXG5cdFx0Xy5pc0Z1bmN0aW9uKHZhbHVlLCAndG9TdHJpbmcnKSAmJlxuXHRcdF8uY29udGFpbnModmFsdWUudG9TdHJpbmcoKSwgJ1RyYW5zaXRpb24nKVxuXHQpO1xufTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJUcmFuc2l0aW9uID0gaXNFbWJlclRyYW5zaXRpb247XG5cblxuLyoqXG4gKiBMb2Rhc2ggZm9yRWFjaFxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBfZm9yRWFjaFxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fFN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKiBAc2luY2UgdjAuNS4yXG4gKi9cbmV4cG9ydCB2YXIgX2ZvckVhY2ggPSBfLmZvckVhY2g7XG5sb2Rhc2hFbWJlci5fZm9yRWFjaCA9IF9mb3JFYWNoO1xuXG5cbi8qKlxuICogT3ZlcnJpZGUgbG9kYXNoIGBmb3JFYWNoYCB0byBzdXBwb3J0IGVtYmVyIGFycmF5cy9vYmplY3RzXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGZvckVhY2hcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG5leHBvcnQgdmFyIGZvckVhY2ggPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuXHRpZiAoXy5pc0VtYmVyQXJyYXlQcm94eShjb2xsZWN0aW9uKSkge1xuXHRcdHJldHVybiBjb2xsZWN0aW9uLmZvckVhY2goY2FsbGJhY2ssIHRoaXMpO1xuXHR9XG5cdGlmIChfLmlzRW1iZXJPYmplY3RQcm94eShjb2xsZWN0aW9uKSAmJiBfLmlzT2JqZWN0KGNvbGxlY3Rpb24uZ2V0KCdjb250ZW50JykpKSB7XG5cdFx0cmV0dXJuIF9mb3JFYWNoKGNvbGxlY3Rpb24uZ2V0KCdjb250ZW50JyksIGNhbGxiYWNrLCB0aGlzQXJnKTtcblx0fVxuXHRyZXR1cm4gX2ZvckVhY2goY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpO1xufTtcbmxvZGFzaEVtYmVyLmZvckVhY2ggPSBmb3JFYWNoO1xuXG5cbi8qKlxuICogTG9kYXNoIHJlZHVjZVxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBfcmVkdWNlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFtjdXJyZW50VmFsdWVdIHZhbHVlIGF0IGJlZ2lubmluZyBvZiBpdGVyYXRpb25cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQHNpbmNlIHYxLjEuMFxuICovXG5leHBvcnQgdmFyIF9yZWR1Y2UgPSBfLnJlZHVjZTtcbmxvZGFzaEVtYmVyLl9yZWR1Y2UgPSBfcmVkdWNlO1xuXG5cbi8qKlxuICogT3ZlcnJpZGUgbG9kYXNoIGByZWR1Y2VgIHRvIHN1cHBvcnQgZW1iZXIgYXJyYXlzL29iamVjdHNcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgcmVkdWNlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFtjdXJyZW50VmFsdWVdIHZhbHVlIGF0IGJlZ2lubmluZyBvZiBpdGVyYXRpb25cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQHNpbmNlIHYxLjEuMFxuICovXG5leHBvcnQgdmFyIHJlZHVjZSA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCBjdXJyZW50VmFsdWUsIHRoaXNBcmcpIHtcblx0aWYgKF8uaXNFbWJlckFycmF5UHJveHkoY29sbGVjdGlvbikpIHtcblx0XHRyZXR1cm4gY29sbGVjdGlvbi5yZWR1Y2UoY2FsbGJhY2ssIGN1cnJlbnRWYWx1ZSwgdGhpcyk7XG5cdH1cblx0aWYgKF8uaXNFbWJlck9iamVjdFByb3h5KGNvbGxlY3Rpb24pICYmIF8uaXNPYmplY3QoY29sbGVjdGlvbi5nZXQoJ2NvbnRlbnQnKSkpIHtcblx0XHRyZXR1cm4gX3JlZHVjZShjb2xsZWN0aW9uLmdldCgnY29udGVudCcpLCBjYWxsYmFjaywgY3VycmVudFZhbHVlLCB0aGlzQXJnKTtcblx0fVxuXHRyZXR1cm4gX3JlZHVjZShjb2xsZWN0aW9uLCBjYWxsYmFjaywgY3VycmVudFZhbHVlLCB0aGlzQXJnKTtcbn07XG5sb2Rhc2hFbWJlci5yZWR1Y2UgPSByZWR1Y2U7XG5cblxuLyoqXG4gKiBMb2Rhc2ggbWFwXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIF9tYXBcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQHNpbmNlIHYwLjUuMlxuICovXG5leHBvcnQgdmFyIF9tYXAgPSBfLm1hcDtcbmxvZGFzaEVtYmVyLl9tYXAgPSBfbWFwO1xuXG5cbi8qKlxuICogT3ZlcnJpZGUgbG9kYXNoIGBtYXBgIHRvIHN1cHBvcnQgZW1iZXIgYXJyYXlzL29iamVjdHNcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgbWFwXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8U3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xuZXhwb3J0IHZhciBtYXAgPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuXHRpZiAoXy5pc0VtYmVyQXJyYXlQcm94eShjb2xsZWN0aW9uKSkge1xuXHRcdHJldHVybiBjb2xsZWN0aW9uLm1hcChjYWxsYmFjaywgdGhpcyk7XG5cdH1cblx0cmV0dXJuIF9tYXAoY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpO1xufTtcbmxvZGFzaEVtYmVyLm1hcCA9IG1hcDtcblxuXG4vKipcbiAqIExvZGFzaCBkZWVwR2V0IGFsaWFzIHRvIHByaXZhdGUgbmFtZXNwYWNlXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIF9kZWVwR2V0XG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gY29sbGVjdGlvbjogVGhlIHJvb3QgY29sbGVjdGlvbiBvZiB0aGUgdHJlZS5cbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBwcm9wZXJ0eVBhdGg6IFRoZSBwcm9wZXJ0eSBwYXRoIGluIHRoZSBjb2xsZWN0aW9uLlxuICogQHJldHVybnMgeyp9IFRoZSB2YWx1ZSwgb3IgdW5kZWZpbmVkIGlmIGl0IGRvZXNuJ3QgZXhpc3RzLlxuICogQHNpbmNlIHYwLjUuMlxuICovXG5leHBvcnQgdmFyIF9kZWVwR2V0ID0gXy5kZWVwR2V0O1xubG9kYXNoRW1iZXIuX2RlZXBHZXQgPSBfZGVlcEdldDtcblxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgdmFsdWUgb2YgYSBwcm9wZXJ0eSBpbiBhbiBvYmplY3QgdHJlZS5cbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgZ2V0XG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gY29sbGVjdGlvbjogVGhlIHJvb3QgY29sbGVjdGlvbiBvZiB0aGUgdHJlZS5cbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBwcm9wZXJ0eVBhdGg6IFRoZSBwcm9wZXJ0eSBwYXRoIGluIHRoZSBjb2xsZWN0aW9uLlxuICogQHJldHVybnMgeyp9IFRoZSB2YWx1ZSwgb3IgdW5kZWZpbmVkIGlmIGl0IGRvZXNuJ3QgZXhpc3RzLlxuICovXG5leHBvcnQgdmFyIGdldCA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIHByb3BlcnR5UGF0aCkge1xuXHQvLyBIYW5kbGUgRW1iZXIgT2JqZWN0c1xuXHRpZiAoaXNFbWJlck9iamVjdChjb2xsZWN0aW9uKSB8fCBpc0VtYmVyT2JqZWN0UHJveHkoY29sbGVjdGlvbikpIHtcblx0XHRyZXR1cm4gY29sbGVjdGlvbi5nZXQocHJvcGVydHlQYXRoKTtcblx0fVxuXG5cdHJldHVybiBfZGVlcEdldCguLi5hcmd1bWVudHMpO1xufTtcbmxvZGFzaEVtYmVyLmdldCA9IGdldDtcblxuXG4vKipcbiAqIExvZGFzaCBkZWVwU2V0IGFsaWFzIHRvIHByaXZhdGUgbmFtZXNwYWNlXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIF9kZWVwU2V0XG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gY29sbGVjdGlvbjogVGhlIHJvb3QgY29sbGVjdGlvbiBvZiB0aGUgdHJlZS5cbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBwcm9wZXJ0eVBhdGg6IFRoZSBwcm9wZXJ0eSBwYXRoIGluIHRoZSBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHsqfSB2YWx1ZTogVGhlIHByb3BlcnR5IHBhdGggaW4gdGhlIGNvbGxlY3Rpb24uXG4gKiBAcmV0dXJucyB7Kn0gVGhlIGBjb2xsZWN0aW9uYCBwYXNzZWQgaW4gd2l0aCB2YWx1ZSBzZXQuXG4gKiBAc2luY2UgdjAuNS4yXG4gKi9cbmV4cG9ydCB2YXIgX2RlZXBTZXQgPSBfLmRlZXBTZXQ7XG5sb2Rhc2hFbWJlci5fZGVlcFNldCA9IF9kZWVwU2V0O1xuXG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSB2YWx1ZSBvZiBhIHByb3BlcnR5IGluIGFuIG9iamVjdCB0cmVlLlxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBzZXRcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb2xsZWN0aW9uOiBUaGUgcm9vdCBjb2xsZWN0aW9uIG9mIHRoZSB0cmVlLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHByb3BlcnR5UGF0aDogVGhlIHByb3BlcnR5IHBhdGggaW4gdGhlIGNvbGxlY3Rpb24uXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBzZXQgb24gdGhlIGNvbGxlY3Rpb24uXG4gKiBAcmV0dXJucyB7Kn0gVGhlIGBjb2xsZWN0aW9uYCBwYXNzZWQgaW4gd2l0aCB2YWx1ZSBzZXQuXG4gKi9cbmV4cG9ydCB2YXIgc2V0ID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgcHJvcGVydHlQYXRoLCB2YWx1ZSkge1xuXHQvLyBIYW5kbGUgRW1iZXIgT2JqZWN0c1xuXHRpZiAoaXNFbWJlck9iamVjdChjb2xsZWN0aW9uKSB8fCBpc0VtYmVyT2JqZWN0UHJveHkoY29sbGVjdGlvbikpIHtcblx0XHRjb2xsZWN0aW9uLnNldChwcm9wZXJ0eVBhdGgsIHZhbHVlKTtcblx0XHRyZXR1cm4gY29sbGVjdGlvbjtcblx0fVxuXG5cdHJldHVybiBfZGVlcFNldCguLi5hcmd1bWVudHMpO1xufTtcbmxvZGFzaEVtYmVyLnNldCA9IHNldDtcblxuXG4vLyBEb24ndCB1c2UgdGhlIGRlZXAgcHJlZml4LlxuLy8gSWYgbmVjZXNzYXJ5LCB5b3UgY2FuIGFjY2VzcyB0aGUgcmF3IGZ1bmN0aW9uIGF0IGBfLl9kZWVwR2V0YFxuKCgpID0+IHtcblx0ZGVsZXRlIF8uZGVlcEdldDtcblx0ZGVsZXRlIF8uZGVlcFNldDtcbn0pKCk7XG5cblxuLyoqXG4gKiBPcmlnaW5hbCBsb2Rhc2ggaXNFbXB0eVxuICpcbiAqIEBuYW1lc3BhY2UgIF9cbiAqIEBtZXRob2QgX2lzRW1wdHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAc2luY2UgdjAuNS4zXG4gKi9cbmV4cG9ydCB2YXIgX2lzRW1wdHkgPSBfLmlzRW1wdHk7XG5sb2Rhc2hFbWJlci5faXNFbXB0eSA9IF9pc0VtcHR5O1xuXG5cbi8qKlxuICogRGV0ZXJtaW5lcyBpZiB0aGUgdmFsdWUgaXMgZW1wdHkgb3Igbm90XG4gKlxuICogQG5hbWVzcGFjZSAgX1xuICogQG1ldGhvZCBpc0VtcHR5XG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQHNpbmNlIHYwLjUuM1xuICovXG5leHBvcnQgdmFyIGlzRW1wdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAoXG5cdFx0Xy5pc0VtYmVyQXJyYXlQcm94eSh2YWx1ZSkgJiZcblx0XHRfLmlzRnVuY3Rpb24odmFsdWUuaXNFbXB0eSlcblx0KSB7XG5cdFx0cmV0dXJuIHZhbHVlLmlzRW1wdHkoKTtcblx0fVxuXG5cdHJldHVybiBfaXNFbXB0eSguLi5hcmd1bWVudHMpO1xufTtcbmxvZGFzaEVtYmVyLmlzRW1wdHkgPSBpc0VtcHR5O1xuXG5cbi8qKlxuICogT3JpZ2luYWwgbG9kYXNoIGNsb25lXG4gKlxuICogQG5hbWVzcGFjZSAgX1xuICogQG1ldGhvZCBfY2xvbmVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4geyp9XG4gKiBAc2luY2UgdjEuMC4wXG4gKi9cbmV4cG9ydCB2YXIgX2Nsb25lID0gXy5jbG9uZTtcbmxvZGFzaEVtYmVyLl9jbG9uZSA9IF9jbG9uZTtcblxuXG4vKipcbiAqIFJldHVybnMgYSBjbG9uZWQgY29weSBvZiB2YWx1ZVxuICpcbiAqIEBuYW1lc3BhY2UgIF9cbiAqIEBtZXRob2QgY2xvbmVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4geyp9XG4gKiBAc2luY2UgdjEuMC4wXG4gKi9cbmV4cG9ydCB2YXIgY2xvbmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRpZiAoXy5pc1dpbGRjYXRPYmplY3QodmFsdWUpKSB7XG5cdFx0cmV0dXJuIHZhbHVlLmNsb25lKCk7XG5cdH1cblxuXHRyZXR1cm4gX2Nsb25lKC4uLmFyZ3VtZW50cyk7XG59O1xubG9kYXNoRW1iZXIuY2xvbmUgPSBjbG9uZTtcblxuXG4vKipcbiAqIEFsaWFzIGZvciBgYXJyYXkucG9wYCBvciBgYXJyYXlQcm94eS5wb3BPYmplY3RgXG4gKlxuICogQG5hbWVzcGFjZSAgX1xuICogQG1ldGhvZCBwb3BcbiAqIEBwYXJhbSB7QXJyYXl8RW1iZXIuQXJyYXlQcm94eX0gdmFsdWVcbiAqIEByZXR1cm4geyp9XG4gKiBAc2luY2UgdjEuMy4wXG4gKi9cbmV4cG9ydCB2YXIgcG9wID0gZnVuY3Rpb24odmFsdWUpIHtcblx0cmV0dXJuIChfLmlzRW1iZXJBcnJheVByb3h5KHZhbHVlKSkgPyB2YWx1ZS5wb3BPYmplY3QoKSA6IHZhbHVlLnBvcCgpO1xufTtcbmxvZGFzaEVtYmVyLnBvcCA9IHBvcDtcblxuXG4vKipcbiAqIEFsaWFzIGZvciBgYXJyYXkuc2hpZnRgIG9yIGBhcnJheVByb3h5LnNoaWZ0T2JqZWN0YFxuICpcbiAqIEBuYW1lc3BhY2UgIF9cbiAqIEBtZXRob2Qgc2hpZnRcbiAqIEBwYXJhbSB7QXJyYXl8RW1iZXIuQXJyYXlQcm94eX0gdmFsdWVcbiAqIEByZXR1cm4geyp9XG4gKiBAc2luY2UgdjEuMy4wXG4gKi9cbmV4cG9ydCB2YXIgc2hpZnQgPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRyZXR1cm4gKF8uaXNFbWJlckFycmF5UHJveHkodmFsdWUpKSA/IHZhbHVlLnNoaWZ0T2JqZWN0KCkgOiB2YWx1ZS5zaGlmdCgpO1xufTtcbmxvZGFzaEVtYmVyLnNoaWZ0ID0gc2hpZnQ7XG5cblxuLyoqXG4gKiBFbWJlciBgdHlwZU9mYCBhbGlhc1xuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCB0eXBlT2ZcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSB0eXBlIG9mIGB2YWx1ZWBcbiAqL1xuZXhwb3J0IHZhciB0eXBlT2YgPSAodmFsdWUpID0+IEVtYmVyLnR5cGVPZih2YWx1ZSk7XG5sb2Rhc2hFbWJlci50eXBlT2YgPSB0eXBlT2Y7XG5cblxuZXhwb3J0IHZhciBsb2Rhc2hFbWJlcjtcbmV4cG9ydCBkZWZhdWx0IGxvZGFzaEVtYmVyO1xuIiwiaW1wb3J0IGxvZGFzaFV0aWxzIGZyb20gJy4vX2NvcmUvbG9kYXNoLXV0aWxzJztcblxuXG4vKipcbiAqIENvbGxlY3Rpb24gb2YgYWxsIHRoZSB1dGlscyBpbiBoZXJlLiBBZGQgdG8gdGhpcyBhcyB5b3UgZ28uXG4gKi9cbmxldCBsb2Rhc2hFeHRyYXMgPSB7fTtcblxuXG4vKipcbiAqIEhlbHBlciB0byBjaGVjayBpZiBhIHZhcmlhYmxlIGlzIGRlZmluZWQgYW5kIHByZXNlbnRcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgaXNQcmVzZW50XG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc1ByZXNlbnQgPSAodmFsdWUpID0+ICghXy5pc1VuZGVmaW5lZCh2YWx1ZSkgJiYgIV8uaXNOdWxsKHZhbHVlKSk7XG5sb2Rhc2hFeHRyYXMuaXNQcmVzZW50ID0gaXNQcmVzZW50O1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNoZWNrIGlmIGEgdmFyaWFibGUgaXMgZGVmaW5lZCBhbmQgcHJlc2VudFxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBpc0JsYW5rXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc0JsYW5rID0gKHZhbHVlKSA9PiAhXy5pc1ByZXNlbnQodmFsdWUpO1xubG9kYXNoRXh0cmFzLmlzQmxhbmsgPSBpc0JsYW5rO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNoZWNrIGlmIGEgdmFyaWFibGUgaXMgYSBwcm9taXNlXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGlzUHJvbWlzZVxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNQcm9taXNlID0gKHZhbHVlKSA9PiBfLmlzRnVuY3Rpb24odmFsdWUsICd0aGVuJyk7XG5sb2Rhc2hFeHRyYXMuaXNQcm9taXNlID0gaXNQcm9taXNlO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNoZWNrIGEgdmFsdWUgZm9yIGFuIGFycmF5IG9mIExvRGFzaCBib29sZWFuIGNvbmRpdGlvbnNcbiAqIFRPRE86IE5hbWUgdGhpcyBgaXNBbmRgIGFuZCBjcmVhdGUgYGlzT3JgLi4uXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGlzXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHBhcmFtIHtBcnJheX0gY29uZGl0aW9uczogTG9EYXNoIG1ldGhvZHMgdG8gaGF2ZSB2YWx1ZSB0ZXN0ZWQgYWdhaW5zdCAoYXMgc3RyaW5ncylcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXMgPSBmdW5jdGlvbih2YWx1ZSwgY29uZGl0aW9ucykge1xuXHRpZiAoXy5pc1N0cmluZyhjb25kaXRpb25zKSkgY29uZGl0aW9ucyA9IFtjb25kaXRpb25zXTtcblx0aWYgKF8uaXNQcmVzZW50KGNvbmRpdGlvbnMpICYmICFfLmlzQXJyYXkoY29uZGl0aW9ucykpIGNvbmRpdGlvbnMgPSBbXTtcblx0aWYgKGNvbmRpdGlvbnMubGVuZ3RoIDw9IDEpIGNvbnNvbGUuZXJyb3IoXCJEb24ndCBjYWxsIGBpc2AgaGVscGVyIHdpdGgganVzdCBvbmUgY29uZGl0aW9uLSB1c2UgdGhhdCBjb25kaXRpb24gZGlyZWN0bHlcIik7XG5cdHJldHVybiBfLmV2ZXJ5KGNvbmRpdGlvbnMsIGZ1bmN0aW9uKGNvbmRpdGlvbikge1xuXHRcdGxldCByZXN1bHQsIG5vdDtcblxuXHRcdC8vIENoZWNrIGZvciB2YWxpZCBjb25kaXRpb25cblx0XHRpZiAoIV8uaXNTdHJpbmcoY29uZGl0aW9uKSkge1xuXHRcdFx0Y29uc29sZS53YXJuKFwiYGNvbmRpdGlvbmAgd2FzIG5vdCBhIHN0cmluZzogXCIgKyBjb25kaXRpb24pO1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIEhhbmRsZSBub3QgY29uZGl0aW9uXG5cdFx0bm90ID0gZmFsc2U7XG5cdFx0aWYgKF8uc3RhcnRzV2l0aChjb25kaXRpb24sICchJykpIHtcblx0XHRcdG5vdCA9IHRydWU7XG5cdFx0XHRjb25kaXRpb24gPSBjb25kaXRpb24ucmVwbGFjZSgnIScsICcnKTtcblx0XHR9XG5cblx0XHQvLyBCZSBFWFRSQSAodG9vKSBoZWxwZnVsIChwcmVwZW5kICdpcycgaWYgb21taXR0ZWQpXG5cdFx0aWYgKCFfLnN0YXJ0c1dpdGgoY29uZGl0aW9uLCAnaXMnKSkge1xuXHRcdFx0Y29uZGl0aW9uID0gJ2lzJyArIGNvbmRpdGlvbjtcblx0XHR9XG5cblx0XHQvLyBNYWtlIHN1cmUgYGNvbmRpdGlvbmAgaXMgYSB2YWxpZCBsb2Rhc2ggbWV0aG9kXG5cdFx0aWYgKCFfLmlzRnVuY3Rpb24oX1tjb25kaXRpb25dKSkge1xuXHRcdFx0Y29uc29sZS53YXJuKFwiYGNvbmRpdGlvbmAgd2FzIG5vdCBhIHZhbGlkIGxvZGFzaCBtZXRob2Q6IFwiICsgY29uZGl0aW9uKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlcm1pbmUgcmVzdWx0IGFuZCByZXR1cm5cblx0XHRyZXN1bHQgPSBfW2NvbmRpdGlvbl0odmFsdWUpO1xuXHRcdGlmIChub3QgPT09IHRydWUpIHJldHVybiAhcmVzdWx0O1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSk7XG59O1xubG9kYXNoRXh0cmFzLmlzID0gaXM7XG5cblxuLyoqXG4gKiBHZW5lcmF0ZSBgZW5zdXJlYCBtZXRob2RzLSBFbnN1cmUgdGhhdCB2YWx1ZSBpcyBvZiB0eXBlIHhcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgZW5zdXJle1R5cGV9XG4gKiBAcGFyYW0geyp9IHZhbHVlOiBUbyBjaGVja1xuICogQHBhcmFtIHsqfSBbdmFsdWVEZWZhdWx0PWRlZmF1bHRzW2NvbmRpdGlvbl06IFdoYXQgdG8gZGVmYXVsdCB0b1xuICogQHJldHVybiB7Kn0gRW5zdXJlZCB2YWx1ZVxuICogQHNpbmNlIHYxLjMuMFxuICovXG5fLmZvckVhY2goXy5rZXlzKGxvZGFzaFV0aWxzLnR5cGVEZWZhdWx0cygpKSwgKHR5cGUpID0+IHtcblx0bG9kYXNoRXh0cmFzW2BlbnN1cmUke3R5cGV9YF0gPSBsb2Rhc2hVdGlscy5tYWtlRW5zdXJlVHlwZSh0eXBlKTtcbn0pO1xuXG5cbi8qKlxuICogSmF2YXNjcmlwdCBgdHlwZW9mYCBhbGlhc1xuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCB0eXBlT2ZcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSB0eXBlIG9mIGB2YWx1ZWBcbiAqL1xuZXhwb3J0IHZhciB0eXBlT2YgPSAodmFsdWUpID0+IHR5cGVvZih2YWx1ZSk7XG5sb2Rhc2hFeHRyYXMudHlwZU9mID0gdHlwZU9mO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGxvZGFzaEV4dHJhcztcbiJdfQ==
