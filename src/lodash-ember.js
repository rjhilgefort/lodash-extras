/**
 * This utility assumes `Ember` exists globally
 */
import lodashUtils from './_core/lodash-utils';


/**
 * Collection of all the utils in here. Add to this as you go.
 */
export var lodashEmber = {};


/**
 * Check that a value is an instance, as designated by Ember
 *
 * @method isInstance
 * @param {*} value: Value to check
 * @return {Boolean}
 */
export var isEmberInstance = function(value) {
  return (Ember.typeOf(value) === 'instance');
};
lodashEmber.isEmberInstance = isEmberInstance;


/**
 * Check that a value is, at least, a subclass of Ember.Object
 *
 * @method isEmberObject
 * @param {*} value: Value to check
 * @return {Boolean}
 */
export var isEmberObject = lodashUtils.makeIsType(Ember.Object);
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
export var isEmberObjectProxy = lodashUtils.makeIsType(Ember.ObjectProxy);
lodashEmber.isEmberObjectProxy = isEmberObjectProxy;


/**
 * Check that a value is, at least, a subclass of Ember.ArrayProxy
 *
 * @method isEmberArrayProxy
 * @param {*} value: Value to check
 * @return {Boolean}
 */
export var isEmberArrayProxy = lodashUtils.makeIsType(Ember.ArrayProxy);
lodashEmber.isEmberArrayProxy = isEmberArrayProxy;


/**
 * Check that the value is a descendent of an Ember Class
 * TODO: Check that `_.isEmberInstance` doesn't already yield the same result
 *
 * @method isEmberCollection
 * @param {*} value: Value to check
 * @return {Boolean}
 */
export var isEmberCollection = function(value) {
  return (
    _.isEmberObject(value) ||
    _.isEmberObjectProxy(value) ||
    _.isEmberArrayProxy(value)
  );
};
lodashEmber.isEmberCollection = isEmberCollection;


/**
 * Check that value is Ember Transition
 *
 * @method isEmberTransition
 * @param {*} value: Value to check
 * @return {Boolean}
 */
export var isEmberTransition = function(value) {
  return (
    _.isFunction(value, 'toString') &&
    _.contains(value.toString(), 'Transition')
  );
};
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
export var _forEach = _.forEach;
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
export var forEach = function(collection, callback, thisArg) {
  if (_.isEmberArrayProxy(collection)) {
    return collection.forEach(callback, this);
  }
  if (_.isEmberObjectProxy(collection) && _.isObject(collection.get('content'))) {
    return _forEach(collection.get('content'), callback, thisArg);
  }
  return _forEach(collection, callback, thisArg);
};
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
export var _reduce = _.reduce;
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
export var reduce = function(collection, callback, currentValue, thisArg) {
  if (_.isEmberArrayProxy(collection)) {
    return collection.reduce(callback, currentValue, this);
  }
  if (_.isEmberObjectProxy(collection) && _.isObject(collection.get('content'))) {
    return _reduce(collection.get('content'), callback, currentValue, thisArg);
  }
  return _reduce(collection, callback, currentValue, thisArg);
};
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
export var _map = _.map;
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
export var map = function(collection, callback, thisArg) {
  if (_.isEmberArrayProxy(collection)) {
    return collection.map(callback, this);
  }
  return _map(collection, callback, thisArg);
};
lodashEmber.map = map;


/**
 * Lodash `get` alias to private namespace
 *
 * @method _get
 * @param {Object|Array} collection: The root collection of the tree.
 * @param {String|Array} propertyPath: The property path in the collection.
 * @returns {*} The value, or undefined if it doesn't exists.
 */
export var _get = _.get;
lodashEmber._get = _get;


/**
 * Retrieves the value of a property in an object tree.
 *
 * @method get
 * @param {Object|Array} collection: The root collection of the tree.
 * @param {String|Array} propertyPath: The property path in the collection.
 * @returns {*} The value, or undefined if it doesn't exists.
 */
export var get = function(collection, propertyPath) {
  // Handle Ember Objects
  if (isEmberObject(collection) || isEmberObjectProxy(collection)) {
    return collection.get(propertyPath);
  }

  return _get(...arguments);
};
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
export var _set = _.set;
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
export var set = function(collection, propertyPath, value) {
  // Handle Ember Objects
  if (isEmberObject(collection) || isEmberObjectProxy(collection)) {
    collection.set(propertyPath, value);
    return collection;
  }

  return _set(...arguments);
};
lodashEmber.set = set;


/**
 * Original lodash isEmpty
 *
 * @method _isEmpty
 * @param {*} value
 * @return {Boolean}
 */
export var _isEmpty = _.isEmpty;
lodashEmber._isEmpty = _isEmpty;


/**
 * Determines if the value is empty or not
 *
 * @method isEmpty
 * @param {*} value
 * @return {Boolean}
 */
export var isEmpty = function(value) {
  if (
    _.isEmberArrayProxy(value) &&
    _.isFunction(value.isEmpty)
  ) {
    return value.isEmpty();
  }

  return _isEmpty(...arguments);
};
lodashEmber.isEmpty = isEmpty;


/**
 * Original lodash clone
 *
 * @method _clone
 * @param {*} value
 * @return {*}
 */
export var _clone = _.clone;
lodashEmber._clone = _clone;


/**
 * Returns a cloned copy of value
 *
 * @method clone
 * @param {*} value
 * @return {*}
 */
export var clone = function(value) {
  if (_.isWildcatObject(value)) {
    return value.clone();
  }

  return _clone(...arguments);
};
lodashEmber.clone = clone;


/**
 * Alias for `array.pop` or `arrayProxy.popObject`
 *
 * @method pop
 * @param {Array|Ember.ArrayProxy} value
 * @return {*}
 */
export var pop = function(value) {
  return (_.isEmberArrayProxy(value)) ? value.popObject() : value.pop();
};
lodashEmber.pop = pop;


/**
 * Alias for `array.shift` or `arrayProxy.shiftObject`
 *
 * @method shift
 * @param {Array|Ember.ArrayProxy} value
 * @return {*}
 */
export var shift = function(value) {
  return (_.isEmberArrayProxy(value)) ? value.shiftObject() : value.shift();
};
lodashEmber.shift = shift;


/**
 * Ember `typeOf` alias
 *
 * @method typeOf
 * @param {*} value: Value to check
 * @return {String} The type of `value`
 */
export var typeOf = (value) => Ember.typeOf(value);
lodashEmber.typeOf = typeOf;


export var lodashEmber;
export default lodashEmber;
