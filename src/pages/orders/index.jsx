import React, { useEffect, useMemo, useRef } from 'react';
import IntlProvider from 'misc/providers/IntlProvider';
import useLocationSearch from 'misc/hooks/useLocationSearch';

import getMessages from './intl';
import Orders from './containers/Orders';
import actionsOrders from 'app/actions/orders';
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';
import { useDispatch, useSelector } from 'react-redux';
import useChangePage from 'misc/hooks/useChangePage';

function Index(props) {
  const { lang } = useLocationSearch();
  const messages = useMemo(() => getMessages(lang), [lang]);
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
        }),
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
    <IntlProvider messages={messages}>
      <Orders
        {...props}
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
    </IntlProvider>
  );
}

export default Index;
