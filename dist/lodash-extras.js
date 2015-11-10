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
 * @namespace _
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
 * Delete deeply nested properties without checking existence down the tree first
 * TODO: TEST TEST TEST. This is experimental (WIP)
 *
 * @namespace _
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
 * Lodash `get` alias to private namespace
 *
 * @namespace _
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

  return _get.apply(undefined, arguments);
};
exports.get = get;
lodashEmber.get = get;

/**
 * Lodash `set` alias to private namespace
 *
 * @namespace _
 * @method _set
 * @param {Object|Array} collection: The root collection of the tree.
 * @param {String|Array} propertyPath: The property path in the collection.
 * @param {*} value: The property path in the collection.
 * @returns {*} The `collection` passed in with value set.
 * @since v0.5.2
 */
var _set = _.set;
exports._set = _set;
lodashEmber._set = _set;

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

  return _set.apply(undefined, arguments);
};
exports.set = set;
lodashEmber.set = set;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcmpoaWxnZWZvcnQvRHJvcGJveC9Qcm9qZWN0cy9sb2Rhc2gtZXh0cmFzL3NyYy9fY29yZS9sb2Rhc2gtdXRpbHMuanMiLCIvVXNlcnMvcmpoaWxnZWZvcnQvRHJvcGJveC9Qcm9qZWN0cy9sb2Rhc2gtZXh0cmFzL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1kZWVwLWV4dHJhcy5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1lbWJlci5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC1leHRyYXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0dBLElBQUksV0FBVyxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7O0FBVWQsSUFBSSxZQUFZLEdBQUcsU0FBZixZQUFZLEdBQVM7QUFDL0IsU0FBTztBQUNOLFlBQVEsRUFBRSxFQUFFO0FBQ1osV0FBTyxFQUFFLEVBQUU7QUFDWCxpQkFBYSxFQUFFLEVBQUU7QUFDakIsYUFBUyxFQUFFLEtBQUs7QUFDaEIsWUFBUSxFQUFFLENBQUM7R0FDWCxDQUFDO0NBQ0YsQ0FBQzs7QUFDRixXQUFXLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQzs7Ozs7Ozs7OztBQVdqQyxJQUFJLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBSSxLQUFLLEVBQUs7QUFDbEMsU0FBTyxVQUFTLEtBQUssRUFBRTtBQUN0QixXQUFRLEtBQUssWUFBWSxLQUFLLENBQUU7R0FDaEMsQ0FBQztDQUNGLENBQUM7O0FBQ0YsV0FBVyxDQUFDLFVBQVUsR0FBRyxVQUFVLENB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QUEsQ0FBQzs7QUFDN0MsWUFBWSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O3FCQUdkLFlBQVkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDb2xsZWN0aW9uIG9mIGFsbCB0aGUgdXRpbHMgaW4gaGVyZS4gQWRkIHRvIHRoaXMgYXMgeW91IGdvLlxuICovXG5sZXQgbG9kYXNoVXRpbHMgPSB7fTtcblxuXG4vKipcbiAqIEhlbHBlciBmb3IgSlMgdHlwZXMgYW5kIGRlZmF1bHRzIGZvciBlYWNoIHR5cGVcbiAqXG4gKiBAbWV0aG9kIHR5cGVEZWZhdWx0c1xuICogQHJldHVybiB7UGxhaW5PYmplY3R9XG4gKiBAc2luY2UgdjEuMy4wXG4gKi9cbmV4cG9ydCB2YXIgdHlwZURlZmF1bHRzID0gKCkgPT4ge1xuXHRyZXR1cm4ge1xuXHRcdCdTdHJpbmcnOiAnJyxcblx0XHQnQXJyYXknOiBbXSxcblx0XHQnUGxhaW5PYmplY3QnOiB7fSxcblx0XHQnQm9vbGVhbic6IGZhbHNlLFxuXHRcdCdOdW1iZXInOiAxXG5cdH07XG59O1xubG9kYXNoVXRpbHMudHlwZURlZmF1bHRzID0gdHlwZURlZmF1bHRzO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIG1ha2UgYF8uaXNFbWJlcntDbGFzc31gXG4gKlxuICogQG1ldGhvZCBtYWtlSXNUeXBlXG4gKiBAcGFyYW0geyp9IGtsYXNzOiBBIGNsYXNzIHRvIGNoZWNrIGluc3RhbmNlb2YgYWdhaW5zdFxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAc2luY2UgdjAuNS4yXG4gKi9cbmV4cG9ydCB2YXIgbWFrZUlzVHlwZSA9IChrbGFzcykgPT4ge1xuXHRyZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcblx0XHRyZXR1cm4gKHZhbHVlIGluc3RhbmNlb2Yga2xhc3MpO1xuXHR9O1xufTtcbmxvZGFzaFV0aWxzLm1ha2VJc1R5cGUgPSBtYWtlSXNUeXBlO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIG1ha2UgYF8uZW5zdXJlVHlwZWBcbiAqXG4gKiBAbWV0aG9kIG1ha2VFbnN1cmVUeXBlXG4gKiBAcGFyYW0ge1N0cmluZ30gY29uZGl0aW9uOiBMb2Rhc2ggbWV0aG9kIHRvIGFwcGx5XG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAqIEBzaW5jZSB2MS4zLjBcbiAqL1xuZXhwb3J0IHZhciBtYWtlRW5zdXJlVHlwZSA9IChjb25kaXRpb24pID0+IHtcblx0bGV0IGRlZmF1bHRzID0gbG9kYXNoVXRpbHMudHlwZURlZmF1bHRzKCk7XG5cblx0Ly8gQ2hlY2sgcGFyYW1zOiBjb25kaXRpb25cblx0aWYgKCFfLmlzU3RyaW5nKGNvbmRpdGlvbikpIGNvbmRpdGlvbiA9ICcnO1xuXHRjb25kaXRpb24gPSBfLmNhcGl0YWxpemUoY29uZGl0aW9uKTtcblx0aWYgKCFfLmNvbnRhaW5zKF8ua2V5cyhkZWZhdWx0cyksIGNvbmRpdGlvbikpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYFxcYGNvbmRpdGlvblxcYCBub3Qgc3VwcG9ydGVkOiAke2NvbmRpdGlvbn1gKTtcblx0fVxuXG5cdC8vIFNob3J0Y3V0XG5cdGxldCBpc0NvbmRpdGlvbiA9IF9bYGlzJHtjb25kaXRpb259YF07XG5cblx0LyoqXG5cdCAqIEludGVyZmFjZSBmb3IgYGVuc3VyZVR5cGVgIG1ldGhvZHNcblx0ICpcblx0ICogQG1ldGhvZCBgZW5zdXJlJHt0eXBlfWBcblx0ICogQHBhcmFtIHsqfSB2YWx1ZTogVG8gY2hlY2tcblx0ICogQHBhcmFtIHsqfSBbdmFsdWVEZWZhdWx0PWRlZmF1bHRzW2NvbmRpdGlvbl06IFdoYXQgdG8gZGVmYXVsdCB0b1xuXHQgKiBAcmV0dXJuIHsqfSBEZWZhdWx0ZWQgdmFsdWUsIG9yIHRoZSB2YWx1ZSBpdHNlbGYgaWYgcGFzc1xuXHQgKiBAc2luY2UgdjEuMy4wXG5cdCAqL1xuXHRyZXR1cm4gKHZhbHVlLCB2YWx1ZURlZmF1bHQpID0+IHtcblx0XHQvLyBEZXRlcm1pbmUgYHZhbHVlRGVmYXVsdGA6IGlmIG5vdGhpbmcgcHJvdmlkZWQsIG9yIHByb3ZpZGVkIGRvZXNuJ3QgbWF0Y2ggdHlwZVxuXHRcdGlmIChfLmlzVW5kZWZpbmVkKHZhbHVlRGVmYXVsdCkgfHwgIWlzQ29uZGl0aW9uKHZhbHVlRGVmYXVsdCkpIHtcblx0XHRcdHZhbHVlRGVmYXVsdCA9IF8uY2xvbmUoZGVmYXVsdHNbY29uZGl0aW9uXSk7XG5cdFx0fVxuXG5cdFx0Ly8gQWN0dWFsIFwiZW5zdXJlXCIgY2hlY2tcblx0XHRpZiAoIV9bYGlzJHtjb25kaXRpb259YF0odmFsdWUpKSB2YWx1ZSA9IHZhbHVlRGVmYXVsdDtcblxuXHRcdHJldHVybiB2YWx1ZTtcblx0fTtcbn07XG5sb2Rhc2hVdGlscy5tYWtlRW5zdXJlVHlwZSA9IG1ha2VFbnN1cmVUeXBlO1xuXG5cbi8qKlxuICogSGVscGVyIHRvIG1ha2UgYF8uZGVlcEVuc3VyZXtUeXBlfWBcbiAqXG4gKiBAbWV0aG9kIG1ha2VEZWVwRW5zdXJlVHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY29uZGl0aW9uOiBMb2Rhc2ggbWV0aG9kIHRvIGFwcGx5XG4gKiBAcGFyYW0geyp9IHZhbHVlRGVmYXVsdDogV2hhdCB0byBhc3NpZ24gd2hlbiBub3Qgb2YgdGhlIGRlc2lyZWQgdHlwZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAc2luY2UgdjAuNS4yXG4gKi9cbmV4cG9ydCB2YXIgbWFrZURlZXBFbnN1cmVUeXBlID0gKGNvbmRpdGlvbikgPT4ge1xuXHRyZXR1cm4gKGNvbGxlY3Rpb24sIHByb3BTdHJpbmcsIHZhbHVlRGVmYXVsdCkgPT4ge1xuXHRcdHJldHVybiBfLnNldChcblx0XHRcdGNvbGxlY3Rpb24sXG5cdFx0XHRwcm9wU3RyaW5nLFxuXHRcdFx0bG9kYXNoVXRpbHMubWFrZUVuc3VyZVR5cGUoY29uZGl0aW9uKShcblx0XHRcdFx0Xy5nZXQoY29sbGVjdGlvbiwgcHJvcFN0cmluZyksXG5cdFx0XHRcdHZhbHVlRGVmYXVsdFxuXHRcdFx0KVxuXHRcdCk7XG5cdH07XG59O1xubG9kYXNoVXRpbHMubWFrZURlZXBFbnN1cmVUeXBlID0gbWFrZURlZXBFbnN1cmVUeXBlO1xuXG5cbi8qKlxuICogRGV0ZXJtaW5lZCBpZiBsb2Rhc2gga2V5L21ldGhvZCBpcyB2YWxpZCB0byBtYWtlIGRlZXAgKGBpc2AgbWV0aG9kcyB0aGF0IG9ubHkgaGF2ZSBvbmUgYXJndW1lbnQpXG4gKiBOT1RFOiBBc3N1bWVzIGB0aGlzYCA9PT0gaXMgdGhlIG5hbWVzcGFjZSB0byBjaGVjayBmb3IgdGhlIGZ1bmN0aW9uIG9uXG4gKlxuICogQG1ldGhvZCB2YWxpZElzTWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5OiBtZXRob2QgbmFtZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciB2YWxpZElzTWV0aG9kID0gZnVuY3Rpb24oa2V5KSB7XG4gIHJldHVybiAoXG4gICAgXy5zdGFydHNXaXRoKGtleSwgJ2lzJykgJiZcbiAgICAodGhpc1trZXldLmxlbmd0aCA9PT0gMSlcbiAgKTtcbn07XG5sb2Rhc2hVdGlscy52YWxpZElzTWV0aG9kID0gdmFsaWRJc01ldGhvZDtcblxuXG4vKipcbiAqIEZpbHRlciBvdXQgYWxsIHZhbGlkIGBpc2AgbWV0aG9kcyBmcm9tIGEgbmFtZXNwYWNlXG4gKlxuICogQG1ldGhvZCBmaWx0ZXJJc01ldGhvZHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2U6IENvbGxlY3Rpb24gb2YgbWV0aG9kc1xuICogQHJldHVybiB7T2JqZWN0fSBgbmFtZXNwYWNlYCB3aXRoIGp1c3QgdGhlIFwiaXNcIiBtZXRob2RzXG4gKi9cbmV4cG9ydCB2YXIgZmlsdGVySXNNZXRob2RzID0gKG5hbWVzcGFjZSkgPT4ge1xuICByZXR1cm4gXy5jaGFpbihuYW1lc3BhY2UpXG4gICAgLmtleXMoKVxuICAgIC5maWx0ZXIodmFsaWRJc01ldGhvZCwgbmFtZXNwYWNlKVxuICAgIC52YWx1ZSgpO1xufTtcbmxvZGFzaFV0aWxzLmZpbHRlcklzTWV0aG9kcyA9IGZpbHRlcklzTWV0aG9kcztcblxuXG4vKipcbiAqIE92ZXJsb2FkIG5vcm1hbCBsb2Rhc2ggbWV0aG9kcyB0byBoYW5kbGUgZGVlcCBzeW50YXhcbiAqIFRPRE86IE5vIG5lZWQgdG8gdGFrZSB0aGUgZmlyc3QgcGFyYW1cbiAqXG4gKiBAbWV0aG9kIG92ZXJsb2FkTWV0aG9kc1xuICogQHBhcmFtIHtPYmplY3R9IGlzTWV0aG9kczogQ29sbGVjdGlvbiBvZiBpcyBtZXRob2RzXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlOiBPcmlnaW5hbCBuYW1lc3BhY2UgaXNNZXRob2RzIGNhbWUgZnJvbVxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldDogbmFtZXNwYWNlIHRvIG92ZXJsb2FkIG1ldGhvZHMgb25cbiAqIEByZXR1cm4ge1VuZGVmaW5lZH1cbiAqL1xuZXhwb3J0IHZhciBvdmVybG9hZE1ldGhvZHMgPSAoaXNNZXRob2RzLCBuYW1lc3BhY2UsIHRhcmdldCkgPT4ge1xuICBsZXQgb2xkTWV0aG9kID0ge307XG5cbiAgXy5mb3JFYWNoKGlzTWV0aG9kcywgKG1ldGhvZCkgPT4ge1xuICAgIC8vIFNhdmUgb2xkIG1ldGhvZFxuICAgIG9sZE1ldGhvZFttZXRob2RdID0gbmFtZXNwYWNlW21ldGhvZF07XG5cbiAgICAvLyBNYWtlIG5ldyBtZXRob2QgdGhhdCBhbHNvIGhhbmRsZXMgYGdldGAuIEFwcGx5IG1ldGhvZCB0byBleHBvcnRzLlxuICAgIHRhcmdldFttZXRob2RdID0gZnVuY3Rpb24odmFsdWUsIHByb3BTdHJpbmcpIHtcbiAgICAgIGlmIChfLnNpemUoYXJndW1lbnRzKSA9PT0gMikge1xuICAgICAgICByZXR1cm4gbmFtZXNwYWNlW21ldGhvZF0oXy5nZXQoLi4uYXJndW1lbnRzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gb2xkTWV0aG9kW21ldGhvZF0oLi4uYXJndW1lbnRzKTtcbiAgICB9O1xuICB9KTtcbn07XG5sb2Rhc2hVdGlscy5vdmVybG9hZE1ldGhvZHMgPSBvdmVybG9hZE1ldGhvZHM7XG5cblxuLyoqXG4gKiBCdWlsZCBgaXNNZXRob2RzYFxuICpcbiAqIEBtZXRob2QgYnVpbGRJc01ldGhvZHNcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2U6IE5hbWVzcGFjZSB0byBwdWxsIGBpc2AgbWV0aG9kcyBmcm9tXG4gKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0OiBuYW1lc3BhY2UgdG8gb3ZlcmxvYWQgbWV0aG9kcyBvblxuICogQHJldHVybiB7VW5kZWZpbmVkfVxuICovXG5leHBvcnQgdmFyIGJ1aWxkSXNNZXRob2RzID0gKG5hbWVzcGFjZSwgdGFyZ2V0KSA9PiB7XG4gIG92ZXJsb2FkTWV0aG9kcyhmaWx0ZXJJc01ldGhvZHMobmFtZXNwYWNlKSwgbmFtZXNwYWNlLCB0YXJnZXQpO1xufVxubG9kYXNoVXRpbHMuYnVpbGRJc01ldGhvZHMgPSBidWlsZElzTWV0aG9kcztcblxuXG5leHBvcnQgZGVmYXVsdCBsb2Rhc2hVdGlscztcbiIsImltcG9ydCBsb2Rhc2hFeHRyYXMgZnJvbSAnLi9sb2Rhc2gtZXh0cmFzJztcbl8ubWl4aW4obG9kYXNoRXh0cmFzKTtcblxuaW1wb3J0IGxvZGFzaEVtYmVyIGZyb20gJy4vbG9kYXNoLWVtYmVyJztcbl8ubWl4aW4obG9kYXNoRW1iZXIpO1xuXG5pbXBvcnQgbG9kYXNoRGVlcEV4dHJhcyBmcm9tICcuL2xvZGFzaC1kZWVwLWV4dHJhcyc7XG5fLm1peGluKGxvZGFzaERlZXBFeHRyYXMpO1xuIiwiaW1wb3J0IGxvZGFzaFV0aWxzIGZyb20gJy4vX2NvcmUvbG9kYXNoLXV0aWxzJztcbmltcG9ydCBsb2Rhc2hFeHRyYXMgZnJvbSAnLi9sb2Rhc2gtZXh0cmFzJztcbmltcG9ydCBsb2Rhc2hFbWJlciBmcm9tICcuL2xvZGFzaC1lbWJlcic7XG5cblxuLy8gQWxsIGxvZGFzaCBleHRyYURlZXAgbWV0aG9kcyB0byBleHBvcnRcbmxldCBsb2Rhc2hEZWVwRXh0cmFzID0ge307XG5cblxuLyoqXG4gKiBHZW5lcmF0ZSBgZGVlcElzYCBtZXRob2RzIGFuZCBvdmVycmlkZSBzdGFuZGFyZCBtZXRob2RzIHRvIGhhbmRsZSBib3RoXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGlze0NvbmRpdGlvbn1cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZTogQmFzZSB2YWx1ZSB0byBsb29rIHRocm91Z2hcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wU3RyaW5nOiBQcm9wZXJ0eSBzdHJpbmcgdG8gYXBwbHkgdG8gYGdldGBcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmxvZGFzaFV0aWxzLmJ1aWxkSXNNZXRob2RzKF8sIGxvZGFzaERlZXBFeHRyYXMpO1xubG9kYXNoVXRpbHMuYnVpbGRJc01ldGhvZHMobG9kYXNoRXh0cmFzLCBsb2Rhc2hEZWVwRXh0cmFzKTtcbmxvZGFzaFV0aWxzLmJ1aWxkSXNNZXRob2RzKGxvZGFzaEVtYmVyLCBsb2Rhc2hEZWVwRXh0cmFzKTtcblxuLyoqXG4gKiBHZW5lcmF0ZSBgZW5zdXJlYCBtZXRob2RzLSBFbnN1cmUgdGhhdCB2YWx1ZSBpcyBvZiB0eXBlIHgsIGRlZXBseVxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBkZWVwRW5zdXJle1R5cGV9XG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gY29sbGVjdGlvbjogVGhlIHJvb3QgY29sbGVjdGlvbiBvZiB0aGUgdHJlZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wU3RyaW5nOiBOZXN0ZWQgcHJvcGVydHkgcGF0aCBvZiB2YWx1ZSB0byBjaGVja1xuICogQHBhcmFtIHsqfSBbdmFsdWVEZWZhdWx0PWRlZmF1bHRzW2NvbmRpdGlvbl06IFdoYXQgdG8gZGVmYXVsdCB0b1xuICogQHJldHVybiB7Kn0gQ29sbGVjdGlvbiwgd2l0aCBlbnN1cmVkIHByb3BlcnR5XG4gKiBAc2luY2UgdjEuMy4wXG4gKi9cbl8uZm9yRWFjaChfLmtleXMobG9kYXNoVXRpbHMudHlwZURlZmF1bHRzKCkpLCAodHlwZSkgPT4ge1xuXHRsb2Rhc2hFeHRyYXNbYGRlZXBFbnN1cmUke3R5cGV9YF0gPSBsb2Rhc2hVdGlscy5tYWtlRGVlcEVuc3VyZVR5cGUodHlwZSk7XG59KTtcblxuXG4vKipcbiAqIERlbGV0ZSBkZWVwbHkgbmVzdGVkIHByb3BlcnRpZXMgd2l0aG91dCBjaGVja2luZyBleGlzdGVuY2UgZG93biB0aGUgdHJlZSBmaXJzdFxuICogVE9ETzogVEVTVCBURVNUIFRFU1QuIFRoaXMgaXMgZXhwZXJpbWVudGFsIChXSVApXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGRlZXBEZWxldGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcFN0cmluZzogUHJvcGVydHkgc3RyaW5nIHRvIGFwcGx5IHRvIGBnZXRgXG4gKiBAcmV0dXJuIHt1bmRlZmluZWR9IERvZXNuJ3QgcmV0dXJuIHN1Y2Nlc3MvZmFpbHVyZSwgdG8gbWF0Y2ggYGRlbGV0ZWAncyByZXR1cm5cbiAqL1xuZXhwb3J0IHZhciBkZWVwRGVsZXRlID0gZnVuY3Rpb24odmFsdWUsIHByb3BTdHJpbmcpIHtcblx0bGV0IGN1cnJlbnRWYWx1ZSwgaTtcblxuXHQvLyBEZWxldGUgaWYgcHJlc2VudFxuXHRpZiAoXy5pc1ByZXNlbnQodmFsdWUsIHByb3BTdHJpbmcpKSB7XG5cdFx0Y3VycmVudFZhbHVlID0gdmFsdWU7XG5cdFx0cHJvcFN0cmluZyA9IF8ocHJvcFN0cmluZykudG9TdHJpbmcoKS5zcGxpdCgnLicpO1xuXG5cdFx0Zm9yIChpID0gMDsgaSA8IChwcm9wU3RyaW5nLmxlbmd0aCAtIDEpOyBpKyspIHtcblx0XHRcdGN1cnJlbnRWYWx1ZSA9IGN1cnJlbnRWYWx1ZVtwcm9wU3RyaW5nW2ldXTtcblx0XHR9XG5cblx0XHRkZWxldGUgY3VycmVudFZhbHVlW3Byb3BTdHJpbmdbaV1dO1xuXHR9XG59O1xubG9kYXNoRGVlcEV4dHJhcy5kZWVwRGVsZXRlID0gZGVlcERlbGV0ZTtcblxuXG5leHBvcnQgZGVmYXVsdCBsb2Rhc2hEZWVwRXh0cmFzO1xuIiwiLyoqXG4gKiBUaGlzIHV0aWxpdHkgYXNzdW1lcyBgRW1iZXJgIGV4aXN0cyBnbG9iYWxseVxuICovXG5pbXBvcnQgbG9kYXNoVXRpbHMgZnJvbSAnLi9fY29yZS9sb2Rhc2gtdXRpbHMnO1xuXG5cbi8qKlxuICogQ29sbGVjdGlvbiBvZiBhbGwgdGhlIHV0aWxzIGluIGhlcmUuIEFkZCB0byB0aGlzIGFzIHlvdSBnby5cbiAqL1xuZXhwb3J0IHZhciBsb2Rhc2hFbWJlciA9IHt9O1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhIHZhbHVlIGlzIGFuIGluc3RhbmNlLCBhcyBkZXNpZ25hdGVkIGJ5IEVtYmVyXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGlzSW5zdGFuY2VcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzRW1iZXJJbnN0YW5jZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHJldHVybiAoRW1iZXIudHlwZU9mKHZhbHVlKSA9PT0gJ2luc3RhbmNlJyk7XG59O1xubG9kYXNoRW1iZXIuaXNFbWJlckluc3RhbmNlID0gaXNFbWJlckluc3RhbmNlO1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhIHZhbHVlIGlzLCBhdCBsZWFzdCwgYSBzdWJjbGFzcyBvZiBFbWJlci5PYmplY3RcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgaXNFbWJlck9iamVjdFxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNFbWJlck9iamVjdCA9IGxvZGFzaFV0aWxzLm1ha2VJc1R5cGUoRW1iZXIuT2JqZWN0KTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJPYmplY3QgPSBpc0VtYmVyT2JqZWN0O1xuXG5cbi8qKlxuICogTk9URTogaXNFbWJlckFycmF5IGhhcyBiZWVuIGV4Y2x1ZGVkIGFzIEVtYmVyLkFycmF5IGlzIG5vdCBhbiBFbWJlci5PYmplY3RcbiAqL1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhIHZhbHVlIGlzLCBhdCBsZWFzdCwgYSBzdWJjbGFzcyBvZiBFbWJlci5PYmplY3RQcm94eVxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBpc0VtYmVyT2JqZWN0UHJveHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzRW1iZXJPYmplY3RQcm94eSA9IGxvZGFzaFV0aWxzLm1ha2VJc1R5cGUoRW1iZXIuT2JqZWN0UHJveHkpO1xubG9kYXNoRW1iZXIuaXNFbWJlck9iamVjdFByb3h5ID0gaXNFbWJlck9iamVjdFByb3h5O1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCBhIHZhbHVlIGlzLCBhdCBsZWFzdCwgYSBzdWJjbGFzcyBvZiBFbWJlci5BcnJheVByb3h5XG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGlzRW1iZXJBcnJheVByb3h5XG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IHZhciBpc0VtYmVyQXJyYXlQcm94eSA9IGxvZGFzaFV0aWxzLm1ha2VJc1R5cGUoRW1iZXIuQXJyYXlQcm94eSk7XG5sb2Rhc2hFbWJlci5pc0VtYmVyQXJyYXlQcm94eSA9IGlzRW1iZXJBcnJheVByb3h5O1xuXG5cbi8qKlxuICogQ2hlY2sgdGhhdCB0aGUgdmFsdWUgaXMgYSBkZXNjZW5kZW50IG9mIGFuIEVtYmVyIENsYXNzXG4gKiBUT0RPOiBDaGVjayB0aGF0IGBfLmlzRW1iZXJJbnN0YW5jZWAgZG9lc24ndCBhbHJlYWR5IHlpZWxkIHRoZSBzYW1lIHJlc3VsdFxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBpc0VtYmVyQ29sbGVjdGlvblxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNFbWJlckNvbGxlY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuXHRyZXR1cm4gKFxuXHRcdF8uaXNFbWJlck9iamVjdCh2YWx1ZSkgfHxcblx0XHRfLmlzRW1iZXJPYmplY3RQcm94eSh2YWx1ZSkgfHxcblx0XHRfLmlzRW1iZXJBcnJheVByb3h5KHZhbHVlKVxuXHQpO1xufTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJDb2xsZWN0aW9uID0gaXNFbWJlckNvbGxlY3Rpb247XG5cblxuLyoqXG4gKiBDaGVjayB0aGF0IHZhbHVlIGlzIEVtYmVyIFRyYW5zaXRpb25cbiAqXG4gKiBAbWV0aG9kIGlzRW1iZXJUcmFuc2l0aW9uXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBzaW5jZSB2MC41LjJcbiAqL1xuZXhwb3J0IHZhciBpc0VtYmVyVHJhbnNpdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHJldHVybiAoXG5cdFx0Xy5pc0Z1bmN0aW9uKHZhbHVlLCAndG9TdHJpbmcnKSAmJlxuXHRcdF8uY29udGFpbnModmFsdWUudG9TdHJpbmcoKSwgJ1RyYW5zaXRpb24nKVxuXHQpO1xufTtcbmxvZGFzaEVtYmVyLmlzRW1iZXJUcmFuc2l0aW9uID0gaXNFbWJlclRyYW5zaXRpb247XG5cblxuLyoqXG4gKiBMb2Rhc2ggZm9yRWFjaFxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBfZm9yRWFjaFxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8U3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFjaz1pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjYWxsYmFja2AuXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fFN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKiBAc2luY2UgdjAuNS4yXG4gKi9cbmV4cG9ydCB2YXIgX2ZvckVhY2ggPSBfLmZvckVhY2g7XG5sb2Rhc2hFbWJlci5fZm9yRWFjaCA9IF9mb3JFYWNoO1xuXG5cbi8qKlxuICogT3ZlcnJpZGUgbG9kYXNoIGBmb3JFYWNoYCB0byBzdXBwb3J0IGVtYmVyIGFycmF5cy9vYmplY3RzXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGZvckVhY2hcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG5leHBvcnQgdmFyIGZvckVhY2ggPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuXHRpZiAoXy5pc0VtYmVyQXJyYXlQcm94eShjb2xsZWN0aW9uKSkge1xuXHRcdHJldHVybiBjb2xsZWN0aW9uLmZvckVhY2goY2FsbGJhY2ssIHRoaXMpO1xuXHR9XG5cdGlmIChfLmlzRW1iZXJPYmplY3RQcm94eShjb2xsZWN0aW9uKSAmJiBfLmlzT2JqZWN0KGNvbGxlY3Rpb24uZ2V0KCdjb250ZW50JykpKSB7XG5cdFx0cmV0dXJuIF9mb3JFYWNoKGNvbGxlY3Rpb24uZ2V0KCdjb250ZW50JyksIGNhbGxiYWNrLCB0aGlzQXJnKTtcblx0fVxuXHRyZXR1cm4gX2ZvckVhY2goY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpO1xufTtcbmxvZGFzaEVtYmVyLmZvckVhY2ggPSBmb3JFYWNoO1xuXG5cbi8qKlxuICogTG9kYXNoIHJlZHVjZVxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBfcmVkdWNlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFtjdXJyZW50VmFsdWVdIHZhbHVlIGF0IGJlZ2lubmluZyBvZiBpdGVyYXRpb25cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQHNpbmNlIHYxLjEuMFxuICovXG5leHBvcnQgdmFyIF9yZWR1Y2UgPSBfLnJlZHVjZTtcbmxvZGFzaEVtYmVyLl9yZWR1Y2UgPSBfcmVkdWNlO1xuXG5cbi8qKlxuICogT3ZlcnJpZGUgbG9kYXNoIGByZWR1Y2VgIHRvIHN1cHBvcnQgZW1iZXIgYXJyYXlzL29iamVjdHNcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgcmVkdWNlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFtjdXJyZW50VmFsdWVdIHZhbHVlIGF0IGJlZ2lubmluZyBvZiBpdGVyYXRpb25cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQHNpbmNlIHYxLjEuMFxuICovXG5leHBvcnQgdmFyIHJlZHVjZSA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGNhbGxiYWNrLCBjdXJyZW50VmFsdWUsIHRoaXNBcmcpIHtcblx0aWYgKF8uaXNFbWJlckFycmF5UHJveHkoY29sbGVjdGlvbikpIHtcblx0XHRyZXR1cm4gY29sbGVjdGlvbi5yZWR1Y2UoY2FsbGJhY2ssIGN1cnJlbnRWYWx1ZSwgdGhpcyk7XG5cdH1cblx0aWYgKF8uaXNFbWJlck9iamVjdFByb3h5KGNvbGxlY3Rpb24pICYmIF8uaXNPYmplY3QoY29sbGVjdGlvbi5nZXQoJ2NvbnRlbnQnKSkpIHtcblx0XHRyZXR1cm4gX3JlZHVjZShjb2xsZWN0aW9uLmdldCgnY29udGVudCcpLCBjYWxsYmFjaywgY3VycmVudFZhbHVlLCB0aGlzQXJnKTtcblx0fVxuXHRyZXR1cm4gX3JlZHVjZShjb2xsZWN0aW9uLCBjYWxsYmFjaywgY3VycmVudFZhbHVlLCB0aGlzQXJnKTtcbn07XG5sb2Rhc2hFbWJlci5yZWR1Y2UgPSByZWR1Y2U7XG5cblxuLyoqXG4gKiBMb2Rhc2ggbWFwXG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIF9tYXBcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fFN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2s9aWRlbnRpdHldIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgY2FsbGJhY2tgLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxTdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQHNpbmNlIHYwLjUuMlxuICovXG5leHBvcnQgdmFyIF9tYXAgPSBfLm1hcDtcbmxvZGFzaEVtYmVyLl9tYXAgPSBfbWFwO1xuXG5cbi8qKlxuICogT3ZlcnJpZGUgbG9kYXNoIGBtYXBgIHRvIHN1cHBvcnQgZW1iZXIgYXJyYXlzL29iamVjdHNcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgbWFwXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxTdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrPWlkZW50aXR5XSBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGNhbGxiYWNrYC5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8U3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xuZXhwb3J0IHZhciBtYXAgPSBmdW5jdGlvbihjb2xsZWN0aW9uLCBjYWxsYmFjaywgdGhpc0FyZykge1xuXHRpZiAoXy5pc0VtYmVyQXJyYXlQcm94eShjb2xsZWN0aW9uKSkge1xuXHRcdHJldHVybiBjb2xsZWN0aW9uLm1hcChjYWxsYmFjaywgdGhpcyk7XG5cdH1cblx0cmV0dXJuIF9tYXAoY29sbGVjdGlvbiwgY2FsbGJhY2ssIHRoaXNBcmcpO1xufTtcbmxvZGFzaEVtYmVyLm1hcCA9IG1hcDtcblxuXG4vKipcbiAqIExvZGFzaCBgZ2V0YCBhbGlhcyB0byBwcml2YXRlIG5hbWVzcGFjZVxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBfZ2V0XG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gY29sbGVjdGlvbjogVGhlIHJvb3QgY29sbGVjdGlvbiBvZiB0aGUgdHJlZS5cbiAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBwcm9wZXJ0eVBhdGg6IFRoZSBwcm9wZXJ0eSBwYXRoIGluIHRoZSBjb2xsZWN0aW9uLlxuICogQHJldHVybnMgeyp9IFRoZSB2YWx1ZSwgb3IgdW5kZWZpbmVkIGlmIGl0IGRvZXNuJ3QgZXhpc3RzLlxuICovXG5leHBvcnQgdmFyIF9nZXQgPSBfLmdldDtcbmxvZGFzaEVtYmVyLl9nZXQgPSBfZ2V0O1xuXG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSB2YWx1ZSBvZiBhIHByb3BlcnR5IGluIGFuIG9iamVjdCB0cmVlLlxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBnZXRcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb2xsZWN0aW9uOiBUaGUgcm9vdCBjb2xsZWN0aW9uIG9mIHRoZSB0cmVlLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHByb3BlcnR5UGF0aDogVGhlIHByb3BlcnR5IHBhdGggaW4gdGhlIGNvbGxlY3Rpb24uXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHZhbHVlLCBvciB1bmRlZmluZWQgaWYgaXQgZG9lc24ndCBleGlzdHMuXG4gKi9cbmV4cG9ydCB2YXIgZ2V0ID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgcHJvcGVydHlQYXRoKSB7XG5cdC8vIEhhbmRsZSBFbWJlciBPYmplY3RzXG5cdGlmIChpc0VtYmVyT2JqZWN0KGNvbGxlY3Rpb24pIHx8IGlzRW1iZXJPYmplY3RQcm94eShjb2xsZWN0aW9uKSkge1xuXHRcdHJldHVybiBjb2xsZWN0aW9uLmdldChwcm9wZXJ0eVBhdGgpO1xuXHR9XG5cbiAgcmV0dXJuIF9nZXQoLi4uYXJndW1lbnRzKTtcbn07XG5sb2Rhc2hFbWJlci5nZXQgPSBnZXQ7XG5cblxuLyoqXG4gKiBMb2Rhc2ggYHNldGAgYWxpYXMgdG8gcHJpdmF0ZSBuYW1lc3BhY2VcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgX3NldFxuICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGNvbGxlY3Rpb246IFRoZSByb290IGNvbGxlY3Rpb24gb2YgdGhlIHRyZWUuXG4gKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gcHJvcGVydHlQYXRoOiBUaGUgcHJvcGVydHkgcGF0aCBpbiB0aGUgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFRoZSBwcm9wZXJ0eSBwYXRoIGluIHRoZSBjb2xsZWN0aW9uLlxuICogQHJldHVybnMgeyp9IFRoZSBgY29sbGVjdGlvbmAgcGFzc2VkIGluIHdpdGggdmFsdWUgc2V0LlxuICogQHNpbmNlIHYwLjUuMlxuICovXG5leHBvcnQgdmFyIF9zZXQgPSBfLnNldDtcbmxvZGFzaEVtYmVyLl9zZXQgPSBfc2V0O1xuXG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSB2YWx1ZSBvZiBhIHByb3BlcnR5IGluIGFuIG9iamVjdCB0cmVlLlxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBzZXRcbiAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBjb2xsZWN0aW9uOiBUaGUgcm9vdCBjb2xsZWN0aW9uIG9mIHRoZSB0cmVlLlxuICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IHByb3BlcnR5UGF0aDogVGhlIHByb3BlcnR5IHBhdGggaW4gdGhlIGNvbGxlY3Rpb24uXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBzZXQgb24gdGhlIGNvbGxlY3Rpb24uXG4gKiBAcmV0dXJucyB7Kn0gVGhlIGBjb2xsZWN0aW9uYCBwYXNzZWQgaW4gd2l0aCB2YWx1ZSBzZXQuXG4gKi9cbmV4cG9ydCB2YXIgc2V0ID0gZnVuY3Rpb24oY29sbGVjdGlvbiwgcHJvcGVydHlQYXRoLCB2YWx1ZSkge1xuXHQvLyBIYW5kbGUgRW1iZXIgT2JqZWN0c1xuXHRpZiAoaXNFbWJlck9iamVjdChjb2xsZWN0aW9uKSB8fCBpc0VtYmVyT2JqZWN0UHJveHkoY29sbGVjdGlvbikpIHtcblx0XHRjb2xsZWN0aW9uLnNldChwcm9wZXJ0eVBhdGgsIHZhbHVlKTtcblx0XHRyZXR1cm4gY29sbGVjdGlvbjtcblx0fVxuXG4gIHJldHVybiBfc2V0KC4uLmFyZ3VtZW50cyk7XG59O1xubG9kYXNoRW1iZXIuc2V0ID0gc2V0O1xuXG5cbi8qKlxuICogT3JpZ2luYWwgbG9kYXNoIGlzRW1wdHlcbiAqXG4gKiBAbmFtZXNwYWNlICBfXG4gKiBAbWV0aG9kIF9pc0VtcHR5XG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQHNpbmNlIHYwLjUuM1xuICovXG5leHBvcnQgdmFyIF9pc0VtcHR5ID0gXy5pc0VtcHR5O1xubG9kYXNoRW1iZXIuX2lzRW1wdHkgPSBfaXNFbXB0eTtcblxuXG4vKipcbiAqIERldGVybWluZXMgaWYgdGhlIHZhbHVlIGlzIGVtcHR5IG9yIG5vdFxuICpcbiAqIEBuYW1lc3BhY2UgIF9cbiAqIEBtZXRob2QgaXNFbXB0eVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBzaW5jZSB2MC41LjNcbiAqL1xuZXhwb3J0IHZhciBpc0VtcHR5ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKFxuXHRcdF8uaXNFbWJlckFycmF5UHJveHkodmFsdWUpICYmXG5cdFx0Xy5pc0Z1bmN0aW9uKHZhbHVlLmlzRW1wdHkpXG5cdCkge1xuXHRcdHJldHVybiB2YWx1ZS5pc0VtcHR5KCk7XG5cdH1cblxuXHRyZXR1cm4gX2lzRW1wdHkoLi4uYXJndW1lbnRzKTtcbn07XG5sb2Rhc2hFbWJlci5pc0VtcHR5ID0gaXNFbXB0eTtcblxuXG4vKipcbiAqIE9yaWdpbmFsIGxvZGFzaCBjbG9uZVxuICpcbiAqIEBuYW1lc3BhY2UgIF9cbiAqIEBtZXRob2QgX2Nsb25lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJuIHsqfVxuICogQHNpbmNlIHYxLjAuMFxuICovXG5leHBvcnQgdmFyIF9jbG9uZSA9IF8uY2xvbmU7XG5sb2Rhc2hFbWJlci5fY2xvbmUgPSBfY2xvbmU7XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgY2xvbmVkIGNvcHkgb2YgdmFsdWVcbiAqXG4gKiBAbmFtZXNwYWNlICBfXG4gKiBAbWV0aG9kIGNsb25lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJuIHsqfVxuICogQHNpbmNlIHYxLjAuMFxuICovXG5leHBvcnQgdmFyIGNsb25lID0gZnVuY3Rpb24odmFsdWUpIHtcblx0aWYgKF8uaXNXaWxkY2F0T2JqZWN0KHZhbHVlKSkge1xuXHRcdHJldHVybiB2YWx1ZS5jbG9uZSgpO1xuXHR9XG5cblx0cmV0dXJuIF9jbG9uZSguLi5hcmd1bWVudHMpO1xufTtcbmxvZGFzaEVtYmVyLmNsb25lID0gY2xvbmU7XG5cblxuLyoqXG4gKiBBbGlhcyBmb3IgYGFycmF5LnBvcGAgb3IgYGFycmF5UHJveHkucG9wT2JqZWN0YFxuICpcbiAqIEBuYW1lc3BhY2UgIF9cbiAqIEBtZXRob2QgcG9wXG4gKiBAcGFyYW0ge0FycmF5fEVtYmVyLkFycmF5UHJveHl9IHZhbHVlXG4gKiBAcmV0dXJuIHsqfVxuICogQHNpbmNlIHYxLjMuMFxuICovXG5leHBvcnQgdmFyIHBvcCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG5cdHJldHVybiAoXy5pc0VtYmVyQXJyYXlQcm94eSh2YWx1ZSkpID8gdmFsdWUucG9wT2JqZWN0KCkgOiB2YWx1ZS5wb3AoKTtcbn07XG5sb2Rhc2hFbWJlci5wb3AgPSBwb3A7XG5cblxuLyoqXG4gKiBBbGlhcyBmb3IgYGFycmF5LnNoaWZ0YCBvciBgYXJyYXlQcm94eS5zaGlmdE9iamVjdGBcbiAqXG4gKiBAbmFtZXNwYWNlICBfXG4gKiBAbWV0aG9kIHNoaWZ0XG4gKiBAcGFyYW0ge0FycmF5fEVtYmVyLkFycmF5UHJveHl9IHZhbHVlXG4gKiBAcmV0dXJuIHsqfVxuICogQHNpbmNlIHYxLjMuMFxuICovXG5leHBvcnQgdmFyIHNoaWZ0ID0gZnVuY3Rpb24odmFsdWUpIHtcblx0cmV0dXJuIChfLmlzRW1iZXJBcnJheVByb3h5KHZhbHVlKSkgPyB2YWx1ZS5zaGlmdE9iamVjdCgpIDogdmFsdWUuc2hpZnQoKTtcbn07XG5sb2Rhc2hFbWJlci5zaGlmdCA9IHNoaWZ0O1xuXG5cbi8qKlxuICogRW1iZXIgYHR5cGVPZmAgYWxpYXNcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgdHlwZU9mXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7U3RyaW5nfSBUaGUgdHlwZSBvZiBgdmFsdWVgXG4gKi9cbmV4cG9ydCB2YXIgdHlwZU9mID0gKHZhbHVlKSA9PiBFbWJlci50eXBlT2YodmFsdWUpO1xubG9kYXNoRW1iZXIudHlwZU9mID0gdHlwZU9mO1xuXG5cbmV4cG9ydCB2YXIgbG9kYXNoRW1iZXI7XG5leHBvcnQgZGVmYXVsdCBsb2Rhc2hFbWJlcjtcbiIsImltcG9ydCBsb2Rhc2hVdGlscyBmcm9tICcuL19jb3JlL2xvZGFzaC11dGlscyc7XG5cblxuLyoqXG4gKiBDb2xsZWN0aW9uIG9mIGFsbCB0aGUgdXRpbHMgaW4gaGVyZS4gQWRkIHRvIHRoaXMgYXMgeW91IGdvLlxuICovXG5sZXQgbG9kYXNoRXh0cmFzID0ge307XG5cblxuLyoqXG4gKiBIZWxwZXIgdG8gY2hlY2sgaWYgYSB2YXJpYWJsZSBpcyBkZWZpbmVkIGFuZCBwcmVzZW50XG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGlzUHJlc2VudFxuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNQcmVzZW50ID0gKHZhbHVlKSA9PiAoIV8uaXNVbmRlZmluZWQodmFsdWUpICYmICFfLmlzTnVsbCh2YWx1ZSkpO1xubG9kYXNoRXh0cmFzLmlzUHJlc2VudCA9IGlzUHJlc2VudDtcblxuXG4vKipcbiAqIEhlbHBlciB0byBjaGVjayBpZiBhIHZhcmlhYmxlIGlzIGRlZmluZWQgYW5kIHByZXNlbnRcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgaXNCbGFua1xuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmV4cG9ydCB2YXIgaXNCbGFuayA9ICh2YWx1ZSkgPT4gIV8uaXNQcmVzZW50KHZhbHVlKTtcbmxvZGFzaEV4dHJhcy5pc0JsYW5rID0gaXNCbGFuaztcblxuXG4vKipcbiAqIEhlbHBlciB0byBjaGVjayBpZiBhIHZhcmlhYmxlIGlzIGEgcHJvbWlzZVxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBpc1Byb21pc2VcbiAqIEBwYXJhbSB7Kn0gdmFsdWU6IFZhbHVlIHRvIGNoZWNrXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzUHJvbWlzZSA9ICh2YWx1ZSkgPT4gXy5pc0Z1bmN0aW9uKHZhbHVlLCAndGhlbicpO1xubG9kYXNoRXh0cmFzLmlzUHJvbWlzZSA9IGlzUHJvbWlzZTtcblxuXG4vKipcbiAqIEhlbHBlciB0byBjaGVjayBhIHZhbHVlIGZvciBhbiBhcnJheSBvZiBMb0Rhc2ggYm9vbGVhbiBjb25kaXRpb25zXG4gKiBUT0RPOiBOYW1lIHRoaXMgYGlzQW5kYCBhbmQgY3JlYXRlIGBpc09yYC4uLlxuICpcbiAqIEBuYW1lc3BhY2UgX1xuICogQG1ldGhvZCBpc1xuICogQHBhcmFtIHsqfSB2YWx1ZTogVmFsdWUgdG8gY2hlY2tcbiAqIEBwYXJhbSB7QXJyYXl9IGNvbmRpdGlvbnM6IExvRGFzaCBtZXRob2RzIHRvIGhhdmUgdmFsdWUgdGVzdGVkIGFnYWluc3QgKGFzIHN0cmluZ3MpXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5leHBvcnQgdmFyIGlzID0gZnVuY3Rpb24odmFsdWUsIGNvbmRpdGlvbnMpIHtcblx0aWYgKF8uaXNTdHJpbmcoY29uZGl0aW9ucykpIGNvbmRpdGlvbnMgPSBbY29uZGl0aW9uc107XG5cdGlmIChfLmlzUHJlc2VudChjb25kaXRpb25zKSAmJiAhXy5pc0FycmF5KGNvbmRpdGlvbnMpKSBjb25kaXRpb25zID0gW107XG5cdGlmIChjb25kaXRpb25zLmxlbmd0aCA8PSAxKSBjb25zb2xlLmVycm9yKFwiRG9uJ3QgY2FsbCBgaXNgIGhlbHBlciB3aXRoIGp1c3Qgb25lIGNvbmRpdGlvbi0gdXNlIHRoYXQgY29uZGl0aW9uIGRpcmVjdGx5XCIpO1xuXHRyZXR1cm4gXy5ldmVyeShjb25kaXRpb25zLCBmdW5jdGlvbihjb25kaXRpb24pIHtcblx0XHRsZXQgcmVzdWx0LCBub3Q7XG5cblx0XHQvLyBDaGVjayBmb3IgdmFsaWQgY29uZGl0aW9uXG5cdFx0aWYgKCFfLmlzU3RyaW5nKGNvbmRpdGlvbikpIHtcblx0XHRcdGNvbnNvbGUud2FybihcImBjb25kaXRpb25gIHdhcyBub3QgYSBzdHJpbmc6IFwiICsgY29uZGl0aW9uKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBIYW5kbGUgbm90IGNvbmRpdGlvblxuXHRcdG5vdCA9IGZhbHNlO1xuXHRcdGlmIChfLnN0YXJ0c1dpdGgoY29uZGl0aW9uLCAnIScpKSB7XG5cdFx0XHRub3QgPSB0cnVlO1xuXHRcdFx0Y29uZGl0aW9uID0gY29uZGl0aW9uLnJlcGxhY2UoJyEnLCAnJyk7XG5cdFx0fVxuXG5cdFx0Ly8gQmUgRVhUUkEgKHRvbykgaGVscGZ1bCAocHJlcGVuZCAnaXMnIGlmIG9tbWl0dGVkKVxuXHRcdGlmICghXy5zdGFydHNXaXRoKGNvbmRpdGlvbiwgJ2lzJykpIHtcblx0XHRcdGNvbmRpdGlvbiA9ICdpcycgKyBjb25kaXRpb247XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBzdXJlIGBjb25kaXRpb25gIGlzIGEgdmFsaWQgbG9kYXNoIG1ldGhvZFxuXHRcdGlmICghXy5pc0Z1bmN0aW9uKF9bY29uZGl0aW9uXSkpIHtcblx0XHRcdGNvbnNvbGUud2FybihcImBjb25kaXRpb25gIHdhcyBub3QgYSB2YWxpZCBsb2Rhc2ggbWV0aG9kOiBcIiArIGNvbmRpdGlvbik7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gRGV0ZXJtaW5lIHJlc3VsdCBhbmQgcmV0dXJuXG5cdFx0cmVzdWx0ID0gX1tjb25kaXRpb25dKHZhbHVlKTtcblx0XHRpZiAobm90ID09PSB0cnVlKSByZXR1cm4gIXJlc3VsdDtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0pO1xufTtcbmxvZGFzaEV4dHJhcy5pcyA9IGlzO1xuXG5cbi8qKlxuICogR2VuZXJhdGUgYGVuc3VyZWAgbWV0aG9kcy0gRW5zdXJlIHRoYXQgdmFsdWUgaXMgb2YgdHlwZSB4XG4gKlxuICogQG5hbWVzcGFjZSBfXG4gKiBAbWV0aG9kIGVuc3VyZXtUeXBlfVxuICogQHBhcmFtIHsqfSB2YWx1ZTogVG8gY2hlY2tcbiAqIEBwYXJhbSB7Kn0gW3ZhbHVlRGVmYXVsdD1kZWZhdWx0c1tjb25kaXRpb25dOiBXaGF0IHRvIGRlZmF1bHQgdG9cbiAqIEByZXR1cm4geyp9IEVuc3VyZWQgdmFsdWVcbiAqIEBzaW5jZSB2MS4zLjBcbiAqL1xuXy5mb3JFYWNoKF8ua2V5cyhsb2Rhc2hVdGlscy50eXBlRGVmYXVsdHMoKSksICh0eXBlKSA9PiB7XG5cdGxvZGFzaEV4dHJhc1tgZW5zdXJlJHt0eXBlfWBdID0gbG9kYXNoVXRpbHMubWFrZUVuc3VyZVR5cGUodHlwZSk7XG59KTtcblxuXG4vKipcbiAqIEphdmFzY3JpcHQgYHR5cGVvZmAgYWxpYXNcbiAqXG4gKiBAbmFtZXNwYWNlIF9cbiAqIEBtZXRob2QgdHlwZU9mXG4gKiBAcGFyYW0geyp9IHZhbHVlOiBWYWx1ZSB0byBjaGVja1xuICogQHJldHVybiB7U3RyaW5nfSBUaGUgdHlwZSBvZiBgdmFsdWVgXG4gKi9cbmV4cG9ydCB2YXIgdHlwZU9mID0gKHZhbHVlKSA9PiB0eXBlb2YodmFsdWUpO1xubG9kYXNoRXh0cmFzLnR5cGVPZiA9IHR5cGVPZjtcblxuXG5leHBvcnQgZGVmYXVsdCBsb2Rhc2hFeHRyYXM7XG4iXX0=
