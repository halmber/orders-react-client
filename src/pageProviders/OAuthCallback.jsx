import React from 'react';
import OAuthCallbackPage from 'pages/oauthCallback';
import PageContainer from './components/PageContainer';

const OAuthCallback = (props) => {
  return (
    <PageContainer>
      <OAuthCallbackPage {...props} />
    </PageContainer>
  );
};

export default OAuthCallback;
