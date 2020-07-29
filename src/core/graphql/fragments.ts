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
    isPublished
    readDuration
    audiences {
      ...AudienceFragment
    }
    editions {
      ...EditionFragment
    }
    subjects {
      ...SubjectFragment
    }
  }
  ${SubjectFragment}
  ${EditionFragment}
  ${AudienceFragment}
`;

export const SummaryFragment = gql`
  fragment SummaryFragment on Summary {
    id
    stepId
    orderNum
    title
    content
  }
`;

export const StepFragment = gql`
  fragment StepFragment on Step {
    id
    discoveryId
    title
    description
    orderNum
    summaries {
      ...SummaryFragment
    }
  }
  ${SummaryFragment}
`;

export const DiscoveryFragment = gql`
  fragment DiscoveryFragment on Discovery {
    id
    title
    image
    language
    orderNum
    link
    isPublished
    # actualTime
    steps {
      ...StepFragment
    }
    audiences {
      ...AudienceFragment
    }
    editions {
      ...EditionFragment
    }
    subjects {
      ...SubjectFragment
    }
  }
  ${StepFragment}
  ${SubjectFragment}
  ${EditionFragment}
  ${AudienceFragment}
`;
