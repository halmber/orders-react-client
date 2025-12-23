import * as Yup from 'yup';

/**
 * Factory for creating Yup validation schemes based on field configuration
 *
 * @param {Object} fieldsConfig Field configuration
 * @param {Function} formatMessage Function for formatting messages (react-intl)
 * @returns {Yup.ObjectSchema} Yup validation scheme
 *
 * @example
 * const fieldsConfig = {
 *   title: {
 *     type: 'text',
 *     required: true,
 *     min: 2,
 *     max: 30,
 *     initial: '',
 *     labelKey: 'field.title',
 *     placeholderKey: 'field.title.placeholder'
 *   },
 *   email: {
 *     type: 'email',
 *     required: true,
 *     initial: '',
 *     labelKey: 'field.email'
 *   }
 * };
 *
 * const schema = createValidationSchema(fieldsConfig, formatMessage);
 */

const createValidationSchema = (fieldsConfig, formatMessage) =>
  Yup.object().shape(
    Object.entries(fieldsConfig).reduce((acc, [fieldName, config]) => {
      const fieldType = config.type;

      let fieldSchema = getBasicSchemaBaseOnType(fieldType, formatMessage);

      // Required validation
      if (config.required) {
        fieldSchema = fieldSchema.required(
          config.requiredMessage
            ? formatMessage({ id: config.requiredMessage })
            : formatMessage(
                { id: 'validation.required' },
                {
                  field: formatMessage({ id: config.labelKey || fieldName }),
                }
              )
        );
      }

      // Min/Max for strings
      if (
        fieldType === 'text' ||
        fieldType === 'textarea' ||
        fieldType === 'password'
      ) {
        if (config.min !== undefined) {
          fieldSchema = fieldSchema.min(
            config.min,
            config.minMessage
              ? formatMessage({ id: config.minMessage })
              : formatMessage(
                  { id: 'validation.min' },
                  {
                    field: formatMessage({ id: config.labelKey || fieldName }),
                    min: config.min,
                  }
                )
          );
        }

        if (config.max !== undefined) {
          fieldSchema = fieldSchema.max(
            config.max,
            config.maxMessage
              ? formatMessage({ id: config.maxMessage })
              : formatMessage(
                  { id: 'validation.max' },
                  {
                    field: formatMessage({ id: config.labelKey || fieldName }),
                    max: config.max,
                  }
                )
          );
        }
      }

      // Min/Max for numbers
      if (fieldType === 'number') {
        if (config.min !== undefined) {
          fieldSchema = fieldSchema.min(
            config.min,
            formatMessage(
              { id: 'validation.number.min' },
              {
                field: formatMessage({ id: config.labelKey || fieldName }),
                min: config.min,
              }
            )
          );
        }

        if (config.max !== undefined) {
          fieldSchema = fieldSchema.max(
            config.max,
            formatMessage(
              { id: 'validation.number.max' },
              {
                field: formatMessage({ id: config.labelKey || fieldName }),
                max: config.max,
              }
            )
          );
        }

        if (config.positive) {
          fieldSchema = fieldSchema.positive(
            formatMessage({ id: 'validation.number.positive' })
          );
        }

        if (config.integer) {
          fieldSchema = fieldSchema.integer(
            formatMessage({ id: 'validation.number.integer' })
          );
        }
      }

      // Email validation
      if (fieldType === 'email') {
        fieldSchema = fieldSchema.email(
          config.emailMessage
            ? formatMessage({ id: config.emailMessage })
            : formatMessage({ id: 'validation.email' })
        );
      }

      // Pattern validation
      if (config.pattern) {
        fieldSchema = fieldSchema.matches(
          config.pattern,
          config.patternMessage
            ? formatMessage({ id: config.patternMessage })
            : formatMessage({ id: 'validation.pattern' })
        );
      }

      // OneOf validation (select, radio)
      if (config.oneOf) {
        fieldSchema = fieldSchema.oneOf(
          config.oneOf,
          config.oneOfMessage
            ? formatMessage({ id: config.oneOfMessage })
            : formatMessage({ id: 'validation.oneOf' })
        );
      }

      // Custom validation function
      if (config.validate) {
        fieldSchema = fieldSchema.test(
          'custom',
          config.validateMessage
            ? formatMessage({ id: config.validateMessage })
            : formatMessage({ id: 'validation.custom' }),
          config.validate
        );
      }

      // Nullable
      if (config.nullable) {
        fieldSchema = fieldSchema.nullable();
      }

      acc[fieldName] = fieldSchema;
      return acc;
    }, {})
  );

// Get base schema depending on type
const getBasicSchemaBaseOnType = (fieldType, formatMessage) => {
  switch (fieldType) {
    case 'text':
    case 'textarea':
    case 'email':
    case 'password':
      return Yup.string();

    case 'number':
      return Yup.number().typeError(formatMessage({ id: 'validation.number' }));

    case 'select':
    case 'radio':
      return Yup.string();

    case 'boolean':
    case 'checkbox':
      return Yup.boolean();

    case 'date':
      return Yup.date().typeError(formatMessage({ id: 'validation.date' }));

    case 'array':
      return Yup.array();

    case 'object':
      return Yup.object();

    default:
      return Yup.mixed();
  }
};

/**
 * Creates initial values for Formik based on field configuration and existingData
 */
export const createInitialValues = (fieldsConfig, existingData = {}) =>
  Object.entries(fieldsConfig).reduce((acc, [fieldName, config]) => {
    // Utilize existing data, if available
    if (existingData[fieldName] !== undefined) {
      acc[fieldName] = existingData[fieldName];
    } else {
      // Otherwise, use the initial value from the configuration
      acc[fieldName] =
        config.initial !== undefined
          ? config.initial
          : getDefaultInitialValue(config.type);
    }
    return acc;
  }, existingData);

/**
 * Returns the default initial value for the field type
 */
const getDefaultInitialValue = (type) => {
  switch (type) {
    case 'text':
    case 'textarea':
    case 'email':
    case 'password':
    case 'select':
    case 'radio':
      return '';

    case 'number':
      return 0;

    case 'boolean':
    case 'checkbox':
      return false;

    case 'date':
      return null;

    case 'array':
      return [];

    case 'object':
      return {};

    default:
      return '';
  }
};

export default createValidationSchema;
