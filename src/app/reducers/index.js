import { combineReducers } from 'redux';

import user from './user';
import orders from './orders';
import snackbar from './snackbar';

export default combineReducers({
  user,
  orders,
  snackbar,
});
