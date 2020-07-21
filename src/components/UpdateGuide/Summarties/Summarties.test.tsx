import { render } from '@testing-library/react';
import React from 'react';
import Summarties, { SummartiesProps } from './Summarties';

describe('Summarties', () => {
  const defaultProps: SummartiesProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<Summarties {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('Summarties')).toBeTruthy();
  });
});
