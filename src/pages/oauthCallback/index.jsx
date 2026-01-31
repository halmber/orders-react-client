import React, { useMemo } from 'react';
import OAuthCallback from './containers/OAuthCallback';
import useLocationSearch from 'misc/hooks/useLocationSearch';
import getMessages from 'intl';
import IntlProvider from 'misc/providers/IntlProvider';

function Index(props) {
  const { lang } = useLocationSearch();
  const messages = useMemo(() => getMessages(lang), [lang]);
  return (
    <IntlProvider messages={messages}>
      <OAuthCallback {...props} />
    </IntlProvider>
  );
}

export default Index;
