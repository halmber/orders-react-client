import React, { useEffect } from 'react';
import * as authorities from 'constants/authorities';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import actionsOrders from 'app/actions/orders';
import PageContainer from './components/PageContainer';
import useLocationSearch from 'misc/hooks/useLocationSearch';
import useChangePage from 'misc/hooks/useChangePage';
import * as pages from 'constants/pages';
import pageURLs from 'constants/pagesURLs';
import OrderDetailsPage from 'pages/orderDetails';
import PageAccessValidator from './components/PageAccessValidator';

const OrderDetailsProvider = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const locationSearch = useLocationSearch();
  const changePage = useChangePage();

  // TODO: add fallback if order with such ID doesnt exist
  const isNew = id === 'new';

  const {
    currentOrder,
    isFetchingDetails,
    isCreatingOrder,
    isUpdatingOrder,
    errorCreate,
    errorUpdate,
    createSuccess,
  } = useSelector(({ orders }) => orders);

  // Featch order details if not creating a new one
  useEffect(() => {
    if (!isNew) {
      dispatch(actionsOrders.fetchOrderDetails(id));
    }
  }, [id, isNew, dispatch]);

  const handleBack = () => {
    // Return to the list with filters and pagination preserved
    // TODO use existing filters in store
    changePage({
      pathname: pageURLs[pages.orders],
      locationSearch,
    });
  };

  const handleCreate = (values) => {
    dispatch(actionsOrders.fetchCreateOrder(values));
  };

  const handleUpdate = async (orderId, values) => {
    dispatch(actionsOrders.fetchUpdateOrder(orderId, values));
  };

  // Return to the list after creating
  useEffect(() => {
    if (createSuccess) {
      changePage({
        pathname: pageURLs[pages.orders],
        locationSearch,
      });
    }
  }, [createSuccess, changePage, locationSearch]);

  return (
    <PageAccessValidator neededAuthorities={[authorities.ENABLE_ORDERS_ACCESS]}>
      <PageContainer>
        <OrderDetailsPage
          order={currentOrder}
          isNew={isNew}
          isFetchingDetails={isFetchingDetails}
          isCreating={isCreatingOrder}
          isUpdating={isUpdatingOrder}
          createError={errorCreate}
          updateError={errorUpdate}
          onBack={handleBack}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />
      </PageContainer>
    </PageAccessValidator>
  );
};

export default OrderDetailsProvider;
