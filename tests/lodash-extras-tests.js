import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import { all } from '../../../dist/server/index';

describe(
  'Lodash-extras tests',
  function () {
    beforeEach( () => {
      _.runInContext().merge(_, all);
    });

    describe('isPresent', () => {
      it('exists', () => expect(!_.isUndefined(_.isPresent) && !_.isNull(_.isPresent)).to.be.true);

      it('Identifies present objects', () => {
        const testObject = { };
        expect(_.isPresent(testObject)).to.be.true;
      });

      it('Identifies undefined objects', () => {
        let testObject;
        expect(_.isPresent(testObject)).to.be.false
      });

      it('Identifies null objects', () => {
        const testObject = null;
        expect(_.isPresent(testObject)).to.be.false
      });
    });

    describe('isBlank', () => {
      it('exists', () => expect(_.isPresent(_.isBlank)).to.be.true);

      it('Identifies blank objects', () => {
        let testObject;
        expect(_.isBlank(testObject)).to.be.true
      });

      it('Identifies non-blank objects', () => {
        const testObject = { };
        expect(_.isBlank(testObject)).to.be.false;
      });
    });

    describe('isDate', () => {
      it('exists', () => expect(_.isPresent(_.isDate)).to.be.true);

      it('Identifies dates', () => {
        const testObject = new Date();
        expect(_.isDate(testObject)).to.be.true
      });

      it('Identifies non-dates', () => {
        const testObject = { };
        expect(_.isDate(testObject)).to.be.false;
      });
    });

    describe('isPromise', () => {
      it('exists', () => expect(_.isPresent(_.isPromise)).to.be.true);

      it('Identifies promises', () => {
        const testObject = new Promise((resolve, reject) => resolve());
        expect(_.isPromise(testObject)).to.be.true
      });

      it('Identifies non-promises', () => {
        const testObject = { };
        expect(_.isPromise(testObject)).to.be.false;
      });
    });

    describe('is', () => {
      beforeEach(function() {
        sinon.spy(console, 'warn')
        sinon.spy(console, 'error');
      });

      afterEach(function() {
        console.warn.restore();
        console.error.restore();
      });

      it('exists', () => expect(_.isPresent(_.is)).to.be.true);

      it('Identifies match', () => {
        const testObject = { };
        const conditions = ['isPresent', 'isObject'];
        expect(_.is(testObject, conditions)).to.be.true
      });

      it('Identifies non-match', () => {
        const testObject = { };
        const conditions = ['isPresent', 'isBlank'];
        expect(_.is(testObject, conditions)).to.be.false
      });

      it('Displays an error for single condition but completes', () => {
        const testObject = { };
        const conditions = ['isPresent'];
        expect(_.is(testObject, conditions)).to.be.true
        expect(console.error.calledOnce).to.be.true;
        expect(console.error.getCall(0).args[0]).to.equal("Don't call `is` helper with just one condition- use that condition directly");
      });

      it('Returns false for non-string conditions and warns', () => {
        const testObject = { };
        const conditions = ['isPresent', 2];
        expect(_.is(testObject, conditions)).to.be.false
        expect(console.warn.calledOnce).to.be.true;
        expect(console.warn.getCall(0).args[0]).to.equal('`condition` was not a string: 2');
      });

      it('Identifies match with ! condition', () => {
        const testObject = { };
        const conditions = ['isPresent', '!isBlank'];
        expect(_.is(testObject, conditions)).to.be.true
      });

      it('Identifies match with is ommited', () => {
        const testObject = { };
        const conditions = ['Present', '!Blank'];
        expect(_.is(testObject, conditions)).to.be.true
      });

      it('Identifies and returns false for invalid methods', () => {
        const testObject = { };
        const conditions = ['Foo', '!Bar'];
        expect(_.is(testObject, conditions)).to.be.false
        expect(console.warn.calledOnce).to.be.true;
        expect(console.warn.getCall(0).args[0]).to.equal('`condition` was not a valid lodash method: isFoo');
      });
    });

    describe('ensureString', () => {
      it('exists', () => expect(_.isPresent(_.ensureString)).to.be.true);

      it('Returns String when valid', () => {
        const testObject = 'FOO';
        expect(_.ensureString(testObject)).to.equal(testObject);
      });

      it('Returns default value when not a string', () => {
        const testObject = { };
        const valueDefault = 'test';
        expect(_.ensureString(testObject, valueDefault)).to.equal(valueDefault);
      });

      it('Returns string even when default is not supplied', () => {
        const testObject = { };
        expect(_.isString(_.ensureString(testObject))).to.be.true;
      });
    });

    describe('ensureArray', () => {
      it('exists', () => expect(_.isPresent(_.ensureArray)).to.be.true);

      it('Returns Array when valid', () => {
        const testObject = ['FOO', 'BAR'];
        expect(_.ensureArray(testObject)).to.equal(testObject);
      });

      it('Returns default value when not an Array', () => {
        const testObject = { };
        const valueDefault = ['DEFAULT'];
        expect(_.ensureArray(testObject, valueDefault)).to.equal(valueDefault);
      });

      it('Returns Array even when default is not supplied', () => {
        const testObject = { };
        expect(_.isArray(_.ensureArray(testObject))).to.be.true;
      });
    });

    describe('ensurePlainObject', () => {
      it('exists', () => expect(_.isPresent(_.ensurePlainObject)).to.be.true);

      it('Returns PlainObject when valid', () => {
        const testObject = { foo:'bar' };
        expect(_.ensurePlainObject(testObject)).to.equal(testObject);
      });

      it('Returns default value when not a PlainObject', () => {
        const testObject = () => 'foo';
        const valueDefault = { default: 'value' };
        expect(_.ensurePlainObject(testObject, valueDefault)).to.equal(valueDefault);
      });

      it('Returns PlainObject even when default is not supplied', () => {
        const testObject = () => 'foo';
        expect(_.isPlainObject(_.ensurePlainObject(testObject))).to.be.true;
      });
    });

    describe('ensureBoolean', () => {
      it('exists', () => expect(_.isPresent(_.ensureBoolean)).to.be.true);

      it('Returns Boolean when valid', () => {
        let testObject = false;
        expect(_.ensureBoolean(testObject)).to.equal(testObject);
        testObject = true;
        expect(_.ensureBoolean(testObject)).to.equal(testObject);
      });

      it('Returns default value when not a Boolean', () => {
        const testObject = { };
        const valueDefault = true;
        expect(_.ensureBoolean(testObject, valueDefault)).to.equal(valueDefault);
      });

      it('Returns Boolean even when default is not supplied', () => {
        const testObject = { };
        expect(_.isBoolean(_.ensureBoolean(testObject))).to.be.true;
      });
    });

    describe('ensureNumber', () => {
      it('exists', () => expect(_.isPresent(_.ensureNumber)).to.be.true);

      it('Returns Number when valid', () => {
        const testObject = 2;
        expect(_.ensureNumber(testObject)).to.equal(testObject);
      });

      it('Returns default value when not a Number', () => {
        const testObject = 'one';
        const valueDefault = 2;
        expect(_.ensureNumber(testObject, valueDefault)).to.equal(valueDefault);
      });

      it('Returns Number even when default is not supplied', () => {
        const testObject = { };
        expect(_.isNumber(_.ensureNumber(testObject))).to.be.true;
      });
    });

    describe('typeOf', () => {
      it('exists', () => expect(_.isPresent(_.typeOf)).to.be.true);

      it('Returns typeOf Object', () => {
        const testObject = { };
        expect(_.typeOf(testObject)).to.equal(typeof testObject);
      });

      it('Handles undefined', () => {
        let testObject;
        expect(_.typeOf(testObject)).to.equal(typeof testObject);
      });

      it('Handles null', () => {
        const testObject = null;
        expect(_.typeOf(testObject)).to.equal(typeof testObject);
      });
    });
});
