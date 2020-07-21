import { render } from '@testing-library/react';
import React from 'react';
import TreeView, { TreeViewProps } from './TreeView';

describe('TreeView', () => {
  const defaultProps: TreeViewProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<TreeView {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('TreeView')).toBeTruthy();
  });
});
