import { expect } from 'chai';
import _ from 'lodash';
import moment from 'moment';
import { all } from '../../../dist/server/index';


describe(
  'Lodash-moment tests',
  function () {
    beforeEach( () => {
      _.runInContext().merge(_, all);
    });

    it('moment namespace should be present on _', () => {
      expect(_.isPresent(_.moment)).to.be.true;
    });

    describe('isMoment', ()=> {
      it('exists', () => expect(_.isPresent(_.moment.isMoment)).to.be.true);

      it('Identifies moment objects', () => {
        const testObject = moment();
        expect(_.moment.isMoment(testObject)).to.be.true;
      });

      it('Identifies non-moment objects', () => {
        const testObject = Date();
        expect(_.moment.isMoment(testObject)).to.be.false;
      });
    });

    describe('ensureMoment', ()=> {
      it('exists', () => expect(_.isPresent(_.moment.ensureMoment)).to.be.true);

      it('Returns moment object when valid', () => {
        const testObject = moment();
        expect(_.moment.ensureMoment(testObject).isSame(testObject)).to.be.true;
      });

      it('Converts to moment object when possible', () => {
        const testObject = '2013-02-08';
        expect(_.moment.ensureMoment(testObject).isSame(moment(testObject))).to.be.true;
      });

      it('Returns default value when conversion isn\'t possible', () => {
        const testObject = 'Not a time';
        const valueDefault = moment();
        expect(_.moment.ensureMoment(testObject, valueDefault).isSame(valueDefault)).to.be.true;
      });

      it('Returns  moment object even when default is not supplied', () => {
        const testObject = 'Not a time';
        expect(_.moment.isMoment(_.moment.ensureMoment(testObject))).to.be.true;
      });
    });
});
