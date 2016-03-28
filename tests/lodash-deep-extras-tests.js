import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import { all } from '../../../dist/server/index';



describe(
  'Lodash-deep-extras tests',
  function () {
    beforeEach( () => {
      _.runInContext().merge(_, all);
    });

    describe('deepEnsureString', ()=> {
      it('exists', () => expect(_.isPresent(_.deepEnsureString)).to.be.true);

      it('Returns String when valid', () => {
        let testObject = { testKey: 'FOO' };
        expect(_.deepEnsureString(testObject, 'testKey')).to.equal(testObject);
        testObject = { deeperTest: { testKey: 'FOO' } };
        expect(_.deepEnsureString(testObject, 'testKey')).to.equal(testObject);
      });

      it('Returns default value when not a string', () => {
        let testObject = { testKey: {} };
        const valueDefault = 'BAR';
        expect(_.deepEnsureString(testObject, 'testKey', valueDefault).testKey).to.equal(valueDefault);
        testObject = { deeperTest: { testKey: {} } };
        expect(_.deepEnsureString(testObject, 'testKey', valueDefault).testKey).to.equal(valueDefault);
      });

      it('Returns default value when not a string and default is omitted', () => {
        let testObject = { testKey: {} };
        const valueDefault = '';
        expect(_.deepEnsureString(testObject, 'testKey').testKey).to.equal(valueDefault);
        testObject = { deeperTest: { testKey: {} } };
        expect(_.deepEnsureString(testObject, 'testKey').testKey).to.equal(valueDefault);
      });
    });

    describe('deepEnsureArray', ()=> {
      it('exists', () => expect(_.isPresent(_.deepEnsureArray)).to.be.true);

      it('Returns Array when valid', () => {
        let testObject = { testKey: ['FOO', 'BAR'] };
        expect(_.deepEnsureArray(testObject, 'testKey')).to.eql(testObject);
        testObject = { deeperTest: { testKey: ['FOO', 'BAR'] } };
        expect(_.deepEnsureArray(testObject, 'testKey')).to.eql(testObject);
      });

      it('Returns default value when not an Array', () => {
        let testObject = { testKey: {} };;
        const valueDefault = ['DEFAULT'];
        expect(_.deepEnsureArray(testObject, 'testKey', valueDefault).testKey).to.eql(valueDefault);
        testObject = { deeperTest: { testKey: { } } };
        expect(_.deepEnsureArray(testObject, 'testKey', valueDefault).testKey).to.eql(valueDefault);
      });

      it('Returns Array even when default is not supplied', () => {
        let testObject = {};
        const valueDefault = [];
        expect(_.deepEnsureArray(testObject, 'testKey').testKey).to.eql(valueDefault);
        testObject = { deeperTest: { testKey: { } } };
        expect(_.deepEnsureArray(testObject, 'testKey').testKey).to.eql(valueDefault);
      });
    });

    describe('deepEnsurePlainObject', ()=> {
      it('exists', () => expect(_.isPresent(_.deepEnsurePlainObject)).to.be.true);

      it('Returns PlainObject when valid', () => {
        let testObject = { testKey: { foo:'bar' } };
        expect(_.deepEnsurePlainObject(testObject), 'testKey').to.eql(testObject);
        testObject = { deeperTest: { testKey: { foo:'bar' } } };
        expect(_.deepEnsurePlainObject(testObject), 'testKey').to.eql(testObject);
      });

      it('Returns default value when not a PlainObject', () => {
        let testObject = { testKey: () => 'foo' }
        const valueDefault = { default: 'bar' };
        expect(_.deepEnsurePlainObject(testObject, 'testKey', valueDefault).testKey).to.eql(valueDefault);
        testObject = { deeperTest: { testKey: () => 'foo' } }
        expect(_.deepEnsurePlainObject(testObject, 'testKey', valueDefault).testKey).to.eql(valueDefault);
      });

      it('Returns PlainObject even when default is not supplied', () => {
        let testObject = { testKey: () => 'foo' }
        const valueDefault = { };
        expect(_.deepEnsurePlainObject(testObject, 'testKey').testKey).to.eql(valueDefault);
        testObject = { deeperTest: { testKey: () => 'foo' } }
        expect(_.deepEnsurePlainObject(testObject, 'testKey').testKey).to.eql(valueDefault);
      });
    });

    describe('deepEnsureBoolean', ()=> {
      it('exists', () => expect(_.isPresent(_.deepEnsureBoolean)).to.be.true);

      it('Returns Boolean when valid', () => {
        let testObject = { testKey: false };
        expect(_.deepEnsureBoolean(testObject, 'testKey')).to.equal(testObject);
        testObject = { deeperTest: { testKey: false } };
        expect(_.deepEnsureBoolean(testObject, 'testKey')).to.equal(testObject);
      });

      it('Returns default value when not a Boolean', () => {
        let testObject = { testKey: { } };
        const valueDefault = true;
        expect(_.deepEnsureBoolean(testObject, 'testKey', valueDefault).testKey).to.be.true;
        testObject = { deeperTest: { testKey: { } } };
        expect(_.deepEnsureBoolean(testObject, 'testKey', valueDefault).testKey).to.be.true;
      });

      it('Returns Boolean even when default is not supplied', () => {
        let testObject = { testKey: { } };
        expect(_.deepEnsureBoolean(testObject, 'testKey').testKey).to.be.false;
        testObject = { deeperTest: { testKey: { } } };
        expect(_.deepEnsureBoolean(testObject, 'testKey').testKey).to.be.false;
      });
    });

    describe('deepEnsureNumber', ()=> {
      it('exists', () => expect(_.isPresent(_.deepEnsureNumber)).to.be.true);

      it('Returns Number when valid', () => {
        let testObject = { testKey: 2 };
        expect(_.deepEnsureNumber(testObject)).to.equal(testObject);
        testObject = { deeperTest: { testKey: 2 } };
        expect(_.deepEnsureNumber(testObject)).to.equal(testObject);

      });

      it('Returns default value when not a Number', () => {
        let testObject = { testKey: 'one' };
        const valueDefault = 2;
        expect(_.deepEnsureNumber(testObject, 'testKey', valueDefault).testKey).to.equal(valueDefault);
        testObject = { deeperTest: { testKey: 'one' } };
        expect(_.deepEnsureNumber(testObject, 'testKey', valueDefault).testKey).to.equal(valueDefault);
      });

      it('Returns Number even when default is not supplied', () => {
        let testObject = { testKey: 'one' };
        const valueDefault = 1;
        expect(_.deepEnsureNumber(testObject, 'testKey').testKey).to.equal(valueDefault);
        testObject = { deeperTest: { testKey: 'one' } };
        expect(_.deepEnsureNumber(testObject, 'testKey').testKey).to.equal(valueDefault);
      });
    });
});
