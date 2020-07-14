import React from 'react';
import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';

import { Option } from 'models';

const { Group, Button } = Radio;

export interface RadioButtonsProps {
  options: Option[],
  value?: string;
  disabled?: boolean;
  onChange?: (e: RadioChangeEvent) => void;
}

const RadioButtons = React.forwardRef<typeof Group, RadioButtonsProps>(({
  options,
  value,
  disabled = false,
  onChange = () => null
}, ref) => (
  <Group ref={ref} value={value} disabled={disabled} onChange={onChange}>
    {options.map(o => (
      <Button key={String(o.value)} value={o.value}>{o.label}</Button>
    ))}
  </Group>
));

export default RadioButtons;
