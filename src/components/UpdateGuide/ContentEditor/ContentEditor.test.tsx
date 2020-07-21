import { render } from '@testing-library/react';
import React from 'react';
import ContentEditor, { ContentEditorProps } from './ContentEditor';

describe('ContentEditor', () => {
  const defaultProps: ContentEditorProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<ContentEditor {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('ContentEditor')).toBeTruthy();
  });
});
