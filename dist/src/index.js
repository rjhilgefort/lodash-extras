'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allExtras = exports.deepExtras = exports.extras = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodashExtras = require('./lodash-extras');

var extras = _interopRequireWildcard(_lodashExtras);

var _lodashDeepExtras = require('./lodash-deep-extras');

var deepExtras = _interopRequireWildcard(_lodashDeepExtras);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var allExtras = _lodash2.default.merge({}, extras, deepExtras);

// Only mixin moment-extras if available
// import lodashMoment from './lodash-moment';
// if (_.isPresent(window.moment)) _.moment = lodashMoment;

// // Only mixin ember-extras if available
// import lodashEmber from './lodash-ember';
// if (_.isPresent(window.Ember)) _.mixin(lodashEmber);
//
// // Must be last to override above methods programmatically

exports.extras = extras;
exports.deepExtras = deepExtras;
exports.allExtras = allExtras;