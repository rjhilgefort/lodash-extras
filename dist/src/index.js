'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.all = exports.deep = exports.core = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodashExtras = require('./lodash-extras');

var _lodashExtras2 = _interopRequireDefault(_lodashExtras);

var _lodashDeepExtras = require('./lodash-deep-extras');

var _lodashDeepExtras2 = _interopRequireDefault(_lodashDeepExtras);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var core = _lodashExtras2.default;

// Only mixin moment-extras if available
// import lodashMoment from './lodash-moment';
// if (_.isPresent(window.moment)) _.moment = lodashMoment;

// // Only mixin ember-extras if available
// import lodashEmber from './lodash-ember';
// if (_.isPresent(window.Ember)) _.mixin(lodashEmber);
//
// // Must be last to override above methods programmatically

var deep = _lodashDeepExtras2.default;
var all = _lodash2.default.merge({}, core, deep);

exports.core = core;
exports.deep = deep;
exports.all = all;