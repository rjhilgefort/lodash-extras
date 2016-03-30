'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepDelete = void 0;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodashUtils = require('./_core/lodash-utils');

var _lodashUtils2 = _interopRequireDefault(_lodashUtils);

var _lodashExtras = require('./lodash-extras');

var _lodashExtras2 = _interopRequireDefault(_lodashExtras);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
_lodashUtils2.default.buildIsMethods(_lodash2.default, lodashDeepExtras);
_lodashUtils2.default.buildIsMethods(_lodashExtras2.default, lodashDeepExtras);

/**
 * Generate `ensure` methods- Ensure that value is of type x, deeply
 *
 * @method deepEnsure{Type}
 * @param {Object|Array} collection: The root collection of the tree.
 * @param {String} propString: Nested property path of value to check
 * @param {*} [valueDefault=defaults[condition]: What to default to
 * @return {*} Collection, with ensured property
 */
_lodash2.default.forEach(_lodash2.default.keys(_lodashUtils2.default.typeDefaults()), function (type) {
  _lodashExtras2.default['deepEnsure' + type] = _lodashUtils2.default.makeDeepEnsureType(type);
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
var deepDelete = exports.deepDelete = function deepDelete(value, propString) {
  var currentValue = void 0,
      i = void 0;

  // Delete if present
  if (_lodash2.default.isPresent(value, propString)) {
    currentValue = value;
    propString = (0, _lodash2.default)(propString).toString().split('.');

    for (i = 0; i < propString.length - 1; i++) {
      currentValue = currentValue[propString[i]];
    }

    delete currentValue[propString[i]];
  }
};
lodashDeepExtras.deepDelete = deepDelete;

exports.default = lodashDeepExtras;