import { render } from '@testing-library/react';
import React from 'react';
import Toolbar, { ToolbarProps } from './Toolbar';

describe('Toolbar', () => {
  const defaultProps: ToolbarProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<Toolbar {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('Toolbar')).toBeTruthy();
  });
});
