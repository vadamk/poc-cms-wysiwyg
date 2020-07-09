import { render } from '@testing-library/react';
import React from 'react';
import Dashboard, { DashboardProps } from './Dashboard';

describe('Dashboard', () => {
  const defaultProps: DashboardProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<Dashboard {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('Dashboard')).toBeTruthy();
  });
});
