import _ from 'lodash';
import lodashExtras from './lodash-extras';
import lodashMoment from './lodash-moment';
import lodashEmber from './lodash-ember';
import lodashDeepExtras from './lodash-deep-extras';

const core = lodashExtras;
const deep = lodashDeepExtras;
const moment = lodashMoment;
const ember = lodashEmber;
const all = _.merge({}, core, deep, ember, { moment });

export { core, deep, moment, ember, all};
