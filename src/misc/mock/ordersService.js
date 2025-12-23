import MOCK_ORDERS from './ordersData';

/**
 * Creates database-format error
 */
const createBackendError = (message, status = 404) => {
  const error = new Error(message);
  error.status = status;
  error.timestamp = new Date().toISOString();
  error.message = message;
  return error;
};

/**
 * Gets mock orders list with filtering and pagination
 */
export const getMockOrdersList = (page = 0, size = 10, filters = {}) => {
  let filteredOrders = [...MOCK_ORDERS];

  // Filter by status
  if (filters.status) {
    filteredOrders = filteredOrders.filter(
      (order) => order.status === filters.status
    );
  }

  // Filter by payment method
  if (filters.paymentMethod) {
    filteredOrders = filteredOrders.filter(
      (order) => order.paymentMethod === filters.paymentMethod
    );
  }

  // Filter by customer email (case-insensitive, partial match)
  if (filters.customerEmail) {
    const searchEmail = filters.customerEmail.toLowerCase();
    filteredOrders = filteredOrders.filter((order) =>
      order.customer.email.toLowerCase().includes(searchEmail)
    );
  }

  // Calculate total after filtering
  const totalAmount = filteredOrders.length;

  // Pagination
  const firstPageItemIndex = page * size;
  const lastPageItemIndex = firstPageItemIndex + size;
  const paginatedOrders = filteredOrders.slice(
    firstPageItemIndex,
    lastPageItemIndex
  );

  // Map to DTO format for list (without details)
  const orders = paginatedOrders.map((order) => ({
    id: order.id,
    amount: order.amount,
    status: order.status,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
    customer: {
      id: order.customer.id,
      firstName: order.customer.firstName,
      lastName: order.customer.lastName,
      email: order.customer.email,
    },
  }));

  return {
    orders,
    totalPages: Math.ceil(totalAmount / size),
  };
};

/**
 * Gets mock order details by ID
 */
export const getMockOrderDetails = (orderId) => {
  const order = MOCK_ORDERS.find((o) => o.id === orderId);

  if (!order) {
    throw createBackendError(`Order with id '${orderId}' not found`, 404);
  }

  // Return full order details
  return {
    id: order.id,
    amount: order.amount,
    status: order.status,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
    customer: {
      id: order.customer.id,
      fullName: `${order.customer.firstName} ${order.customer.lastName}`,
      email: order.customer.email,
      phone: order.customer.phone,
      city: order.customer.city,
      firstName: order.customer.firstName,
      lastName: order.customer.lastName,
    },
  };
};

/**
 * Creates new mock order
 * Required fields: customerId, amount, status, paymentMethod
 */
export const createMockOrder = (orderData) => {
  // Validate required fields
  if (!orderData.customerId) {
    throw createBackendError('Customer ID is required', 400);
  }

  if (!orderData.amount || orderData.amount <= 0) {
    throw createBackendError('Amount must be greater than 0', 400);
  }

  if (!orderData.status) {
    throw createBackendError('Status is required', 400);
  }

  if (!orderData.paymentMethod) {
    throw createBackendError('Payment method is required', 400);
  }

  // Find customer by ID
  const customer = MOCK_ORDERS.map((o) => o.customer).find(
    (c) => c.id === orderData.customerId
  );

  if (!customer) {
    throw createBackendError(
      `Customer with id '${orderData.customerId}' not found`,
      404
    );
  }

  const newOrder = {
    id: crypto.randomUUID(),
    amount: parseFloat(orderData.amount),
    status: orderData.status,
    paymentMethod: orderData.paymentMethod,
    createdAt: new Date().toISOString(),
    customer: { ...customer },
  };

  // Add to mock array (in reality this would be on server)
  MOCK_ORDERS.unshift(newOrder);

  // Return created order
  return {
    id: newOrder.id,
    amount: newOrder.amount,
    status: newOrder.status,
    paymentMethod: newOrder.paymentMethod,
    createdAt: newOrder.createdAt,
    customer: {
      id: newOrder.customer.id,
      fullName: `${newOrder.customer.firstName} ${newOrder.customer.lastName}`,
      email: newOrder.customer.email,
      phone: newOrder.customer.phone,
      city: newOrder.customer.city,
      firstName: newOrder.customer.firstName,
      lastName: newOrder.customer.lastName,
    },
  };
};

/**
 * Updates existing mock order
 * Required fields: customerId, amount, status, paymentMethod
 */
export const updateMockOrder = (orderId, orderData) => {
  const orderIndex = MOCK_ORDERS.findIndex((o) => o.id === orderId);

  if (orderIndex === -1) {
    throw createBackendError(`Order with id '${orderId}' not found`, 404);
  }

  // Validate required fields
  if (!orderData.customerId) {
    throw createBackendError('Customer ID is required', 400);
  }

  if (!orderData.amount || orderData.amount <= 0) {
    throw createBackendError('Amount must be greater than 0', 400);
  }

  if (!orderData.status) {
    throw createBackendError('Status is required', 400);
  }

  if (!orderData.paymentMethod) {
    throw createBackendError('Payment method is required', 400);
  }

  // Find customer by ID
  const customer = MOCK_ORDERS.map((o) => o.customer).find(
    (c) => c.id === orderData.customerId
  );

  if (!customer) {
    throw createBackendError(
      `Customer with id '${orderData.customerId}' not found`,
      404
    );
  }

  // Update order
  MOCK_ORDERS[orderIndex] = {
    ...MOCK_ORDERS[orderIndex],
    amount: parseFloat(orderData.amount),
    status: orderData.status,
    paymentMethod: orderData.paymentMethod,
    customer: { ...customer },
  };

  const updatedOrder = MOCK_ORDERS[orderIndex];

  // Return updated order
  return {
    id: updatedOrder.id,
    amount: updatedOrder.amount,
    status: updatedOrder.status,
    paymentMethod: updatedOrder.paymentMethod,
    createdAt: updatedOrder.createdAt,
    customer: {
      id: updatedOrder.customer.id,
      fullName: `${updatedOrder.customer.firstName} ${updatedOrder.customer.lastName}`,
      email: updatedOrder.customer.email,
      phone: updatedOrder.customer.phone,
      city: updatedOrder.customer.city,
      firstName: updatedOrder.customer.firstName,
      lastName: updatedOrder.customer.lastName,
    },
  };
};

/**
 * Deletes mock order
 */
export const deleteMockOrder = (orderId) => {
  const orderIndex = MOCK_ORDERS.findIndex((o) => o.id === orderId);

  if (orderIndex === -1) {
    throw createBackendError(`Order with id '${orderId}' not found`, 404);
  }

  // Remove order from array
  MOCK_ORDERS.splice(orderIndex, 1);

  return { success: true };
};
