import { render } from '@testing-library/react';
import React from 'react';
import CreateArticle, { CreateArticleProps } from './CreateArticle';

describe('CreateArticle', () => {
  const defaultProps: CreateArticleProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<CreateArticle {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('CreateArticle')).toBeTruthy();
  });
});
