import { useIntl } from 'react-intl';
import React from 'react';
import Typography from 'components/Typography';
import * as pages from 'constants/pages';
import pagesURLs from 'constants/pagesURLs';
import Link from 'components/Link';

function Default() {
  const { formatMessage } = useIntl();

  const pageLinks = [
    { key: pages.orders, label: 'Orders' },
    { key: pages.secretPage, label: 'Secret Page' },
    { key: pages.login, label: 'Login' },
  ];

  return (
    <div>
      <Typography>{formatMessage({ id: 'title' })}</Typography>
      <div style={{ marginTop: '20px' }}>
        <ul>
          {pageLinks.map((page) => (
            <li key={page.key}>
              <Link to={{ pathname: pagesURLs[page.key] }}>{page.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Default;
