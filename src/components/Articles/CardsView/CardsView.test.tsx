import { render } from '@testing-library/react';
import React from 'react';
import CardsView, { CardsViewProps } from './CardsView';

describe('CardsView', () => {
  const defaultProps: CardsViewProps = {};

  it('should render', () => {
    const props = { ...defaultProps };
    const { asFragment, queryByText } = render(<CardsView {...props} />);

    expect(asFragment()).toMatchSnapshot();
    expect(queryByText('CardsView')).toBeTruthy();
  });
});
