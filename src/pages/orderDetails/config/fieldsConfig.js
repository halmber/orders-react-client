import { ORDER_STATUSES, PAYMENT_METHODS } from 'app/constants/orders';

/**
 * Field validation configuration for order form
 */
export const orderFieldsConfig = {
  customerId: {
    type: 'text',
    required: true,
    initial: '',
    labelKey: 'orderDetails.field.customerId',
    placeholderKey: 'orderDetails.field.customerId.placeholder',
  },
  amount: {
    type: 'number',
    required: true,
    min: 0.01,
    positive: true,
    initial: 0,
    labelKey: 'orderDetails.field.amount',
    placeholderKey: 'orderDetails.field.amount.placeholder',
  },
  status: {
    type: 'select',
    required: true,
    initial: ORDER_STATUSES.NEW,
    labelKey: 'orderDetails.field.status',
    oneOf: Object.keys(ORDER_STATUSES),
  },
  paymentMethod: {
    type: 'select',
    required: true,
    initial: PAYMENT_METHODS.CARD,
    labelKey: 'orderDetails.field.paymentMethod',
    oneOf: Object.keys(PAYMENT_METHODS),
  },
};

export default orderFieldsConfig;
