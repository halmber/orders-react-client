import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OrdersPage from 'pages/orders/index';
import actionsOrders from 'app/actions/orders';
import PageContainer from './components/PageContainer';
import * as pages from 'constants/pages';
import pageURLs from 'constants/pagesURLs';
import useLocationSearch from 'misc/hooks/useLocationSearch';
import useChangePage from 'misc/hooks/useChangePage';

const OrdersProvider = () => {
  const dispatch = useDispatch();
  const locationSearch = useLocationSearch();
  const changePage = useChangePage();
  const hasMounted = useRef(false);

  const {
    list,
    totalPages,
    currentPage,
    pageSize,
    filters,
    isFetchingList,
    isDeletingOrder,
    errorDelete,
  } = useSelector(({ orders }) => orders);

  // Sync URL with Redux state when URL changes
  useEffect(() => {
    const urlPage = parseInt(locationSearch.page || '0', 10);
    const urlSize = parseInt(locationSearch.size || '10', 10);
    const urlStatus = locationSearch.status || '';
    const urlPaymentMethod = locationSearch.paymentMethod || '';
    const urlCustomerEmail = locationSearch.customerEmail || '';

    if (urlPage !== currentPage) {
      dispatch(actionsOrders.changePage(urlPage));
    }

    if (urlSize !== pageSize) {
      dispatch(actionsOrders.changePageSize(urlSize));
    }

    if (
      urlStatus !== filters.status ||
      urlPaymentMethod !== filters.paymentMethod ||
      urlCustomerEmail !== filters.customerEmail
    ) {
      dispatch(
        actionsOrders.changeFilters({
          status: urlStatus,
          paymentMethod: urlPaymentMethod,
          customerEmail: urlCustomerEmail,
        })
      );
    }
  }, [locationSearch]);

  // Fetch orders when page or filters change
  useEffect(() => {
    dispatch(actionsOrders.fetchOrdersList());
  }, [currentPage, filters]);

  // Sync Redux state with URL whenever it changes (skip initial mount)
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const newLocationSearch = {
      ...locationSearch,
      page: currentPage.toString(),
      size: pageSize.toString(),
    };

    if (filters.status) {
      newLocationSearch.status = filters.status;
    } else {
      delete newLocationSearch.status;
    }

    if (filters.paymentMethod) {
      newLocationSearch.paymentMethod = filters.paymentMethod;
    } else {
      delete newLocationSearch.paymentMethod;
    }

    if (filters.customerEmail) {
      newLocationSearch.customerEmail = filters.customerEmail;
    } else {
      delete newLocationSearch.customerEmail;
    }

    // Only update URL if something actually changed
    const hasChanges =
      locationSearch.page !== currentPage.toString() ||
      locationSearch.size !== pageSize.toString() ||
      locationSearch.status !== (filters.status || undefined) ||
      locationSearch.paymentMethod !== (filters.paymentMethod || undefined) ||
      locationSearch.customerEmail !== (filters.customerEmail || undefined);

    if (hasChanges) {
      changePage({
        locationSearch: newLocationSearch,
      });
    }
  }, [currentPage, filters, pageSize, hasMounted]);

  const handleDeleteOrder = (orderId) => {
    return dispatch(actionsOrders.fetchDeleteOrder(orderId));
  };

  const handleNavigateToDetails = (orderId) => {
    changePage({
      pathname: `${pageURLs[pages.order]}/${orderId}`,
    });
  };

  const handlePageChange = (newPage) => {
    dispatch(actionsOrders.changePage(newPage));
  };

  const handleFilterChange = (newFilters) => {
    dispatch(actionsOrders.changeFilters(newFilters));
  };

  const handleClearDeleteError = () => {
    dispatch(actionsOrders.clearDeleteError());
  };

  return (
    <PageContainer>
      <OrdersPage
        orders={list}
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={pageSize}
        filters={filters}
        isFetchingList={isFetchingList}
        isDeletingOrder={isDeletingOrder}
        deleteError={errorDelete}
        onDeleteOrder={handleDeleteOrder}
        onNavigateToDetails={handleNavigateToDetails}
        onPageChange={handlePageChange}
        onFilterChange={handleFilterChange}
        onClearDeleteError={handleClearDeleteError}
      />
    </PageContainer>
  );
};

export default OrdersProvider;
