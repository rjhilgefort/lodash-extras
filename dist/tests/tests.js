'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _index = require('../src/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Lodash-extras', function () {
  it('should test', function () {
    //console.log(lodashExtras);
    console.log(_index.extras);
    console.log(_index.deepExtras);
    console.log(_index.allExtras);
    _chai2.default.expect(true).to.be.true;
  });
});
//var _ = require('lodash');
//_.mixin(require('../src/lodash-extras'));