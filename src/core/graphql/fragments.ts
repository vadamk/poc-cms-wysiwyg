import { AdminEntity } from './../models/generated';
import { gql } from 'apollo-boost';

export const AudienceFragment = gql`
  fragment AudienceFragment on Audience {
    id
    title
    language
  }
`;

export const EditionFragment = gql`
  fragment EditionFragment on SpecialEdition {
    id
    type
  }
`;

export const SubjectFragment = gql`
  fragment SubjectFragment on Subject {
    id
    title
    description
    language
    audiences {
      ...AudienceFragment
    }
    articles {
      id
      title
    }
    guides {
      id
      title
    }
  }
  ${AudienceFragment}
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
    editions {
      ...EditionFragment
    }
    subjects {
      ...SubjectFragment
    }
  }
  ${SubjectFragment}
  ${EditionFragment}
`;

export const SummaryFragment = gql`
  fragment SummaryFragment on GuideStepSummary {
    id
    stepId
    orderNum
    title
    content
  }
`;

export const StepFragment = gql`
  fragment StepFragment on GuideStep {
    id
    guideId
    title
    description
    image
    orderNum
    summaries {
      ...SummaryFragment
    }
  }
  ${SummaryFragment}
`;

export const GuideFragment = gql`
  fragment GuideFragment on Guide {
    id
    title
    headerImage
    language
    orderNum
    link
    isPublished
    # actualTime
    steps {
      ...StepFragment
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
`;
