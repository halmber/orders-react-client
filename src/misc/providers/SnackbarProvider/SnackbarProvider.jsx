import React, { createContext, useCallback, useMemo, useState } from 'react';
import { snackbarActionVariants } from 'app/constants/snackbarVariants';
import { useIntl } from 'react-intl';
import Snackbar from 'components/Snackbar';

export const SnackbarContext = createContext({
  showSnackbar: () => {},
});

export const DEFAULT_AUTO_HIDE = 3000;

const SnackbarProvider = ({ children }) => {
  const { formatMessage } = useIntl();

  const [state, setState] = useState({
    open: false,
    message: '',
    variant: snackbarActionVariants.success,
    autoHideDuration: DEFAULT_AUTO_HIDE,
  });

  const handleClose = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  const showSnackbar = useCallback(
    ({
      messageId,
      values,
      variant = snackbarActionVariants.success,
      autoHideDuration,
    }) => {
      setState({
        open: true,
        message: formatMessage({ id: messageId }, values),
        variant,
        autoHideDuration,
      });
    },
    []
  );

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}

      <Snackbar
        message={state.message}
        open={state.open}
        variant={state.variant}
        autoHideDuration={state.autoHideDuration}
        handleClose={handleClose}
      />
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
