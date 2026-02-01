import axios from 'misc/requests';
import config from 'config';
import {
  REQUEST_ORDERS_LIST,
  RECEIVE_ORDERS_LIST,
  ERROR_ORDERS_LIST,
  REQUEST_DELETE_ORDER,
  SUCCESS_DELETE_ORDER,
  ERROR_DELETE_ORDER,
  CLEAR_DELETE_ERROR,
  SET_CURRENT_PAGE,
  SET_PAGE_SIZE,
  SET_FILTERS,
  CLEAR_FILTERS,
  REQUEST_ORDER_DETAILS,
  RECEIVE_ORDER_DETAILS,
  ERROR_ORDER_DETAILS,
  REQUEST_UPDATE_ORDER,
  SUCCESS_UPDATE_ORDER,
  ERROR_UPDATE_ORDER,
  REQUEST_CREATE_ORDER,
  SUCCESS_CREATE_ORDER,
  ERROR_CREATE_ORDER,
} from '../constants/actionTypes';
import { showSnackbar } from './snackbar';
import { snackbarActionVariants } from 'app/constants/snackbarVariants';

const handleApiError = (
  error,
  fallbackMessage = 'error.INTERNAL_SERVER_ERROR',
) => {
  const message =
    error?.response?.data?.message || error?.message || fallbackMessage;

  return {
    message,
    code: error?.response?.status,
    details: error?.response?.data,
  };
};

// Action Creators
const requestOrdersList = () => ({
  type: REQUEST_ORDERS_LIST,
});

const receiveOrdersList = (data) => ({
  type: RECEIVE_ORDERS_LIST,
  payload: data,
});

const errorOrdersList = (error) => ({
  type: ERROR_ORDERS_LIST,
  payload: error,
});

const requestDeleteOrder = () => ({
  type: REQUEST_DELETE_ORDER,
});

const successDeleteOrder = (orderId) => ({
  type: SUCCESS_DELETE_ORDER,
  payload: orderId,
});

const errorDeleteOrder = (error) => ({
  type: ERROR_DELETE_ORDER,
  payload: error,
});

const clearDeleteError = () => ({
  type: CLEAR_DELETE_ERROR,
});

const setCurrentPage = (page) => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

const setPageSize = (size) => ({
  type: SET_PAGE_SIZE,
  payload: size,
});

const setFilters = (filters) => ({
  type: SET_FILTERS,
  payload: filters,
});

const clearFiltersAction = () => ({
  type: CLEAR_FILTERS,
});

const requestOrderDetails = () => ({
  type: REQUEST_ORDER_DETAILS,
});

const receiveOrderDetails = (order) => ({
  type: RECEIVE_ORDER_DETAILS,
  payload: order,
});

const errorOrderDetails = (error) => ({
  type: ERROR_ORDER_DETAILS,
  payload: error,
});

const requestUpdateOrder = () => ({
  type: REQUEST_UPDATE_ORDER,
});

const successUpdateOrder = (order) => ({
  type: SUCCESS_UPDATE_ORDER,
  payload: order,
});

const errorUpdateOrder = (error) => ({
  type: ERROR_UPDATE_ORDER,
  payload: error,
});

const requestCreateOrder = () => ({
  type: REQUEST_CREATE_ORDER,
});

const successCreateOrder = (order) => ({
  type: SUCCESS_CREATE_ORDER,
  payload: order,
});

const errorCreateOrder = (error) => ({
  type: ERROR_CREATE_ORDER,
  payload: error,
});

// API
const buildQueryParams = ({
  page,
  size,
  status,
  paymentMethod,
  customerEmail,
}) => {
  const params = new URLSearchParams();

  params.append('page', page);
  params.append('size', size);

  if (status) params.append('status', status);
  if (paymentMethod) params.append('paymentMethod', paymentMethod);
  if (customerEmail) params.append('customerEmail', customerEmail);

  return params.toString();
};

const api = {
  getOrdersList: ({
    page = 0,
    size = 10,
    status,
    paymentMethod,
    customerEmail,
  }) => {
    const { ORDERS_SERVICE } = config;
    return axios.post(
      `${ORDERS_SERVICE}/api/orders/_list`,
      {
        page,
        size,
        status,
        paymentMethod,
        customerEmail,
      },
      {
        withCredentials: true,
      },
    );
  },

  deleteOrder: (orderId) => {
    const { ORDERS_SERVICE } = config;
    return axios.delete(`${ORDERS_SERVICE}/api/orders/${orderId}`, {
      withCredentials: true,
    });
  },

  getOrderDetails: (orderId) => {
    const { ORDERS_SERVICE } = config;
    return axios.get(`${ORDERS_SERVICE}/api/orders/${orderId}`, {
      withCredentials: true,
    });
  },

  updateOrder: (orderId, orderData) => {
    const { ORDERS_SERVICE } = config;
    return axios.put(`${ORDERS_SERVICE}/api/orders/${orderId}`, orderData, {
      withCredentials: true,
    });
  },

  createOrder: (orderData) => {
    const { ORDERS_SERVICE } = config;
    return axios.post(`${ORDERS_SERVICE}/api/orders`, orderData, {
      withCredentials: true,
    });
  },
};

// Thunks
const fetchOrdersList = () => (dispatch, getState) => {
  const { orders } = getState();
  const { currentPage, pageSize, filters } = orders;

  dispatch(requestOrdersList());

  return api
    .getOrdersList({
      page: currentPage,
      size: pageSize,
      status: filters.status || undefined,
      paymentMethod: filters.paymentMethod || undefined,
      customerEmail: filters.customerEmail || undefined,
    })
    .then((data) => {
      dispatch(receiveOrdersList(data));
      dispatch(
        showSnackbar({
          messageId: 'orders.list.recieved',
          variant: snackbarActionVariants.success,
        }),
      );
      return data;
    })
    .catch((error) => {
      const apiError = handleApiError(error);
      dispatch(errorOrdersList(apiError.message));
      dispatch(
        showSnackbar({
          messageId: 'orders.error.list.recieve',
          variant: snackbarActionVariants.error,
        }),
      );
    });
};

const fetchDeleteOrder = (orderId) => (dispatch) => {
  dispatch(requestDeleteOrder());

  return api
    .deleteOrder(orderId)
    .then(() => {
      dispatch(successDeleteOrder(orderId));
      dispatch(
        showSnackbar({
          messageId: 'orders.deleted',
          variant: snackbarActionVariants.success,
        }),
      );
    })
    .catch((error) => {
      const apiError = handleApiError(error);
      dispatch(errorDeleteOrder(apiError.message));
      dispatch(
        showSnackbar({
          messageId: 'orders.error.delete',
          variant: snackbarActionVariants.error,
        }),
      );
    });
};

const fetchOrderDetails = (orderId) => (dispatch) => {
  dispatch(requestOrderDetails());

  return api
    .getOrderDetails(orderId)
    .then((order) => {
      dispatch(receiveOrderDetails(order));
      dispatch(
        showSnackbar({
          messageId: 'orders.details.recieved',
          variant: snackbarActionVariants.success,
        }),
      );
      return order;
    })
    .catch((error) => {
      const apiError = handleApiError(error);
      dispatch(errorOrderDetails(apiError.message));
      dispatch(
        showSnackbar({
          messageId: 'orders.error.details.recieve',
          variant: snackbarActionVariants.error,
        }),
      );
    });
};

const fetchUpdateOrder = (orderId, orderData) => (dispatch) => {
  dispatch(requestUpdateOrder());

  return api
    .updateOrder(orderId, orderData)
    .then((order) => {
      dispatch(successUpdateOrder(order));
      dispatch(
        showSnackbar({
          messageId: 'orders.details.updated',
          variant: snackbarActionVariants.success,
        }),
      );
      return order;
    })
    .catch((error) => {
      const apiError = handleApiError(error);
      dispatch(errorUpdateOrder(apiError.message));
      dispatch(
        showSnackbar({
          messageId: 'orders.error.update',
          variant: snackbarActionVariants.error,
        }),
      );
    });
};

const fetchCreateOrder = (orderData) => (dispatch) => {
  dispatch(requestCreateOrder());

  return api
    .createOrder(orderData)
    .then((order) => {
      dispatch(successCreateOrder(order));
      dispatch(
        showSnackbar({
          messageId: 'orders.created',
          variant: snackbarActionVariants.success,
        }),
      );
      return order;
    })
    .catch((error) => {
      const apiError = handleApiError(error);
      dispatch(errorCreateOrder(apiError.message));
      dispatch(
        showSnackbar({
          messageId: 'orders.error.create',
          variant: snackbarActionVariants.error,
        }),
      );
    });
};

const changePage = (page) => (dispatch) => {
  dispatch(setCurrentPage(page));
};

const changePageSize = (size) => (dispatch) => {
  dispatch(setPageSize(size));
};

const changeFilters = (filters) => (dispatch) => {
  dispatch(setFilters(filters));
};

const clearFilters = () => (dispatch) => {
  dispatch(clearFiltersAction());
};

const clearDeleteErrorAction = () => (dispatch) => {
  dispatch(clearDeleteError());
};

const exportFunctions = {
  fetchOrdersList,
  fetchDeleteOrder,
  fetchOrderDetails,
  fetchUpdateOrder,
  fetchCreateOrder,
  changePage,
  changePageSize,
  changeFilters,
  clearFilters,
  clearDeleteError: clearDeleteErrorAction,
};

export default exportFunctions;
