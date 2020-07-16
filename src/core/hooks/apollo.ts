import { DocumentNode, OperationVariables } from 'apollo-boost';
import { useQuery, QueryHookOptions } from '@apollo/react-hooks';
import { QueryResult } from '@apollo/react-common';

export function useImperativeQuery<
  TData = any,
  TVariables = OperationVariables
>(
  query: DocumentNode,
  options: QueryHookOptions<TData, TVariables> = {}
): QueryResult<TData, TVariables>['refetch'] {
  const { refetch } = useQuery<TData, TVariables>(query, {
    ...options,
    skip: true,
  });

  const imperativelyCallQuery = (queryVariables: TVariables) => {
    return refetch(queryVariables);
  };

  return imperativelyCallQuery;
}
