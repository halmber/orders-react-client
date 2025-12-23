import Select from 'components/Select';
import { useField } from 'formik';

const FormikSelect = ({ name, ...props }) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Select
      {...props}
      name={name}
      value={field.value}
      onChange={(e) => helpers.setValue(e.target.value)}
      onBlur={() => helpers.setTouched(true)}
      isError={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};

export default FormikSelect;
