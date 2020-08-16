import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Typography, Table } from 'antd';
import Column from 'antd/lib/table/Column';

import { ServiceFragment } from 'core/graphql/fragments';
import { Language } from 'core/models';
import { getSubjectsOptions, basicReorder } from 'core/utils';

import Toolbar from 'components/Toolbar';
import Tags from 'components/Tags';
import DragableBodyRow from 'components/DragableBodyRow';

const { Paragraph } = Typography;

export const GET_SERVICES = gql`
  query GetServices {
    getServices {
      ...ServiceFragment
    }
  }
  ${ServiceFragment}
`;

export const SET_SERVICES_ORDER = gql`
  mutation SortServices($order: [OrderServiceInput!]!) {
    sortServices(order: $order)
  }
`;

export interface ServicesProps {}

const Services: React.FC<ServicesProps> = () => {
  const [services, setServices] = React.useState<any[]>([]);
  console.log('services: ', services);

  const { data, loading } = useQuery(GET_SERVICES, {
    pollInterval: 10000,
  });

  React.useEffect(() => {
    if (data) {
      setServices(data?.getServices.map(({ description, ...service }: any) => ({
        ...service,
        ...(description.find(d => d.language === Language.EN) || {}),
      })) || [])
    }
  }, [data]);

  const [setServicesOrder, setServicesOrderStatus] = useMutation(SET_SERVICES_ORDER, {
    refetchQueries: [{ query: GET_SERVICES }]
  });

  const moveRow = React.useCallback((dragIndex: number, hoverIndex: number) => {
    const nextServices = basicReorder(services, dragIndex, hoverIndex);
    setServices(nextServices);

    const order = nextServices.map((article, index) => ({
      id: article.id,
      orderNum: index + 1,
    }));

    setServicesOrder({ variables: { order } })
  }, [services, setServicesOrder]);

  return (
    <>
      <Toolbar title="Services" />

      <Table
        rowKey="id"
        loading={loading || setServicesOrderStatus.loading}
        dataSource={services as any}
        pagination={false}
        components={{ body: { row: DragableBodyRow } }}
        onRow={(record, index) => ({
          index,
          moveRow,
        }) as any}
      >
        <Column<any>
          title="Title"
          dataIndex="title"
          key="title"
          width={200}
        />
        <Column
          title="Subtitle"
          dataIndex="subTitle"
          key="subTitle"
          render={text => <Paragraph ellipsis={{ rows: 3 }}>{text}</Paragraph>}
        />
        <Column
          title="Subjects"
          dataIndex="serviceSubjects"
          key="serviceSubjects"
          width={220}
          render={subjects => <Tags options={getSubjectsOptions(subjects)} />}
        />
      </Table>
    </>
  );
};

export default Services;
