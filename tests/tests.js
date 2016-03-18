
import chai from 'chai';
import _ from'lodash';
import { core, deep, lodashMoment, lodashEmber, all} from '../../../dist/server/index';
_.merge(_, all);

describe(
  'Lodash-extras',
  function () {
    it('should test', function () {
      console.log(_);
      chai.expect(true).to.be.true;
    });
});
