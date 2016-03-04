import { expect } from 'chai';
//import _ from 'lodash';
//import lodashExtras from '../src/main';
import _ from '../../dist/lodash-extras';
describe('Test', () => {
  it ('pass', () => {
    console.log((_));
    expect(!_.isUndefined(_.isPresent) || !_.isNull(_.isPresent)).to.be.true;
  });
});
