import { render } from '@testing-library/react';
import React from 'react';
import UpdateArticle, { UpdateArticleProps } from './UpdateArticle';

describe('UpdateArticle', () => {
  const defaultProps: UpdateArticleProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<UpdateArticle {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('UpdateArticle')).toBeTruthy();
  });
});
