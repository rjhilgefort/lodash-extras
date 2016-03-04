/**
 * Collection of all the utils in here. Add to this as you go.
 */
let lodashUtils = {};


/**
 * Helper for JS types and defaults for each type
 *
 * @method typeDefaults
 * @return {PlainObject}
 */
export var typeDefaults = () => {
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
export var makeIsType = (klass) => {
  return function(value) {
    return (value instanceof klass);
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
export var makeEnsureType = (condition) => {
  let defaults = lodashUtils.typeDefaults();

  // Check params: condition
  if (!_.isString(condition)) condition = '';
  condition = _.upperFirst(condition);
  if (!_.includes(_.keys(defaults), condition)) {
    throw new Error(`\`condition\` not supported: ${condition}`);
  }

  // Shortcut
  let isCondition = _[`is${condition}`];

  /**
   * Interface for `ensureType` methods
   *
   * @method `ensure${type}`
   * @param {*} value: To check
   * @param {*} [valueDefault=defaults[condition]: What to default to
   * @return {*} Defaulted value, or the value itself if pass
   */
  return (value, valueDefault) => {
    // Determine `valueDefault`: if nothing provided, or provided doesn't match type
    if (_.isUndefined(valueDefault) || !isCondition(valueDefault)) {
      valueDefault = _.clone(defaults[condition]);
    }

    // Actual "ensure" check
    if (!_[`is${condition}`](value)) value = valueDefault;

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
export var makeDeepEnsureType = (condition) => {
  return (collection, propString, valueDefault) => {
    return _.set(
      collection,
      propString,
      lodashUtils.makeEnsureType(condition)(
        _.get(collection, propString),
        valueDefault
      )
    );
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
export var validIsMethod = function(key) {
  return (
    _.startsWith(key, 'is') &&
    (this[key].length === 1)
  );
};
lodashUtils.validIsMethod = validIsMethod;


/**
 * Filter out all valid `is` methods from a namespace
 *
 * @method filterIsMethods
 * @param {String} namespace: Collection of methods
 * @return {Object} `namespace` with just the "is" methods
 */
export var filterIsMethods = (namespace) => {
  return _.chain(namespace)
    .keys()
    .filter(_.bind(validIsMethod, namespace))
    .value();
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
export var overloadMethods = (isMethods, namespace, target) => {
  let oldMethod = {};
  _.forEach(isMethods, (method) => {
    // Save old method
    oldMethod[method] = namespace[method];

    // Make new method that also handles `get`. Apply method to exports.
    target[method] = function(value, propString) {
      if (_.size(arguments) === 2) {
        return namespace[method](_.get(...arguments));
      }
      return oldMethod[method](...arguments);
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
export var buildIsMethods = (namespace, target) => {
  overloadMethods(filterIsMethods(namespace), namespace, target);
}
lodashUtils.buildIsMethods = buildIsMethods;


/**
 * Build `before` and `after` methods for moment
 *
 * @method buildInclusiveCompare
 * @param {String} method: either 'isBefore' or 'isAfter'
 * @param {Object} target: namespace to overload methods on
 * @return {Function}
 */
export var buildInclusiveCompare = (method, target) => {
  return (date, dateToCompare) => (date[method](dateToCompare) || date.isSame(dateToCompare));
};
lodashUtils.buildInclusiveCompare = buildInclusiveCompare;


export default lodashUtils;
