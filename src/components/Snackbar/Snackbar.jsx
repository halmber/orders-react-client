import React from 'react';
import useTheme from 'misc/hooks/useTheme';
import IconButton from 'components/IconButton';
import IconClose from 'components/icons/Close';
import { snackbarActionVariants } from 'app/constants/snackbarVariants';
import { Alert } from '@mui/material';
import SnackbarMui from '@mui/material/Snackbar';
import { DEFAULT_AUTO_HIDE } from 'misc/providers/SnackbarProvider';

const Snackbar = ({
  variant = snackbarActionVariants.success,
  message,
  open = false,
  handleClose,
  autoHideDuration = DEFAULT_AUTO_HIDE,
}) => {
  const { theme } = useTheme();
  return (
    <SnackbarMui
      open={open}
      onClose={handleClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        severity={variant}
        variant="filled"
        onClose={handleClose}
        action={
          <IconButton size="small" onClick={handleClose}>
            <IconClose size={18} color="inherit" />
          </IconButton>
        }
        sx={{
          minWidth: 300,
          maxWidth: 600,
          border: 1,
          ...theme.snackbar?.variants?.[variant],
        }}
      >
        {message}
      </Alert>
    </SnackbarMui>
  );
};

export default Snackbar;
