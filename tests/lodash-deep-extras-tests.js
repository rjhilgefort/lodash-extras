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

    describe('isPresent', () => {
      it('exists', () => expect(!_.isUndefined(_.isPresent) && !_.isNull(_.isPresent)).to.be.true);

      it('Identifies Present values', () => {
        const testObject = { testKey: 0 };
        expect(_.isPresent(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Present values', () => {
        let testObject = { testKey: null };
        expect(_.isPresent(testObject, 'testKey')).to.be.false;
        testObject = { testKey: undefined };
        expect(_.isPresent(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: 0 };
        expect(_.isPresent(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('deepEnsureString', () => {
      it('exists', () => expect(_.isPresent(_.deepEnsureString)).to.be.true);

      it('Returns String when valid', () => {
        const testObject = { testKey: 'FOO' };
        expect(_.deepEnsureString(testObject, 'testKey')).to.equal(testObject);
      });

      it('Returns default value when not a string', () => {
        const testObject = { testKey: { } };
        const valueDefault = 'BAR';
        expect(_.deepEnsureString(testObject, 'testKey', valueDefault).testKey).to.equal(valueDefault);
      });

      it('Returns default value when not a string and default is omitted', () => {
        const testObject = { testKey: { } };
        const valueDefault = '';
        expect(_.deepEnsureString(testObject, 'testKey').testKey).to.equal(valueDefault);
      });
    });

    describe('deepEnsureArray', () => {
      it('exists', () => expect(_.isPresent(_.deepEnsureArray)).to.be.true);

      it('Returns Array when valid', () => {
        const testObject = { testKey: ['FOO', 'BAR'] };
        expect(_.deepEnsureArray(testObject, 'testKey')).to.eql(testObject);
      });

      it('Returns default value when not an Array', () => {
        const testObject = { testKey: { } };
        const valueDefault = ['DEFAULT'];
        expect(_.deepEnsureArray(testObject, 'testKey', valueDefault).testKey).to.eql(valueDefault);
      });

      it('Returns Array even when default is not supplied', () => {
        const testObject = { };
        const valueDefault = [];
        expect(_.deepEnsureArray(testObject, 'testKey').testKey).to.eql(valueDefault);
      });
    });

    describe('deepEnsurePlainObject', () => {
      it('exists', () => expect(_.isPresent(_.deepEnsurePlainObject)).to.be.true);

      it('Returns PlainObject when valid', () => {
        const testObject = { testKey: { foo: 'bar' } };
        expect(_.deepEnsurePlainObject(testObject), 'testKey').to.eql(testObject);
      });

      it('Returns default value when not a PlainObject', () => {
        const testObject = { testKey: () => 'foo' }
        const valueDefault = { default: 'bar' };
        expect(_.deepEnsurePlainObject(testObject, 'testKey', valueDefault).testKey).to.eql(valueDefault);
      });

      it('Returns PlainObject even when default is not supplied', () => {
        const testObject = { testKey: () => 'foo' }
        const valueDefault = { };
        expect(_.deepEnsurePlainObject(testObject, 'testKey').testKey).to.eql(valueDefault);
      });
    });

    describe('deepEnsureBoolean', () => {
      it('exists', () => expect(_.isPresent(_.deepEnsureBoolean)).to.be.true);

      it('Returns Boolean when valid', () => {
        const testObject = { testKey: false };
        expect(_.deepEnsureBoolean(testObject, 'testKey')).to.equal(testObject);
      });

      it('Returns default value when not a Boolean', () => {
        const testObject = { testKey: { } };
        const valueDefault = true;
        expect(_.deepEnsureBoolean(testObject, 'testKey', valueDefault).testKey).to.be.true;
      });

      it('Returns Boolean even when default is not supplied', () => {
        const testObject = { testKey: { } };
        expect(_.deepEnsureBoolean(testObject, 'testKey').testKey).to.be.false;
      });
    });

    describe('deepEnsureNumber', () => {
      it('exists', () => expect(_.isPresent(_.deepEnsureNumber)).to.be.true);

      it('Returns Number when valid', () => {
        const testObject = { testKey: 2 };
        expect(_.deepEnsureNumber(testObject)).to.equal(testObject);
      });

      it('Returns default value when not a Number', () => {
        const testObject = { testKey: 'one' };
        const valueDefault = 2;
        expect(_.deepEnsureNumber(testObject, 'testKey', valueDefault).testKey).to.equal(valueDefault);

      });

      it('Returns Number even when default is not supplied', () => {
        const testObject = { testKey: 'one' };
        const valueDefault = 1;
        expect(_.deepEnsureNumber(testObject, 'testKey').testKey).to.equal(valueDefault);
      });
    });

    describe('isArguments', () => {
      it('exists', () => expect(_.isPresent(_.isArguments)).to.be.true);

      it('Identifies Arguments object', () => {
        const testObject = { testKey: arguments };
        expect(_.isArguments(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Arguments object', () => {
        const testObject = { testKey: 'foo' };
        expect(_.isArguments(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: 'foo' };
        expect(_.isArguments(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isArray', () => {
      it('exists', () => expect(_.isPresent(_.isArray)).to.be.true);

      it('Identifies Array object', () => {
        const testObject = { testKey: ['foo'] };
        expect(_.isArray(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Array object', () => {
        const testObject = { testKey: 'foo' };
        expect(_.isArray(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: ['foo'] };
        expect(_.isArray(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isArrayBuffer', () => {
      it('exists', () => expect(_.isPresent(_.isArrayBuffer)).to.be.true);

      it('Identifies ArrayBuffer object', () => {
        const testObject = { testKey: new ArrayBuffer(2) };
        expect(_.isArrayBuffer(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-ArrayBuffer object', () => {
        const testObject = { testKey: 'foo' };
        expect(_.isArrayBuffer(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: new ArrayBuffer(2) };
        expect(_.isArrayBuffer(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isArrayLike', () => {
      it('exists', () => expect(_.isPresent(_.isArrayLike)).to.be.true);

      it('Identifies Array-likes', () => {
        let testObject = { testKey: ['foo'] };
        expect(_.isArrayLike(testObject, 'testKey')).to.be.true;
        testObject = { testKey: 'foo' };
        expect(_.isArrayLike(testObject, 'testKey')).to.be.true;
        testObject = { testKey: { value: 1, length: 1 } };
        expect(_.isArrayLike(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Array-likes', () => {
        let testObject = { testKey: _.noop };
        expect(_.isArrayLike(testObject, 'testKey')).to.be.false;
        testObject = { testKey: { value: 1 } };
        expect(_.isArrayLike(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: ['foo'] };
        expect(_.isArrayLike(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isArrayLikeObject', () => {
      it('exists', () => expect(_.isPresent(_.isArrayLikeObject)).to.be.true);

      it('Identifies Array-like objects', () => {
        let testObject = { testKey: ['foo'] };
        expect(_.isArrayLikeObject(testObject, 'testKey')).to.be.true;
        testObject = { testKey: { value: 1, length: 1 } };
        expect(_.isArrayLikeObject(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Array-like objects', () => {
        let testObject = { testKey: _.noop };
        expect(_.isArrayLikeObject(testObject, 'testKey')).to.be.false;
        testObject = { testKey: { value: 1 } };
        expect(_.isArrayLikeObject(testObject, 'testKey')).to.be.false;
        testObject = { testKey: 'foo' };
        expect(_.isArrayLikeObject(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: ['foo'] };
        expect(_.isArrayLikeObject(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isBoolean', () => {
      it('exists', () => expect(_.isPresent(_.isBoolean)).to.be.true);

      it('Identifies Booleans', () => {
        const testObject = { testKey: false };
        expect(_.isBoolean(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Booleans', () => {
        const testObject = { testKey: 'foo' };
        expect(_.isBoolean(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: false };
        expect(_.isBoolean(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isBuffer', () => {
      console.log(new Buffer(2));
      console.log(_.isBuffer(new Buffer(2)));
      it('exists', () => expect(_.isPresent(_.isBuffer)).to.be.true);

      if(!_.isNil(Buffer)) {
        it('Identifies Buffer', () => {
          const testObject = { testKey: new Buffer(2) };
          expect(_.isBuffer(testObject, 'testKey')).to.be.true;
        });

        it('Identifies non-Buffer', () => {
          const testObject = { testKey: 'foo' };
          expect(_.isBuffer(testObject, 'testKey')).to.be.false;
        });

        it('Handles undefined key', () => {
          const testObject = { testKey: new Buffer(2) };
          expect(_.isBuffer(testObject, 'testKey2')).to.be.false;
        });
      }
    });

    describe('isDate', () => {
      it('exists', () => expect(_.isPresent(_.isDate)).to.be.true);

      it('Identifies Dates', () => {
        const testObject = { testKey: new Date };
        expect(_.isDate(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Dates', () => {
        const testObject = { testKey: 'Mon April 23 2012' };
        expect(_.isDate(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: new Date };
        expect(_.isDate(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isElement', () => {
      function Element() {
        this.nodeType = 1;
      }

      it('exists', () => expect(_.isPresent(_.isElement)).to.be.true);

      it('Identifies Elements', () => {
        const testObject = { testKey: new Element };
        expect(_.isElement(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Elements', () => {
        const testObject = { testKey: '<body>' };
        expect(_.isElement(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: new Element };
        expect(_.isElement(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isEmpty', () => {
      it('exists', () => expect(_.isPresent(_.isEmpty)).to.be.true);

      it('Identifies Empty value', () => {
        const testObject = { testKey: 1 };
        expect(_.isEmpty(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Empty value', () => {
        const testObject = { testKey: { value: 1 } };
        expect(_.isEmpty(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: 1 };
        expect(_.isEmpty(testObject, 'testKey2')).to.be.true;
      });
    });

    describe('isError', () => {
      it('exists', () => expect(_.isPresent(_.isError)).to.be.true);

      it('Identifies Error object', () => {
        const testObject = { testKey: new Error };
        expect(_.isError(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Error object', () => {
        const testObject = { testKey: 'error' };
        expect(_.isError(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: new Error };
        expect(_.isError(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isFinite', () => {
      it('exists', () => expect(_.isPresent(_.isFinite)).to.be.true);

      it('Identifies Finite value', () => {
        const testObject = { testKey: 3 };
        expect(_.isFinite(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Finite value', () => {
        const testObject = { testKey: Infinity };
        expect(_.isFinite(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: 3 };
        expect(_.isFinite(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isFunction', () => {
      it('exists', () => expect(_.isPresent(_.isFunction)).to.be.true);

      it('Identifies Function', () => {
        const testObject = { testKey: _ };
        expect(_.isFunction(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Function', () => {
        const testObject = { testKey: 'foo' };
        expect(_.isFunction(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: _ };
        expect(_.isFunction(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isInteger', () => {
      it('exists', () => expect(_.isPresent(_.isInteger)).to.be.true);

      it('Identifies Integer', () => {
        const testObject = { testKey: 3 };
        expect(_.isInteger(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Integer', () => {
        const testObject = { testKey: 'foo' };
        expect(_.isInteger(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: 3 };
        expect(_.isInteger(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isLength', () => {
      it('exists', () => expect(_.isPresent(_.isLength)).to.be.true);

      it('Identifies array-like length', () => {
        const testObject = { testKey: 3 };
        expect(_.isLength(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-array-like length', () => {
        const testObject = { testKey: '3' };
        expect(_.isLength(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: 3 };
        expect(_.isLength(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isMap', () => {
      it('exists', () => expect(_.isPresent(_.isMap)).to.be.true);

      it('Identifies Map objects', () => {
        const testObject = { testKey: new Map };
        expect(_.isMap(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Map objects', () => {
        const testObject = { testKey: '3' };
        expect(_.isMap(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: new Map };
        expect(_.isMap(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isNaN', () => {
      it('exists', () => expect(_.isPresent(_.isNaN)).to.be.true);

      it('Identifies NaN', () => {
        const testObject = { testKey: NaN };
        expect(_.isNaN(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-NaN', () => {
        const testObject = { testKey: 3 };
        expect(_.isNaN(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: NaN };
        expect(_.isNaN(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isNil', () => {
      it('exists', () => expect(_.isPresent(_.isNil)).to.be.true);

      it('Identifies Nil values', () => {
        let testObject = { testKey: null };
        expect(_.isNil(testObject, 'testKey')).to.be.true;
        testObject = { testKey: undefined };
        expect(_.isNil(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Nil values', () => {
        const testObject = { testKey: 0 };
        expect(_.isNil(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: null };
        expect(_.isNil(testObject, 'testKey2')).to.be.true;
      });
    });

    describe('isNull', () => {
      it('exists', () => expect(_.isPresent(_.isNull)).to.be.true);

      it('Identifies Null values', () => {
        let testObject = { testKey: null };
        expect(_.isNull(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Null values', () => {
        const testObject = { testKey: undefined };
        expect(_.isNull(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: null };
        expect(_.isNull(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isNumber', () => {
      it('exists', () => expect(_.isPresent(_.isNumber)).to.be.true);

      it('Identifies Number', () => {
        const testObject = { testKey: 3 };
        expect(_.isNumber(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Numbers', () => {
        const testObject = { testKey: '3' };
        expect(_.isNumber(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: 3 };
        expect(_.isNumber(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isObject', () => {
      it('exists', () => expect(_.isPresent(_.isObject)).to.be.true);

      it('Identifies Object', () => {
        const testObject = { testKey: { } };
        expect(_.isObject(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Object', () => {
        const testObject = { testKey: null };
        expect(_.isObject(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: { } };
        expect(_.isObject(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isObjectLike', () => {
      it('exists', () => expect(_.isPresent(_.isObjectLike)).to.be.true);

      it('Identifies Object-like', () => {
        const testObject = { testKey: { } };
        expect(_.isObjectLike(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Object-like', () => {
        const testObject = { testKey: null };
        expect(_.isObjectLike(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: { } };
        expect(_.isObjectLike(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isPlainObject', () => {
      it('exists', () => expect(_.isPresent(_.isPlainObject)).to.be.true);

      it('Identifies Plain Objects', () => {
        const testObject = { testKey: { foo: 'bar' } };
        expect(_.isPlainObject(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Plain Objects', () => {
        const testObject = { testKey: () => 'foo' };
        expect(_.isPlainObject(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: { foo: 'bar' } };
        expect(_.isPlainObject(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isRegExp', () => {
      it('exists', () => expect(_.isPresent(_.isRegExp)).to.be.true);

      it('Identifies RegExp', () => {
        const testObject = { testKey: /abc/ };
        expect(_.isRegExp(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-RegExp', () => {
        const testObject = { testKey: '/abc/' };
        expect(_.isRegExp(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: /abc/ };
        expect(_.isRegExp(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isSafeInteger', () => {
      it('exists', () => expect(_.isPresent(_.isSafeInteger)).to.be.true);

      it('Identifies Safe Integer', () => {
        const testObject = { testKey: 3 };
        expect(_.isSafeInteger(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Safe Integer', () => {
        const testObject = { testKey: '3' };
        expect(_.isSafeInteger(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: 3 };
        expect(_.isSafeInteger(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isSet', () => {
      it('exists', () => expect(_.isPresent(_.isSet)).to.be.true);

      it('Identifies Set object', () => {
        const testObject = { testKey: new Set };
        expect(_.isSet(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Set object', () => {
        const testObject = { testKey: { } };
        expect(_.isSet(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: new Set };
        expect(_.isSet(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isString', () => {
      it('exists', () => expect(_.isPresent(_.isString)).to.be.true);

      it('Identifies String', () => {
        const testObject = { testKey: 'foo' };
        expect(_.isString(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-String', () => {
        const testObject = { testKey: 3 };
        expect(_.isString(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: 'foo' };
        expect(_.isString(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isSymbol', () => {
      it('exists', () => expect(_.isPresent(_.isSymbol)).to.be.true);

      it('Identifies Symbol', () => {
        const testObject = { testKey: Symbol.iterator };
        expect(_.isSymbol(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Symbol', () => {
        const testObject = { testKey: 'foo' };
        expect(_.isSymbol(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: Symbol.iterator };
        expect(_.isSymbol(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isTypedArray', () => {
      it('exists', () => expect(_.isPresent(_.isTypedArray)).to.be.true);

      it('Identifies Typed Array', () => {
        const testObject = { testKey: new Uint8Array };
        expect(_.isTypedArray(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Typed Array', () => {
        const testObject = { testKey: [] };
        expect(_.isTypedArray(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: new Uint8Array };
        expect(_.isTypedArray(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isUndefined', () => {
      it('exists', () => expect(_.isPresent(_.isUndefined)).to.be.true);

      it('Identifies undefined', () => {
        const testObject = { testKey: undefined };
        expect(_.isUndefined(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-undefined', () => {
        const testObject = { testKey: { } };
        expect(_.isUndefined(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: undefined };
        expect(_.isUndefined(testObject, 'testKey2')).to.be.true;
      });
    });

    describe('isWeakMap', () => {
      it('exists', () => expect(_.isPresent(_.isWeakMap)).to.be.true);

      it('Identifies WeakMap object', () => {
        const testObject = { testKey: new WeakMap };
        expect(_.isWeakMap(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-WeakMap object', () => {
        const testObject = { testKey: { } };
        expect(_.isWeakMap(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: new WeakMap };
        expect(_.isWeakMap(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isWeakSet', () => {
      it('exists', () => expect(_.isPresent(_.isWeakSet)).to.be.true);

      it('Identifies WeakSet object', () => {
        const testObject = { testKey: new WeakSet };
        expect(_.isWeakSet(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-WeakSet object', () => {
        const testObject = { testKey: { } };
        expect(_.isWeakSet(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: new WeakSet };
        expect(_.isWeakSet(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('isBlank', () => {
      it('exists', () => expect(_.isPresent(_.isBlank)).to.be.true);

      it('Identifies Blank object', () => {
        const testObject = { testKey: null };
        expect(_.isBlank(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Blank object', () => {
        const testObject = { testKey: { } };
        expect(_.isBlank(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testObject = { testKey: new WeakSet };
        expect(_.isBlank(testObject, 'testKey2')).to.be.true;
      });
    });

    describe('isPromise', () => {
      it('exists', () => expect(_.isPresent(_.isPromise)).to.be.true);

      it('Identifies promises', () => {
        const testPromise = new Promise((resolve, reject) => resolve());
        const testObject = { testKey: testPromise };
        expect(_.isPromise(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-promises', () => {
        const testObject = { };
        expect(_.isPromise(testObject, 'testKey2')).to.be.false;
      });

      it('Handles undefined key', () => {
        const testPromise = new Promise((resolve, reject) => resolve());
        const testObject = { testKey: testPromise };
        expect(_.isPromise(testObject, 'testKey2')).to.be.false;
      });
    });

    describe('deepDelete', () => {
      it('exists', () => expect(_.isPresent(_.deepDelete)).to.be.true);

      describe('objects', () => {
        let testObject;
        beforeEach( () => {
          testObject = {
            level1: 'foo',
            level2: {
              foo: 'bar'
            }
          };
        });

        it('Delete from Objects', () => {
          expect(_.isPresent(testObject.level1)).to.be.true;
          _.deepDelete(testObject, 'level1');
          expect(_.isPresent(testObject.level1)).to.be.false;
        });

        it('Deep Delete from Objects', () => {
          expect(_.isPresent(testObject.level2)).to.be.true;
          expect(_.isPresent(testObject.level2.foo)).to.be.true;
          _.deepDelete(testObject, 'level2.foo');
          expect(_.isPresent(testObject.level2)).to.be.true;
          expect(_.isPresent(testObject.level2.foo)).to.be.false;
        });

        it('Handles undefined key', () => {
          expect(() => _.deepDelete(testObject, 'level3')).to.not.throw(Error);
        });
      });

      describe('arrays', () => {
        let testObject;
        beforeEach( () => {
          testObject = [
            1,
            2,
            [ 1, 2, 3],
            4
          ];
        });
        it('Delete from Arrays', () => {
          expect(_.isPresent(testObject[1])).to.be.true;
          _.deepDelete(testObject, '1');
          expect(_.isPresent(testObject[1])).to.be.false;
        });

        it('Deep Delete from Arrays', () => {
          expect(_.isPresent(testObject[2])).to.be.true;
          expect(_.isPresent(testObject[2][2])).to.be.true;
          _.deepDelete(testObject, '2.2');
          expect(_.isPresent(testObject[2])).to.be.true;
          expect(_.isPresent(testObject[2][2])).to.be.false;
        });

        it('Handles undefined key', () => {
          expect(() => _.deepDelete(testObject, '4')).to.not.throw(Error);
        });
      });

      describe('mixed', () => {
        let testObject, testArray, testCase;
        beforeEach( () => {
          testArray = [
            1,
            2,
            [ 1, 2, 3],
            4
          ];
          testObject = {
            level1: 'foo',
            level2: {
              foo: testArray
            }
          };
          testCase = [
            1,
            testObject
          ];

        });
        it('Delete from Array', () => {
          expect(_.isPresent(testCase[1])).to.be.true;
          _.deepDelete(testCase, '1');
          expect(_.isPresent(testCase[1])).to.be.false;
        });

        it('Delete from Object', () => {
          expect(_.isPresent(testCase[1].level1)).to.be.true;
          _.deepDelete(testCase, '1.level1');
          expect(_.isPresent(testCase[1].level1)).to.be.false;
        });

        it('Deep Delete from Array', () => {
          expect(_.isPresent(testCase[1])).to.be.true;
          expect(_.isPresent(testCase[1].level2)).to.be.true;
          expect(_.isPresent(testCase[1].level2.foo)).to.be.true;
          expect(_.isPresent(testCase[1].level2.foo[1])).to.be.true;
          _.deepDelete(testCase, '1.level2.foo.1');
          expect(_.isPresent(testCase[1])).to.be.true;
          expect(_.isPresent(testCase[1].level2)).to.be.true;
          expect(_.isPresent(testCase[1].level2.foo)).to.be.true;
          expect(_.isPresent(testCase[1].level2.foo[1])).to.be.false;
        });

        it('Handles undefined key', () => {
          expect(() => _.deepDelete(testCase, '4')).to.not.throw(Error);
        });
      });
    });
});
