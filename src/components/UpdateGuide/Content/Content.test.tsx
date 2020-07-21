import { render } from '@testing-library/react';
import React from 'react';
import Content, { ContentProps } from './Content';

describe('Content', () => {
  const defaultProps: ContentProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<Content {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('Content')).toBeTruthy();
  });
});
