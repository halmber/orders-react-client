import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Loading from 'components/Loading';
import PageContainer from 'pageProviders/components/PageContainer';
import * as pages from 'constants/pages';
import pagesURLs from 'constants/pagesURLs';
import actionsUser from 'app/actions/user';

function OAuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actionsUser.fetchOAuthCallback())
      .then(() => {
        navigate(`${pagesURLs[pages.defaultPage]}`);
      })
      .catch(() => {
        dispatch(actionsUser.fetchErrorGoogleLogin('Authentication failed'));
        navigate(`${pagesURLs[pages.login]}`);
      });
  }, [dispatch, navigate]);

  return (
    <PageContainer>
      <Loading />
    </PageContainer>
  );
}

export default OAuthCallback;
