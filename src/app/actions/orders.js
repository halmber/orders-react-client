import axios from 'misc/requests';
import config from 'config';
import {
  getMockOrdersList,
  getMockOrderDetails,
  createMockOrder,
  updateMockOrder,
  deleteMockOrder,
} from 'misc/mock/ordersService';
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
  fallbackMessage = 'error.INTERNAL_SERVER_ERROR'
) => {
  const message =
    error?.response?.data?.message || error?.message || fallbackMessage;

  return {
    message,
    code: error?.response?.status,
    details: error?.response?.data,
  };
};

/**
 * Wrapper for API calls with mock data fallback and snackbar notifications
 */
export const apiCallWithMockFallback = async ({
  apiCall,
  mockFallback,
  onSuccess,
  onError,
  successMessageId,
  errorMessageId,
  mockSuccessMessageId,
  dispatch,
}) => {
  try {
    const data = await apiCall();

    if (onSuccess) dispatch(onSuccess(data));

    if (successMessageId) {
      dispatch(
        showSnackbar({
          messageId: successMessageId,
          variant: snackbarActionVariants.success,
        })
      );
    }

    return data;
  } catch (error) {
    const apiError = handleApiError(error);

    // If mock fallback is provided, try to get mock data
    if (mockFallback) {
      try {
        const mockData = await mockFallback();

        if (onSuccess) dispatch(onSuccess(mockData));

        if (mockSuccessMessageId) {
          dispatch(
            showSnackbar({
              messageId: mockSuccessMessageId,
              variant: snackbarActionVariants.info,
            })
          );
        }

        return mockData;
      } catch (mockError) {
        const finalError = handleApiError(mockError);

        if (onError) dispatch(onError(finalError.message));

        if (errorMessageId) {
          dispatch(
            showSnackbar({
              messageId: errorMessageId,
              variant: snackbarActionVariants.error,
            })
          );
        }
      }
    } else {
      if (onError) dispatch(onError(apiError.message));

      if (errorMessageId) {
        dispatch(
          showSnackbar({
            messageId: errorMessageId,
            variant: snackbarActionVariants.error,
          })
        );
      }
    }
  }
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
    const queryString = buildQueryParams({
      page,
      size,
      status,
      paymentMethod,
      customerEmail,
    });
    return axios.get(`${ORDERS_SERVICE}/orders?${queryString}`);
  },

  deleteOrder: (orderId) => {
    const { ORDERS_SERVICE } = config;
    return axios.delete(`${ORDERS_SERVICE}/orders/${orderId}`);
  },

  getOrderDetails: (orderId) => {
    const { ORDERS_SERVICE } = config;
    return axios.get(`${ORDERS_SERVICE}/orders/${orderId}`);
  },

  updateOrder: (orderId, orderData) => {
    const { ORDERS_SERVICE } = config;
    return axios.put(`${ORDERS_SERVICE}/orders/${orderId}`, orderData);
  },

  createOrder: (orderData) => {
    const { ORDERS_SERVICE } = config;
    return axios.post(`${ORDERS_SERVICE}/orders`, orderData);
  },
};

// Thunks
const fetchOrdersList = () => (dispatch, getState) => {
  const { orders } = getState();
  const { currentPage, pageSize, filters } = orders;

  dispatch(requestOrdersList());

  return apiCallWithMockFallback({
    apiCall: () =>
      api.getOrdersList({
        page: currentPage,
        size: pageSize,
        status: filters.status || undefined,
        paymentMethod: filters.paymentMethod || undefined,
        customerEmail: filters.customerEmail || undefined,
      }),
    mockFallback: () => getMockOrdersList(currentPage, pageSize, filters),
    onSuccess: receiveOrdersList,
    onError: errorOrdersList,
    successMessageId: 'orders.list.recieved',
    mockSuccessMessageId: 'orders.mock.recieved',
    errorMessageId: 'orders.error.list.recieved',
    dispatch,
  });
};

const fetchDeleteOrder = (orderId) => (dispatch) => {
  dispatch(requestDeleteOrder());

  return apiCallWithMockFallback({
    apiCall: () => api.deleteOrder(orderId),
    mockFallback: () => deleteMockOrder(orderId),
    onSuccess: () => successDeleteOrder(orderId),
    onError: errorDeleteOrder,
    successMessageId: 'orders.deleted',
    mockSuccessMessageId: 'orders.mock.deleted',
    errorMessageId: 'orders.error.delete',
    dispatch,
  });
};

const fetchOrderDetails = (orderId) => (dispatch) => {
  dispatch(requestOrderDetails());

  return apiCallWithMockFallback({
    apiCall: () => api.getOrderDetails(orderId),
    mockFallback: () => getMockOrderDetails(orderId),
    onSuccess: receiveOrderDetails,
    onError: errorOrderDetails,
    successMessageId: 'orders.details.recieved',
    mockSuccessMessageId: 'orders.mock.recieved',
    errorMessageId: 'orders.error.details.recieved',
    dispatch,
  });
};

const fetchUpdateOrder = (orderId, orderData) => (dispatch) => {
  dispatch(requestUpdateOrder());

  return apiCallWithMockFallback({
    apiCall: () => api.updateOrder(orderId, orderData),
    mockFallback: () => updateMockOrder(orderId, orderData),
    onSuccess: successUpdateOrder,
    onError: errorUpdateOrder,
    successMessageId: 'orders.details.updated',
    mockSuccessMessageId: 'orders.mock.updated',
    errorMessageId: 'orders.error.update',
    dispatch,
  });
};

const fetchCreateOrder = (orderData) => (dispatch) => {
  dispatch(requestCreateOrder());

  return apiCallWithMockFallback({
    apiCall: () => api.createOrder(orderData),
    mockFallback: () => createMockOrder(orderData),
    onSuccess: successCreateOrder,
    onError: errorCreateOrder,
    successMessageId: 'orders.created',
    mockSuccessMessageId: 'orders.mock.created',
    errorMessageId: 'orders.error.create',
    dispatch,
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
