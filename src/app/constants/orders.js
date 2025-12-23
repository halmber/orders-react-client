export const ORDER_STATUSES = {
  NEW: 'NEW',
  PROCESSING: 'PROCESSING',
  DONE: 'DONE',
  CANCELED: 'CANCELED',
};

export const PAYMENT_METHODS = {
  CARD: 'CARD',
  CASH: 'CASH',
  PAYPAL: 'PAYPAL',
};

export const AMOUNT_CURRENCY = 'UAH';

export const STATUS_COLORS = {
  [ORDER_STATUSES.NEW]: '#FFA500',
  [ORDER_STATUSES.PROCESSING]: '#2196F3',
  [ORDER_STATUSES.DONE]: '#4CAF50',
  [ORDER_STATUSES.CANCELED]: '#F44336',
};

export const DEFAULT_FORMATDATE_OPTIONS = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};
