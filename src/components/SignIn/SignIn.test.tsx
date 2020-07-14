import { render } from '@testing-library/react';
import React from 'react';
import SignIn, { SignInProps } from './SignIn';

describe('SignIn', () => {
  const defaultProps: SignInProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<SignIn {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('SignIn')).toBeTruthy();
  });
});
