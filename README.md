# lodash-extras

[![npm version](https://badge.fury.io/js/lodash-extras.svg)](https://badge.fury.io/js/lodash-extras) [![Build Status](https://travis-ci.org/rjhilgefort/lodash-extras.svg?branch=master)](https://travis-ci.org/rjhilgefort/lodash-extras) [![Join the chat at https://gitter.im/rjhilgefort/lodash-extras](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/rjhilgefort/lodash-extras)
#### An opinionated [lodash](https://lodash.com/) modification with extras.

## Installation / Usage

Follow the below instructions, depending on your runtime environment (client/server). After which, the `_` (lodash) object will have been modified with the "extras" included in this project.

### Client-side

This project depends on [lodash](https://lodash.com/) being loaded first. Then simply [download](https://github.com/rjhilgefort/lodash-extras/releases), or install this package via bower. After which, you'll need to source both projects in your web application.

```shell
bower install --save lodash
bower install --save lodash-extras
```

```html
<script src="bower_components/lodash/lodash.js"></script>
<script src="bower_components/lodash-extras/dist/lodash-extras.js"></script>
```

 Or for Ember.js support

```html
<script src="bower_components/lodash/lodash.js"></script>
<script src="bower_components/lodash-extras/dist/lodash-extras-w-ember.js"></script>
```

Then merge in the all object from lodashExtras into _

```Javascript
_.merge(_, lodashExtras.all);
```

### Server-side

Install via npm

```shell
npm install --save lodash
npm install --save lodash-extras
```

Then merge in the all object from lodashExtras into `_`.

```Javascript
const _ = require('lodash');
_.merge(_, require('lodash-extras').all);
```

## Further Reading

* [API Documentation](docs/api-docs.md)
* [Roadmap/Changelog](docs/roadmap.md)
* [lodash Documentation](https://lodash.com/docs)

## Features

The full [API Docs](docs/roadmap.md) are still a work in progress. Look for them to get more fleshed out as proper interface documentation including examples. For now, here's a bulleted list of some features to check out. As with anything, your best bet it to [check out the source](src/) (it's well documented).


#### > `_.is[Condition]`

Additional is conditions

* `_.isPresent`: Not `null` or `undefined`
* `_.isPromise` Is the object a then-able
* `_.moment.isMoment` Is value a moment object


#### > `_.is`

Checks a value for an array of lodash boolean conditions

```js
// Standard usage, trivial example (`_.isPlainObject` would accomplish the same)
_.is('foo', ['isPresent', 'isPlainObject']); // -> false

// You may prefix any method with `!` to invert the check
_.is('foo', ['isPresent', '!isPlainObject']); // -> true

// You may omit the "is" prefix on any method
_.is([1, 2], ['Array', '!Empty']); // -> true
```


#### > `_.ensure[Type]`

Ensure type methods ensure that a value is of the type specified (default can be specified)

* `_.ensureString`
* `_.ensureArray`
* `_.ensurePlainObject`
* `_.ensureBoolean`
* `_.ensureNumber`
* `_.moment.ensureMoment`

```js
var foo = 'foo';

// Standard usage
foo = _.ensureString(foo); // -> 'foo'
foo = _.ensurePlainObject(foo); // -> {}

// A default can be specified
foo = _.ensureArray(foo, ['foo', 'bar']); // -> ['foo', 'bar']

// Providing a default that doesn't match the ensure[Type] will ignore your default
foo = _.ensureNumber(foo, 'foo'); // -> 1

// ensureMoment is handled slightly different, it will try to convert anything you pass to moment first before falling back to default it ensures a moment object but not one with a valid date
foo = _.ensureMoment(new Date(2015, 11, 5), moment()); // -> Moment with 11-5-2015 as date
foo = _.ensureMoment('foo', moment()); // -> Moment with today as date
foo = _.ensureMoment('foo'); // -> Moment with invalid date
```

#### > `_.typeOf`

An alias for native JS `typeOf` method. Aliased for common interface and the ability to be overrieden by other "extras" ([as seen in `lodash-ember`](src/lodash-ember.js))

#### > `_.is[Condition]`

lodash provides many type checking methods out of the box. These are all of the following format `_.is[Condition]`. For example, `_.isString`. All the lodash `_.is[Condition]`methods now take two params and follow the interface of `_.get`.

```js
foo = {
  bar: 'bar',
  baz: {
    qux: false
  }
};

_.isString(foo, 'bar'); // -> true
_.isPlainObject(foo, 'baz'); // -> true
_.isBoolean(foo, 'baz.qux'); // -> true
_.isPresent(foo, 'baz.qux.foo.bar'); // -> false
```


#### > `_.deepEnsure[Type]`

Same as `_.ensure[Type]`, but adheres to the `_.get` interface. Look for this to be merged with the `_.ensure[Type]` namespace in the near future. The return of these methods is as you'd expect- the entire modified object. In the examples below, I only show the updated bits.

* `_.deepEnsureString`
* `_.deepEnsureArray`
* `_.deepEnsurePlainObject`
* `_.deepEnsureBoolean`
* `_.deepEnsureNumber`

```js
foo = {
  bar: 'bar',
  baz: {
    qux: false
  }
};

// Standard usage
foo = _.deepEnsureString(foo, 'bar'); // -> { bar: 'bar' }
foo = _.deepEnsurePlainObject(foo, 'bar'); // -> { bar: {} }

// Still accepts defaults
foo = _.deepEnsureArray(foo, 'bar', ['foo', 'bar']); // -> { bar: ['foo', 'bar'] }

// Still ignores your default if wrong type
foo = _.deepEnsureNumber(foo, 'baz.qux', 'foo'); // -> 'foo'
```

#### > `_.deepDelete`

Delete properties on an object using the `_.get` interface. This will eventually probably be renamed to `_.delete`. This utility is still a work in progress, use at your own risk.

```js
foo = {
  bar: 'bar'
};

_.deepDelete(foo, 'bar'); // -> {}
```

#### > `lodash-ember`

This module constitutes nearly half of the "lodash-extras" project and I unfortunately do not have the time to do the feature write up for them yet. I opted to shortcut doing the write up as the use case for them is specific to Ember applications. That being said, there's some great stuff in there and I encourage you to [check out the source](src/lodash-ember.js) (again, it's well documented).

#### > `lodash-moment`

This module is simply for mixins that depend on the presence of the moment global variable.

* `_.moment.ensureMoment`
* `_.moment.isMoment`
