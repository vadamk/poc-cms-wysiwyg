import React from 'react';
import { Row, Col, Empty } from 'antd';

import { Summary } from 'core/models/generated';

import TreeView from 'components/UpdateGuide/TreeView';
import ContentEditor from 'components/UpdateGuide/ContentEditor';

import './Content.module.scss';

export interface ContentProps {}

const Content: React.FC<ContentProps> = () => {
  const [currentSummary, setCurentSummary] = React.useState<Summary>();

  const handleSummaryChange = (summary?: Summary) => {
    setCurentSummary(summary);
  }

  return (
    <div style={{ height: 'calc(100vh - 220px)' }}>
      <Row gutter={[10, 10]}>
        <Col span={6}>
          <TreeView onSummaryChange={handleSummaryChange} />
        </Col>
        <Col span={18}>
          {currentSummary ? (
            <ContentEditor summary={currentSummary} />
          ): (
            <Empty description="Please choose summary" />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default React.memo(Content);
