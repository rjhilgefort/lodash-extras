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

var _lodashEmber = require('./lodash-ember');

var _lodashEmber2 = _interopRequireDefault(_lodashEmber);

// Must be last to override above methods programmatically

var _lodashDeepExtras = require('./lodash-deep-extras');

var _lodashDeepExtras2 = _interopRequireDefault(_lodashDeepExtras);

_.mixin(_lodashExtras2['default']);
if (_.isPresent(window.Ember)) _.mixin(_lodashEmber2['default']);
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
lodashExtras.isMoment = isMoment;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcmpoaWxnZWZvcnQvRHJvcGJveC9Qcm9qZWN0cy9sb2Rhc2gtZXh0cmFzL3NyYy9fY29yZS9sb2Rhc2gtdXRpbHMuanMiLCIvVXNlcnMvcmpoaWxnZWZvcnQvRHJvcGJveC9Qcm9qZWN0cy9sb2Rhc2gtZXh0cmFzL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1kZWVwLWV4dHJhcy5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1lbWJlci5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1leHRyYXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0dBLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7QUFTZCxJQUFJLFlBQVksR0FBRyxTQUFmLFlBQVksR0FBUztBQUM5QixTQUFPO0FBQ0wsWUFBUSxFQUFFLEVBQUU7QUFDWixXQUFPLEVBQUUsRUFBRTtBQUNYLGlCQUFhLEVBQUUsRUFBRTtBQUNqQixhQUFTLEVBQUUsS0FBSztBQUNoQixZQUFRLEVBQUUsQ0FBQztHQUNaLENBQUM7Q0FDSCxDQUFDOztBQUNGLFdBQVcsQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDOzs7Ozs7Ozs7QUFVakMsSUFBSSxVQUFVLEdBQUcsU0FBYixVQUFVLENBQUksS0FBSyxFQUFLO0FBQ2pDLFNBQU8sVUFBUyxLQUFLLEVBQUU7QUFDckIsV0FBUSxLQUFLLFlBQVksS0FBSyxDQUFFO0dBQ2pDLENBQUM7Q0FDSCxDQUFDOztBQUNGLFdBQVcsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFD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LENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0NBQUMsQ0FBQzs7QUFDOUUsWUFBWSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7Ozs7Ozs7OztBQVU1QixJQUFJLE9BQU8sR0FBRyxTQUFWLE9BQU8sQ0FBSSxLQUFLO1NBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztDQUFBLENBQUM7O0FBQ3BELFlBQVksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7Ozs7Ozs7QUFVeEIsSUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFNLENBQUksS0FBSztTQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssTUFBTTtDQUFBLENBQUM7O0FBQzFELFlBQVksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOzs7Ozs7Ozs7QUFVdEIsSUFBSSxRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUksS0FBSyxFQUFLO0FBQy9CLFNBQ0UsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFDakIsS0FBSyxDQUFDLGdCQUFnQixLQUFLLElBQUksQ0FDL0I7Q0FDSCxDQUFDOztBQUNGLFlBQVksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOzs7Ozs7Ozs7QUFVMUIsSUFBSSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQUksS0FBSztTQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQztDQUFBLENBQUM7O0FBQzlELFlBQVksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDOzs7Ozs7Ozs7OztBQVk1QixJQUFJLEVBQUUsR0FBRyxTQUFMLEVBQUUsQ0FBWSxLQUFLLEVBQUUsVUFBVSxFQUFFO0FBQzFDLE1BQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxVQUFVLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN0RCxNQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDdkUsTUFBSSxVQUFVLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLDZFQUE2RSxDQUFDLENBQUM7QUFDekgsU0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxVQUFTLFNBQVMsRUFBRTtBQUM3QyxRQUFJLE1BQU0sWUFBQTtRQUFFLEdBQUcsWUFBQSxDQUFDOzs7QUFHaEIsUUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDMUIsYUFBTyxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsR0FBRyxTQUFTLENBQUMsQ0FBQztBQUMzRCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7QUFHRCxPQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ1osUUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsRUFBRTtBQUNoQyxTQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ1gsZUFBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ3hDOzs7QUFHRCxRQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEVBQUU7QUFDbEMsZUFBUyxHQUFHLElBQUksR0FBRyxTQUFTLENBQUM7S0FDOUI7OztBQUdELFFBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFO0FBQy9CLGFBQU8sQ0FBQyxJQUFJLENBQUMsNkNBQTZDLEdBQUcsU0FBUyxDQUFDLENBQUM7QUFDeEUsYUFBTyxLQUFLLENBQUM7S0FDZDs7O0FBR0QsVUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QixRQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQzs7QUFFakMsV0FBTyxNQUFNLENBQUM7R0FDZixDQUFDLENBQUM7Q0FDSixDQUFDOztBQUNGLFlBQVksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDOzs7Ozs7Ozs7O0FBV3JCLENBQUMsQ0FBQyxPQUFPLENBQ1AsQ0FBQyxDQUFDLElBQUksQ0FBQyw2QkFBWSxZQUFZLEVBQUUsQ0FBQyxFQUNsQyxVQUFDLElBQUksRUFBSztBQUNSLGNBQVksWUFBVSxJQUFJLENBQUcsR0FBRyw2QkFBWSxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDbEUsQ0FDRixDQUFDOzs7Ozs7Ozs7QUFVSyxJQUFJLE1BQU0sR0FBRyxTQUFULE1BQU0sQ0FBSSxLQUFLO1NBQUssT0FBTyxLQUFLO0NBQUEsQ0FBQzs7QUFDNUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O3FCQUdkLFlBQVkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDb2xsZWN0aW9uIG9mIGFsbCB0aGUgdXRpbHMgaW4gaGVyZS4gQWRkIHRvIHRoaXMgYXMgeW91IGdvLlxuICovXG5sZXQgbG9kYXNoVXRpbHMgPSB7fTtcblxuXG4vKipcbiAqIEhlbHBlciBmb3IgSlMgdHlwZXMgYW5kIGRlZmF1bHRzIGZvciBlYWNoIHR5cGVcbiAqXG4gKiBAbWV0aG9kIHR5cGVEZWZhdWx0c1xuICogQHJldHVybiB7UGxhaW5PYmplY3R9XG4gKi9cbmV4cG9ydCB2YXIgdHlwZURlZmF1bHRzID0gKCkgPT4ge1xuICByZXR1cm4ge1xuICAgICdTdHJpbmcnOiAnJyxcbiAgICAnQXJyYXknOiBbXSxcbiAgICAnUGxhaW5PYmplY3QnOiB7fSxcbiAgICAnQm9vbGVhbic6IGZhbHNlLFxuICAgICdOdW1iZXInOiAxXG4gIH07XG59O1xubG9kYXNoVXRpbHMudHlwZURlZmF1bHRzID0gdHlwZURlZmF1bHRzO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIG1ha2UgYF8uaXNFbWJlcntDbGFzc31gXG4gKlxuICogQG1ldGhvZCBtYWtlSXNUeXBlXG4gKiBAcGFyYW0geyp9IGtsYXNzOiBBIGNsYXNzIHRvIGNoZWNrIGluc3RhbmNlb2YgYWdhaW5zdFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKi9cbmV4cG9ydCB2YXIgbWFrZUlzVHlwZSA9IChrbGFzcykgPT4ge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gKHZhbHVlIGluc3RhbmNlb2Yga2xhc3MpO1xuICB9O1xufTtcbmxvZGFzaFV0aWxzLm1ha2VJc1R5cGUgPSBtYWtlSXNUeXBlO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIG1ha2UgYF8uZW5zdXJlVHlwZWBcbiAqXG4gKiBAbWV0aG9kIG1ha2VFbnN1cmVUeXBlXG4gKiBAcGFyYW0ge1N0cmluZ30gY29uZGl0aW9uOiBMb2Rhc2ggbWV0aG9kIHRvIGFwcGx5XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqL1xuZXhwb3J0IHZhciBtYWtlRW5zdXJlVHlwZSA9IChjb25kaXRpb24pID0+IHtcbiAgbGV0IGRlZmF1bHRzID0gbG9kYXNoVXRpbHMudHlwZURlZmF1bHRzKCk7XG5cbiAgLy8gQ2hlY2sgcGFyYW1zOiBjb25kaXRpb25cbiAgaWYgKCFfLmlzU3RyaW5nKGNvbmRpdGlvbikpIGNvbmRpdGlvbiA9ICcnO1xuICBjb25kaXRpb24gPSBfLmNhcGl0YWxpemUoY29uZGl0aW9uKTtcbiAgaWYgKCFfLmNvbnRhaW5zKF8ua2V5cyhkZWZhdWx0cyksIGNvbmRpdGlvbikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFxcYGNvbmRpdGlvblxcYCBub3Qgc3VwcG9ydGVkOiAke2NvbmRpdGlvbn1gKTtcbiAgfVxuXG4gIC8vIFNob3J0Y3V0XG4gIGxldCBpc0NvbmRpdGlvbiA9IF9bYGlzJHtjb25kaXRpb259YF07XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBmb3IgYGVuc3VyZVR5cGVgIG1ldGhvZHNcbiAgICpcbiAgICogQG1ldGhvZCBgZW5zdXJlJHt0eXBlfWBcbiAgICogQHBhcmFtIHsqfSB2YWx1ZTogVG8gY2hlY2tcbiAgICogQHBhcmFtIHsqfSBbdmFsdWVEZWZhdWx0PWRlZmF1bHRzW2NvbmRpdGlvbl06IFdoYXQgdG8gZGVmYXVsdCB0b1xuICAgKiBAcmV0dXJuIHsqfSBEZWZhdWx0ZWQgdmFsdWUsIG9yIHRoZSB2YWx1ZSBpdHNlbGYgaWYgcGFzc1xuICAgKi9cbiAgcmV0dXJuICh2YWx1ZSwgdmFsdWVEZWZhdWx0KSA9PiB7XG4gICAgLy8gRGV0ZXJtaW5lIGB2YWx1ZURlZmF1bHRgOiBpZiBub3RoaW5nIHByb3ZpZGVkLCBvciBwcm92aWRlZCBkb2Vzbid0IG1hdGNoIHR5cGVcbiAgICBpZiAoXy5pc1VuZGVmaW5lZCh2YWx1ZURlZmF1bHQpIHx8ICFpc0NvbmRpdGlvbih2YWx1ZURlZmF1bHQpKSB7XG4gICAgICB2YWx1ZURlZmF1bHQgPSBfLmNsb25lKGRlZmF1bHRzW2NvbmRpdGlvbl0pO1xuICAgIH1cblxuICAgIC8vIEFjdHVhbCBcImVuc3VyZVwiIGNoZWNrXG4gICAgaWYgKCFfW2BpcyR7Y29uZGl0aW9ufWBdKHZhbHVlKSkgdmFsdWUgPSB2YWx1ZURlZmF1bHQ7XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59O1xubG9kYXNoVXRpbHMubWFrZUVuc3VyZVR5cGUgPSBtYWtlRW5zdXJlVHlwZTtcblxuXG4vKipcbiAqIEhlbHBlciB0byBtYWtlIGBfLmRlZXBFbnN1cmV7VHlwZX1gXG4gKlxuICogQG1ldGhvZCBtYWtlRGVlcEVuc3VyZVR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbmRpdGlvbjogTG9kYXNoIG1ldGhvZCB0byBhcHBseVxuICogQHBhcmFtIHsqfSB2YWx1ZURlZmF1bHQ6IFdoYXQgdG8gYXNzaWduIHdoZW4gbm90IG9mIHRoZSBkZXNpcmVkIHR5cGVcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5leHBvcnQgdmFyIG1ha2VEZWVwRW5zdXJlVHlwZSA9IChjb25kaXRpb24pID0+IHtcbiAgcmV0dXJuIChjb2xsZWN0aW9uLCBwcm9wU3RyaW5nLCB2YWx1ZURlZmF1bHQpID0+IHtcbiAgICByZXR1cm4gXy5zZXQoXG4gICAgICBjb2xsZWN0aW9uLFxuICAgICAgcHJvcFN0cmluZyxcbiAgICAgIGxvZGFzaFV0aWxzLm1ha2VFbnN1cmVUeXBlKGNvbmRpdGlvbikoXG4gICAgICAgIF8uZ2V0KGNvbGxlY3Rpb24sIHByb3BTdHJpbmcpLFxuICAgICAgICB2YWx1ZURlZmF1bHRcbiAgICAgIClcbiAgICApO1xuICB9O1xufTtcbmxvZGFzaFV0aWxzLm1ha2VEZWVwRW5zdXJlVHlwZSA9IG1ha2VEZWVwRW5zdXJlVHlwZTtcblxuXG4vKipcbiAqIERldGVybWluZWQgaWYgbG9kYXNoIGtleS9tZXRob2QgaXMgdmFsaWQgdG8gbWFrZSBkZWVwIChgaXNgIG1ldGhvZHMgdGhhdCBvbmx5IGhhdmUgb25lIGFyZ3VtZW50KVxuICogTk9URTogQXNzdW1lcyBgdGhpc2AgPT09IGlzIHRoZSBuYW1lc3BhY2UgdG8gY2hlY2sgZm9yIHRoZSBmdW5jdGlvbiBvblxuICpcbiAqIEBtZXRob2QgdmFsaWRJc01ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IGtleTogbWV0aG9kIG5hbWVcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgdmFsaWRJc01ldGhvZCA9IGZ1bmN0aW9uKGtleSkge1xuICByZXR1cm4gKFxuICAgIF8uc3RhcnRzV2l0aChrZXksICdpcycpICYmXG4gICAgKHRoaXNba2V5XS5sZW5ndGggPT09IDEpXG4gICk7XG59O1xubG9kYXNoVXRpbHMudmFsaWRJc01ldGhvZCA9IHZhbGlkSXNNZXRob2Q7XG5cblxuLyoqXG4gKiBGaWx0ZXIgb3V0IGFsbCB2YWxpZCBgaXNgIG1ldGhvZHMgZnJvbSBhIG5hbWVzcGFjZVxuICpcbiAqIEBtZXRob2QgZmlsdGVySXNNZXRob2RzXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlOiBDb2xsZWN0aW9uIG9mIG1ldGhvZHNcbiAqIEByZXR1cm4ge09iamVjdH0gYG5hbWVzcGFjZWAgd2l0aCBqdXN0IHRoZSBcImlzXCIgbWV0aG9kc1xuICovXG5leHBvcnQgdmFyIGZpbHRlcklzTWV0aG9kcyA9IChuYW1lc3BhY2UpID0+IHtcbiAgcmV0dXJuIF8uY2hhaW4obmFtZXNwYWNlKVxuICAgIC5rZXlzKClcbiAgICAuZmlsdGVyKHZhbGlkSXNNZXRob2QsIG5hbWVzcGFjZSlcbiAgICAudmFsdWUoKTtcbn07XG5sb2Rhc2hVdGlscy5maWx0ZXJJc01ldGhvZHMgPSBmaWx0ZXJJc01ldGhvZHM7XG5cblxuLyoqXG4gKiBPdmVybG9hZCBub3JtYWwgbG9kYXNoIG1ldGhvZHMgdG8gaGFuZGxlIGRlZXAgc3ludGF4XG4gKiBUT0RPOiBObyBuZWVkIHRvIHRha2UgdGhlIGZpcnN0IHBhcmFtXG4gKlxuICogQG1ldGhvZCBvdmVybG9hZE1ldGhvZHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBpc01ldGhvZHM6IENvbGxlY3Rpb24gb2YgaXMgbWV0aG9kc1xuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZTogT3JpZ2luYWwgbmFtZXNwYWNlIGlzTWV0aG9kcyBjYW1lIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXQ6IG5hbWVzcGFjZSB0byBvdmVybG9hZCBtZXRob2RzIG9uXG4gKiBAcmV0dXJuIHtVbmRlZmluZWR9XG4gKi9cbmV4cG9ydCB2YXIgb3ZlcmxvYWRNZXRob2RzID0gKGlzTWV0aG9kcywgbmFtZXNwYWNlLCB0YXJnZXQpID0+IHtcbiAgbGV0IG9sZE1ldGhvZCA9IHt9O1xuXG4gIF8uZm9yRWFjaChpc01ldGhvZHMsIChtZXRob2QpID0+IHtcbiAgICAvLyBTYXZlIG9sZCBtZXRob2RcbiAgICBvbGRNZXRob2RbbWV0aG9kXSA9IG5hbWVzcGFjZVttZXRob2RdO1xuXG4gICAgLy8gTWFrZSBuZXcgbWV0aG9kIHRoYXQgYWxzbyBoYW5kbGVzIGBnZXRgLiBBcHBseSBtZXRob2QgdG8gZXhwb3J0cy5cbiAgICB0YXJnZXRbbWV0aG9kXSA9IGZ1bmN0aW9uKHZhbHVlLCBwcm9wU3RyaW5nKSB7XG4gICAgICBpZiAoXy5zaXplKGFyZ3VtZW50cykgPT09IDIpIHtcbiAgICAgICAgcmV0dXJuIG5hbWVzcGFjZVttZXRob2RdKF8uZ2V0KC4uLmFyZ3VtZW50cykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9sZE1ldGhvZFttZXRob2RdKC4uLmFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfSk7XG59O1xubG9kYXNoVXRpbHMub3ZlcmxvYWRNZXRob2RzID0gb3ZlcmxvYWRNZXRob2RzO1xuXG5cbi8qKlxuICogQnVpbGQgYGlzTWV0aG9kc2BcbiAqXG4gKiBAbWV0aG9kIGJ1aWxkSXNNZXRob2RzXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlOiBOYW1lc3BhY2UgdG8gcHVsbCBgaXNgIG1ldGhvZHMgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldDogbmFtZXNwYWNlIHRvIG92ZXJsb2FkIG1ldGhvZHMgb25cbiAqIEByZXR1cm4ge1VuZGVmaW5lZH1cbiAqL1xuZXhwb3J0IHZhciBidWlsZElzTWV0aG9kcyA9IChuYW1lc3BhY2UsIHRhcmdldCkgPT4ge1xuICBvdmVybG9hZE1ldGhvZHMoZmlsdGVySXNNZXRob2RzKG5hbWVzcGFjZSksIG5hbWVzcGFjZSwgdGFyZ2V0KTtcbn1cbmxvZGFzaFV0aWxzLmJ1aWxkSXNNZXRob2RzID0gYnVpbGRJc01ldGhvZHM7XG5cblxuZXhwb3J0IGRlZmF1bHQgbG9kYXNoVXRpbHM7XG4iLCJpbXBvcnQgbG9kYXNoRXh0cmFzIGZyb20gJy4vbG9kYXNoLWV4dHJhcyc7XG5fLm1peGluKGxvZGFzaEV4dHJhcyk7XG5cbi8vIE9ubHkgbWl4aW4gZW1iZXItZXh0cmFzIGlmIGF2YWlsYWJsZVxuaW1wb3J0IGxvZGFzaEVtYmVyIGZyb20gJy4vbG9kYXNoLWVtYmVyJztcbmlmIChfLmlzUHJlc2VudCh3aW5kb3cuRW1iZXIpKSBfLm1peGluKGxvZGFzaEVtYmVyKTtcblxuLy8gTXVzdCBiZSBsYXN0IHRvIG92ZXJyaWRlIGFib3ZlIG1ldGhvZHMgcHJvZ3JhbW1hdGljYWxseVxuaW1wb3J0IGxvZGFzaERlZXBFeHRyYXMgZnJvbSAnLi9sb2Rhc2gtZGVlcC1leHRyYXMnO1xuXy5taXhpbihsb2Rhc2hEZWVwRXh0cmFzKTtcbiIsImltcG9ydCBsb2Rhc2hVdGlscyBmcm9tICcuL19jb3JlL2xvZGFzaC11dGlscyc7XG5pbXBvcnQgbG9kYXNoRXh0cmFzIGZyb20gJy4vbG9kYXNoLWV4dHJhcyc7XG5cblxuLy8gQWxsIGxvZGFzaCBleHRyYURlZXAgbWV0aG9kcyB0byBleHBvcnRcbmxldCBsb2Rhc2hEZWVwRXh0cmFzID0ge307XG5cblxuLyoqXG4gKiBHZW5lcmF0ZSBkZWVwIGBpc2AgbWV0aG9kcyBhbmQgb3ZlcnJpZGUgc3RhbmRhcmQgbWV0aG9kcyB0byBoYW5kbGUgYm90aFxuICpcbiAqIEBtZXRob2QgaXN7Q29uZGl0aW9ufVxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlOiBCYXNlIHZhbHVlIHRvIGxvb2sgdGhyb3VnaFxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BTdHJpbmc6IFByb3BlcnR5IHN0cmluZyB0byBhcHBseSB0byBgZ2V0YFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xubG9kYXNoVXRpbHMuYnVpbGRJc01ldGhvZHMoXywgbG9kYXNoRGVlcEV4dHJhcyk7XG5sb2Rhc2hVdGlscy5idWlsZElzTWV0aG9kcyhsb2Rhc2hFeHRyYXMsIGxvZGFzaERlZXBFeHRyYXMpO1xuXG5cbi8qKlxuICogR2VuZXJhdGUgYGVuc3VyZWAgbWV0aG9kcy0gRW5zdXJlIHRoYXQgdmFsdWUgaXMgb2YgdHlwZSB4LCBkZWVwbHlcbiAqXG4gKiBAbWV0aG9kIGRlZXBFbnN1cmV7VHlwZX1cbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb2xsZWN0aW9uOiBUaGUgcm9vdCBjb2xsZWN0aW9uIG9mIHRoZSB0cmVlLlxuICogQHBhcmFtIHtTdHJpbmd9IHByb3BTdHJpbmc6IE5lc3RlZCBwcm9wZXJ0eSBwYXRoIG9mIHZhbHVlIHRvIGNoZWNrXG4gKiBAcGFyYW0geyp9IFt2YWx1ZURlZmF1bHQ9ZGVmYXVsdHNbY29uZGl0aW9uXTogV2hhdCB0byBkZWZhdWx0IHRvXG4gKiBAcmV0dXJuIHsqfSBDb2xsZWN0aW9uLCB3aXRoIGVuc3VyZWQgcHJvcGVydHlcbiAqL1xuXy5mb3JFYWNoKF8ua2V5cyhsb2Rhc2hVdGlscy50eXBlRGVmYXVsdHMoKSksICh0eXBlKSA9PiB7XG4gIGxvZGFzaEV4dHJhc1tgZGVlcEVuc3VyZSR7dHlwZX1gXSA9IGxvZGFzaFV0aWxzLm1ha2VEZWVwRW5zdXJlVHlwZSh0eXBlKTtcbn0pO1xuXG5cbi8qKlxuICogRGVsZXRlIGRlZXBseSBuZXN0ZWQgcHJvcGVydGllcyB3aXRob3V0IGNoZWNraW5nIGV4aXN0ZW5jZSBkb3duIHRoZSB0cmVlIGZpcnN0XG4gKiBUT0RPOiBURVNUIFRFU1QgVEVTVC4gVGhpcyBpcyBleHBlcmltZW50YWwgKFdJUClcbiAqXG4gKiBAbWV0aG9kIGRlZXBEZWxldGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcFN0cmluZzogUHJvcGVydHkgc3RyaW5nIHRvIGFwcGx5IHRvIGBnZXRgXG4gKiBAcmV0dXJuIHt1bmRlZmluZWR9IERvZXNuJ3QgcmV0dXJuIHN1Y2Nlc3MvZmFpbHVyZSwgdG8gbWF0Y2ggYGRlbGV0ZWAncyByZXR1cm5cbiAqL1xuZXhwb3J0IHZhciBkZWVwRGVsZXRlID0gZnVuY3Rpb24odmFsdWUsIHByb3BTdHJpbmcpIHtcbiAgbGV0IGN1cnJlbnRWYWx1ZSwgaTtcblxuICAvLyBEZWxldGUgaWYgcHJlc2VudFxuICBpZiAoXy5pc1ByZXNlbnQodmFsdWUsIHByb3BTdHJpbmcpKSB7XG4gICAgY3VycmVudFZhbHVlID0gdmFsdWU7XG4gICAgcHJvcFN0cmluZyA9IF8ocHJvcFN0cmluZykudG9TdHJpbmcoKS5zcGxpdCgnLicpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IChwcm9wU3RyaW5nLmxlbmd0aCAtIDEpOyBpKyspIHtcbiAgICAgIGN1cnJlbnRWYWx1ZSA9IGN1cnJlbnRWYWx1ZVtwcm9wU3RyaW5nW2ldXTtcbiAgICB9XG5cbiAgICBkZWxldGUgY3VycmVudFZhbHVlW3Byb3BTdHJpbmdbaV1dO1xuICB9XG59O1xubG9kYXNoRGVlcEV4dHJhcy5kZWVwRGVsZXRlID0gZGVlcERlbGV0ZTtcblxuXG5leHBvcnQgZGVmYXVsdCBsb2Rhc2hEZWVwRXh0cmFzO1xuIiwiLyoqXG4gKiBUaGlzIHV0aWxpdHkgYXNzdW1lcyBgRW1iZXJgIGV4aXN0cyBnbG9iYWxseVxuICovXG5pbXBvcnQgbG9kYXNoVXRpbHMgZnJvbSAnLi9fY29yZS9sb2Rhc2gtdXRpbHMnO1xuXG5cbi8qKlxuICogQ29sbGVjdGlvbiBvZiBhbGwgdGhlIHV0aWxzIGluIGhlcmUuIEFkZCB0byB0aGlzIGFzIHlvdSBnby5cbiAqL1xuZXhwb3J0IHZhciBsb2Rhc2hFbWJlciA9IHt9O1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhIHZhbHVlIGlzIGFuIGluc3RhbmNlLCBhcyBkZXNpZ25hdGVkIGJ5IEVtYmVyXG4gKlxuICogQG1ldGhvZCBpc0VtYmVySW5zdGFuY2VcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzRW1iZXJJbnN0YW5jZSA9ICh2YWx1ZSkgPT4gRW1iZXIudHlwZU9mKHZhbHVlKSA9PT0gJ2luc3RhbmNlJztcbmxvZGFzaEVtYmVyLmlzRW1iZXJJbnN0YW5jZSA9IGlzRW1iZXJJbnN0YW5jZTtcblxuXG4vKipcbiAqIENoZWNrIHRoYXQgYSB2YWx1ZSBpcywgYXQgbGVhc3QsIGEgc3ViY2xhc3Mgb2YgRW1iZXIuT2JqZWN0XG4gKlxuICogQG1ldGhvZCBpc0VtYmVyT2JqZWN0XG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc0VtYmVyT2JqZWN0ID0gbG9kYXNoVXRpbHMubWFrZUlzVHlwZShFbWJlci5PYmplY3QpO1xubG9kYXNoRW1iZXIuaXNFbWJlck9iamVjdCA9IGlzRW1iZXJPYmplY3Q7XG5cblxuLyoqXG4gKiBOT1RFOiBpc0VtYmVyQXJyYXkgaGFzIGJlZW4gZXhjbHVkZWQgYXMgRW1iZXIuQXJyYXkgaXMgbm90IGFuIEVtYmVyLk9iamVjdFxuICovXG5cblxuLyoqXG4gKiBDaGVjayB0aGF0IGEgdmFsdWUgaXMsIGF0IGxlYXN0LCBhIHN1YmNsYXNzIG9mIEVtYmVyLk9iamVjdFByb3h5XG4gKlxuICogQG1ldGhvZCBpc0VtYmVyT2JqZWN0UHJveHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzRW1iZXJPYmplY3RQcm94eSA9IGxvZGFzaFV0aWxzLm1ha2VJc1R5cGUoRW1iZXIuT2JqZWN0UHJveHkpO1xubG9kYXNoRW1iZXIuaXNFbWJlck9iamVjdFByb3h5ID0gaXNFbWJlck9iamVjdFByb3h5O1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhIHZhbHVlIGlzLCBhdCBsZWFzdCwgYSBzdWJjbGFzcyBvZiBFbWJlci5BcnJheVByb3h5XG4gKlxuICogQG1ldGhvZCBpc0VtYmVyQXJyYXlQcm94eVxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNFbWJlckFycmF5UHJveHkgPSBsb2Rhc2hVdGlscy5tYWtlSXNUeXBlKEVtYmVyLkFycmF5UHJveHkpO1xubG9kYXNoRW1iZXIuaXNFbWJlckFycmF5UHJveHkgPSBpc0VtYmVyQXJyYXlQcm94eTtcblxuXG4vKipcbiAqIENoZWNrIHRoYXQgdGhlIHZhbHVlIGlzIGEgZGVzY2VuZGVudCBvZiBhbiBFbWJlciBDbGFzc1xuICogVE9ETzogQ2hlY2sgdGhhdCBgXy5pc0VtYmVySW5zdGFuY2VgIGRvZXNuJ3QgYWxyZWFkeSB5aWVsZCB0aGUgc2FtZSByZXN1bHRcbiAqXG4gKiBAbWV0aG9kIGlzRW1iZXJDb2xsZWN0aW9uXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc0VtYmVyQ29sbGVjdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiAoXG4gICAgXy5pc0VtYmVyT2JqZWN0KHZhbHVlKSB8fFxuICAgIF8uaXNFbWJlck9iamVjdFByb3h5KHZhbHVlKSB8fFxuICAgIF8uaXNFbWJlckFycmF5UHJveHkodmFsdWUpXG4gICk7XG59O1xubG9kYXNoRW1iZXIuaXNFbWJlckNvbGxlY3Rpb24gPSBpc0VtYmVyQ29sbGVjdGlvbjtcblxuXG4vKipcbiAqIENoZWNrIHRoYXQgdmFsdWUgaXMgRW1iZXIgVHJhbnNpdGlvblxuICpcbiAqIEBtZXRob2QgaXNFbWJlclRyYW5zaXRpb25cbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzRW1iZXJUcmFuc2l0aW9uID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIChcbiAgICBfLmlzRnVuY3Rpb24odmFsdWUsICd0b1N0cmluZycpICYmXG4gICAgXy5jb250YWlucyh2YWx1ZS50b1N0cmluZygpLCAnVHJhbnNpdGlvbicpXG4gICk7XG59O1xubG9kYXNoRW1iZXIuaXNFbWJlclRyYW5zaXRpb24gPSBpc0VtYmVyVHJhbnNpdGlvbjtcblxuXG4vKipcbiAqIExvZGFzaCBmb3JFYWNoXG4gKlxuICogQG1ldGhvZCBfZm9yRWFjaFxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fFN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbmV4cG9ydCB2YXIgX2ZvckVhY2ggPSBfLmZvckVhY2g7XG5sb2Rhc2hFbWJlci5fZm9yRWFjaCA9IF9mb3JFYWNoO1xuXG5cbi8qKlxuICogT3ZlcnJpZGUgbG9kYXNoIGBmb3JFYWNoYCB0byBzdXBwb3J0IGVtYmVyIGFycmF5cy9vYmplY3RzXG4gKlxuICogQG1ldGhvZCBmb3JFYWNoXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8U3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xuZXhwb3J0IHZhciBmb3JFYWNoID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgaWYgKF8uaXNFbWJlckFycmF5UHJveHkoY29sbGVjdGlvbikpIHtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5mb3JFYWNoKGNhbGxiYWNrLCB0aGlzKTtcbiAgfVxuICBpZiAoXy5pc0VtYmVyT2JqZWN0UHJveHkoY29sbGVjdGlvbikgJiYgXy5pc09iamVjdChjb2xsZWN0aW9uLmdldCgnY29udGVudCcpKSkge1xuICAgIHJldHVybiBfZm9yRWFjaChjb2xsZWN0aW9uLmdldCgnY29udGVudCcpLCBjYWxsYmFjaywgdGhpc0FyZyk7XG4gIH1cbiAgcmV0dXJuIF9mb3JFYWNoKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKTtcbn07XG5sb2Rhc2hFbWJlci5mb3JFYWNoID0gZm9yRWFjaDtcblxuXG4vKipcbiAqIExvZGFzaCByZWR1Y2VcbiAqXG4gKiBAbWV0aG9kIF9yZWR1Y2VcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW2N1cnJlbnRWYWx1ZV0gdmFsdWUgYXQgYmVnaW5uaW5nIG9mIGl0ZXJhdGlvblxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fFN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbmV4cG9ydCB2YXIgX3JlZHVjZSA9IF8ucmVkdWNlO1xubG9kYXNoRW1iZXIuX3JlZHVjZSA9IF9yZWR1Y2U7XG5cblxuLyoqXG4gKiBPdmVycmlkZSBsb2Rhc2ggYHJlZHVjZWAgdG8gc3VwcG9ydCBlbWJlciBhcnJheXMvb2JqZWN0c1xuICpcbiAqIEBtZXRob2QgcmVkdWNlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFtjdXJyZW50VmFsdWVdIHZhbHVlIGF0IGJlZ2lubmluZyBvZiBpdGVyYXRpb25cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG5leHBvcnQgdmFyIHJlZHVjZSA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCBjdXJyZW50VmFsdWUsIHRoaXNBcmcpIHtcbiAgaWYgKF8uaXNFbWJlckFycmF5UHJveHkoY29sbGVjdGlvbikpIHtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5yZWR1Y2UoY2FsbGJhY2ssIGN1cnJlbnRWYWx1ZSwgdGhpcyk7XG4gIH1cbiAgaWYgKF8uaXNFbWJlck9iamVjdFByb3h5KGNvbGxlY3Rpb24pICYmIF8uaXNPYmplY3QoY29sbGVjdGlvbi5nZXQoJ2NvbnRlbnQnKSkpIHtcbiAgICByZXR1cm4gX3JlZHVjZShjb2xsZWN0aW9uLmdldCgnY29udGVudCcpLCBjYWxsYmFjaywgY3VycmVudFZhbHVlLCB0aGlzQXJnKTtcbiAgfVxuICByZXR1cm4gX3JlZHVjZShjb2xsZWN0aW9uLCBjYWxsYmFjaywgY3VycmVudFZhbHVlLCB0aGlzQXJnKTtcbn07XG5sb2Rhc2hFbWJlci5yZWR1Y2UgPSByZWR1Y2U7XG5cblxuLyoqXG4gKiBMb2Rhc2ggbWFwXG4gKlxuICogQG1ldGhvZCBfbWFwXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8U3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xuZXhwb3J0IHZhciBfbWFwID0gXy5tYXA7XG5sb2Rhc2hFbWJlci5fbWFwID0gX21hcDtcblxuXG4vKipcbiAqIE92ZXJyaWRlIGxvZGFzaCBgbWFwYCB0byBzdXBwb3J0IGVtYmVyIGFycmF5cy9vYmplY3RzXG4gKlxuICogQG1ldGhvZCBtYXBcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG5leHBvcnQgdmFyIG1hcCA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gIGlmIChfLmlzRW1iZXJBcnJheVByb3h5KGNvbGxlY3Rpb24pKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24ubWFwKGNhbGxiYWNrLCB0aGlzKTtcbiAgfVxuICByZXR1cm4gX21hcChjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZyk7XG59O1xubG9kYXNoRW1iZXIubWFwID0gbWFwO1xuXG5cbi8qKlxuICogTG9kYXNoIGBnZXRgIGFsaWFzIHRvIHByaXZhdGUgbmFtZXNwYWNlXG4gKlxuICogQG1ldGhvZCBfZ2V0XG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gY29sbGVjdGlvbjogVGhlIHJvb3QgY29sbGVjdGlvbiBvZiB0aGUgdHJlZS5cbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBwcm9wZXJ0eVBhdGg6IFRoZSBwcm9wZXJ0eSBwYXRoIGluIHRoZSBjb2xsZWN0aW9uLlxuICogQHJldHVybnMgeyp9IFRoZSB2YWx1ZSwgb3IgdW5kZWZpbmVkIGlmIGl0IGRvZXNuJ3QgZXhpc3RzLlxuICovXG5leHBvcnQgdmFyIF9nZXQgPSBfLmdldDtcbmxvZGFzaEVtYmVyLl9nZXQgPSBfZ2V0O1xuXG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSB2YWx1ZSBvZiBhIHByb3BlcnR5IGluIGFuIG9iamVjdCB0cmVlLlxuICpcbiAqIEBtZXRob2QgZ2V0XG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gY29sbGVjdGlvbjogVGhlIHJvb3QgY29sbGVjdGlvbiBvZiB0aGUgdHJlZS5cbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBwcm9wZXJ0eVBhdGg6IFRoZSBwcm9wZXJ0eSBwYXRoIGluIHRoZSBjb2xsZWN0aW9uLlxuICogQHJldHVybnMgeyp9IFRoZSB2YWx1ZSwgb3IgdW5kZWZpbmVkIGlmIGl0IGRvZXNuJ3QgZXhpc3RzLlxuICovXG5leHBvcnQgdmFyIGdldCA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIHByb3BlcnR5UGF0aCkge1xuICAvLyBIYW5kbGUgRW1iZXIgT2JqZWN0c1xuICBpZiAoaXNFbWJlck9iamVjdChjb2xsZWN0aW9uKSB8fCBpc0VtYmVyT2JqZWN0UHJveHkoY29sbGVjdGlvbikpIHtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5nZXQocHJvcGVydHlQYXRoKTtcbiAgfVxuXG4gIHJldHVybiBfZ2V0KC4uLmFyZ3VtZW50cyk7XG59O1xubG9kYXNoRW1iZXIuZ2V0ID0gZ2V0O1xuXG5cbi8qKlxuICogTG9kYXNoIGBzZXRgIGFsaWFzIHRvIHByaXZhdGUgbmFtZXNwYWNlXG4gKlxuICogQG1ldGhvZCBfc2V0XG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gY29sbGVjdGlvbjogVGhlIHJvb3QgY29sbGVjdGlvbiBvZiB0aGUgdHJlZS5cbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBwcm9wZXJ0eVBhdGg6IFRoZSBwcm9wZXJ0eSBwYXRoIGluIHRoZSBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHsqfSB2YWx1ZTogVGhlIHByb3BlcnR5IHBhdGggaW4gdGhlIGNvbGxlY3Rpb24uXG4gKiBAcmV0dXJucyB7Kn0gVGhlIGBjb2xsZWN0aW9uYCBwYXNzZWQgaW4gd2l0aCB2YWx1ZSBzZXQuXG4gKi9cbmV4cG9ydCB2YXIgX3NldCA9IF8uc2V0O1xubG9kYXNoRW1iZXIuX3NldCA9IF9zZXQ7XG5cblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIHZhbHVlIG9mIGEgcHJvcGVydHkgaW4gYW4gb2JqZWN0IHRyZWUuXG4gKlxuICogQG1ldGhvZCBzZXRcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb2xsZWN0aW9uOiBUaGUgcm9vdCBjb2xsZWN0aW9uIG9mIHRoZSB0cmVlLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHByb3BlcnR5UGF0aDogVGhlIHByb3BlcnR5IHBhdGggaW4gdGhlIGNvbGxlY3Rpb24uXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBzZXQgb24gdGhlIGNvbGxlY3Rpb24uXG4gKiBAcmV0dXJucyB7Kn0gVGhlIGBjb2xsZWN0aW9uYCBwYXNzZWQgaW4gd2l0aCB2YWx1ZSBzZXQuXG4gKi9cbmV4cG9ydCB2YXIgc2V0ID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgcHJvcGVydHlQYXRoLCB2YWx1ZSkge1xuICAvLyBIYW5kbGUgRW1iZXIgT2JqZWN0c1xuICBpZiAoaXNFbWJlck9iamVjdChjb2xsZWN0aW9uKSB8fCBpc0VtYmVyT2JqZWN0UHJveHkoY29sbGVjdGlvbikpIHtcbiAgICBjb2xsZWN0aW9uLnNldChwcm9wZXJ0eVBhdGgsIHZhbHVlKTtcbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIHJldHVybiBfc2V0KC4uLmFyZ3VtZW50cyk7XG59O1xubG9kYXNoRW1iZXIuc2V0ID0gc2V0O1xuXG5cbi8qKlxuICogT3JpZ2luYWwgbG9kYXNoIGlzRW1wdHlcbiAqXG4gKiBAbWV0aG9kIF9pc0VtcHR5XG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIF9pc0VtcHR5ID0gXy5pc0VtcHR5O1xubG9kYXNoRW1iZXIuX2lzRW1wdHkgPSBfaXNFbXB0eTtcblxuXG4vKipcbiAqIERldGVybWluZXMgaWYgdGhlIHZhbHVlIGlzIGVtcHR5IG9yIG5vdFxuICpcbiAqIEBtZXRob2QgaXNFbXB0eVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc0VtcHR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKFxuICAgIF8uaXNFbWJlckFycmF5UHJveHkodmFsdWUpICYmXG4gICAgXy5pc0Z1bmN0aW9uKHZhbHVlLmlzRW1wdHkpXG4gICkge1xuICAgIHJldHVybiB2YWx1ZS5pc0VtcHR5KCk7XG4gIH1cblxuICByZXR1cm4gX2lzRW1wdHkoLi4uYXJndW1lbnRzKTtcbn07XG5sb2Rhc2hFbWJlci5pc0VtcHR5ID0gaXNFbXB0eTtcblxuXG4vKipcbiAqIE9yaWdpbmFsIGxvZGFzaCBjbG9uZVxuICpcbiAqIEBtZXRob2QgX2Nsb25lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJuIHsqfVxuICovXG5leHBvcnQgdmFyIF9jbG9uZSA9IF8uY2xvbmU7XG5sb2Rhc2hFbWJlci5fY2xvbmUgPSBfY2xvbmU7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgY2xvbmVkIGNvcHkgb2YgdmFsdWVcbiAqXG4gKiBAbWV0aG9kIGNsb25lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJuIHsqfVxuICovXG5leHBvcnQgdmFyIGNsb25lID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKF8uaXNXaWxkY2F0T2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZS5jbG9uZSgpO1xuICB9XG5cbiAgcmV0dXJuIF9jbG9uZSguLi5hcmd1bWVudHMpO1xufTtcbmxvZGFzaEVtYmVyLmNsb25lID0gY2xvbmU7XG5cblxuLyoqXG4gKiBBbGlhcyBmb3IgYGFycmF5LnBvcGAgb3IgYGFycmF5UHJveHkucG9wT2JqZWN0YFxuICpcbiAqIEBtZXRob2QgcG9wXG4gKiBAcGFyYW0ge0FycmF5fEVtYmVyLkFycmF5UHJveHl9IHZhbHVlXG4gKiBAcmV0dXJuIHsqfVxuICovXG5leHBvcnQgdmFyIHBvcCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiAoXy5pc0VtYmVyQXJyYXlQcm94eSh2YWx1ZSkpID8gdmFsdWUucG9wT2JqZWN0KCkgOiB2YWx1ZS5wb3AoKTtcbn07XG5sb2Rhc2hFbWJlci5wb3AgPSBwb3A7XG5cblxuLyoqXG4gKiBBbGlhcyBmb3IgYGFycmF5LnNoaWZ0YCBvciBgYXJyYXlQcm94eS5zaGlmdE9iamVjdGBcbiAqXG4gKiBAbWV0aG9kIHNoaWZ0XG4gKiBAcGFyYW0ge0FycmF5fEVtYmVyLkFycmF5UHJveHl9IHZhbHVlXG4gKiBAcmV0dXJuIHsqfVxuICovXG5leHBvcnQgdmFyIHNoaWZ0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIChfLmlzRW1iZXJBcnJheVByb3h5KHZhbHVlKSkgPyB2YWx1ZS5zaGlmdE9iamVjdCgpIDogdmFsdWUuc2hpZnQoKTtcbn07XG5sb2Rhc2hFbWJlci5zaGlmdCA9IHNoaWZ0O1xuXG5cbi8qKlxuICogRW1iZXIgYHR5cGVPZmAgYWxpYXNcbiAqXG4gKiBAbWV0aG9kIHR5cGVPZlxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge1N0cmluZ30gVGhlIHR5cGUgb2YgYHZhbHVlYFxuICovXG5leHBvcnQgdmFyIHR5cGVPZiA9ICh2YWx1ZSkgPT4gRW1iZXIudHlwZU9mKHZhbHVlKTtcbmxvZGFzaEVtYmVyLnR5cGVPZiA9IHR5cGVPZjtcblxuXG4vKipcbiAqIEdlbmVyYXRlIGRlZXAgYGlzYCBtZXRob2RzIGFuZCBvdmVycmlkZSBzdGFuZGFyZCBtZXRob2RzIHRvIGhhbmRsZSBib3RoXG4gKlxuICogQG1ldGhvZCBpc3tDb25kaXRpb259XG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWU6IEJhc2UgdmFsdWUgdG8gbG9vayB0aHJvdWdoXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcFN0cmluZzogUHJvcGVydHkgc3RyaW5nIHRvIGFwcGx5IHRvIGBnZXRgXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5sb2Rhc2hVdGlscy5idWlsZElzTWV0aG9kcyhsb2Rhc2hFbWJlciwgbG9kYXNoRW1iZXIpO1xuXG5cbmV4cG9ydCB2YXIgbG9kYXNoRW1iZXI7XG5leHBvcnQgZGVmYXVsdCBsb2Rhc2hFbWJlcjtcbiIsImltcG9ydCBsb2Rhc2hVdGlscyBmcm9tICcuL19jb3JlL2xvZGFzaC11dGlscyc7XG5cblxuLyoqXG4gKiBDb2xsZWN0aW9uIG9mIGFsbCB0aGUgdXRpbHMgaW4gaGVyZS4gQWRkIHRvIHRoaXMgYXMgeW91IGdvLlxuICovXG5sZXQgbG9kYXNoRXh0cmFzID0ge307XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY2hlY2sgaWYgYSB2YXJpYWJsZSBpcyBkZWZpbmVkIGFuZCBwcmVzZW50XG4gKlxuICogQG1ldGhvZCBpc1ByZXNlbnRcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzUHJlc2VudCA9ICh2YWx1ZSkgPT4gKCFfLmlzVW5kZWZpbmVkKHZhbHVlKSAmJiAhXy5pc051bGwodmFsdWUpKTtcbmxvZGFzaEV4dHJhcy5pc1ByZXNlbnQgPSBpc1ByZXNlbnQ7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY2hlY2sgaWYgYSB2YXJpYWJsZSBpcyBkZWZpbmVkIGFuZCBwcmVzZW50XG4gKlxuICogQG1ldGhvZCBpc0JsYW5rXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc0JsYW5rID0gKHZhbHVlKSA9PiAhXy5pc1ByZXNlbnQodmFsdWUpO1xubG9kYXNoRXh0cmFzLmlzQmxhbmsgPSBpc0JsYW5rO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNoZWNrIGlmIGEgdmFyaWFibGUgaXMgYSBkYXRlXG4gKlxuICogQG1ldGhvZCBpc0RhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzRGF0ZSA9ICh2YWx1ZSkgPT4gXy50eXBlT2YodmFsdWUpID09PSAnZGF0ZSc7XG5sb2Rhc2hFeHRyYXMuaXNEYXRlID0gaXNEYXRlO1xuXG5cbi8qKlxuICogQ2hlY2sgaWYgYSB2YXJpYWJsZSBpcyBhIG1vbWVudCBkYXRlIG9iamVjdFxuICpcbiAqIEBtZXRob2QgaXNNb21lbnRcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzTW9tZW50ID0gKHZhbHVlKSA9PiB7XG4gIHJldHVybiAoXG4gICAgXy5pc09iamVjdCh2YWx1ZSkgJiZcbiAgICB2YWx1ZS5faXNBTW9tZW50T2JqZWN0ID09PSB0cnVlXG4gICk7XG59O1xubG9kYXNoRXh0cmFzLmlzTW9tZW50ID0gaXNNb21lbnQ7XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY2hlY2sgaWYgYSB2YXJpYWJsZSBpcyBhIHByb21pc2VcbiAqXG4gKiBAbWV0aG9kIGlzUHJvbWlzZVxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNQcm9taXNlID0gKHZhbHVlKSA9PiBfLmlzRnVuY3Rpb24odmFsdWUsICd0aGVuJyk7XG5sb2Rhc2hFeHRyYXMuaXNQcm9taXNlID0gaXNQcm9taXNlO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIGNoZWNrIGEgdmFsdWUgZm9yIGFuIGFycmF5IG9mIExvRGFzaCBib29sZWFuIGNvbmRpdGlvbnNcbiAqIFRPRE86IE5hbWUgdGhpcyBgaXNBbmRgIGFuZCBjcmVhdGUgYGlzT3JgLi4uXG4gKlxuICogQG1ldGhvZCBpc1xuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEBwYXJhbSB7QXJyYXl9IGNvbmRpdGlvbnM6IExvRGFzaCBtZXRob2RzIHRvIGhhdmUgdmFsdWUgdGVzdGVkIGFnYWluc3QgKGFzIHN0cmluZ3MpXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzID0gZnVuY3Rpb24odmFsdWUsIGNvbmRpdGlvbnMpIHtcbiAgaWYgKF8uaXNTdHJpbmcoY29uZGl0aW9ucykpIGNvbmRpdGlvbnMgPSBbY29uZGl0aW9uc107XG4gIGlmIChfLmlzUHJlc2VudChjb25kaXRpb25zKSAmJiAhXy5pc0FycmF5KGNvbmRpdGlvbnMpKSBjb25kaXRpb25zID0gW107XG4gIGlmIChjb25kaXRpb25zLmxlbmd0aCA8PSAxKSBjb25zb2xlLmVycm9yKFwiRG9uJ3QgY2FsbCBgaXNgIGhlbHBlciB3aXRoIGp1c3Qgb25lIGNvbmRpdGlvbi0gdXNlIHRoYXQgY29uZGl0aW9uIGRpcmVjdGx5XCIpO1xuICByZXR1cm4gXy5ldmVyeShjb25kaXRpb25zLCBmdW5jdGlvbihjb25kaXRpb24pIHtcbiAgICBsZXQgcmVzdWx0LCBub3Q7XG5cbiAgICAvLyBDaGVjayBmb3IgdmFsaWQgY29uZGl0aW9uXG4gICAgaWYgKCFfLmlzU3RyaW5nKGNvbmRpdGlvbikpIHtcbiAgICAgIGNvbnNvbGUud2FybihcImBjb25kaXRpb25gIHdhcyBub3QgYSBzdHJpbmc6IFwiICsgY29uZGl0aW9uKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgbm90IGNvbmRpdGlvblxuICAgIG5vdCA9IGZhbHNlO1xuICAgIGlmIChfLnN0YXJ0c1dpdGgoY29uZGl0aW9uLCAnIScpKSB7XG4gICAgICBub3QgPSB0cnVlO1xuICAgICAgY29uZGl0aW9uID0gY29uZGl0aW9uLnJlcGxhY2UoJyEnLCAnJyk7XG4gICAgfVxuXG4gICAgLy8gQmUgRVhUUkEgKHRvbykgaGVscGZ1bCAocHJlcGVuZCAnaXMnIGlmIG9tbWl0dGVkKVxuICAgIGlmICghXy5zdGFydHNXaXRoKGNvbmRpdGlvbiwgJ2lzJykpIHtcbiAgICAgIGNvbmRpdGlvbiA9ICdpcycgKyBjb25kaXRpb247XG4gICAgfVxuXG4gICAgLy8gTWFrZSBzdXJlIGBjb25kaXRpb25gIGlzIGEgdmFsaWQgbG9kYXNoIG1ldGhvZFxuICAgIGlmICghXy5pc0Z1bmN0aW9uKF9bY29uZGl0aW9uXSkpIHtcbiAgICAgIGNvbnNvbGUud2FybihcImBjb25kaXRpb25gIHdhcyBub3QgYSB2YWxpZCBsb2Rhc2ggbWV0aG9kOiBcIiArIGNvbmRpdGlvbik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gRGV0ZXJtaW5lIHJlc3VsdCBhbmQgcmV0dXJuXG4gICAgcmVzdWx0ID0gX1tjb25kaXRpb25dKHZhbHVlKTtcbiAgICBpZiAobm90ID09PSB0cnVlKSByZXR1cm4gIXJlc3VsdDtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0pO1xufTtcbmxvZGFzaEV4dHJhcy5pcyA9IGlzO1xuXG5cbi8qKlxuICogR2VuZXJhdGUgYGVuc3VyZWAgbWV0aG9kcy0gRW5zdXJlIHRoYXQgdmFsdWUgaXMgb2YgdHlwZSB4XG4gKlxuICogQG1ldGhvZCBlbnN1cmV7VHlwZX1cbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFRvIGNoZWNrXG4gKiBAcGFyYW0geyp9IFt2YWx1ZURlZmF1bHQ9ZGVmYXVsdHNbY29uZGl0aW9uXTogV2hhdCB0byBkZWZhdWx0IHRvXG4gKiBAcmV0dXJuIHsqfSBFbnN1cmVkIHZhbHVlXG4gKi9cbl8uZm9yRWFjaChcbiAgXy5rZXlzKGxvZGFzaFV0aWxzLnR5cGVEZWZhdWx0cygpKSxcbiAgKHR5cGUpID0+IHtcbiAgICBsb2Rhc2hFeHRyYXNbYGVuc3VyZSR7dHlwZX1gXSA9IGxvZGFzaFV0aWxzLm1ha2VFbnN1cmVUeXBlKHR5cGUpO1xuICB9XG4pO1xuXG5cbi8qKlxuICogSmF2YXNjcmlwdCBgdHlwZW9mYCBhbGlhc1xuICpcbiAqIEBtZXRob2QgdHlwZU9mXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7U3RyaW5nfSBUaGUgdHlwZSBvZiBgdmFsdWVgXG4gKi9cbmV4cG9ydCB2YXIgdHlwZU9mID0gKHZhbHVlKSA9PiB0eXBlb2YgdmFsdWU7XG5sb2Rhc2hFeHRyYXMudHlwZU9mID0gdHlwZU9mO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGxvZGFzaEV4dHJhcztcbiJdfQ==
