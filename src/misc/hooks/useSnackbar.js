import { SnackbarContext } from 'misc/providers/SnackbarProvider';
import { useContext, useMemo } from 'react';

export const useSnackbar = () => {
  const { showSnackbar } = useContext(SnackbarContext);

  return useMemo(
    () => ({
      showSnackbar,
    }),
    [showSnackbar]
  );
};
