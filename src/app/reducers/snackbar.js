import { SHOW_SNACKBAR, CLEAR_SNACKBAR } from 'app/constants/actionTypes';
import { snackbarActionVariants } from 'app/constants/snackbarVariants';
import { DEFAULT_AUTO_HIDE } from 'misc/providers/SnackbarProvider';

const initialState = {
  messageId: null,
  values: null,
  variant: snackbarActionVariants.success,
  autoHideDuration: DEFAULT_AUTO_HIDE,
};

export default function snackbarReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_SNACKBAR:
      return {
        ...state,
        messageId: action.payload.messageId,
        values: action.payload.values,
        variant: action.payload.variant || snackbarActionVariants.success,
        autoHideDuration:
          action.payload.autoHideDuration ?? state.autoHideDuration,
      };

    case CLEAR_SNACKBAR:
      return {
        ...state,
        messageId: null,
        values: null,
        variant: snackbarActionVariants.success,
      };

    default:
      return state;
  }
}
