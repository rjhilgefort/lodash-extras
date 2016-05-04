import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import { all } from '../../../dist/server/index';

describe(
  'Lodash-deep-extras tests',
  function () {

    let testDefaults;


    beforeEach(() => {
      _.runInContext().merge(_, all);
      testDefaults = {
        _null: null,
        _undefined: undefined,
        _string: '',
        _boolean: true,
        _function: () => {},
        _number: 2,
        _array: [],
        _object: {},
        _arrayLikeObject: {value: 1, length: 1}
      };
    });

    describe('isPresent', () => {
      it('exists', () => expect(!_.isUndefined(_.isPresent) && !_.isNull(_.isPresent)).to.be.true);

      it('Identifies Present values', () => expect(_.isPresent(testDefaults, '_number')).to.be.true);

      it('Identifies non-Present values', () => {
        expect(_.isPresent(testDefaults, '_null')).to.be.false;
        expect(_.isPresent(testDefaults, '_undefined')).to.be.false;
      });

      it('Handles undefined key', () => expect(_.isPresent(testDefaults, 'testKey')).to.be.false);
    });

    describe('deepEnsureString', () => {
      it('exists', () => expect(_.isPresent(_.deepEnsureString)).to.be.true);

      it('Returns String when valid', () => expect(_.deepEnsureString(testDefaults, '_string')).to.equal(testDefaults));

      it('Returns default value when not a string', () => {
        expect(_.deepEnsureString(testDefaults, '_object', testDefaults._string)._object).to.equal(testDefaults._string);
      });

      it('Returns default value when not a string and default is omitted', () => {
        expect(_.deepEnsureString(testDefaults, '_object')._object).to.equal(testDefaults._string);
      });
    });

    describe('deepEnsureArray', () => {
      it('exists', () => expect(_.isPresent(_.deepEnsureArray)).to.be.true);

      it('Returns Array when valid', () => expect(_.deepEnsureArray(testDefaults, '_array')).to.eql(testDefaults));

      it('Returns default value when not an Array', () => {
        expect(_.deepEnsureArray(testDefaults, '_object', testDefaults._array)._object).to.eql(testDefaults._array);
      });

      it('Returns Array even when default is not supplied', () => {
        expect(_.deepEnsureArray(testDefaults, '_object')._object).to.eql(testDefaults._array);
      });
    });

    describe('deepEnsurePlainObject', () => {
      it('exists', () => expect(_.isPresent(_.deepEnsurePlainObject)).to.be.true);

      it('Returns PlainObject when valid', () => expect(_.deepEnsurePlainObject(testDefaults, '_object')).to.eql(testDefaults));

      it('Returns default value when not a PlainObject', () => {
        expect(_.deepEnsurePlainObject(testDefaults, '_function', testDefaults._object)._function).to.eql(testDefaults._object);
      });

      it('Returns PlainObject even when default is not supplied', () => {
        expect(_.deepEnsurePlainObject(testDefaults, '_function')._function).to.eql(testDefaults._object);
      });
    });

    describe('deepEnsureBoolean', () => {
      it('exists', () => expect(_.isPresent(_.deepEnsureBoolean)).to.be.true);

      it('Returns Boolean when valid', () => expect(_.deepEnsureBoolean(testDefaults, '_boolean')).to.eql(testDefaults));

      it('Returns default value when not a Boolean', () => {
        expect(_.deepEnsureBoolean(testDefaults, '_object', testDefaults._boolean)._object).to.equal(testDefaults._boolean);
      });

      it('Returns Boolean even when default is not supplied', () => expect(_.deepEnsureBoolean(testDefaults, '_object')._object).to.be.false);
    });

    describe('deepEnsureNumber', () => {
      it('exists', () => expect(_.isPresent(_.deepEnsureNumber)).to.be.true);

      it('Returns Number when valid', () => expect(_.deepEnsureNumber(testDefaults, '_number')).to.eql(testDefaults));

      it('Returns default value when not a Number', () => {
        expect(_.deepEnsureNumber(testDefaults, '_object', testDefaults._number)._object).to.equal(testDefaults._number);
      });

      it('Returns Number even when default is not supplied', () => {
        expect(_.deepEnsureNumber(testDefaults, '_object')._object).to.equal(1);
      });
    });

    describe('isArguments', () => {
      it('exists', () => expect(_.isPresent(_.isArguments)).to.be.true);

      it('Identifies Arguments object', () => {
        const testObject = { testKey: arguments };
        expect(_.isArguments(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Arguments object', () => expect(_.isArguments(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isArguments(testDefaults, 'testKey')).to.be.false);
    });

    describe('isArray', () => {
      it('exists', () => expect(_.isPresent(_.isArray)).to.be.true);

      it('Identifies Array object', () => expect(_.isArray(testDefaults, '_array')).to.be.true);

      it('Identifies non-Array object', () => expect(_.isArray(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isArray(testDefaults, 'testKey')).to.be.false);
    });

    describe('isArrayBuffer', () => {
      it('exists', () => expect(_.isPresent(_.isArrayBuffer)).to.be.true);

      it('Identifies ArrayBuffer object', () => {
        const testObject = { testKey: new ArrayBuffer(2) };
        expect(_.isArrayBuffer(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-ArrayBuffer object', () => expect(_.isArrayBuffer(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isArrayBuffer(testDefaults, 'testKey')).to.be.false);
    });

    describe('isArrayLike', () => {
      it('exists', () => expect(_.isPresent(_.isArrayLike)).to.be.true);

      it('Identifies Array-likes', () => {
        expect(_.isArrayLike(testDefaults, '_array')).to.be.true;
        expect(_.isArrayLike(testDefaults, '_string')).to.be.true;
        expect(_.isArrayLike(testDefaults, '_arrayLikeObject')).to.be.true;
      });

      it('Identifies non-Array-likes', () => {
        expect(_.isArrayLike(testDefaults, '_function')).to.be.false;
        expect(_.isArrayLike(testDefaults, '_object')).to.be.false;
      });

      it('Handles undefined key', () => expect(_.isArrayLike(testDefaults, 'testKey')).to.be.false);
    });

    describe('isArrayLikeObject', () => {
      it('exists', () => expect(_.isPresent(_.isArrayLikeObject)).to.be.true);

      it('Identifies Array-like objects', () => {
        expect(_.isArrayLike(testDefaults, '_array')).to.be.true;
        expect(_.isArrayLike(testDefaults, '_arrayLikeObject')).to.be.true;
      });

      it('Identifies non-Array-like objects', () => {
        expect(_.isArrayLike(testDefaults, '_function')).to.be.false;
        expect(_.isArrayLike(testDefaults, '_object')).to.be.false;
        expect(_.isArrayLike(testDefaults, '_string')).to.be.true;
      });

      it('Handles undefined key', () => expect(_.isArrayLikeObject(testDefaults, 'testKey')).to.be.false);
    });

    describe('isBoolean', () => {
      it('exists', () => expect(_.isPresent(_.isBoolean)).to.be.true);

      it('Identifies Booleans', () => expect(_.isBoolean(testDefaults, '_boolean')).to.be.true);

      it('Identifies non-Booleans', () => expect(_.isBoolean(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isBoolean(testDefaults, 'testKey')).to.be.false);
    });

    describe('isBuffer', () => {
      it('exists', () => expect(_.isPresent(_.isBuffer)).to.be.true);
        it('Identifies Buffer', () => {
          const testObject = { testKey: new Buffer(2) };
          expect(_.isBuffer(testObject, 'testKey')).to.be.true;
        });

        it('Identifies non-Buffer', () => expect(_.isBuffer(testDefaults, '_object')).to.be.false);

        it('Handles undefined key', () => expect(_.isBuffer(testDefaults, 'testKey')).to.be.false);
    });

    describe('isDate', () => {
      it('exists', () => expect(_.isPresent(_.isDate)).to.be.true);

      it('Identifies Dates', () => {
        const testObject = { testKey: new Date };
        expect(_.isDate(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Dates', () => expect(_.isDate(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isDate(testDefaults, 'testKey')).to.be.false);
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

      it('Handles undefined key', () => expect(_.isElement(testDefaults, 'testKey')).to.be.false);
    });

    describe('isEmpty', () => {
      it('exists', () => expect(_.isPresent(_.isEmpty)).to.be.true);

      it('Identifies Empty value', () => expect(_.isEmpty(testDefaults, '_object')).to.be.true);

      it('Identifies non-Empty value', () => expect(_.isEmpty(testDefaults, '_arrayLikeObject')).to.be.false);

      it('Handles undefined key', () => expect(_.isEmpty(testDefaults, 'testKey')).to.be.true);
    });

    describe('isError', () => {
      it('exists', () => expect(_.isPresent(_.isError)).to.be.true);

      it('Identifies Error object', () => {
        const testObject = { testKey: new Error };
        expect(_.isError(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Error object', () => expect(_.isError(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isError(testDefaults, 'testKey')).to.be.false);
    });

    describe('isFinite', () => {
      it('exists', () => expect(_.isPresent(_.isFinite)).to.be.true);

      it('Identifies Finite value', () => expect(_.isFinite(testDefaults, '_number')).to.be.true);

      it('Identifies non-Finite value', () => {
        const testObject = { testKey: Infinity };
        expect(_.isFinite(testObject, 'testKey')).to.be.false;
      });

      it('Handles undefined key', () => expect(_.isFinite(testDefaults, 'testKey')).to.be.false);
    });

    describe('isFunction', () => {
      it('exists', () => expect(_.isPresent(_.isFunction)).to.be.true);

      it('Identifies Function', () => expect(_.isFunction(testDefaults, '_function')).to.be.true);

      it('Identifies non-Function', () => expect(_.isFunction(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isFunction(testDefaults, 'testKey')).to.be.false);
    });

    describe('isInteger', () => {
      it('exists', () => expect(_.isPresent(_.isInteger)).to.be.true);

      it('Identifies Integer', () => expect(_.isInteger(testDefaults, '_number')).to.be.true);

      it('Identifies non-Integer', () => expect(_.isInteger(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isInteger(testDefaults, 'testKey')).to.be.false);
    });

    describe('isLength', () => {
      it('exists', () => expect(_.isPresent(_.isLength)).to.be.true);

      it('Identifies array-like length', () => expect(_.isLength(testDefaults, '_number')).to.be.true);

      it('Identifies non-array-like length', () => expect(_.isLength(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isLength(testDefaults, 'testKey')).to.be.false);
    });

    describe('isMap', () => {
      it('exists', () => expect(_.isPresent(_.isMap)).to.be.true);

      it('Identifies Map objects', () => {
        const testObject = { testKey: new Map };
        expect(_.isMap(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Map objects', () => expect(_.isMap(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isMap(testDefaults, 'testKey')).to.be.false);
    });

    describe('isNaN', () => {
      it('exists', () => expect(_.isPresent(_.isNaN)).to.be.true);

      it('Identifies NaN', () => {
        const testObject = { testKey: NaN };
        expect(_.isNaN(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-NaN', () => expect(_.isNaN(testDefaults, '_number')).to.be.false);

      it('Handles undefined key', () => expect(_.isNaN(testDefaults, 'testKey')).to.be.false);
    });

    describe('isNil', () => {
      it('exists', () => expect(_.isPresent(_.isNil)).to.be.true);

      it('Identifies Nil values', () => {
        expect(_.isNil(testDefaults, '_null')).to.be.true;
        expect(_.isNil(testDefaults, '_undefined')).to.be.true;
      });

      it('Identifies non-Nil values', () => expect(_.isNil(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isNil(testDefaults, 'testKey')).to.be.true);
    });

    describe('isNull', () => {
      it('exists', () => expect(_.isPresent(_.isNull)).to.be.true);

      it('Identifies Null values', () => expect(_.isNull(testDefaults, '_null')).to.be.true);

      it('Identifies non-Null values', () => expect(_.isNull(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isNull(testDefaults, 'testKey')).to.be.false);
    });

    describe('isNumber', () => {
      it('exists', () => expect(_.isPresent(_.isNumber)).to.be.true);

      it('Identifies Number', () => expect(_.isNumber(testDefaults, '_number')).to.be.true);

      it('Identifies non-Numbers', () => expect(_.isNumber(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isNumber(testDefaults, 'testKey')).to.be.false);
    });

    describe('isObject', () => {
      it('exists', () => expect(_.isPresent(_.isObject)).to.be.true);

      it('Identifies Object', () => expect(_.isObject(testDefaults, '_object')).to.be.true);

      it('Identifies non-Object', () => expect(_.isObject(testDefaults, '_string')).to.be.false);

      it('Handles undefined key', () => expect(_.isObject(testDefaults, 'testKey')).to.be.false);
    });

    describe('isObjectLike', () => {
      it('exists', () => expect(_.isPresent(_.isObjectLike)).to.be.true);

      it('Identifies Object-like', () => expect(_.isObjectLike(testDefaults, '_object')).to.be.true);

      it('Identifies non-Object-like', () => expect(_.isObjectLike(testDefaults, '_string')).to.be.false);

      it('Handles undefined key', () => expect(_.isObjectLike(testDefaults, 'testKey2')).to.be.false);
    });

    describe('isPlainObject', () => {
      it('exists', () => expect(_.isPresent(_.isPlainObject)).to.be.true);

      it('Identifies Plain Objects', () => expect(_.isPlainObject(testDefaults, '_object')).to.be.true);

      it('Identifies non-Plain Objects', () => expect(_.isPlainObject(testDefaults, '_function')).to.be.false);

      it('Handles undefined key', () => expect(_.isPlainObject(testDefaults, 'testKey')).to.be.false);
    });

    describe('isRegExp', () => {
      it('exists', () => expect(_.isPresent(_.isRegExp)).to.be.true);

      it('Identifies RegExp', () => {
        const testObject = { testKey: /abc/ };
        expect(_.isRegExp(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-RegExp', () => expect(_.isRegExp(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isRegExp(testDefaults, 'testKey')).to.be.false);
    });

    describe('isSafeInteger', () => {
      it('exists', () => expect(_.isPresent(_.isSafeInteger)).to.be.true);

      it('Identifies Safe Integer', () => expect(_.isSafeInteger(testDefaults, '_number')).to.be.true);

      it('Identifies non-Safe Integer', () => expect(_.isSafeInteger(testDefaults, '_string')).to.be.false);

      it('Handles undefined key', () => expect(_.isSafeInteger(testDefaults, 'testKey')).to.be.false);
    });

    describe('isSet', () => {
      it('exists', () => expect(_.isPresent(_.isSet)).to.be.true);

      it('Identifies Set object', () => {
        const testObject = { testKey: new Set };
        expect(_.isSet(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Set object', () => expect(_.isSet(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isSet(testDefaults, 'testKey2')).to.be.false);
    });

    describe('isString', () => {
      it('exists', () => expect(_.isPresent(_.isString)).to.be.true);

      it('Identifies String', () => expect(_.isString(testDefaults, '_string')).to.be.true);

      it('Identifies non-String', () => expect(_.isString(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isString(testDefaults, 'testKey')).to.be.false);
    });

    describe('isSymbol', () => {
      it('exists', () => expect(_.isPresent(_.isSymbol)).to.be.true);

      it('Identifies Symbol', () => {
        const testObject = { testKey: Symbol.iterator };
        expect(_.isSymbol(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Symbol', () => expect(_.isSymbol(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () =>expect(_.isSymbol(testDefaults, 'testKey')).to.be.false);
    });

    describe('isTypedArray', () => {
      it('exists', () => expect(_.isPresent(_.isTypedArray)).to.be.true);

      it('Identifies Typed Array', () => {
        const testObject = { testKey: new Uint8Array };
        expect(_.isTypedArray(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-Typed Array', () => expect(_.isTypedArray(testDefaults, '_array')).to.be.false);

      it('Handles undefined key', () => expect(_.isTypedArray(testDefaults, 'testKey')).to.be.false);
    });

    describe('isUndefined', () => {
      it('exists', () => expect(_.isPresent(_.isUndefined)).to.be.true);

      it('Identifies undefined', () => expect(_.isUndefined(testDefaults, '_undefined')).to.be.true);

      it('Identifies non-undefined', () => expect(_.isUndefined(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isUndefined(testDefaults, 'testKey')).to.be.true);
    });

    describe('isWeakMap', () => {
      it('exists', () => expect(_.isPresent(_.isWeakMap)).to.be.true);

      it('Identifies WeakMap object', () => {
        const testObject = { testKey: new WeakMap };
        expect(_.isWeakMap(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-WeakMap object', () => expect(_.isWeakMap(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isWeakMap(testDefaults, 'testKey')).to.be.false);
    });

    describe('isWeakSet', () => {
      it('exists', () => expect(_.isPresent(_.isWeakSet)).to.be.true);

      it('Identifies WeakSet object', () => {
        const testObject = { testKey: new WeakSet };
        expect(_.isWeakSet(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-WeakSet object', () => expect(_.isWeakSet(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isWeakSet(testDefaults, 'testKey')).to.be.false);
    });

    describe('isBlank', () => {
      it('exists', () => expect(_.isPresent(_.isBlank)).to.be.true);

      it('Identifies Blank object', () => expect(_.isBlank(testDefaults, '_null')).to.be.true);

      it('Identifies non-Blank object', () => expect(_.isBlank(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isBlank(testDefaults, 'testKey')).to.be.true);
    });

    describe('isPromise', () => {
      it('exists', () => expect(_.isPresent(_.isPromise)).to.be.true);

      it('Identifies promises', () => {
        const testPromise = new Promise((resolve, reject) => resolve());
        const testObject = { testKey: testPromise };
        expect(_.isPromise(testObject, 'testKey')).to.be.true;
      });

      it('Identifies non-promises', () => expect(_.isPromise(testDefaults, '_object')).to.be.false);

      it('Handles undefined key', () => expect(_.isPromise(testDefaults, 'testKey')).to.be.false);
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
