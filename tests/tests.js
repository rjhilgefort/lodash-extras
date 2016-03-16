
import chai from 'chai';
//var _ = require('lodash');
//_.mixin(require('../src/lodash-extras'));
import { core, deep, all } from '../src/index';

describe(
  'Lodash-extras',
  function () {
    it('should test', function () {
      //console.log(lodashExtras);
      console.log(core);
      console.log(deep);
      console.log(all);
      chai.expect(true).to.be.true;
    });
});
