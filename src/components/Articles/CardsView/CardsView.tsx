import React from 'react';
import { Spin, Row, Col, Card, Dropdown, Menu, Space, Typography, Button } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';

import Tags from 'components/Tags';
import { getEditionsOptions, getAudienceOptions } from 'components/Articles';
import DateTime from 'components/DateTime';

import sty from './CardsView.module.scss';

const { Paragraph, Text } = Typography;

export interface CardsViewProps {
  articles: any[];
  isLoading: boolean;
  onDelete: (article: any) => void;
  onEdit: (articleId: string) => void;
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
              <Dropdown
                trigger={['click']}
                overlay={() => (
                  <Menu>
                    <Menu.Item
                      icon={<EditOutlined />}
                      onClick={() => onEdit(article.id)}
                    >
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      icon={<DeleteOutlined />}
                      onClick={() => onDelete(article)}
                    >
                      Delete
                    </Menu.Item>
                  </Menu>
                )}
              >
                <Button type="text" icon={<MoreOutlined />} shape="circle" />
              </Dropdown>
            )}
            cover={<img src={article.image} alt=""/>}
            // onClick={() => onEdit(article.id)}
          >
            <Space direction="vertical">
              <Paragraph ellipsis={{ rows: 3 }}>
                {article.subTitle}
              </Paragraph>
              <Space align="start">
                <Text
                  type="secondary"
                  style={{ display: 'block', fontSize: 12, textAlign: 'right', width: 75 }}
                >
                  Audiences:
                </Text>
                <Tags options={getAudienceOptions(article?.audiences)} />
              </Space>
              {Boolean(article?.editions.length) && (
                <Space align="start">
                  <Text
                    type="secondary"
                    style={{ display: 'block', fontSize: 12, textAlign: 'right', width: 75 }}
                  >
                    Editions:
                  </Text>
                  <Tags options={getEditionsOptions(article?.editions)} color="magenta" />
                </Space>
              )}
              <Space align="start">
                <Text
                  type="secondary"
                  style={{ display: 'block', fontSize: 12, textAlign: 'right', width: 75 }}
                >
                  Edtied:
                </Text>
                <Text type="secondary" style={{ display: 'block', fontSize: 12, lineHeight: '18px' }}>
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
