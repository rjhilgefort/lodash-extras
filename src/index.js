// Get lodash in here and expose, in the worst ways possible (for now)
var _ = require('lodash');
window._ = _;

// POC mixin an extra method
_.mixin({
  foo: function() {
    console.log('foo');
    return true;
  }
});

// import lodashExtras from './lodash-extras';
// import lodashEmber from './lodash-ember';
// import lodashDeepExtras from './lodash-deep-extras';

// _.mixin(lodashExtras);
// _.mixin(lodashEmber);
// _.mixin(lodashDeepExtras);
