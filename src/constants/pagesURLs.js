import * as pages from './pages';
import config from 'config';

const result = {
  [pages.defaultPage]: `${config.UI_URL_PREFIX}/${pages.defaultPage}`,
  [pages.login]: `${config.UI_URL_PREFIX}/${pages.login}`,
  [pages.oauthCallback]: `${config.UI_URL_PREFIX}/${pages.oauthCallback}`,
  [pages.secretPage]: `${config.UI_URL_PREFIX}/${pages.secretPage}`,
  [pages.orders]: `${config.UI_URL_PREFIX}/${pages.orders}`,
  [pages.order]: `${config.UI_URL_PREFIX}/${pages.order}`,
};

export default result;
