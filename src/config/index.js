const config = {
  // Services
  USERS_SERVICE: 'http://localhost:3000',
  UI_URL_PREFIX: process.env.REACT_APP_UI_URL_PREFIX || '',
  ORDERS_SERVICE:
    process.env.REACT_APP_ORDERS_SERVICE || 'http://localhost:1000/api',
  ORDERS_GATEWAY_SERVICE:
    process.env.REACT_APP_ORDERS_GATEWAY_SERVICE || 'http://localhost:1000',
};

export default config;
