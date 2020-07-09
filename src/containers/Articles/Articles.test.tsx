import { render } from '@testing-library/react';
import React from 'react';
import Articles, { ArticlesProps } from './Articles';

describe('Articles', () => {
  const defaultProps: ArticlesProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<Articles {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('Articles')).toBeTruthy();
  });
});
