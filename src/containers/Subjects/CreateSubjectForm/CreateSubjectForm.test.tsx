import { render } from '@testing-library/react';
import React from 'react';
import CreateSubjectForm, { CreateSubjectFormProps } from './CreateSubjectForm';

describe('CreateSubjectForm', () => {
  const defaultProps: CreateSubjectFormProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<CreateSubjectForm {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('CreateSubjectForm')).toBeTruthy();
  });
});
