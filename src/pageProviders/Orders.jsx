import React from 'react';
import * as authorities from 'constants/authorities';
import OrdersPage from 'pages/orders/index';
import PageContainer from './components/PageContainer';
import PageAccessValidator from './components/PageAccessValidator';

const OrdersProvider = () => {
  return (
    <PageAccessValidator neededAuthorities={[authorities.ENABLE_ORDERS_ACCESS]}>
      <PageContainer>
        <OrdersPage />
      </PageContainer>
    </PageAccessValidator>
  );
};

export default OrdersProvider;
