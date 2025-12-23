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

const initialState = {
  list: [],
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
  filters: {
    status: '',
    paymentMethod: '',
    customerEmail: '',
  },
  currentOrder: null,
  isFetchingList: false,
  isFetchingDetails: false,
  isDeletingOrder: false,
  isUpdatingOrder: false,
  isCreatingOrder: false,
  errorList: null,
  errorDetails: null,
  errorDelete: null,
  errorUpdate: null,
  errorCreate: null,
  createSuccess: false,
};

export default function ordersReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_ORDERS_LIST:
      return {
        ...state,
        isFetchingList: true,
        errorList: null,
      };

    case RECEIVE_ORDERS_LIST:
      return {
        ...state,
        list: action.payload.orders,
        totalPages: action.payload.totalPages,
        isFetchingList: false,
        errorList: null,
        errorCreate: null,
        errorUpdate: null,
        createSuccess: false,
      };

    case ERROR_ORDERS_LIST:
      return {
        ...state,
        isFetchingList: false,
        errorList: action.payload,
      };

    case REQUEST_DELETE_ORDER:
      return {
        ...state,
        isDeletingOrder: true,
        errorDelete: null,
      };

    case SUCCESS_DELETE_ORDER:
      return {
        ...state,
        list: state.list.filter((order) => order.id !== action.payload),
        isDeletingOrder: false,
        errorDelete: null,
      };

    case ERROR_DELETE_ORDER:
      return {
        ...state,
        isDeletingOrder: false,
        errorDelete: action.payload,
      };

    case CLEAR_DELETE_ERROR:
      return {
        ...state,
        errorDelete: null,
      };

    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    case SET_PAGE_SIZE:
      return {
        ...state,
        pageSize: action.payload,
        currentPage: 0, // Reset to first page when page size changes
      };

    case SET_FILTERS:
      return {
        ...state,
        filters: action.payload,
        currentPage: 0, // Reset to first page when filters change
      };

    case CLEAR_FILTERS:
      return {
        ...state,
        filters: initialState.filters,
        currentPage: 0,
      };

    case REQUEST_ORDER_DETAILS:
      return {
        ...state,
        isFetchingDetails: true,
        errorDetails: null,
      };

    case RECEIVE_ORDER_DETAILS:
      return {
        ...state,
        currentOrder: action.payload,
        isFetchingDetails: false,
        errorDetails: null,
        errorCreate: null,
        errorUpdate: null,
      };

    case ERROR_ORDER_DETAILS:
      return {
        ...state,
        isFetchingDetails: false,
        errorDetails: action.payload,
      };

    case REQUEST_UPDATE_ORDER:
      return {
        ...state,
        isUpdatingOrder: true,
        errorUpdate: null,
      };

    case SUCCESS_UPDATE_ORDER:
      return {
        ...state,
        currentOrder: action.payload,
        isUpdatingOrder: false,
        errorUpdate: null,
      };

    case ERROR_UPDATE_ORDER:
      return {
        ...state,
        isUpdatingOrder: false,
        errorUpdate: action.payload,
      };

    case REQUEST_CREATE_ORDER:
      return {
        ...state,
        isCreatingOrder: true,
        errorCreate: null,
        createSuccess: false,
      };

    case SUCCESS_CREATE_ORDER:
      return {
        ...state,
        currentOrder: action.payload,
        isCreatingOrder: false,
        errorCreate: null,
        createSuccess: true,
      };

    case ERROR_CREATE_ORDER:
      return {
        ...state,
        isCreatingOrder: false,
        errorCreate: action.payload,
        createSuccess: false,
      };

    default:
      return state;
  }
}
