(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashTesting = require('./lodash-testing');

var _lodashTesting2 = _interopRequireDefault(_lodashTesting);

// import lodashExtras from './lodash-extras';
// import lodashEmber from './lodash-ember';
// import lodashDeepExtras from './lodash-deep-extras';

_.mixin(_lodashTesting2['default']);

// // POC mixin an extra method
// _.mixin({
//   foo: function() {
//     console.log('foo');
//     return true;
//   }
// });

// _.mixin(lodashExtras);
// _.mixin(lodashEmber);
// _.mixin(lodashDeepExtras);

},{"./lodash-testing":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var lodashTesting = {};

var foo = function foo() {
  return console.log('foo');
};
exports.foo = foo;
lodashTesting.foo = foo;

exports['default'] = lodashTesting;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvcmpoaWxnZWZvcnQvRHJvcGJveC9Qcm9qZWN0cy9sb2Rhc2gtZXh0cmFzL3NyYy9pbmRleC5qcyIsIi9Vc2Vycy9yamhpbGdlZm9ydC9Ecm9wYm94L1Byb2plY3RzL2xvZGFzaC1leHRyYXMvc3JjL2xvZGFzaC10ZXN0aW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs2QkNBMEIsa0JBQWtCOzs7Ozs7OztBQUs1QyxDQUFDLENBQUMsS0FBSyw0QkFBZSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0x2QixJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUM7O0FBRWhCLElBQUksR0FBRyxHQUFHLFNBQU4sR0FBRyxHQUFTO0FBQ3JCLFNBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztDQUMzQixDQUFDOztBQUNGLGFBQWEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDOztxQkFFVCxhQUFhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBsb2Rhc2hUZXN0aW5nIGZyb20gJy4vbG9kYXNoLXRlc3RpbmcnO1xuLy8gaW1wb3J0IGxvZGFzaEV4dHJhcyBmcm9tICcuL2xvZGFzaC1leHRyYXMnO1xuLy8gaW1wb3J0IGxvZGFzaEVtYmVyIGZyb20gJy4vbG9kYXNoLWVtYmVyJztcbi8vIGltcG9ydCBsb2Rhc2hEZWVwRXh0cmFzIGZyb20gJy4vbG9kYXNoLWRlZXAtZXh0cmFzJztcblxuXy5taXhpbihsb2Rhc2hUZXN0aW5nKTtcblxuXG4vLyAvLyBQT0MgbWl4aW4gYW4gZXh0cmEgbWV0aG9kXG4vLyBfLm1peGluKHtcbi8vICAgZm9vOiBmdW5jdGlvbigpIHtcbi8vICAgICBjb25zb2xlLmxvZygnZm9vJyk7XG4vLyAgICAgcmV0dXJuIHRydWU7XG4vLyAgIH1cbi8vIH0pO1xuXG4vLyBfLm1peGluKGxvZGFzaEV4dHJhcyk7XG4vLyBfLm1peGluKGxvZGFzaEVtYmVyKTtcbi8vIF8ubWl4aW4obG9kYXNoRGVlcEV4dHJhcyk7XG4iLCJsZXQgbG9kYXNoVGVzdGluZyA9IHt9O1xuXG5leHBvcnQgdmFyIGZvbyA9ICgpID0+IHtcbiAgcmV0dXJuIGNvbnNvbGUubG9nKCdmb28nKTtcbn07XG5sb2Rhc2hUZXN0aW5nLmZvbyA9IGZvbztcblxuZXhwb3J0IGRlZmF1bHQgbG9kYXNoVGVzdGluZztcbiJdfQ==
