import React from 'react';
import { Spin, Row, Col, Card, Space, Typography, Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

import Tags from 'components/Tags';
import DateTime from 'components/DateTime';
import CrudMenu from 'components/CrudMenu';
import { getEditionsOptions, getAudienceOptions } from 'components/Articles';

import sty from './CardsView.module.scss';

const { Paragraph, Text } = Typography;

export interface CardsViewProps {
  articles: any[];
  isLoading: boolean;
  onEdit: (article: any) => void;
  onDelete: (article: any) => void;
}

const CardsView: React.FC<CardsViewProps> = ({
  articles,
  isLoading,
  onDelete = () => null,
  onEdit = () => null,
}) => (
  <Spin spinning={isLoading}>
    <Row gutter={[20, 20]}>
      {articles.map(article => (
        <Col key={article.id} span={6}>
          <Card
            title={article.title}
            extra={(
              <CrudMenu data={article} onEdit={onEdit} onDelete={onDelete}>
                <Button type="text" icon={<MoreOutlined />} shape="circle" />
              </CrudMenu>
            )}
            cover={<img src={article.image} alt="" />}
          >
            <Space direction="vertical">
              <Paragraph ellipsis={{ rows: 3 }}>
                {article.subTitle}
              </Paragraph>
              <Space align="start">
                <Text type="secondary" className={sty.label}>
                  Audiences:
                </Text>
                <Tags options={getAudienceOptions(article?.audiences)} />
              </Space>
              {Boolean(article?.editions.length) && (
                <Space align="start">
                  <Text type="secondary" className={sty.label}>
                    Editions:
                  </Text>
                  <Tags options={getEditionsOptions(article?.editions)} color="magenta" />
                </Space>
              )}
              <Space align="start">
                <Text type="secondary" className={sty.label}>
                  Edited:
                </Text>
                <Text type="secondary" className={sty.dateTime}>
                  <DateTime timestamp={article?.actualTime} />
                </Text>
              </Space>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  </Spin>
);

export default CardsView;
