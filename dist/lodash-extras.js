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

// Only mixin ember-extras if available

var _lodashMoment = require('./lodash-moment');

var _lodashMoment2 = _interopRequireDefault(_lodashMoment);

// Only mixin ember-extras if available

var _lodashEmber = require('./lodash-ember');

var _lodashEmber2 = _interopRequireDefault(_lodashEmber);

// Must be last to override above methods programmatically

var _lodashDeepExtras = require('./lodash-deep-extras');

var _lodashDeepExtras2 = _interopRequireDefault(_lodashDeepExtras);

_.mixin(_lodashExtras2['default']);
if (_.isPresent(window.moment)) _.mixin(_lodashMoment2['default']);
if (_.isPresent(window.Ember)) _.mixin(_lodashEmber2['default']);
_.mixin(_lodashDeepExtras2['default']);

},{"./lodash-deep-extras":3,"./lodash-ember":4,"./lodash-extras":5,"./lodash-moment":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _coreLodashUtils = require('./_core/lodash-utils');

var _coreLodashUtils2 = _interopRequireDefault(_coreLodashUtils);

var _lodashExtras = require('./lodash-extras');

var _lodashExtras2 = _interopRequireDefault(_lodashExtras);

// All lodash extraDeep methods to export
var lodashDeepExtras = {};

/**
 * Generate deep `is` methods and override standard methods to handle both
 *
 * @method is{Condition}
 * @param {Object} value: Base value to look through
 * @param {String} propString: Property string to apply to `get`
 * @return {Boolean}
 */
_coreLodashUtils2['default'].buildIsMethods(_, lodashDeepExtras);
_coreLodashUtils2['default'].buildIsMethods(_lodashExtras2['default'], lodashDeepExtras);

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

},{"./_core/lodash-utils":1,"./lodash-extras":5}],4:[function(require,module,exports){
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
 * @method isEmberInstance
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
  // TODO: Create some sort of clone for Ember Objects and Arrays
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

/**
 * RSVP resolve helper
 *
 * @method promiseResolve
 * @param {*} value: Value to resolve with
 * @return {Promise}
 */
var promiseResolve = function promiseResolve(value) {
  return Ember.RSVP.resolve(value);
};
exports.promiseResolve = promiseResolve;
lodashEmber.promiseResolve = promiseResolve;

/**
 * RSVP reject helper
 *
 * @method promiseReject
 * @param {*} value: Value to resolve with
 * @return {Promise}
 */
var promiseReject = function promiseReject(message) {
  message = _.ensureString(message);
  return Ember.RSVP.reject(console.error(message));
};
exports.promiseReject = promiseReject;
lodashEmber.promiseReject = promiseReject;

/**
 * Generate deep `is` methods and override standard methods to handle both
 *
 * @method is{Condition}
 * @param {Object} value: Base value to look through
 * @param {String} propString: Property string to apply to `get`
 * @return {Boolean}
 */
_coreLodashUtils2['default'].buildIsMethods(lodashEmber, lodashEmber);

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
 * Helper to check if a variable is a date
 *
 * @method isDate
 * @param {*} value: Value to check
 * @return {Boolean}
 */
var isDate = function isDate(value) {
  return _.typeOf(value) === 'date';
};
exports.isDate = isDate;
lodashExtras.isDate = isDate;

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

},{"./_core/lodash-utils":1}],6:[function(require,module,exports){
/**
 * Collection of all the utils in here. Add to this as you go.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var lodashMoment = {};

/**
 * Check if a variable is a moment date object
 *
 * @method isMoment
 * @param {*} value: Value to check
 * @return {Boolean}
 */
var isMoment = function isMoment(value) {
  return _.isObject(value) && value._isAMomentObject === true;
};
exports.isMoment = isMoment;
lodashMoment.isMoment = isMoment;

/**
 * Ensure value is a moment object.
 * If not, tries to create a moment object from value,
 * otherwise returns moment().
 *
 * @method ensureMoment
 * @param {*} value: Value to check
 * @return {Moment}
 */
var ensureMoment = function ensureMoment(value) {
  if (isMoment(value)) return value;
  value = moment(value);
  if (value.isValid()) return value;
  return moment();
};
exports.ensureMoment = ensureMoment;
lodashMoment.ensureMoment = ensureMoment;

exports["default"] = lodashMoment;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvQW5kcmV3L1ppcHNjZW5lL2xvZGFzaC1leHRyYXMvc3JjL19jb3JlL2xvZGFzaC11dGlscy5qcyIsIi9Vc2Vycy9BbmRyZXcvWmlwc2NlbmUvbG9kYXNoLWV4dHJhcy9zcmMvaW5kZXguanMiLCIvVXNlcnMvQW5kcmV3L1ppcHNjZW5lL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1kZWVwLWV4dHJhcy5qcyIsIi9Vc2Vycy9BbmRyZXcvWmlwc2NlbmUvbG9kYXNoLWV4dHJhcy9zcmMvbG9kYXNoLWVtYmVyLmpzIiwiL1VzZXJzL0FuZHJldy9aaXBzY2VuZS9sb2Rhc2gtZXh0cmFzL3NyYy9sb2Rhc2gtZXh0cmFzLmpzIiwiL1VzZXJzL0FuZHJldy9aaXBzY2VuZS9sb2Rhc2gtZXh0cmFzL3NyYy9sb2Rhc2gtbW9tZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNHQSxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7Ozs7Ozs7O0FBU2QsSUFBSSxZQUFZLEdBQUcsU0FBZixZQUFZLEdBQVM7QUFDOUIsU0FBTztBQUNMLFlBQVEsRUFBRSxFQUFFO0FBQ1osV0FBTyxFQUFFLEVBQUU7QUFDWCxpQkFBYSxFQUFFLEVBQUU7QUFDakIsYUFBUyxFQUFFLEtBQUs7QUFDaEIsWUFBUSxFQUFFLENBQUM7R0FDWixDQUFDO0NBQ0gsQ0FBQzs7QUFDRixXQUFXLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQzs7Ozs7Ozs7O0FBVWpDLElBQUksVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFJLEtBQUssRUFBSztBQUNqQyxTQUFPLFVBQVMsS0FBSyxFQUFFO0FBQ3JCLFdBQVEsS0FBSyxZQUFZLEtBQUssQ0FBRTtHQUNqQyxDQUFDO0NBQ0gsQ0FBQzs7QUFDRixXQUFXLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQzs7Ozs7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LENBQUM7QUFDbEMsT0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QixNQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUNsQyxTQUFPLE1BQU0sRUFBRSxDQUFDO0NBQ2pCLENBQUM7O0FBQ0YsWUFBWSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7O3FCQUcxQixZQUFZIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ29sbGVjdGlvbiBvZiBhbGwgdGhlIHV0aWxzIGluIGhlcmUuIEFkZCB0byB0aGlzIGFzIHlvdSBnby5cbiAqL1xubGV0IGxvZGFzaFV0aWxzID0ge307XG5cblxuLyoqXG4gKiBIZWxwZXIgZm9yIEpTIHR5cGVzIGFuZCBkZWZhdWx0cyBmb3IgZWFjaCB0eXBlXG4gKlxuICogQG1ldGhvZCB0eXBlRGVmYXVsdHNcbiAqIEByZXR1cm4ge1BsYWluT2JqZWN0fVxuICovXG5leHBvcnQgdmFyIHR5cGVEZWZhdWx0cyA9ICgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICAnU3RyaW5nJzogJycsXG4gICAgJ0FycmF5JzogW10sXG4gICAgJ1BsYWluT2JqZWN0Jzoge30sXG4gICAgJ0Jvb2xlYW4nOiBmYWxzZSxcbiAgICAnTnVtYmVyJzogMVxuICB9O1xufTtcbmxvZGFzaFV0aWxzLnR5cGVEZWZhdWx0cyA9IHR5cGVEZWZhdWx0cztcblxuXG4vKipcbiAqIEhlbHBlciB0byBtYWtlIGBfLmlzRW1iZXJ7Q2xhc3N9YFxuICpcbiAqIEBtZXRob2QgbWFrZUlzVHlwZVxuICogQHBhcmFtIHsqfSBrbGFzczogQSBjbGFzcyB0byBjaGVjayBpbnN0YW5jZW9mIGFnYWluc3RcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnQgdmFyIG1ha2VJc1R5cGUgPSAoa2xhc3MpID0+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIGtsYXNzKTtcbiAgfTtcbn07XG5sb2Rhc2hVdGlscy5tYWtlSXNUeXBlID0gbWFrZUlzVHlwZTtcblxuXG4vKipcbiAqIEhlbHBlciB0byBtYWtlIGBfLmVuc3VyZVR5cGVgXG4gKlxuICogQG1ldGhvZCBtYWtlRW5zdXJlVHlwZVxuICogQHBhcmFtIHtTdHJpbmd9IGNvbmRpdGlvbjogTG9kYXNoIG1ldGhvZCB0byBhcHBseVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydCB2YXIgbWFrZUVuc3VyZVR5cGUgPSAoY29uZGl0aW9uKSA9PiB7XG4gIGxldCBkZWZhdWx0cyA9IGxvZGFzaFV0aWxzLnR5cGVEZWZhdWx0cygpO1xuXG4gIC8vIENoZWNrIHBhcmFtczogY29uZGl0aW9uXG4gIGlmICghXy5pc1N0cmluZyhjb25kaXRpb24pKSBjb25kaXRpb24gPSAnJztcbiAgY29uZGl0aW9uID0gXy5jYXBpdGFsaXplKGNvbmRpdGlvbik7XG4gIGlmICghXy5jb250YWlucyhfLmtleXMoZGVmYXVsdHMpLCBjb25kaXRpb24pKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcXGBjb25kaXRpb25cXGAgbm90IHN1cHBvcnRlZDogJHtjb25kaXRpb259YCk7XG4gIH1cblxuICAvLyBTaG9ydGN1dFxuICBsZXQgaXNDb25kaXRpb24gPSBfW2BpcyR7Y29uZGl0aW9ufWBdO1xuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgZm9yIGBlbnN1cmVUeXBlYCBtZXRob2RzXG4gICAqXG4gICAqIEBtZXRob2QgYGVuc3VyZSR7dHlwZX1gXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWU6IFRvIGNoZWNrXG4gICAqIEBwYXJhbSB7Kn0gW3ZhbHVlRGVmYXVsdD1kZWZhdWx0c1tjb25kaXRpb25dOiBXaGF0IHRvIGRlZmF1bHQgdG9cbiAgICogQHJldHVybiB7Kn0gRGVmYXVsdGVkIHZhbHVlLCBvciB0aGUgdmFsdWUgaXRzZWxmIGlmIHBhc3NcbiAgICovXG4gIHJldHVybiAodmFsdWUsIHZhbHVlRGVmYXVsdCkgPT4ge1xuICAgIC8vIERldGVybWluZSBgdmFsdWVEZWZhdWx0YDogaWYgbm90aGluZyBwcm92aWRlZCwgb3IgcHJvdmlkZWQgZG9lc24ndCBtYXRjaCB0eXBlXG4gICAgaWYgKF8uaXNVbmRlZmluZWQodmFsdWVEZWZhdWx0KSB8fCAhaXNDb25kaXRpb24odmFsdWVEZWZhdWx0KSkge1xuICAgICAgdmFsdWVEZWZhdWx0ID0gXy5jbG9uZShkZWZhdWx0c1tjb25kaXRpb25dKTtcbiAgICB9XG5cbiAgICAvLyBBY3R1YWwgXCJlbnN1cmVcIiBjaGVja1xuICAgIGlmICghX1tgaXMke2NvbmRpdGlvbn1gXSh2YWx1ZSkpIHZhbHVlID0gdmFsdWVEZWZhdWx0O1xuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufTtcbmxvZGFzaFV0aWxzLm1ha2VFbnN1cmVUeXBlID0gbWFrZUVuc3VyZVR5cGU7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gbWFrZSBgXy5kZWVwRW5zdXJle1R5cGV9YFxuICpcbiAqIEBtZXRob2QgbWFrZURlZXBFbnN1cmVUeXBlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25kaXRpb246IExvZGFzaCBtZXRob2QgdG8gYXBwbHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWVEZWZhdWx0OiBXaGF0IHRvIGFzc2lnbiB3aGVuIG5vdCBvZiB0aGUgZGVzaXJlZCB0eXBlXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0IHZhciBtYWtlRGVlcEVuc3VyZVR5cGUgPSAoY29uZGl0aW9uKSA9PiB7XG4gIHJldHVybiAoY29sbGVjdGlvbiwgcHJvcFN0cmluZywgdmFsdWVEZWZhdWx0KSA9PiB7XG4gICAgcmV0dXJuIF8uc2V0KFxuICAgICAgY29sbGVjdGlvbixcbiAgICAgIHByb3BTdHJpbmcsXG4gICAgICBsb2Rhc2hVdGlscy5tYWtlRW5zdXJlVHlwZShjb25kaXRpb24pKFxuICAgICAgICBfLmdldChjb2xsZWN0aW9uLCBwcm9wU3RyaW5nKSxcbiAgICAgICAgdmFsdWVEZWZhdWx0XG4gICAgICApXG4gICAgKTtcbiAgfTtcbn07XG5sb2Rhc2hVdGlscy5tYWtlRGVlcEVuc3VyZVR5cGUgPSBtYWtlRGVlcEVuc3VyZVR5cGU7XG5cblxuLyoqXG4gKiBEZXRlcm1pbmVkIGlmIGxvZGFzaCBrZXkvbWV0aG9kIGlzIHZhbGlkIHRvIG1ha2UgZGVlcCAoYGlzYCBtZXRob2RzIHRoYXQgb25seSBoYXZlIG9uZSBhcmd1bWVudClcbiAqIE5PVEU6IEFzc3VtZXMgYHRoaXNgID09PSBpcyB0aGUgbmFtZXNwYWNlIHRvIGNoZWNrIGZvciB0aGUgZnVuY3Rpb24gb25cbiAqXG4gKiBAbWV0aG9kIHZhbGlkSXNNZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXk6IG1ldGhvZCBuYW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIHZhbGlkSXNNZXRob2QgPSBmdW5jdGlvbihrZXkpIHtcbiAgcmV0dXJuIChcbiAgICBfLnN0YXJ0c1dpdGgoa2V5LCAnaXMnKSAmJlxuICAgICh0aGlzW2tleV0ubGVuZ3RoID09PSAxKVxuICApO1xufTtcbmxvZGFzaFV0aWxzLnZhbGlkSXNNZXRob2QgPSB2YWxpZElzTWV0aG9kO1xuXG5cbi8qKlxuICogRmlsdGVyIG91dCBhbGwgdmFsaWQgYGlzYCBtZXRob2RzIGZyb20gYSBuYW1lc3BhY2VcbiAqXG4gKiBAbWV0aG9kIGZpbHRlcklzTWV0aG9kc1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZTogQ29sbGVjdGlvbiBvZiBtZXRob2RzXG4gKiBAcmV0dXJuIHtPYmplY3R9IGBuYW1lc3BhY2VgIHdpdGgganVzdCB0aGUgXCJpc1wiIG1ldGhvZHNcbiAqL1xuZXhwb3J0IHZhciBmaWx0ZXJJc01ldGhvZHMgPSAobmFtZXNwYWNlKSA9PiB7XG4gIHJldHVybiBfLmNoYWluKG5hbWVzcGFjZSlcbiAgICAua2V5cygpXG4gICAgLmZpbHRlcih2YWxpZElzTWV0aG9kLCBuYW1lc3BhY2UpXG4gICAgLnZhbHVlKCk7XG59O1xubG9kYXNoVXRpbHMuZmlsdGVySXNNZXRob2RzID0gZmlsdGVySXNNZXRob2RzO1xuXG5cbi8qKlxuICogT3ZlcmxvYWQgbm9ybWFsIGxvZGFzaCBtZXRob2RzIHRvIGhhbmRsZSBkZWVwIHN5bnRheFxuICogVE9ETzogTm8gbmVlZCB0byB0YWtlIHRoZSBmaXJzdCBwYXJhbVxuICpcbiAqIEBtZXRob2Qgb3ZlcmxvYWRNZXRob2RzXG4gKiBAcGFyYW0ge09iamVjdH0gaXNNZXRob2RzOiBDb2xsZWN0aW9uIG9mIGlzIG1ldGhvZHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2U6IE9yaWdpbmFsIG5hbWVzcGFjZSBpc01ldGhvZHMgY2FtZSBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0OiBuYW1lc3BhY2UgdG8gb3ZlcmxvYWQgbWV0aG9kcyBvblxuICogQHJldHVybiB7VW5kZWZpbmVkfVxuICovXG5leHBvcnQgdmFyIG92ZXJsb2FkTWV0aG9kcyA9IChpc01ldGhvZHMsIG5hbWVzcGFjZSwgdGFyZ2V0KSA9PiB7XG4gIGxldCBvbGRNZXRob2QgPSB7fTtcblxuICBfLmZvckVhY2goaXNNZXRob2RzLCAobWV0aG9kKSA9PiB7XG4gICAgLy8gU2F2ZSBvbGQgbWV0aG9kXG4gICAgb2xkTWV0aG9kW21ldGhvZF0gPSBuYW1lc3BhY2VbbWV0aG9kXTtcblxuICAgIC8vIE1ha2UgbmV3IG1ldGhvZCB0aGF0IGFsc28gaGFuZGxlcyBgZ2V0YC4gQXBwbHkgbWV0aG9kIHRvIGV4cG9ydHMuXG4gICAgdGFyZ2V0W21ldGhvZF0gPSBmdW5jdGlvbih2YWx1ZSwgcHJvcFN0cmluZykge1xuICAgICAgaWYgKF8uc2l6ZShhcmd1bWVudHMpID09PSAyKSB7XG4gICAgICAgIHJldHVybiBuYW1lc3BhY2VbbWV0aG9kXShfLmdldCguLi5hcmd1bWVudHMpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvbGRNZXRob2RbbWV0aG9kXSguLi5hcmd1bWVudHMpO1xuICAgIH07XG4gIH0pO1xufTtcbmxvZGFzaFV0aWxzLm92ZXJsb2FkTWV0aG9kcyA9IG92ZXJsb2FkTWV0aG9kcztcblxuXG4vKipcbiAqIEJ1aWxkIGBpc01ldGhvZHNgXG4gKlxuICogQG1ldGhvZCBidWlsZElzTWV0aG9kc1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZTogTmFtZXNwYWNlIHRvIHB1bGwgYGlzYCBtZXRob2RzIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQ6IG5hbWVzcGFjZSB0byBvdmVybG9hZCBtZXRob2RzIG9uXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9XG4gKi9cbmV4cG9ydCB2YXIgYnVpbGRJc01ldGhvZHMgPSAobmFtZXNwYWNlLCB0YXJnZXQpID0+IHtcbiAgb3ZlcmxvYWRNZXRob2RzKGZpbHRlcklzTWV0aG9kcyhuYW1lc3BhY2UpLCBuYW1lc3BhY2UsIHRhcmdldCk7XG59XG5sb2Rhc2hVdGlscy5idWlsZElzTWV0aG9kcyA9IGJ1aWxkSXNNZXRob2RzO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGxvZGFzaFV0aWxzO1xuIiwiaW1wb3J0IGxvZGFzaEV4dHJhcyBmcm9tICcuL2xvZGFzaC1leHRyYXMnO1xuXy5taXhpbihsb2Rhc2hFeHRyYXMpO1xuXG4vLyBPbmx5IG1peGluIGVtYmVyLWV4dHJhcyBpZiBhdmFpbGFibGVcbmltcG9ydCBsb2Rhc2hNb21lbnQgZnJvbSAnLi9sb2Rhc2gtbW9tZW50JztcbmlmIChfLmlzUHJlc2VudCh3aW5kb3cubW9tZW50KSkgXy5taXhpbihsb2Rhc2hNb21lbnQpO1xuXG4vLyBPbmx5IG1peGluIGVtYmVyLWV4dHJhcyBpZiBhdmFpbGFibGVcbmltcG9ydCBsb2Rhc2hFbWJlciBmcm9tICcuL2xvZGFzaC1lbWJlcic7XG5pZiAoXy5pc1ByZXNlbnQod2luZG93LkVtYmVyKSkgXy5taXhpbihsb2Rhc2hFbWJlcik7XG5cbi8vIE11c3QgYmUgbGFzdCB0byBvdmVycmlkZSBhYm92ZSBtZXRob2RzIHByb2dyYW1tYXRpY2FsbHlcbmltcG9ydCBsb2Rhc2hEZWVwRXh0cmFzIGZyb20gJy4vbG9kYXNoLWRlZXAtZXh0cmFzJztcbl8ubWl4aW4obG9kYXNoRGVlcEV4dHJhcyk7XG4iLCJpbXBvcnQgbG9kYXNoVXRpbHMgZnJvbSAnLi9fY29yZS9sb2Rhc2gtdXRpbHMnO1xuaW1wb3J0IGxvZGFzaEV4dHJhcyBmcm9tICcuL2xvZGFzaC1leHRyYXMnO1xuXG5cbi8vIEFsbCBsb2Rhc2ggZXh0cmFEZWVwIG1ldGhvZHMgdG8gZXhwb3J0XG5sZXQgbG9kYXNoRGVlcEV4dHJhcyA9IHt9O1xuXG5cbi8qKlxuICogR2VuZXJhdGUgZGVlcCBgaXNgIG1ldGhvZHMgYW5kIG92ZXJyaWRlIHN0YW5kYXJkIG1ldGhvZHMgdG8gaGFuZGxlIGJvdGhcbiAqXG4gKiBAbWV0aG9kIGlze0NvbmRpdGlvbn1cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZTogQmFzZSB2YWx1ZSB0byBsb29rIHRocm91Z2hcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wU3RyaW5nOiBQcm9wZXJ0eSBzdHJpbmcgdG8gYXBwbHkgdG8gYGdldGBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmxvZGFzaFV0aWxzLmJ1aWxkSXNNZXRob2RzKF8sIGxvZGFzaERlZXBFeHRyYXMpO1xubG9kYXNoVXRpbHMuYnVpbGRJc01ldGhvZHMobG9kYXNoRXh0cmFzLCBsb2Rhc2hEZWVwRXh0cmFzKTtcblxuXG4vKipcbiAqIEdlbmVyYXRlIGBlbnN1cmVgIG1ldGhvZHMtIEVuc3VyZSB0aGF0IHZhbHVlIGlzIG9mIHR5cGUgeCwgZGVlcGx5XG4gKlxuICogQG1ldGhvZCBkZWVwRW5zdXJle1R5cGV9XG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gY29sbGVjdGlvbjogVGhlIHJvb3QgY29sbGVjdGlvbiBvZiB0aGUgdHJlZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wU3RyaW5nOiBOZXN0ZWQgcHJvcGVydHkgcGF0aCBvZiB2YWx1ZSB0byBjaGVja1xuICogQHBhcmFtIHsqfSBbdmFsdWVEZWZhdWx0PWRlZmF1bHRzW2NvbmRpdGlvbl06IFdoYXQgdG8gZGVmYXVsdCB0b1xuICogQHJldHVybiB7Kn0gQ29sbGVjdGlvbiwgd2l0aCBlbnN1cmVkIHByb3BlcnR5XG4gKi9cbl8uZm9yRWFjaChfLmtleXMobG9kYXNoVXRpbHMudHlwZURlZmF1bHRzKCkpLCAodHlwZSkgPT4ge1xuICBsb2Rhc2hFeHRyYXNbYGRlZXBFbnN1cmUke3R5cGV9YF0gPSBsb2Rhc2hVdGlscy5tYWtlRGVlcEVuc3VyZVR5cGUodHlwZSk7XG59KTtcblxuXG4vKipcbiAqIERlbGV0ZSBkZWVwbHkgbmVzdGVkIHByb3BlcnRpZXMgd2l0aG91dCBjaGVja2luZyBleGlzdGVuY2UgZG93biB0aGUgdHJlZSBmaXJzdFxuICogVE9ETzogVEVTVCBURVNUIFRFU1QuIFRoaXMgaXMgZXhwZXJpbWVudGFsIChXSVApXG4gKlxuICogQG1ldGhvZCBkZWVwRGVsZXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHBhcmFtIHtTdHJpbmd9IHByb3BTdHJpbmc6IFByb3BlcnR5IHN0cmluZyB0byBhcHBseSB0byBgZ2V0YFxuICogQHJldHVybiB7dW5kZWZpbmVkfSBEb2Vzbid0IHJldHVybiBzdWNjZXNzL2ZhaWx1cmUsIHRvIG1hdGNoIGBkZWxldGVgJ3MgcmV0dXJuXG4gKi9cbmV4cG9ydCB2YXIgZGVlcERlbGV0ZSA9IGZ1bmN0aW9uKHZhbHVlLCBwcm9wU3RyaW5nKSB7XG4gIGxldCBjdXJyZW50VmFsdWUsIGk7XG5cbiAgLy8gRGVsZXRlIGlmIHByZXNlbnRcbiAgaWYgKF8uaXNQcmVzZW50KHZhbHVlLCBwcm9wU3RyaW5nKSkge1xuICAgIGN1cnJlbnRWYWx1ZSA9IHZhbHVlO1xuICAgIHByb3BTdHJpbmcgPSBfKHByb3BTdHJpbmcpLnRvU3RyaW5nKCkuc3BsaXQoJy4nKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCAocHJvcFN0cmluZy5sZW5ndGggLSAxKTsgaSsrKSB7XG4gICAgICBjdXJyZW50VmFsdWUgPSBjdXJyZW50VmFsdWVbcHJvcFN0cmluZ1tpXV07XG4gICAgfVxuXG4gICAgZGVsZXRlIGN1cnJlbnRWYWx1ZVtwcm9wU3RyaW5nW2ldXTtcbiAgfVxufTtcbmxvZGFzaERlZXBFeHRyYXMuZGVlcERlbGV0ZSA9IGRlZXBEZWxldGU7XG5cblxuZXhwb3J0IGRlZmF1bHQgbG9kYXNoRGVlcEV4dHJhcztcbiIsIi8qKlxuICogVGhpcyB1dGlsaXR5IGFzc3VtZXMgYEVtYmVyYCBleGlzdHMgZ2xvYmFsbHlcbiAqL1xuaW1wb3J0IGxvZGFzaFV0aWxzIGZyb20gJy4vX2NvcmUvbG9kYXNoLXV0aWxzJztcblxuXG4vKipcbiAqIENvbGxlY3Rpb24gb2YgYWxsIHRoZSB1dGlscyBpbiBoZXJlLiBBZGQgdG8gdGhpcyBhcyB5b3UgZ28uXG4gKi9cbmV4cG9ydCB2YXIgbG9kYXNoRW1iZXIgPSB7fTtcblxuXG4vKipcbiAqIENoZWNrIHRoYXQgYSB2YWx1ZSBpcyBhbiBpbnN0YW5jZSwgYXMgZGVzaWduYXRlZCBieSBFbWJlclxuICpcbiAqIEBtZXRob2QgaXNFbWJlckluc3RhbmNlXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc0VtYmVySW5zdGFuY2UgPSAodmFsdWUpID0+IEVtYmVyLnR5cGVPZih2YWx1ZSkgPT09ICdpbnN0YW5jZSc7XG5sb2Rhc2hFbWJlci5pc0VtYmVySW5zdGFuY2UgPSBpc0VtYmVySW5zdGFuY2U7XG5cblxuLyoqXG4gKiBDaGVjayB0aGF0IGEgdmFsdWUgaXMsIGF0IGxlYXN0LCBhIHN1YmNsYXNzIG9mIEVtYmVyLk9iamVjdFxuICpcbiAqIEBtZXRob2QgaXNFbWJlck9iamVjdFxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNFbWJlck9iamVjdCA9IGxvZGFzaFV0aWxzLm1ha2VJc1R5cGUoRW1iZXIuT2JqZWN0KTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJPYmplY3QgPSBpc0VtYmVyT2JqZWN0O1xuXG5cbi8qKlxuICogTk9URTogaXNFbWJlckFycmF5IGhhcyBiZWVuIGV4Y2x1ZGVkIGFzIEVtYmVyLkFycmF5IGlzIG5vdCBhbiBFbWJlci5PYmplY3RcbiAqL1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhIHZhbHVlIGlzLCBhdCBsZWFzdCwgYSBzdWJjbGFzcyBvZiBFbWJlci5PYmplY3RQcm94eVxuICpcbiAqIEBtZXRob2QgaXNFbWJlck9iamVjdFByb3h5XG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc0VtYmVyT2JqZWN0UHJveHkgPSBsb2Rhc2hVdGlscy5tYWtlSXNUeXBlKEVtYmVyLk9iamVjdFByb3h5KTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJPYmplY3RQcm94eSA9IGlzRW1iZXJPYmplY3RQcm94eTtcblxuXG4vKipcbiAqIENoZWNrIHRoYXQgYSB2YWx1ZSBpcywgYXQgbGVhc3QsIGEgc3ViY2xhc3Mgb2YgRW1iZXIuQXJyYXlQcm94eVxuICpcbiAqIEBtZXRob2QgaXNFbWJlckFycmF5UHJveHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzRW1iZXJBcnJheVByb3h5ID0gbG9kYXNoVXRpbHMubWFrZUlzVHlwZShFbWJlci5BcnJheVByb3h5KTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJBcnJheVByb3h5ID0gaXNFbWJlckFycmF5UHJveHk7XG5cblxuLyoqXG4gKiBDaGVjayB0aGF0IHRoZSB2YWx1ZSBpcyBhIGRlc2NlbmRlbnQgb2YgYW4gRW1iZXIgQ2xhc3NcbiAqIFRPRE86IENoZWNrIHRoYXQgYF8uaXNFbWJlckluc3RhbmNlYCBkb2Vzbid0IGFscmVhZHkgeWllbGQgdGhlIHNhbWUgcmVzdWx0XG4gKlxuICogQG1ldGhvZCBpc0VtYmVyQ29sbGVjdGlvblxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNFbWJlckNvbGxlY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKFxuICAgIF8uaXNFbWJlck9iamVjdCh2YWx1ZSkgfHxcbiAgICBfLmlzRW1iZXJPYmplY3RQcm94eSh2YWx1ZSkgfHxcbiAgICBfLmlzRW1iZXJBcnJheVByb3h5KHZhbHVlKVxuICApO1xufTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJDb2xsZWN0aW9uID0gaXNFbWJlckNvbGxlY3Rpb247XG5cblxuLyoqXG4gKiBDaGVjayB0aGF0IHZhbHVlIGlzIEVtYmVyIFRyYW5zaXRpb25cbiAqXG4gKiBAbWV0aG9kIGlzRW1iZXJUcmFuc2l0aW9uXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc0VtYmVyVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiAoXG4gICAgXy5pc0Z1bmN0aW9uKHZhbHVlLCAndG9TdHJpbmcnKSAmJlxuICAgIF8uY29udGFpbnModmFsdWUudG9TdHJpbmcoKSwgJ1RyYW5zaXRpb24nKVxuICApO1xufTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJUcmFuc2l0aW9uID0gaXNFbWJlclRyYW5zaXRpb247XG5cblxuLyoqXG4gKiBMb2Rhc2ggZm9yRWFjaFxuICpcbiAqIEBtZXRob2QgX2ZvckVhY2hcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG5leHBvcnQgdmFyIF9mb3JFYWNoID0gXy5mb3JFYWNoO1xubG9kYXNoRW1iZXIuX2ZvckVhY2ggPSBfZm9yRWFjaDtcblxuXG4vKipcbiAqIE92ZXJyaWRlIGxvZGFzaCBgZm9yRWFjaGAgdG8gc3VwcG9ydCBlbWJlciBhcnJheXMvb2JqZWN0c1xuICpcbiAqIEBtZXRob2QgZm9yRWFjaFxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fFN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbmV4cG9ydCB2YXIgZm9yRWFjaCA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gIGlmIChfLmlzRW1iZXJBcnJheVByb3h5KGNvbGxlY3Rpb24pKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uZm9yRWFjaChjYWxsYmFjaywgdGhpcyk7XG4gIH1cbiAgaWYgKF8uaXNFbWJlck9iamVjdFByb3h5KGNvbGxlY3Rpb24pICYmIF8uaXNPYmplY3QoY29sbGVjdGlvbi5nZXQoJ2NvbnRlbnQnKSkpIHtcbiAgICByZXR1cm4gX2ZvckVhY2goY29sbGVjdGlvbi5nZXQoJ2NvbnRlbnQnKSwgY2FsbGJhY2ssIHRoaXNBcmcpO1xuICB9XG4gIHJldHVybiBfZm9yRWFjaChjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZyk7XG59O1xubG9kYXNoRW1iZXIuZm9yRWFjaCA9IGZvckVhY2g7XG5cblxuLyoqXG4gKiBMb2Rhc2ggcmVkdWNlXG4gKlxuICogQG1ldGhvZCBfcmVkdWNlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFtjdXJyZW50VmFsdWVdIHZhbHVlIGF0IGJlZ2lubmluZyBvZiBpdGVyYXRpb25cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG5leHBvcnQgdmFyIF9yZWR1Y2UgPSBfLnJlZHVjZTtcbmxvZGFzaEVtYmVyLl9yZWR1Y2UgPSBfcmVkdWNlO1xuXG5cbi8qKlxuICogT3ZlcnJpZGUgbG9kYXNoIGByZWR1Y2VgIHRvIHN1cHBvcnQgZW1iZXIgYXJyYXlzL29iamVjdHNcbiAqXG4gKiBAbWV0aG9kIHJlZHVjZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsqfSBbY3VycmVudFZhbHVlXSB2YWx1ZSBhdCBiZWdpbm5pbmcgb2YgaXRlcmF0aW9uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8U3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xuZXhwb3J0IHZhciByZWR1Y2UgPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBjYWxsYmFjaywgY3VycmVudFZhbHVlLCB0aGlzQXJnKSB7XG4gIGlmIChfLmlzRW1iZXJBcnJheVByb3h5KGNvbGxlY3Rpb24pKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24ucmVkdWNlKGNhbGxiYWNrLCBjdXJyZW50VmFsdWUsIHRoaXMpO1xuICB9XG4gIGlmIChfLmlzRW1iZXJPYmplY3RQcm94eShjb2xsZWN0aW9uKSAmJiBfLmlzT2JqZWN0KGNvbGxlY3Rpb24uZ2V0KCdjb250ZW50JykpKSB7XG4gICAgcmV0dXJuIF9yZWR1Y2UoY29sbGVjdGlvbi5nZXQoJ2NvbnRlbnQnKSwgY2FsbGJhY2ssIGN1cnJlbnRWYWx1ZSwgdGhpc0FyZyk7XG4gIH1cbiAgcmV0dXJuIF9yZWR1Y2UoY29sbGVjdGlvbiwgY2FsbGJhY2ssIGN1cnJlbnRWYWx1ZSwgdGhpc0FyZyk7XG59O1xubG9kYXNoRW1iZXIucmVkdWNlID0gcmVkdWNlO1xuXG5cbi8qKlxuICogTG9kYXNoIG1hcFxuICpcbiAqIEBtZXRob2QgX21hcFxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fFN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbmV4cG9ydCB2YXIgX21hcCA9IF8ubWFwO1xubG9kYXNoRW1iZXIuX21hcCA9IF9tYXA7XG5cblxuLyoqXG4gKiBPdmVycmlkZSBsb2Rhc2ggYG1hcGAgdG8gc3VwcG9ydCBlbWJlciBhcnJheXMvb2JqZWN0c1xuICpcbiAqIEBtZXRob2QgbWFwXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8U3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xuZXhwb3J0IHZhciBtYXAgPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuICBpZiAoXy5pc0VtYmVyQXJyYXlQcm94eShjb2xsZWN0aW9uKSkge1xuICAgIHJldHVybiBjb2xsZWN0aW9uLm1hcChjYWxsYmFjaywgdGhpcyk7XG4gIH1cbiAgcmV0dXJuIF9tYXAoY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpO1xufTtcbmxvZGFzaEVtYmVyLm1hcCA9IG1hcDtcblxuXG4vKipcbiAqIExvZGFzaCBgZ2V0YCBhbGlhcyB0byBwcml2YXRlIG5hbWVzcGFjZVxuICpcbiAqIEBtZXRob2QgX2dldFxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGNvbGxlY3Rpb246IFRoZSByb290IGNvbGxlY3Rpb24gb2YgdGhlIHRyZWUuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gcHJvcGVydHlQYXRoOiBUaGUgcHJvcGVydHkgcGF0aCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqIEByZXR1cm5zIHsqfSBUaGUgdmFsdWUsIG9yIHVuZGVmaW5lZCBpZiBpdCBkb2Vzbid0IGV4aXN0cy5cbiAqL1xuZXhwb3J0IHZhciBfZ2V0ID0gXy5nZXQ7XG5sb2Rhc2hFbWJlci5fZ2V0ID0gX2dldDtcblxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgdmFsdWUgb2YgYSBwcm9wZXJ0eSBpbiBhbiBvYmplY3QgdHJlZS5cbiAqXG4gKiBAbWV0aG9kIGdldFxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGNvbGxlY3Rpb246IFRoZSByb290IGNvbGxlY3Rpb24gb2YgdGhlIHRyZWUuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gcHJvcGVydHlQYXRoOiBUaGUgcHJvcGVydHkgcGF0aCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqIEByZXR1cm5zIHsqfSBUaGUgdmFsdWUsIG9yIHVuZGVmaW5lZCBpZiBpdCBkb2Vzbid0IGV4aXN0cy5cbiAqL1xuZXhwb3J0IHZhciBnZXQgPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBwcm9wZXJ0eVBhdGgpIHtcbiAgLy8gSGFuZGxlIEVtYmVyIE9iamVjdHNcbiAgaWYgKGlzRW1iZXJPYmplY3QoY29sbGVjdGlvbikgfHwgaXNFbWJlck9iamVjdFByb3h5KGNvbGxlY3Rpb24pKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uZ2V0KHByb3BlcnR5UGF0aCk7XG4gIH1cblxuICByZXR1cm4gX2dldCguLi5hcmd1bWVudHMpO1xufTtcbmxvZGFzaEVtYmVyLmdldCA9IGdldDtcblxuXG4vKipcbiAqIExvZGFzaCBgc2V0YCBhbGlhcyB0byBwcml2YXRlIG5hbWVzcGFjZVxuICpcbiAqIEBtZXRob2QgX3NldFxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGNvbGxlY3Rpb246IFRoZSByb290IGNvbGxlY3Rpb24gb2YgdGhlIHRyZWUuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gcHJvcGVydHlQYXRoOiBUaGUgcHJvcGVydHkgcGF0aCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFRoZSBwcm9wZXJ0eSBwYXRoIGluIHRoZSBjb2xsZWN0aW9uLlxuICogQHJldHVybnMgeyp9IFRoZSBgY29sbGVjdGlvbmAgcGFzc2VkIGluIHdpdGggdmFsdWUgc2V0LlxuICovXG5leHBvcnQgdmFyIF9zZXQgPSBfLnNldDtcbmxvZGFzaEVtYmVyLl9zZXQgPSBfc2V0O1xuXG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSB2YWx1ZSBvZiBhIHByb3BlcnR5IGluIGFuIG9iamVjdCB0cmVlLlxuICpcbiAqIEBtZXRob2Qgc2V0XG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gY29sbGVjdGlvbjogVGhlIHJvb3QgY29sbGVjdGlvbiBvZiB0aGUgdHJlZS5cbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBwcm9wZXJ0eVBhdGg6IFRoZSBwcm9wZXJ0eSBwYXRoIGluIHRoZSBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gc2V0IG9uIHRoZSBjb2xsZWN0aW9uLlxuICogQHJldHVybnMgeyp9IFRoZSBgY29sbGVjdGlvbmAgcGFzc2VkIGluIHdpdGggdmFsdWUgc2V0LlxuICovXG5leHBvcnQgdmFyIHNldCA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIHByb3BlcnR5UGF0aCwgdmFsdWUpIHtcbiAgLy8gSGFuZGxlIEVtYmVyIE9iamVjdHNcbiAgaWYgKGlzRW1iZXJPYmplY3QoY29sbGVjdGlvbikgfHwgaXNFbWJlck9iamVjdFByb3h5KGNvbGxlY3Rpb24pKSB7XG4gICAgY29sbGVjdGlvbi5zZXQocHJvcGVydHlQYXRoLCB2YWx1ZSk7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cblxuICByZXR1cm4gX3NldCguLi5hcmd1bWVudHMpO1xufTtcbmxvZGFzaEVtYmVyLnNldCA9IHNldDtcblxuXG4vKipcbiAqIE9yaWdpbmFsIGxvZGFzaCBpc0VtcHR5XG4gKlxuICogQG1ldGhvZCBfaXNFbXB0eVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBfaXNFbXB0eSA9IF8uaXNFbXB0eTtcbmxvZGFzaEVtYmVyLl9pc0VtcHR5ID0gX2lzRW1wdHk7XG5cblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIHRoZSB2YWx1ZSBpcyBlbXB0eSBvciBub3RcbiAqXG4gKiBAbWV0aG9kIGlzRW1wdHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNFbXB0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmIChcbiAgICBfLmlzRW1iZXJBcnJheVByb3h5KHZhbHVlKSAmJlxuICAgIF8uaXNGdW5jdGlvbih2YWx1ZS5pc0VtcHR5KVxuICApIHtcbiAgICByZXR1cm4gdmFsdWUuaXNFbXB0eSgpO1xuICB9XG5cbiAgcmV0dXJuIF9pc0VtcHR5KC4uLmFyZ3VtZW50cyk7XG59O1xubG9kYXNoRW1iZXIuaXNFbXB0eSA9IGlzRW1wdHk7XG5cblxuLyoqXG4gKiBPcmlnaW5hbCBsb2Rhc2ggY2xvbmVcbiAqXG4gKiBAbWV0aG9kIF9jbG9uZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7Kn1cbiAqL1xuZXhwb3J0IHZhciBfY2xvbmUgPSBfLmNsb25lO1xubG9kYXNoRW1iZXIuX2Nsb25lID0gX2Nsb25lO1xuXG5cbi8qKlxuICogUmV0dXJucyBhIGNsb25lZCBjb3B5IG9mIHZhbHVlXG4gKlxuICogQG1ldGhvZCBjbG9uZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7Kn1cbiAqL1xuZXhwb3J0IHZhciBjbG9uZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIC8vIFRPRE86IENyZWF0ZSBzb21lIHNvcnQgb2YgY2xvbmUgZm9yIEVtYmVyIE9iamVjdHMgYW5kIEFycmF5c1xuICByZXR1cm4gX2Nsb25lKC4uLmFyZ3VtZW50cyk7XG59O1xubG9kYXNoRW1iZXIuY2xvbmUgPSBjbG9uZTtcblxuXG4vKipcbiAqIEFsaWFzIGZvciBgYXJyYXkucG9wYCBvciBgYXJyYXlQcm94eS5wb3BPYmplY3RgXG4gKlxuICogQG1ldGhvZCBwb3BcbiAqIEBwYXJhbSB7QXJyYXl8RW1iZXIuQXJyYXlQcm94eX0gdmFsdWVcbiAqIEByZXR1cm4geyp9XG4gKi9cbmV4cG9ydCB2YXIgcG9wID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIChfLmlzRW1iZXJBcnJheVByb3h5KHZhbHVlKSkgPyB2YWx1ZS5wb3BPYmplY3QoKSA6IHZhbHVlLnBvcCgpO1xufTtcbmxvZGFzaEVtYmVyLnBvcCA9IHBvcDtcblxuXG4vKipcbiAqIEFsaWFzIGZvciBgYXJyYXkuc2hpZnRgIG9yIGBhcnJheVByb3h5LnNoaWZ0T2JqZWN0YFxuICpcbiAqIEBtZXRob2Qgc2hpZnRcbiAqIEBwYXJhbSB7QXJyYXl8RW1iZXIuQXJyYXlQcm94eX0gdmFsdWVcbiAqIEByZXR1cm4geyp9XG4gKi9cbmV4cG9ydCB2YXIgc2hpZnQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKF8uaXNFbWJlckFycmF5UHJveHkodmFsdWUpKSA/IHZhbHVlLnNoaWZ0T2JqZWN0KCkgOiB2YWx1ZS5zaGlmdCgpO1xufTtcbmxvZGFzaEVtYmVyLnNoaWZ0ID0gc2hpZnQ7XG5cblxuLyoqXG4gKiBFbWJlciBgdHlwZU9mYCBhbGlhc1xuICpcbiAqIEBtZXRob2QgdHlwZU9mXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7U3RyaW5nfSBUaGUgdHlwZSBvZiBgdmFsdWVgXG4gKi9cbmV4cG9ydCB2YXIgdHlwZU9mID0gKHZhbHVlKSA9PiBFbWJlci50eXBlT2YodmFsdWUpO1xubG9kYXNoRW1iZXIudHlwZU9mID0gdHlwZU9mO1xuXG5cbi8qKlxuICogUlNWUCByZXNvbHZlIGhlbHBlclxuICpcbiAqIEBtZXRob2QgcHJvbWlzZVJlc29sdmVcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIHJlc29sdmUgd2l0aFxuICogQHJldHVybiB7UHJvbWlzZX1cbiAqL1xuZXhwb3J0IHZhciBwcm9taXNlUmVzb2x2ZSA9ICh2YWx1ZSkgPT4ge1xuICByZXR1cm4gRW1iZXIuUlNWUC5yZXNvbHZlKHZhbHVlKTtcbn07XG5sb2Rhc2hFbWJlci5wcm9taXNlUmVzb2x2ZSA9IHByb21pc2VSZXNvbHZlO1xuXG5cbi8qKlxuICogUlNWUCByZWplY3QgaGVscGVyXG4gKlxuICogQG1ldGhvZCBwcm9taXNlUmVqZWN0XG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byByZXNvbHZlIHdpdGhcbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKi9cbmV4cG9ydCB2YXIgcHJvbWlzZVJlamVjdCA9IChtZXNzYWdlKSA9PiB7XG4gIG1lc3NhZ2UgPSBfLmVuc3VyZVN0cmluZyhtZXNzYWdlKTtcbiAgcmV0dXJuIEVtYmVyLlJTVlAucmVqZWN0KGNvbnNvbGUuZXJyb3IobWVzc2FnZSkpO1xufTtcbmxvZGFzaEVtYmVyLnByb21pc2VSZWplY3QgPSBwcm9taXNlUmVqZWN0O1xuXG5cbi8qKlxuICogR2VuZXJhdGUgZGVlcCBgaXNgIG1ldGhvZHMgYW5kIG92ZXJyaWRlIHN0YW5kYXJkIG1ldGhvZHMgdG8gaGFuZGxlIGJvdGhcbiAqXG4gKiBAbWV0aG9kIGlze0NvbmRpdGlvbn1cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZTogQmFzZSB2YWx1ZSB0byBsb29rIHRocm91Z2hcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wU3RyaW5nOiBQcm9wZXJ0eSBzdHJpbmcgdG8gYXBwbHkgdG8gYGdldGBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmxvZGFzaFV0aWxzLmJ1aWxkSXNNZXRob2RzKGxvZGFzaEVtYmVyLCBsb2Rhc2hFbWJlcik7XG5cblxuZXhwb3J0IHZhciBsb2Rhc2hFbWJlcjtcbmV4cG9ydCBkZWZhdWx0IGxvZGFzaEVtYmVyO1xuIiwiaW1wb3J0IGxvZGFzaFV0aWxzIGZyb20gJy4vX2NvcmUvbG9kYXNoLXV0aWxzJztcblxuXG4vKipcbiAqIENvbGxlY3Rpb24gb2YgYWxsIHRoZSB1dGlscyBpbiBoZXJlLiBBZGQgdG8gdGhpcyBhcyB5b3UgZ28uXG4gKi9cbmxldCBsb2Rhc2hFeHRyYXMgPSB7fTtcblxuXG4vKipcbiAqIEhlbHBlciB0byBjaGVjayBpZiBhIHZhcmlhYmxlIGlzIGRlZmluZWQgYW5kIHByZXNlbnRcbiAqXG4gKiBAbWV0aG9kIGlzUHJlc2VudFxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNQcmVzZW50ID0gKHZhbHVlKSA9PiAoIV8uaXNVbmRlZmluZWQodmFsdWUpICYmICFfLmlzTnVsbCh2YWx1ZSkpO1xubG9kYXNoRXh0cmFzLmlzUHJlc2VudCA9IGlzUHJlc2VudDtcblxuXG4vKipcbiAqIEhlbHBlciB0byBjaGVjayBpZiBhIHZhcmlhYmxlIGlzIGRlZmluZWQgYW5kIHByZXNlbnRcbiAqXG4gKiBAbWV0aG9kIGlzQmxhbmtcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzQmxhbmsgPSAodmFsdWUpID0+ICFfLmlzUHJlc2VudCh2YWx1ZSk7XG5sb2Rhc2hFeHRyYXMuaXNCbGFuayA9IGlzQmxhbms7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY2hlY2sgaWYgYSB2YXJpYWJsZSBpcyBhIGRhdGVcbiAqXG4gKiBAbWV0aG9kIGlzRGF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNEYXRlID0gKHZhbHVlKSA9PiBfLnR5cGVPZih2YWx1ZSkgPT09ICdkYXRlJztcbmxvZGFzaEV4dHJhcy5pc0RhdGUgPSBpc0RhdGU7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY2hlY2sgaWYgYSB2YXJpYWJsZSBpcyBhIHByb21pc2VcbiAqXG4gKiBAbWV0aG9kIGlzUHJvbWlzZVxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNQcm9taXNlID0gKHZhbHVlKSA9PiBfLmlzRnVuY3Rpb24odmFsdWUsICd0aGVuJyk7XG5sb2Rhc2hFeHRyYXMuaXNQcm9taXNlID0gaXNQcm9taXNlO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNoZWNrIGEgdmFsdWUgZm9yIGFuIGFycmF5IG9mIExvRGFzaCBib29sZWFuIGNvbmRpdGlvbnNcbiAqIFRPRE86IE5hbWUgdGhpcyBgaXNBbmRgIGFuZCBjcmVhdGUgYGlzT3JgLi4uXG4gKlxuICogQG1ldGhvZCBpc1xuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEBwYXJhbSB7QXJyYXl9IGNvbmRpdGlvbnM6IExvRGFzaCBtZXRob2RzIHRvIGhhdmUgdmFsdWUgdGVzdGVkIGFnYWluc3QgKGFzIHN0cmluZ3MpXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzID0gZnVuY3Rpb24odmFsdWUsIGNvbmRpdGlvbnMpIHtcbiAgaWYgKF8uaXNTdHJpbmcoY29uZGl0aW9ucykpIGNvbmRpdGlvbnMgPSBbY29uZGl0aW9uc107XG4gIGlmIChfLmlzUHJlc2VudChjb25kaXRpb25zKSAmJiAhXy5pc0FycmF5KGNvbmRpdGlvbnMpKSBjb25kaXRpb25zID0gW107XG4gIGlmIChjb25kaXRpb25zLmxlbmd0aCA8PSAxKSBjb25zb2xlLmVycm9yKFwiRG9uJ3QgY2FsbCBgaXNgIGhlbHBlciB3aXRoIGp1c3Qgb25lIGNvbmRpdGlvbi0gdXNlIHRoYXQgY29uZGl0aW9uIGRpcmVjdGx5XCIpO1xuICByZXR1cm4gXy5ldmVyeShjb25kaXRpb25zLCBmdW5jdGlvbihjb25kaXRpb24pIHtcbiAgICBsZXQgcmVzdWx0LCBub3Q7XG5cbiAgICAvLyBDaGVjayBmb3IgdmFsaWQgY29uZGl0aW9uXG4gICAgaWYgKCFfLmlzU3RyaW5nKGNvbmRpdGlvbikpIHtcbiAgICAgIGNvbnNvbGUud2FybihcImBjb25kaXRpb25gIHdhcyBub3QgYSBzdHJpbmc6IFwiICsgY29uZGl0aW9uKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgbm90IGNvbmRpdGlvblxuICAgIG5vdCA9IGZhbHNlO1xuICAgIGlmIChfLnN0YXJ0c1dpdGgoY29uZGl0aW9uLCAnIScpKSB7XG4gICAgICBub3QgPSB0cnVlO1xuICAgICAgY29uZGl0aW9uID0gY29uZGl0aW9uLnJlcGxhY2UoJyEnLCAnJyk7XG4gICAgfVxuXG4gICAgLy8gQmUgRVhUUkEgKHRvbykgaGVscGZ1bCAocHJlcGVuZCAnaXMnIGlmIG9tbWl0dGVkKVxuICAgIGlmICghXy5zdGFydHNXaXRoKGNvbmRpdGlvbiwgJ2lzJykpIHtcbiAgICAgIGNvbmRpdGlvbiA9ICdpcycgKyBjb25kaXRpb247XG4gICAgfVxuXG4gICAgLy8gTWFrZSBzdXJlIGBjb25kaXRpb25gIGlzIGEgdmFsaWQgbG9kYXNoIG1ldGhvZFxuICAgIGlmICghXy5pc0Z1bmN0aW9uKF9bY29uZGl0aW9uXSkpIHtcbiAgICAgIGNvbnNvbGUud2FybihcImBjb25kaXRpb25gIHdhcyBub3QgYSB2YWxpZCBsb2Rhc2ggbWV0aG9kOiBcIiArIGNvbmRpdGlvbik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gRGV0ZXJtaW5lIHJlc3VsdCBhbmQgcmV0dXJuXG4gICAgcmVzdWx0ID0gX1tjb25kaXRpb25dKHZhbHVlKTtcbiAgICBpZiAobm90ID09PSB0cnVlKSByZXR1cm4gIXJlc3VsdDtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pO1xufTtcbmxvZGFzaEV4dHJhcy5pcyA9IGlzO1xuXG5cbi8qKlxuICogR2VuZXJhdGUgYGVuc3VyZWAgbWV0aG9kcy0gRW5zdXJlIHRoYXQgdmFsdWUgaXMgb2YgdHlwZSB4XG4gKlxuICogQG1ldGhvZCBlbnN1cmV7VHlwZX1cbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFRvIGNoZWNrXG4gKiBAcGFyYW0geyp9IFt2YWx1ZURlZmF1bHQ9ZGVmYXVsdHNbY29uZGl0aW9uXTogV2hhdCB0byBkZWZhdWx0IHRvXG4gKiBAcmV0dXJuIHsqfSBFbnN1cmVkIHZhbHVlXG4gKi9cbl8uZm9yRWFjaChcbiAgXy5rZXlzKGxvZGFzaFV0aWxzLnR5cGVEZWZhdWx0cygpKSxcbiAgKHR5cGUpID0+IHtcbiAgICBsb2Rhc2hFeHRyYXNbYGVuc3VyZSR7dHlwZX1gXSA9IGxvZGFzaFV0aWxzLm1ha2VFbnN1cmVUeXBlKHR5cGUpO1xuICB9XG4pO1xuXG5cbi8qKlxuICogSmF2YXNjcmlwdCBgdHlwZW9mYCBhbGlhc1xuICpcbiAqIEBtZXRob2QgdHlwZU9mXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7U3RyaW5nfSBUaGUgdHlwZSBvZiBgdmFsdWVgXG4gKi9cbmV4cG9ydCB2YXIgdHlwZU9mID0gKHZhbHVlKSA9PiB0eXBlb2YgdmFsdWU7XG5sb2Rhc2hFeHRyYXMudHlwZU9mID0gdHlwZU9mO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGxvZGFzaEV4dHJhcztcbiIsIi8qKlxuICogQ29sbGVjdGlvbiBvZiBhbGwgdGhlIHV0aWxzIGluIGhlcmUuIEFkZCB0byB0aGlzIGFzIHlvdSBnby5cbiAqL1xubGV0IGxvZGFzaE1vbWVudCA9IHt9O1xuXG5cbi8qKlxuICogQ2hlY2sgaWYgYSB2YXJpYWJsZSBpcyBhIG1vbWVudCBkYXRlIG9iamVjdFxuICpcbiAqIEBtZXRob2QgaXNNb21lbnRcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzTW9tZW50ID0gKHZhbHVlKSA9PiB7XG4gIHJldHVybiAoXG4gICAgXy5pc09iamVjdCh2YWx1ZSkgJiZcbiAgICB2YWx1ZS5faXNBTW9tZW50T2JqZWN0ID09PSB0cnVlXG4gICk7XG59O1xubG9kYXNoTW9tZW50LmlzTW9tZW50ID0gaXNNb21lbnQ7XG5cblxuLyoqXG4gKiBFbnN1cmUgdmFsdWUgaXMgYSBtb21lbnQgb2JqZWN0LlxuICogSWYgbm90LCB0cmllcyB0byBjcmVhdGUgYSBtb21lbnQgb2JqZWN0IGZyb20gdmFsdWUsXG4gKiBvdGhlcndpc2UgcmV0dXJucyBtb21lbnQoKS5cbiAqXG4gKiBAbWV0aG9kIGVuc3VyZU1vbWVudFxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge01vbWVudH1cbiAqL1xuZXhwb3J0IHZhciBlbnN1cmVNb21lbnQgPSAodmFsdWUpID0+IHtcbiAgaWYgKGlzTW9tZW50KHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuICB2YWx1ZSA9IG1vbWVudCh2YWx1ZSk7XG4gIGlmICh2YWx1ZS5pc1ZhbGlkKCkpIHJldHVybiB2YWx1ZTtcbiAgcmV0dXJuIG1vbWVudCgpO1xufTtcbmxvZGFzaE1vbWVudC5lbnN1cmVNb21lbnQgPSBlbnN1cmVNb21lbnQ7XG5cblxuZXhwb3J0IGRlZmF1bHQgbG9kYXNoTW9tZW50O1xuIl19
