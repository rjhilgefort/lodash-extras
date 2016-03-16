import _ from 'lodash';
import * as extras from './lodash-extras';


// Only mixin moment-extras if available
// import lodashMoment from './lodash-moment';
// if (_.isPresent(window.moment)) _.moment = lodashMoment;

// // Only mixin ember-extras if available
// import lodashEmber from './lodash-ember';
// if (_.isPresent(window.Ember)) _.mixin(lodashEmber);
//
// // Must be last to override above methods programmatically
import * as deepExtras from './lodash-deep-extras';

const allExtras = _.merge({}, extras, deepExtras)
export { extras, deepExtras, allExtras};
