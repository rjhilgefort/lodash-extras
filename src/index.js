import _ from 'lodash';
import lodashExtras from './lodash-extras';


// Only mixin moment-extras if available
// import lodashMoment from './lodash-moment';

// // Only mixin ember-extras if available
// import lodashEmber from './lodash-ember';
// if (_.isPresent(window.Ember)) _.mixin(lodashEmber);
//
// // Must be last to override above methods programmatically
import lodashDeepExtras from './lodash-deep-extras';

const core = lodashExtras;
const deep = lodashDeepExtras;
const all = _.merge({}, core, deep)

export { core, deep, all};
