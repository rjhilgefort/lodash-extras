import lodashExtras from './lodash-extras';
_.mixin(lodashExtras);

import lodashEmber from './lodash-ember';
_.mixin(lodashEmber);

// Must be last to override above methods programmatically
import lodashDeepExtras from './lodash-deep-extras';
_.mixin(lodashDeepExtras);
