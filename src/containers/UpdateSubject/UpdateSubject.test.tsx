import { render } from '@testing-library/react';
import React from 'react';
import UpdateSubject, { UpdateSubjectProps } from './UpdateSubject';

describe('UpdateSubject', () => {
  const defaultProps: UpdateSubjectProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<UpdateSubject {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('UpdateSubject')).toBeTruthy();
  });
});
