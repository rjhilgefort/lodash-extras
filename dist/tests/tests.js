'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _index = require('../src/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Lodash-extras', function () {
  it('should test', function () {
    //console.log(lodashExtras);
    console.log(_index.core);
    console.log(_index.deep);
    console.log(_index.all);
    _chai2.default.expect(true).to.be.true;
  });
});
//var _ = require('lodash');
//_.mixin(require('../src/lodash-extras'));