import { render } from '@testing-library/react';
import React from 'react';
import SortServiceSubjects, { SortServiceSubjectsProps } from './SortServiceSubjects';

describe('SortServiceSubjects', () => {
  const defaultProps: SortServiceSubjectsProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<SortServiceSubjects {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('SortServiceSubjects')).toBeTruthy();
  });
});
