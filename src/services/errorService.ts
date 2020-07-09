import { ApolloError } from 'apollo-boost';

export const handleError = (err: any) => {
  // tslint:disable-next-line: no-console
  console.error(err);
};

export const handleApolloError = (err: ApolloError) => {
  handleError(err);
};
