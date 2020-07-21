import { render } from '@testing-library/react';
import React from 'react';
import Steps, { StepsProps } from './Steps';

describe('Steps', () => {
  const defaultProps: StepsProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<Steps {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('Steps')).toBeTruthy();
  });
});
