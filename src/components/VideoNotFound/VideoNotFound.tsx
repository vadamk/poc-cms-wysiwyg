import React from 'react';
import { Card } from 'antd';

import sty from './VideoNotFound.module.scss';

export interface VideoNotFoundProps {}

const VideoNotFound: React.FC<VideoNotFoundProps> = () => {
  return (
    <div className={sty.wrapper}>
      <Card className={sty.card}>
        <div>
          <h1 className={sty.title}>File not found</h1>
        </div>
        <div>
          <p className={sty.description}>
            The site configured at this address does not contain the requested file.
          </p>
          <p className={sty.description}>
            If this is your site, make sure that the filename case matches the URL. For
            root URLs (like http://example.com/) you must provide an index.html file.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default VideoNotFound;
