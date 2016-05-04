import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import { all } from '../../../dist/server/index';

describe(
  'Lodash-extras tests',
  function () {
    let testDefaults;

    beforeEach(() => {
      _.runInContext().merge(_, all);
      testDefaults = {
        _null: null,
        _undefined: undefined,
        _string: '',
        _boolean: true,
        _function: _.noop,
        _number: 2,
        _array: [],
        _object: {}
      };
    });

    describe('isPresent', () => {
      it('exists', () => expect(!_.isUndefined(_.isPresent) && !_.isNull(_.isPresent)).to.be.true);
      it('Identifies present objects', () => expect(_.isPresent(testDefaults._object)).to.be.true);
      it('Identifies present String', () => expect(_.isPresent(testDefaults._string)).to.be.true);
      it('Identifies present Number', () => expect(_.isPresent(testDefaults._number)).to.be.true);;
      it('Identifies present Boolean', () => expect(_.isPresent(testDefaults._boolean)).to.be.true);
      it('Identifies undefined objects', () => expect(_.isPresent(testDefaults._undefined)).to.be.false);
      it('Identifies null objects', () => expect(_.isPresent(testDefaults._null)).to.be.false);
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
        const conditions = ['isPresent', 'isObject'];
        expect(_.is(testDefaults._object, conditions)).to.be.true;
      });
      it('Identifies non-match', () => {
        const conditions = ['isPresent', 'isString'];
        expect(_.is(testDefaults._object, conditions)).to.be.false;
      });
      it('Displays an error for single condition but completes', () => {
        const conditions = ['isPresent'];
        expect(_.is(testDefaults._object, conditions)).to.be.true;
        expect(console.error.calledOnce).to.be.true;
        expect(console.error.getCall(0).args[0]).to.equal("Don't call `is` helper with just one condition- use that condition directly");
      });
      it('Returns false for non-string conditions and warns', () => {
        const conditions = ['isPresent', 2];
        expect(_.is(testDefaults._object, conditions)).to.be.false;
        expect(console.warn.calledOnce).to.be.true;
        expect(console.warn.getCall(0).args[0]).to.equal('`condition` was not a string: 2');
      });
      it('Identifies match with ! condition', () => {
        const conditions = ['isPresent', '!isString'];
        expect(_.is(testDefaults._object, conditions)).to.be.true;
      });
      it('Identifies match with "is" omitted', () => {
        const conditions = ['Present', '!String'];
        expect(_.is(testDefaults._object, conditions)).to.be.true;
      });
      it('Identifies and returns false for invalid methods', () => {
        const conditions = ['Foo', '!Bar'];
        expect(_.is(testDefaults._object, conditions)).to.be.false;
        expect(console.warn.calledOnce).to.be.true;
        expect(console.warn.getCall(0).args[0]).to.equal('`condition` was not a valid lodash method: isFoo');
      });
    });

    describe('ensureString', () => {
      it('exists', () => expect(_.isPresent(_.ensureString)).to.be.true);
      it('Returns String when valid', () => expect(_.ensureString(testDefaults._string)).to.equal(testDefaults._string));
      it('Returns default value when not a string', () => expect(_.ensureString(testDefaults._object, testDefaults._string)).to.equal(testDefaults._string));
      it('Returns string even if supplied default is not a string', () => expect(_.ensureString(testDefaults._object, testDefaults._number)).to.equal(testDefaults._string));
      it('Returns string even when default is not supplied', () => expect(_.ensureString(testDefaults._object)).to.equal(testDefaults._string));
    });

    describe('ensureArray', () => {
      it('exists', () => expect(_.isPresent(_.ensureArray)).to.be.true);
      it('Returns Array when valid', () => expect(_.ensureArray(testDefaults._array)).to.eql(testDefaults._array));
      it('Returns default value when not an Array', () => expect(_.ensureArray(testDefaults._object, testDefaults._array)).to.eql(testDefaults._array));
      it('Returns Array even if supplied default is not a Array', () => expect(_.ensureArray(testDefaults._object, testDefaults._number)).to.eql(testDefaults._array));
      it('Returns Array even when default is not supplied', () => expect(_.ensureArray(testDefaults._object)).to.eql(testDefaults._array));
    });

    describe('ensurePlainObject', () => {
      it('exists', () => expect(_.isPresent(_.ensurePlainObject)).to.be.true);
      it('Returns PlainObject when valid', () => expect(_.ensurePlainObject(testDefaults._object)).to.eql(testDefaults._object));
      it('Returns default value when not a PlainObject', () => expect(_.ensurePlainObject(testDefaults._function, testDefaults._object)).to.eql(testDefaults._object));
      it('Returns PlainObject even if supplied default is not a PlainObject', () => expect(_.ensurePlainObject(testDefaults._function, testDefaults._function)).to.eql(testDefaults._object));
      it('Returns PlainObject even when default is not supplied', () => expect(_.ensurePlainObject(testDefaults._function)).to.eql(testDefaults._object));
    });

    describe('ensureBoolean', () => {
      it('exists', () => expect(_.isPresent(_.ensureBoolean)).to.be.true);
      it('Returns Boolean when valid', () => expect(_.ensureBoolean(testDefaults._boolean)).to.equal(testDefaults._boolean));
      it('Returns default value when not a Boolean', () => expect(_.ensureBoolean(testDefaults._object, testDefaults._boolean)).to.equal(testDefaults._boolean));
      it('Returns Boolean even if supplied default is not a Boolean', () => expect(_.ensureBoolean(testDefaults._object, testDefaults._array)).to.be.false);
      it('Returns Boolean even when default is not supplied', () => expect(_.ensureBoolean(testDefaults._object)).to.be.false);
    });

    describe('ensureNumber', () => {
      it('exists', () => expect(_.isPresent(_.ensureNumber)).to.be.true);
      it('Returns Number when valid', () => expect(_.ensureNumber(testDefaults._number)).to.equal(testDefaults._number));
      it('Returns default value when not a Number', () => expect(_.ensureNumber(testDefaults._object, testDefaults._number)).to.equal(testDefaults._number));
      it('Returns Number even if supplied default is not a Number', () => expect(_.ensureNumber(testDefaults._object, testDefaults._array)).to.equal(1));
      it('Returns Number even when default is not supplied', () => expect(_.ensureNumber(testDefaults._object)).to.equal(1));
    });

    describe('typeOf', () => {
      it('exists', () => expect(_.isPresent(_.typeOf)).to.be.true);
      it('Returns typeOf Object', () => expect(_.typeOf(testDefaults._object)).to.equal(typeof testDefaults._object));
      it('Handles undefined', () => expect(_.typeOf(testDefaults._undefined)).to.equal(typeof testDefaults._undefined));
      it('Handles null', () => expect(_.typeOf(testDefaults._null)).to.equal(typeof testDefaults._null));
    });
});
