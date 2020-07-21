import React from 'react';

export interface PureLayoutProps {}

const PureLayout: React.FC<PureLayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default PureLayout;
