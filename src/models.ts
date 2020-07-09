import { Store } from 'antd/lib/form/interface';
import { FormInstance as FormInstanceLib } from 'antd/lib/form';

export interface FormValues extends Store { }

export interface FormInstance extends FormInstanceLib { }

export interface FormProps {
  form?: FormInstance;
  initialValues?: FormValues,
  isSubmitting?: boolean;
  onSubmit?: (data: FormValues) => void,
}