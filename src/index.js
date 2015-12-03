import lodashExtras from './lodash-extras';
_.mixin(lodashExtras);

// Only mixin moment-extras if available
import lodashMoment from './lodash-moment';
if (_.isPresent(window.moment)) _.moment = lodashMoment;

// Only mixin ember-extras if available
import lodashEmber from './lodash-ember';
if (_.isPresent(window.Ember)) _.mixin(lodashEmber);

// Must be last to override above methods programmatically
import lodashDeepExtras from './lodash-deep-extras';
_.mixin(lodashDeepExtras);
