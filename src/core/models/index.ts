import { Store } from 'antd/lib/form/interface';
import { FormInstance as FormInstanceLib } from 'antd/lib/form';

export type { Maybe } from 'graphql/jsutils/Maybe';

export interface FormValues extends Store {}

export interface FormInstance extends FormInstanceLib {}

export interface FormProps {
  form?: FormInstance;
  initialValues?: FormValues;
  isSubmitting?: boolean;
  onSubmit?: (data: FormValues) => void;
}

export interface Option {
  label: string;
  value: string | number | boolean | null | undefined;
  disabled?: boolean;
  index?: number;
}
