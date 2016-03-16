
import chai from 'chai';
//var _ = require('lodash');
//_.mixin(require('../src/lodash-extras'));
import { extras, deepExtras, allExtras } from '../src/index';

describe(
  'Lodash-extras',
  function () {
    it('should test', function () {
      //console.log(lodashExtras);
      console.log(extras);
      console.log(deepExtras);
      console.log(allExtras);
      chai.expect(true).to.be.true;
    });
});
