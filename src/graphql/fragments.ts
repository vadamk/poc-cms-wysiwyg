import { gql } from 'apollo-boost';

export const SubjectFragment = gql`
  fragment SubjectFragment on Subject {
    id
    title
    description
  }
`;
