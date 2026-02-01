import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addAxiosInterceptors } from 'misc/requests';
import * as pages from 'constants/pages';
import AuthoritiesProvider from 'misc/providers/AuthoritiesProvider';
import DefaultPage from 'pageProviders/Default';
import Loading from 'components/Loading';
import LoginPage from 'pageProviders/Login';
import OAuthCallbackPage from 'pageProviders/OAuthCallback';
import OrdersPage from 'pageProviders/Orders';
import OrderDetailsPage from 'pageProviders/OrderDetails';
import PageContainer from 'pageProviders/components/PageContainer';
import pageURLs from 'constants/pagesURLs';
import SecretPage from 'pageProviders/Secret';
import ThemeProvider from 'misc/providers/ThemeProvider';
import UserProvider from 'misc/providers/UserProvider';
import SnackbarProvider from 'misc/providers/SnackbarProvider';

import actionsUser from '../actions/user';
import Header from '../components/Header';
import IntlProvider from '../components/IntlProvider';
import MissedPage from '../components/MissedPage';
import SearchParamsConfigurator from '../components/SearchParamsConfigurator';
import SnackbarReduxBridge from 'app/components/SnackbarReduxBridge';

function App() {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    componentDidMount: false,
  });

  const {
    errors,
    isFailedGoogleLogin,
    isFailedSignIn,
    isFailedSignUp,
    isFetchingGoogleLogin,
    isFetchingSignIn,
    isFetchingSignUp,
    isFetchingUser,
  } = useSelector(({ user }) => user);

  useEffect(() => {
    addAxiosInterceptors({
      onSignOut: () => dispatch(actionsUser.fetchSignOut()),
    });
    dispatch(actionsUser.fetchUser());
    setState({
      ...state,
      componentDidMount: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <UserProvider>
      <AuthoritiesProvider>
        <ThemeProvider>
          <BrowserRouter>
            <SearchParamsConfigurator />
            {/* This is needed to let first render passed for App's
             * configuration process will be finished (e.g. locationQuery
             * initializing) */}
            {state.componentDidMount && (
              <IntlProvider>
                <SnackbarProvider>
                  <SnackbarReduxBridge />

                  <Header
                    onLogout={() => dispatch(actionsUser.fetchSignOut())}
                  />
                  {isFetchingUser && (
                    <PageContainer>
                      <Loading />
                    </PageContainer>
                  )}
                  {!isFetchingUser && (
                    <Routes>
                      <Route
                        element={<DefaultPage />}
                        path={`${pageURLs[pages.defaultPage]}`}
                      />
                      <Route
                        element={<SecretPage />}
                        path={`${pageURLs[pages.secretPage]}`}
                      />
                      <Route
                        element={<OrdersPage />}
                        path={`${pageURLs[pages.orders]}`}
                      />
                      <Route
                        element={<OrderDetailsPage />}
                        path={`${pageURLs[pages.order]}/:id`}
                      />
                      <Route
                        element={<OAuthCallbackPage />}
                        path={`${pageURLs[pages.oauthCallback]}`}
                      />
                      <Route
                        element={
                          <LoginPage
                            errors={errors}
                            isFailedGoogleLogin={isFailedGoogleLogin}
                            isFailedSignIn={isFailedSignIn}
                            isFailedSignUp={isFailedSignUp}
                            isFetchingGoogleLogin={isFetchingGoogleLogin}
                            isFetchingSignIn={isFetchingSignIn}
                            isFetchingSignUp={isFetchingSignUp}
                            onGoogleLogin={() =>
                              dispatch(actionsUser.fetchGoogleLogin())
                            }
                            onSignIn={({ email, login, password }) =>
                              dispatch(
                                actionsUser.fetchSignIn({
                                  email,
                                  login,
                                  password,
                                }),
                              )
                            }
                            onSignUp={({ email, fullName, login, password }) =>
                              dispatch(
                                actionsUser.fetchSignUp({
                                  email,
                                  fullName,
                                  login,
                                  password,
                                }),
                              )
                            }
                          />
                        }
                        path={`${pageURLs[pages.login]}`}
                      />
                      <Route
                        element={
                          <MissedPage
                            redirectPage={`${pageURLs[pages.defaultPage]}`}
                          />
                        }
                        path="*"
                      />
                    </Routes>
                  )}
                </SnackbarProvider>
              </IntlProvider>
            )}
          </BrowserRouter>
        </ThemeProvider>
      </AuthoritiesProvider>
    </UserProvider>
  );
}

export default App;
