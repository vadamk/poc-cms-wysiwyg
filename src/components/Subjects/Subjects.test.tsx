import { render } from '@testing-library/react';
import React from 'react';
import Subjects, { SubjectsProps } from './Subjects';

describe('Subjects', () => {
  const defaultProps: SubjectsProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<Subjects {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('Subjects')).toBeTruthy();
  });
});
