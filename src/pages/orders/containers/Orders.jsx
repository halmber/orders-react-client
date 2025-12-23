import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import useTheme from 'misc/hooks/useTheme';
import Button from 'components/Button';
import Card from 'components/Card';
import CardContent from 'components/CardContent';
import CardTitle from 'components/CardTitle';
import Dialog from 'components/Dialog';
import IconButton from 'components/IconButton';
import IconDelete from 'components/icons/Delete';
import TextField from 'components/TextField';
import Typography from 'components/Typography';
import Loading from 'components/Loading';
import Select from 'components/Select';
import MenuItem from 'components/MenuItem';
import CardActions from 'components/CardActions';
import Pagination from 'components/Pagination';
import {
  AMOUNT_CURRENCY,
  DEFAULT_FORMATDATE_OPTIONS,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  STATUS_COLORS,
} from 'app/constants/orders';

const getClasses = createUseStyles((theme) => ({
  container: {
    background: theme.pageContainer.content.color.background,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingBottom: theme.spacing(2),
    flexShrink: 0,
  },
  headerActions: {
    display: 'flex',
    gap: `${theme.spacing(2)}px`,
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.spacing(2)}px`,
  },
  orderItem: {
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    '&:hover $deleteButton': {
      opacity: 1,
      visibility: 'visible',
    },
  },
  orderContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: `${theme.spacing(2)}px`,
    minWidth: 0,
  },
  orderField: {
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.spacing(0.5)}px`,
    minWidth: 0,
    overflow: 'hidden',
  },
  deleteButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.2s',
    zIndex: 10,
  },
  filterDialog: {
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.spacing(2)}px`,
    color: theme.input.color.primary.text.primary,
  },
  listWrapper: {
    flex: 1,
    overflowY: 'auto',
    minHeight: 0,
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
  },
  pagination: {
    flexShrink: 0,
    paddingTop: `${theme.spacing(1)}px`,
    background: theme.pageContainer.content.color.background,
  },
  statusBadge: {
    display: 'inline-block',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyState: {
    textAlign: 'center',
    padding: `${theme.spacing(4)}px`,
  },
}));

function Orders({
  orders,
  totalPages,
  isFetchingList,
  isDeletingOrder,
  deleteError,
  currentPage,
  pageSize,
  filters,
  onDeleteOrder,
  onNavigateToDetails,
  onPageChange,
  onFilterChange,
  onClearDeleteError,
}) {
  const { formatMessage, formatDate } = useIntl();
  const { theme } = useTheme();
  const classes = getClasses({ theme });

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const [filterValues, setFilterValues] = useState({
    status: filters.status || '',
    paymentMethod: filters.paymentMethod || '',
    customerEmail: filters.customerEmail || '',
  });

  // Update local filter values when props change
  useEffect(() => {
    setFilterValues({
      status: filters.status || '',
      paymentMethod: filters.paymentMethod || '',
      customerEmail: filters.customerEmail || '',
    });
  }, [filters]);

  const handleApplyFilters = () => {
    onFilterChange(filterValues);
    setIsFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      status: '',
      paymentMethod: '',
      customerEmail: '',
    };
    setFilterValues(emptyFilters);
    onFilterChange(emptyFilters);
    setIsFilterDialogOpen(false);
  };

  const handleDeleteClick = (e, order) => {
    e.stopPropagation();
    setOrderToDelete(order);
    setIsDeleteDialogOpen(true);
    onClearDeleteError();
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      onDeleteOrder(orderToDelete.id);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setOrderToDelete(null);
    onClearDeleteError();
  };

  // Auto-close dialog on successful delete
  useEffect(() => {
    if (
      !isDeletingOrder &&
      !deleteError &&
      isDeleteDialogOpen &&
      orderToDelete
    ) {
      handleCancelDelete();
    }
  }, [isDeletingOrder, deleteError]);

  if (isFetchingList) {
    return <Loading />;
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography variant="title">
          {formatMessage({ id: 'orders.title' })}
        </Typography>
        <div className={classes.headerActions}>
          <Button
            variant="secondary"
            colorVariant="secondary"
            onClick={() => setIsFilterDialogOpen(true)}
          >
            <Typography>{formatMessage({ id: 'orders.filter' })}</Typography>
          </Button>
          <Button variant="primary" onClick={() => onNavigateToDetails('new')}>
            <Typography color="inherit">
              <strong>{formatMessage({ id: 'orders.addNew' })}</strong>
            </Typography>
          </Button>
        </div>
      </div>

      <div className={classes.listWrapper}>
        {orders.length === 0 ? (
          <div className={classes.emptyState}>
            <Typography variant="subTitle">
              {formatMessage({ id: 'orders.emptyList' })}
            </Typography>
          </div>
        ) : (
          <>
            <div className={classes.ordersList}>
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className={classes.orderItem}
                  onClick={() => onNavigateToDetails(order.id)}
                >
                  <div className={classes.deleteButton}>
                    <IconButton onClick={(e) => handleDeleteClick(e, order)}>
                      <IconDelete size={24} />
                    </IconButton>
                  </div>
                  <CardContent>
                    <div className={classes.orderContent}>
                      <div className={classes.orderField}>
                        <Typography variant="caption" color="secondary">
                          {formatMessage({ id: 'orders.field.customer' })}
                        </Typography>
                        <Typography>
                          <strong>{order.customer.fullName}</strong>
                        </Typography>
                        <Typography variant="caption">
                          {order.customer.email}
                        </Typography>
                      </div>
                      <div className={classes.orderField}>
                        <Typography variant="caption" color="secondary">
                          {formatMessage({ id: 'orders.field.amount' })}
                        </Typography>
                        <Typography>
                          <strong>
                            {order.amount.toFixed(2)} {AMOUNT_CURRENCY}
                          </strong>
                        </Typography>
                      </div>
                      <div className={classes.orderField}>
                        <Typography variant="caption" color="secondary">
                          {formatMessage({ id: 'orders.field.status' })}
                        </Typography>
                        <span
                          className={classes.statusBadge}
                          style={{
                            backgroundColor:
                              STATUS_COLORS[order.status] || '#999',
                          }}
                        >
                          {formatMessage({
                            id: `orders.status.${order.status}`,
                          }).toUpperCase()}
                        </span>
                      </div>
                      <div className={classes.orderField}>
                        <Typography variant="caption" color="secondary">
                          {formatMessage({ id: 'orders.field.payment' })}
                        </Typography>
                        <Typography>
                          {formatMessage({
                            id: `orders.paymentMethod.${order.paymentMethod}`,
                          })}
                        </Typography>
                      </div>
                      <div className={classes.orderField}>
                        <Typography variant="caption" color="secondary">
                          {formatMessage({ id: 'orders.field.created' })}
                        </Typography>
                        <Typography variant="caption">
                          {formatDate(
                            order.createdAt,
                            DEFAULT_FORMATDATE_OPTIONS
                          )}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
      <div className={classes.pagination}>
        <Pagination
          page={currentPage + 1}
          count={totalPages}
          onChange={(_e, page) => onPageChange(page - 1)}
        />
      </div>

      {/* Filter Dialog */}
      <Dialog
        open={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        maxWidth="sm"
      >
        <Card>
          <CardTitle>
            <Typography variant="subTitle">
              {formatMessage({ id: 'orders.filter.title' })}
            </Typography>
          </CardTitle>
          <CardContent>
            <div className={classes.filterDialog}>
              <Typography>
                {formatMessage({ id: 'orders.field.status' })}
              </Typography>
              <Select
                label={formatMessage({ id: 'orders.field.status' })}
                value={filterValues.status}
                onChange={(e) =>
                  setFilterValues({ ...filterValues, status: e.target.value })
                }
              >
                <MenuItem value="">
                  {formatMessage({ id: 'orders.filter.all' })}
                </MenuItem>
                {Object.keys(ORDER_STATUSES).map((status) => (
                  <MenuItem
                    key={status}
                    value={status}
                    children={formatMessage({
                      id: `orders.status.${status}`,
                    })}
                  />
                ))}
              </Select>

              <Typography>
                {formatMessage({ id: 'orders.field.payment' })}
              </Typography>
              <Select
                label={formatMessage({ id: 'orders.field.payment' })}
                value={filterValues.paymentMethod}
                onChange={(e) =>
                  setFilterValues({
                    ...filterValues,
                    paymentMethod: e.target.value,
                  })
                }
              >
                <MenuItem value="">
                  {formatMessage({ id: 'orders.filter.all' })}
                </MenuItem>
                {Object.keys(PAYMENT_METHODS).map((method) => (
                  <MenuItem
                    key={method}
                    value={method}
                    children={formatMessage({
                      id: `orders.paymentMethod.${method}`,
                    })}
                  />
                ))}
              </Select>
              <TextField
                label={formatMessage({ id: 'orders.field.customerEmail' })}
                value={filterValues.customerEmail}
                onChange={(e) =>
                  setFilterValues({
                    ...filterValues,
                    customerEmail: e.target.value,
                  })
                }
              />
            </div>
          </CardContent>
          <CardActions>
            <Button
              variant="secondary"
              colorVariant="secondary"
              onClick={handleClearFilters}
            >
              <Typography>
                {formatMessage({ id: 'orders.filter.clear' })}
              </Typography>
            </Button>
            <Button variant="primary" onClick={handleApplyFilters}>
              <Typography color="inherit">
                <strong>{formatMessage({ id: 'orders.filter.apply' })}</strong>
              </Typography>
            </Button>
          </CardActions>
        </Card>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        maxWidth="xs"
      >
        <Card>
          <CardTitle>
            <Typography variant="subTitle">
              {formatMessage({ id: 'orders.delete.title' })}
            </Typography>
          </CardTitle>
          <CardContent>
            <Typography>
              {formatMessage({ id: 'orders.delete.confirmation' })}
            </Typography>
            {orderToDelete && (
              <Typography>
                <strong>{orderToDelete.customer.fullName}</strong> -{' '}
                {orderToDelete.amount.toFixed(2)} {AMOUNT_CURRENCY}
              </Typography>
            )}
            {deleteError && (
              <Typography color="error" style={{ marginTop: '16px' }}>
                {deleteError}
              </Typography>
            )}
          </CardContent>
          <CardActions>
            <Button
              variant="secondary"
              colorVariant="secondary"
              onClick={handleCancelDelete}
              disabled={isDeletingOrder}
            >
              <Typography>{formatMessage({ id: 'btn.cancel' })}</Typography>
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmDelete}
              isLoading={isDeletingOrder}
            >
              <Typography color="inherit">
                <strong>
                  {formatMessage({ id: 'orders.delete.confirm' })}
                </strong>
              </Typography>
            </Button>
          </CardActions>
        </Card>
      </Dialog>
    </div>
  );
}

export default Orders;
