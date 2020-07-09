import { render } from '@testing-library/react';
import React from 'react';
import AuthLayout, { AuthLayoutProps } from './AuthLayout';

describe('AuthLayout', () => {
  const defaultProps: AuthLayoutProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<AuthLayout {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('AuthLayout')).toBeTruthy();
  });
});
