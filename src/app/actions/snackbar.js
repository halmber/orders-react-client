import { SHOW_SNACKBAR, CLEAR_SNACKBAR } from 'app/constants/actionTypes';
import { snackbarActionVariants } from 'app/constants/snackbarVariants';
import { DEFAULT_AUTO_HIDE } from 'misc/providers/SnackbarProvider';

export const showSnackbar = ({
  messageId,
  values = null,
  variant = snackbarActionVariants.success,
  autoHideDuration = DEFAULT_AUTO_HIDE,
}) => ({
  type: SHOW_SNACKBAR,
  payload: {
    messageId,
    values,
    variant,
    autoHideDuration,
  },
});

export const clearSnackbar = () => ({
  type: CLEAR_SNACKBAR,
});
