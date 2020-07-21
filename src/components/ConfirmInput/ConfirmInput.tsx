import React from 'react';
import { Input, Button } from 'antd';

import { useClickOutside } from 'core/hooks/useClickOutside';

import sty from './ConfirmInput.module.scss';

export interface ConfirmInputProps {
  isLoading?: boolean;
  onOk?: (value: string) => void;
  onCancel?: () => void;
  onChange?: (value: string) => void;
}

const ConfirmInput = React.forwardRef<Input, ConfirmInputProps>(
  (
    {
      isLoading = false,
      onOk = () => null,
      onCancel = () => null,
      onChange = () => null,
    },
    ref,
  ) => {
    const wrapRef = React.useRef(null);

    const [value, setValue] = React.useState('');

    useClickOutside(wrapRef, () => {
      if (value === '') {
        onCancel();
      }
    });

    const handleChange = React.useCallback(
      ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        setValue(target.value);
        onChange(target.value);
      },
      [onChange],
    );

    const submitValue = React.useCallback(() => {
      onOk(value);
    }, [onOk, value]);

    const handleKeydown = React.useCallback(
      event => {
        if (event.keyCode === 27) {
          onCancel();
        }
      },
      [onCancel],
    );

    React.useEffect(() => {
      document.addEventListener('keydown', handleKeydown, false);

      return () => {
        document.removeEventListener('keydown', handleKeydown, false);
      };
    }, [handleKeydown]);

    return (
      <div ref={wrapRef} className={sty.confirmInput}>
        <Input
          autoFocus
          ref={ref}
          disabled={isLoading}
          className={sty.input}
          value={value}
          onChange={handleChange}
          onPressEnter={submitValue}
        />
        <Button
          type="primary"
          className={sty.confirmButton}
          loading={isLoading}
          onClick={submitValue}
        >
          Ok
        </Button>
        <Button type="default" className={sty.cancelButton} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    );
  },
);

export default ConfirmInput;
