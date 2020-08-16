import { render } from '@testing-library/react';
import React from 'react';
import ServiceSubjects, { ServiceSubjectsProps } from './ServiceSubjects';

describe('ServiceSubjects', () => {
  const defaultProps: ServiceSubjectsProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<ServiceSubjects {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('ServiceSubjects')).toBeTruthy();
  });
});
