import { gql } from 'apollo-boost';

export const SubjectFragment = gql`
  fragment SubjectFragment on Subject {
    id
    title
    description
    language
  }
`;

export const EditionFragment = gql`
  fragment EditionFragment on SpecialEdition {
    id
    type
  }
`;

export const AudienceFragment = gql`
  fragment AudienceFragment on Audience {
    id
    type
  }
`;

export const ArticleFragment = gql`
  fragment ArticleFragment on Article {
    id
    title
    subTitle
    image
    content
    language
    actualTime
    audiences {
      ...AudienceFragment
    }
    editions {
      ...EditionFragment
    }
    subject {
      ...SubjectFragment
    }
  }
  ${SubjectFragment}
  ${EditionFragment}
  ${AudienceFragment}
`;
