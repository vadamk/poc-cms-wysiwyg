import * as React from 'react';

interface ChevronDownProps extends React.SVGProps<SVGSVGElement> {}

const ChevronDown: React.FC<ChevronDownProps> = props => (
  <svg width={12.822} height={7.09} viewBox="0 0 12.822 7.09" {...props}>
    <path
      d="M1.411 1.411l5 4.353 5-4.353"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={2}
    />
  </svg>
);

export default ChevronDown;
