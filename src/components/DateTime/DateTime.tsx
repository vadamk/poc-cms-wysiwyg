import React from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';

export interface DateTimeProps {
  timestamp: number;
}

const DateTime: React.FC<DateTimeProps> = ({ timestamp }) => {
  return (
    <Tooltip title={moment(timestamp).format('YYYY/MM/DD H:mm')}>
      <span>{moment(timestamp).format('YYYY/MM/DD')}</span>
    </Tooltip>
  );
};

export default DateTime;
