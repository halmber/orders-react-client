import React, { useState, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import { Formik, Form } from 'formik';
import useTheme from 'misc/hooks/useTheme';
import createValidationSchema, {
  createInitialValues,
} from 'misc/validation/shemaFactory';
import Button from 'components/Button';
import Card from 'components/Card';
import CardContent from 'components/CardContent';
import CardTitle from 'components/CardTitle';
import CardActions from 'components/CardActions';
import TextField from 'components/TextField';
import MenuItem from 'components/MenuItem';
import Typography from 'components/Typography';
import Loading from 'components/Loading';
import IconButton from 'components/IconButton';
import IconEdit from 'components/icons/Edit';
import orderFieldsConfig from '../config/fieldsConfig';
import FormikSelect from '../components/FormikSelect';
import {
  AMOUNT_CURRENCY,
  DEFAULT_FORMATDATE_OPTIONS,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  STATUS_COLORS,
} from 'app/constants/orders';

const getClasses = createUseStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.spacing(3)}px`,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: `${theme.spacing(2)}px`,
  },
  formContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.spacing(3)}px`,
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: `${theme.spacing(2)}px`,
  },
  viewField: {
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.spacing(0.5)}px`,
    padding: `${theme.spacing(1)}px 0`,
  },
  statusBadge: {
    display: 'inline-block',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1.5)}px`,
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#fff',
    width: 'fit-content',
  },
  actions: {
    display: 'flex',
    gap: `${theme.spacing(2)}px`,
    justifyContent: 'flex-end',
  },
  backButton: {
    marginRight: 'auto',
  },
}));

function OrderDetails({
  order,
  isNew,
  isFetchingDetails,
  isCreating,
  isUpdating,
  updateError,
  createError,
  onBack,
  onCreate,
  onUpdate,
}) {
  const { formatMessage, formatDate } = useIntl();
  const { theme } = useTheme();
  const classes = getClasses({ theme });
  const [isEditMode, setIsEditMode] = useState(isNew);

  // Create validation schema
  const validationSchema = useMemo(
    () => createValidationSchema(orderFieldsConfig, formatMessage),
    [formatMessage]
  );

  // Create initial values
  const initialValues = useMemo(() => {
    if (isNew) {
      return createInitialValues(orderFieldsConfig);
    }

    // Map order data to form fields
    return createInitialValues(orderFieldsConfig, {
      customerId: order?.customer?.id || '',
      amount: order?.amount || 0,
      status: order?.status || ORDER_STATUSES.NEW,
      paymentMethod: order?.paymentMethod || PAYMENT_METHODS.CARD,
    });
  }, [order, isNew]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const orderData = {
        customerId: values.customerId,
        amount: parseFloat(values.amount),
        status: values.status,
        paymentMethod: values.paymentMethod,
      };

      if (isNew) {
        await onCreate(orderData);
      } else {
        await onUpdate(order.id, orderData);
      }
    } catch (error) {
      // Error handled in Redux
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isNew) {
      onBack();
    } else {
      setIsEditMode(false);
    }
  };

  if (isFetchingDetails) {
    return <Loading />;
  }

  return (
    <div className={classes.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
          resetForm,
        }) => (
          <Form>
            <Card>
              <CardTitle>
                <div className={classes.header}>
                  <Typography variant="title">
                    {isNew
                      ? formatMessage({ id: 'orderDetails.title.create' })
                      : formatMessage({ id: 'orderDetails.title.details' })}
                  </Typography>
                  {!isNew && !isEditMode && (
                    <IconButton onClick={() => setIsEditMode(true)}>
                      <IconEdit />
                    </IconButton>
                  )}
                </div>
              </CardTitle>

              <CardContent>
                <div className={classes.formContent}>
                  {/* Customer Info - readonly in view mode, shows full customer data */}
                  {!isNew && !isEditMode && (
                    <div className={classes.formRow}>
                      <div className={classes.viewField}>
                        <Typography variant="caption" color="secondary">
                          {formatMessage({
                            id: 'orderDetails.field.customerName',
                          })}
                        </Typography>
                        <Typography>
                          <strong>{order?.customer?.fullName || '-'}</strong>
                        </Typography>
                      </div>
                      <div className={classes.viewField}>
                        <Typography variant="caption" color="secondary">
                          {formatMessage({
                            id: 'orderDetails.field.customerEmail',
                          })}
                        </Typography>
                        <Typography>{order?.customer?.email || '-'}</Typography>
                      </div>
                      <div className={classes.viewField}>
                        <Typography variant="caption" color="secondary">
                          {formatMessage({
                            id: 'orderDetails.field.customerCity',
                          })}
                        </Typography>
                        <Typography>{order?.customer?.city || '-'}</Typography>
                      </div>
                      <div className={classes.viewField}>
                        <Typography variant="caption" color="secondary">
                          {formatMessage({
                            id: 'orderDetails.field.customerPhone',
                          })}
                        </Typography>
                        <Typography>{order?.customer?.phone || '-'}</Typography>
                      </div>
                      <div className={classes.viewField}>
                        <Typography variant="caption" color="secondary">
                          {formatMessage({
                            id: 'orderDetails.field.customerId',
                          })}
                        </Typography>
                        <Typography>{order?.customer?.id || '-'}</Typography>
                      </div>
                    </div>
                  )}

                  {/* Customer ID - editable only in edit mode or when creating */}
                  {(isNew || isEditMode) && (
                    <div className={classes.formRow}>
                      <TextField
                        name="customerId"
                        label={formatMessage({
                          id: 'orderDetails.field.customerId',
                        })}
                        placeholder={formatMessage({
                          id: 'orderDetails.field.customerId.placeholder',
                        })}
                        value={values.customerId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isError={touched.customerId && !!errors.customerId}
                        helperText={touched.customerId && errors.customerId}
                        required
                      />
                    </div>
                  )}

                  {/* Amount and Payment Method */}
                  <div className={classes.formRow}>
                    {isEditMode ? (
                      <>
                        <TextField
                          name="amount"
                          inputType="number"
                          label={formatMessage({
                            id: 'orderDetails.field.amount',
                          })}
                          placeholder={formatMessage({
                            id: 'orderDetails.field.amount.placeholder',
                          })}
                          value={values.amount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isError={touched.amount && !!errors.amount}
                          helperText={touched.amount && errors.amount}
                          required
                        />
                        <FormikSelect
                          name="paymentMethod"
                          label={formatMessage({
                            id: 'orderDetails.field.paymentMethod',
                          })}
                          required
                        >
                          {Object.keys(PAYMENT_METHODS).map((method) => (
                            <MenuItem
                              key={method}
                              value={method}
                              children={formatMessage({
                                id: `orderDetails.paymentMethod.${method}`,
                              })}
                            />
                          ))}
                        </FormikSelect>
                      </>
                    ) : (
                      <>
                        <div className={classes.viewField}>
                          <Typography variant="caption" color="secondary">
                            {formatMessage({ id: 'orderDetails.field.amount' })}
                          </Typography>
                          <Typography>
                            <strong>
                              {values.amount.toFixed(2)} {AMOUNT_CURRENCY}
                            </strong>
                          </Typography>
                        </div>
                        <div className={classes.viewField}>
                          <Typography variant="caption" color="secondary">
                            {formatMessage({
                              id: 'orderDetails.field.paymentMethod',
                            })}
                          </Typography>
                          <Typography>
                            {formatMessage({
                              id: `orderDetails.paymentMethod.${values.paymentMethod}`,
                            })}
                          </Typography>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Status */}
                  <div className={classes.formRow}>
                    {isEditMode ? (
                      <FormikSelect
                        name="status"
                        label={formatMessage({
                          id: 'orderDetails.field.status',
                        })}
                        required
                      >
                        {Object.keys(ORDER_STATUSES).map((status) => (
                          <MenuItem
                            key={status}
                            value={status}
                            children={formatMessage({
                              id: `orderDetails.status.${status}`,
                            })}
                          />
                        ))}
                      </FormikSelect>
                    ) : (
                      <div className={classes.viewField}>
                        <Typography variant="caption" color="secondary">
                          {formatMessage({ id: 'orderDetails.field.status' })}
                        </Typography>
                        <span
                          className={classes.statusBadge}
                          style={{
                            backgroundColor:
                              STATUS_COLORS[values.status] || '#999',
                          }}
                        >
                          {formatMessage({
                            id: `orderDetails.status.${values.status}`,
                          }).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Metadata - only in view mode */}
                  {!isNew && !isEditMode && (
                    <>
                      <div className={classes.formRow}>
                        <div className={classes.viewField}>
                          <Typography variant="caption" color="secondary">
                            {formatMessage({ id: 'orderDetails.field.id' })}
                          </Typography>
                          <Typography variant="caption">
                            {order?.id || '-'}
                          </Typography>
                        </div>
                        <div className={classes.viewField}>
                          <Typography variant="caption" color="secondary">
                            {formatMessage({
                              id: 'orderDetails.field.createdAt',
                            })}
                          </Typography>
                          <Typography variant="caption">
                            {formatDate(
                              order?.createdAt,
                              DEFAULT_FORMATDATE_OPTIONS
                            )}
                          </Typography>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Error messages */}
                  {(updateError || createError) && (
                    <Typography color="error">
                      {updateError || createError}
                    </Typography>
                  )}
                </div>
              </CardContent>

              <CardActions>
                <div className={classes.actions}>
                  <Button
                    variant="secondary"
                    colorVariant="secondary"
                    onClick={onBack}
                    className={classes.backButton}
                  >
                    <Typography>
                      {formatMessage({ id: 'orderDetails.btn.back' })}
                    </Typography>
                  </Button>

                  {isEditMode && (
                    <>
                      <Button
                        variant="secondary"
                        colorVariant="secondary"
                        onClick={() => {
                          resetForm();
                          handleCancel();
                        }}
                        disabled={isSubmitting}
                      >
                        <Typography>
                          {formatMessage({ id: 'btn.cancel' })}
                        </Typography>
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        isLoading={isSubmitting || isCreating || isUpdating}
                      >
                        <Typography color="inherit">
                          <strong>
                            {isNew
                              ? formatMessage({ id: 'orderDetails.btn.create' })
                              : formatMessage({ id: 'orderDetails.btn.save' })}
                          </strong>
                        </Typography>
                      </Button>
                    </>
                  )}
                </div>
              </CardActions>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default OrderDetails;
