import axios from 'misc/requests';
import config from 'config';
import * as authorities from 'constants/authorities';
import {
  ERROR_GOOGLE_LOGIN,
  ERROR_SIGN_IN,
  ERROR_SIGN_UP,
  RECEIVE_USER,
  REQUEST_GOOGLE_LOGIN,
  REQUEST_SIGN_IN,
  REQUEST_SIGN_OUT,
  REQUEST_SIGN_UP,
  REQUEST_USER,
  SUCCESS_GOOGLE_LOGIN,
  SUCCESS_SIGN_IN,
  SUCCESS_SIGN_UP,
} from '../constants/actionTypes';

const receiveUser = (user) => ({
  payload: user,
  type: RECEIVE_USER,
});

const requestUser = () => ({
  type: REQUEST_USER,
});

const errorSignIn = (errors) => ({
  payload: errors,
  type: ERROR_SIGN_IN,
});

const requestSignIn = () => ({
  type: REQUEST_SIGN_IN,
});

const successSignIn = (user) => ({
  payload: user,
  type: SUCCESS_SIGN_IN,
});

const errorSignUp = (errors) => ({
  payload: errors,
  type: ERROR_SIGN_UP,
});

const requestSignUp = () => ({
  type: REQUEST_SIGN_UP,
});

const successSignUp = () => ({
  type: SUCCESS_SIGN_UP,
});

const requestSignOut = () => ({
  type: REQUEST_SIGN_OUT,
});

const errorGoogleLogin = (errors) => ({
  payload: errors,
  type: ERROR_GOOGLE_LOGIN,
});

const requestGoogleLogin = () => ({
  type: REQUEST_GOOGLE_LOGIN,
});

const successGoogleLogin = (user) => ({
  payload: user,
  type: SUCCESS_GOOGLE_LOGIN,
});

const getUser = () => {
  const { ORDERS_SERVICE } = config;
  return axios.get(`${ORDERS_SERVICE}/api/profile`, {
    withCredentials: true,
  });
};

const signIn = ({ email, login, password }) => {
  const { USERS_SERVICE } = config;
  return axios.post(`${USERS_SERVICE}/user/signIn`, {
    email,
    login,
    password,
  });
};

const signUp = ({ email, fullName, login, password }) => {
  const { USERS_SERVICE } = config;
  return axios.post(`${USERS_SERVICE}/user/signUp`, {
    email,
    fullName,
    login,
    password,
  });
};

const googleLogin = () => {
  const { ORDERS_SERVICE } = config;
  window.location.assign(`${ORDERS_SERVICE}/oauth/authenticate`);
};

const fetchRefreshToken = () => (dispatch) => {};

const fetchSignIn =
  ({ email, login, password }) =>
  (dispatch) => {
    dispatch(requestSignIn());
    return signIn({
      email,
      login,
      password,
    })
      .catch(() => {
        return Promise.reject([
          {
            code: 'WRONG_LOGIN_OR_PASSWORD',
          },
        ]);
      })
      .then((user) => {
        dispatch(successSignIn(user));
      })
      .catch((errors) => dispatch(errorSignIn(errors)));
  };

const fetchSignOut = () => (dispatch) => {
  dispatch(requestSignOut());
};

const fetchSignUp =
  ({ email, fullName, login, password }) =>
  (dispatch) => {
    dispatch(requestSignUp());
    return signUp({
      email,
      fullName,
      login,
      password,
    })
      .then(() => dispatch(successSignUp()))
      .catch((errors) => dispatch(errorSignUp(errors)));
  };

const fetchUser = () => (dispatch) => {
  dispatch(requestUser());
  return getUser()
    .catch((err) => {
      console.error(err);
      return Promise.reject(err);
    })
    .then((user) => {
      const newUser = {
        ...user,
        fullName: user.name,
        login: user.email,
        authorities: [
          authorities.ENABLE_SEE_SECRET_PAGE,
          authorities.ENABLE_ORDERS_ACCESS,
        ],
      };
      dispatch(receiveUser(newUser));
    })
    .catch(() => dispatch(fetchSignOut()));
};

const fetchGoogleLogin = () => () => {
  googleLogin();
};

const fetchOAuthCallback = () => (dispatch) => {
  dispatch(requestGoogleLogin());
  return getUser()
    .then((user) => {
      const newUser = {
        ...user,
        fullName: user.name,
        login: user.email,
        authorities: [
          authorities.ENABLE_SEE_SECRET_PAGE,
          authorities.ENABLE_ORDERS_ACCESS,
        ],
      };
      dispatch(successGoogleLogin(newUser));
    })
    .catch((errors) => dispatch(errorGoogleLogin(errors)));
};

const fetchErrorGoogleLogin = (errorMessage) => (dispatch) => {
  dispatch(
    errorGoogleLogin([
      {
        code: 'OAUTH_AUTHENTICATION_FAILED',
        description: errorMessage,
      },
    ]),
  );
};

const exportFunctions = {
  fetchErrorGoogleLogin,
  fetchGoogleLogin,
  fetchOAuthCallback,
  fetchRefreshToken,
  fetchSignIn,
  fetchSignOut,
  fetchSignUp,
  fetchUser,
};

export default exportFunctions;
