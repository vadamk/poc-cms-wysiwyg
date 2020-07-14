import { render } from '@testing-library/react';
import React from 'react';
import Guides, { GuidesProps } from './Guides';

describe('Guides', () => {
  const defaultProps: GuidesProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<Guides {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('Guides')).toBeTruthy();
  });
});
