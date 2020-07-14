import React from 'react';
import moment from 'moment';

export interface DateTimeProps {
  timestamp: number;
}

const DateTime: React.FC<DateTimeProps> = ({ timestamp }) => {
  return (
    <>
      {moment(timestamp).format('YYYY/MM/DD H:mm')}
    </>
  );
};

export default DateTime;
