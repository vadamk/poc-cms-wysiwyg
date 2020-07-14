import { render } from '@testing-library/react';
import React from 'react';
import SignInForm, { SignInFormProps } from './SignInForm';

describe('SignInForm', () => {
  const defaultProps: SignInFormProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<SignInForm {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('SignInForm')).toBeTruthy();
  });
});
