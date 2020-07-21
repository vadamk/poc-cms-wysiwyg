import { gql } from 'apollo-boost';

export const SubjectFragment = gql`
  fragment SubjectFragment on Subject {
    id
    title
    description
    language
    discoveries {
      id
    }
    articles {
      id
    }
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
    subjectId
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
    subjectId
    image
    language
    orderNum
    link
    steps {
      ...StepFragment
    }
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
  ${StepFragment}
  ${SubjectFragment}
  ${EditionFragment}
  ${AudienceFragment}
`;
