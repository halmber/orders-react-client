import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSnackbar } from 'app/actions/snackbar';
import { useSnackbar } from 'misc/hooks/useSnackbar';

/**
 * The SnackbarReduxBridge component is a bridge between Redux actions and the snackbar system.
 *
 * This component is necessary so that snackbars called via Redux actions
 * (e.g., from asynchronous operations or middleware) are also displayed correctly.
 * The usual method of using the useSnackbar hook directly in components is not suitable
 * for cases where a snackbar needs to be displayed from Redux logic, since hooks can
 * only be used in functional components, not in actions or reducers.
 *
 * The component subscribes to the snackbar state from the Redux store. When a
 * messageId appears in the state, it calls showSnackbar with the appropriate parameters and then clears
 * the snackbar state in Redux to avoid repeated displays.
 *
 * @returns {JSX.Element} An empty fragment, since the component does not render anything visible.
 */

const SnackbarReduxBridge = () => {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  const snackbar = useSelector((state) => state.snackbar);

  useEffect(() => {
    if (snackbar.messageId) {
      showSnackbar(snackbar);
      dispatch(clearSnackbar());
    }
  }, [snackbar, showSnackbar, dispatch]);

  return <></>;
};

export default SnackbarReduxBridge;
