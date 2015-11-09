// import lodashExtras from './lodash-extras';
// import lodashEmber from './lodash-ember';
// import lodashDeepExtras from './lodash-deep-extras';

// POC mixin an extra method
_.mixin({
  foo: function() {
    console.log('foo');
    return true;
  }
});

// _.mixin(lodashExtras);
// _.mixin(lodashEmber);
// _.mixin(lodashDeepExtras);
