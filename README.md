# lodash-extras

#### An opinionated [lodash](https://lodash.com/) modification with extras.

## Installation / Usage

This project depends on [lodash](https://lodash.com/) being loaded first. Then simply [download](https://github.com/rjhilgefort/lodash-extras/releases), or install this package via bower. After which, you'll need to source both projects in your web application.

```shell
bower install --save lodash
bower install --save lodash-extras
```

```html
<script src="bower_components/lodash/lodash.js"></script>
<script src="bower_components/lodash-extras/dist/lodash-extras.js"></script>
```

The `_` (lodash) object will now have been modified with the "extras" included in this project. Enjoy!

## Community

[![Join the chat at https://gitter.im/rjhilgefort/lodash-extras](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/rjhilgefort/lodash-extras)

## Features

The full [API Docs](docs/roadmap.md) are still a work in progress. Look for them to get more fleshed out as proper interface documentation including examples. For now, here's a bulleted list of some features to check out. As with anything, your best bet it to [check out the source](src/) (it's well documented).

* **Additional `_.is` methods**
  * `_.isPresent`: Not `null` or `undefined`
  * `_.isBlank`: Opposite of `_.isPresent`
  * `_.isPromise` Is the object a then-able
* **`_.is`:** Checks a value for an array of lodash boolean conditions
  * ex: ```_.is('foo', ['isPresent', '!isPlainObject']) // -> true```
    * note: You may prefix any method with `!` to invert the check
  * ex: ```_.is([1, 2], ['Array', '!Empty']) // -> true```
    * note: You may omit the the "is" prefix on any methods
* **Deep `_.is[Method]`methods:** lodash provides many type checking methods out of the box. These are all prefixed with `_.is[Methohod]`and then the type. For example, `_.isString`. All the lodash `_.is[Methohod]`methods now take two params and follow the interface of `_.get`.

## Further Reading

* [API Documentation](docs/api-docs.md)
* [Roadmap/Changelog](docs/roadmap.md)
* [lodash Documentation](https://lodash.com/docs)
