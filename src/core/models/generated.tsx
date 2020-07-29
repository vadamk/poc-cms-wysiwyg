export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** `Date` type as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: any;
};

export type AdminEntity = {
  __typename?: 'AdminEntity';
  id: Scalars['Int'];
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  lastLogin?: Maybe<Scalars['Timestamp']>;
  language: Scalars['String'];
  role: Scalars['String'];
};


export type AuthOutput = {
  __typename?: 'AuthOutput';
  token: Scalars['String'];
  type: Scalars['String'];
  header: Scalars['String'];
  user: AdminEntity;
};

export type Summary = {
  __typename?: 'Summary';
  id: Scalars['Int'];
  stepId: Scalars['Int'];
  orderNum: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
};

export type Step = {
  __typename?: 'Step';
  id: Scalars['Int'];
  discoveryId?: Maybe<Scalars['Int']>;
  title: Scalars['String'];
  description: Scalars['String'];
  orderNum: Scalars['Float'];
  summaries: Array<Maybe<Summary>>;
};

export type Subject = {
  __typename?: 'Subject';
  id: Scalars['Int'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  language: Scalars['String'];
  discoveries: Array<Maybe<Discovery>>;
  articles: Array<Maybe<Article>>;
};

export type SpecialEdition = {
  __typename?: 'SpecialEdition';
  id: Scalars['Int'];
  type: Scalars['String'];
  discoveries: Array<Maybe<Discovery>>;
  articles: Array<Maybe<Article>>;
};

export type Article = {
  __typename?: 'Article';
  id: Scalars['Int'];
  title: Scalars['String'];
  subTitle?: Maybe<Scalars['String']>;
  image: Scalars['String'];
  content: Scalars['String'];
  language: Scalars['String'];
  actualTime: Scalars['Timestamp'];
  isPublished: Scalars['Boolean'];
  audiences: Array<Maybe<Audience>>;
  editions: Array<Maybe<SpecialEdition>>;
  subjects: Array<Maybe<Subject>>;
};

export type Audience = {
  __typename?: 'Audience';
  id: Scalars['Int'];
  type: Scalars['String'];
  discoveries: Array<Maybe<Discovery>>;
  articles: Array<Maybe<Article>>;
};

export type Discovery = {
  __typename?: 'Discovery';
  id: Scalars['Int'];
  title: Scalars['String'];
  image: Scalars['String'];
  language: Scalars['String'];
  actualTime: Scalars['Timestamp'];
  isPublished: Scalars['Boolean'];
  orderNum: Scalars['Int'];
  link?: Maybe<Scalars['String']>;
  steps: Array<Maybe<Step>>;
  audiences?: Maybe<Array<Maybe<Audience>>>;
  editions?: Maybe<Array<Maybe<SpecialEdition>>>;
  subjects: Array<Maybe<Subject>>;
};

export type UploadOutput = {
  __typename?: 'UploadOutput';
  uploadUrl: Scalars['String'];
  path: Scalars['String'];
  exp: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  getArticle?: Maybe<Article>;
  getArticleList: Array<Maybe<Article>>;
  getDiscovery?: Maybe<Discovery>;
  getDiscoveryList: Array<Maybe<Discovery>>;
  getDiscoveryStep: Step;
  getDiscoverySummary: Summary;
  getSubjectList: Array<Maybe<Subject>>;
  getUploadUrl: UploadOutput;
  isAuthorized: Scalars['Boolean'];
};


export type QueryGetArticleArgs = {
  articleId: Scalars['Int'];
};


export type QueryGetDiscoveryArgs = {
  discoveryId: Scalars['Int'];
};


export type QueryGetDiscoveryStepArgs = {
  stepId: Scalars['Int'];
};


export type QueryGetDiscoverySummaryArgs = {
  summaryId: Scalars['Int'];
};


export type QueryGetSubjectListArgs = {
  language: Scalars['String'];
};


export type QueryGetUploadUrlArgs = {
  filename: Scalars['String'];
  folder: Upload_Folder;
};

export enum Upload_Folder {
  Cms = 'CMS',
  Order = 'ORDER'
}

export type Mutation = {
  __typename?: 'Mutation';
  addArticleAudience: Scalars['String'];
  addArticleEdition: Scalars['String'];
  addDiscoveryAudience: Scalars['String'];
  addDiscoveryEdition: Scalars['String'];
  addServiceAudience: Scalars['String'];
  addServiceEdition: Scalars['String'];
  auth: AuthOutput;
  createArticle: Article;
  createDiscovery: Discovery;
  createStep: Step;
  createSubject: Subject;
  createSummary: Summary;
  deleteArticle: Scalars['String'];
  deleteDiscovery: Scalars['String'];
  deleteS3Object: Scalars['String'];
  deleteStep: Scalars['String'];
  deleteSubject: Scalars['String'];
  deleteSummary: Scalars['String'];
  removeArticleAudience: Scalars['String'];
  removeArticleEdition: Scalars['String'];
  removeDiscoveryAudience: Scalars['String'];
  removeDiscoveryEdition: Scalars['String'];
  removeServiceAudience: Scalars['String'];
  removeServiceEdition: Scalars['String'];
  setAuthorized: Scalars['Boolean'];
  sortDiscoverySteps: Scalars['Boolean'];
  sortDiscoverySummaries: Scalars['Boolean'];
  updateArticle: Article;
  updateDiscovery: Discovery;
  updateDiscoveryStep: Scalars['Boolean'];
  updateSubject: Subject;
  updateSummary: Summary;
};


export type MutationAddArticleAudienceArgs = {
  audience: Audiences;
  articleId: Scalars['Int'];
};


export type MutationAddArticleEditionArgs = {
  edition: Edition;
  articleId: Scalars['Int'];
};


export type MutationAddDiscoveryAudienceArgs = {
  audience: Audiences;
  discoveryId: Scalars['Int'];
};


export type MutationAddDiscoveryEditionArgs = {
  edition: Edition;
  discoveryId: Scalars['Int'];
};


export type MutationAddServiceAudienceArgs = {
  audience: Audiences;
  serviceId: Scalars['Int'];
};


export type MutationAddServiceEditionArgs = {
  edition: Edition;
  serviceId: Scalars['Int'];
};


export type MutationAuthArgs = {
  password: Scalars['String'];
  identity: Scalars['String'];
};


export type MutationCreateArticleArgs = {
  article: CreateArticleInput;
};


export type MutationCreateDiscoveryArgs = {
  discovery: CreateDiscoveryInput;
};


export type MutationCreateStepArgs = {
  input: CreateDiscoveryStepInput;
};


export type MutationCreateSubjectArgs = {
  subject: CreateSubjectInput;
};


export type MutationCreateSummaryArgs = {
  summary: CreateDiscoverySummaryInput;
};


export type MutationDeleteArticleArgs = {
  articleId: Scalars['Int'];
};


export type MutationDeleteDiscoveryArgs = {
  discoveryId: Scalars['Int'];
};


export type MutationDeleteS3ObjectArgs = {
  path: Scalars['String'];
};


export type MutationDeleteStepArgs = {
  stepId: Scalars['Int'];
};


export type MutationDeleteSubjectArgs = {
  subjectId: Scalars['Int'];
};


export type MutationDeleteSummaryArgs = {
  summaryId: Scalars['Int'];
};


export type MutationRemoveArticleAudienceArgs = {
  audience: Audiences;
  articleId: Scalars['Int'];
};


export type MutationRemoveArticleEditionArgs = {
  edition: Edition;
  articleId: Scalars['Int'];
};


export type MutationRemoveDiscoveryAudienceArgs = {
  audience: Audiences;
  discoveryId: Scalars['Int'];
};


export type MutationRemoveDiscoveryEditionArgs = {
  edition: Edition;
  discoveryId: Scalars['Int'];
};


export type MutationRemoveServiceAudienceArgs = {
  audience: Audiences;
  serviceId: Scalars['Int'];
};


export type MutationRemoveServiceEditionArgs = {
  edition: Edition;
  serviceId: Scalars['Int'];
};


export type MutationSetAuthorizedArgs = {
  isAuthorized: Scalars['Boolean'];
};


export type MutationSortDiscoveryStepsArgs = {
  order: Array<DiscoveryStepOrderInput>;
};


export type MutationSortDiscoverySummariesArgs = {
  order: Array<DiscoverySummaryOrderInput>;
};


export type MutationUpdateArticleArgs = {
  article: UpdateArticleInput;
  articleId: Scalars['Int'];
};


export type MutationUpdateDiscoveryArgs = {
  discovery: UpdateDiscoveryInput;
  discoveryId: Scalars['Int'];
};


export type MutationUpdateDiscoveryStepArgs = {
  input: UpdateDiscoveryStepInput;
  stepId: Scalars['Int'];
};


export type MutationUpdateSubjectArgs = {
  subject: UpdateSubjectInput;
};


export type MutationUpdateSummaryArgs = {
  summary: UpdateDiscoverySummaryInput;
};

export type CreateSubjectInput = {
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  language: Scalars['String'];
};

export type UpdateSubjectInput = {
  id: Scalars['Int'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  language: Scalars['String'];
};

export type CreateDiscoveryInput = {
  subjectIDs: Array<Scalars['Int']>;
  title: Scalars['String'];
  image: Scalars['String'];
  language: Scalars['String'];
  isPublished?: Maybe<Scalars['Boolean']>;
  actualTime: Scalars['Timestamp'];
  orderNum: Scalars['Int'];
  link?: Maybe<Scalars['String']>;
  stepCount?: Maybe<Scalars['Int']>;
  audiences: Array<Audiences>;
  editions?: Maybe<Array<Edition>>;
};

export enum Audiences {
  NewJob = 'NEW_JOB',
  Develop = 'DEVELOP',
  Profile = 'PROFILE',
  Gigging = 'GIGGING',
  Help = 'HELP',
  SwedenJob = 'SWEDEN_JOB'
}

export enum Edition {
  Beginner = 'BEGINNER',
  Boss = 'BOSS',
  Government = 'GOVERNMENT'
}

export type UpdateDiscoveryInput = {
  subjectIDs: Array<Scalars['Int']>;
  title: Scalars['String'];
  image: Scalars['String'];
  language: Scalars['String'];
  isPublished?: Maybe<Scalars['Boolean']>;
  actualTime: Scalars['Timestamp'];
  orderNum: Scalars['Int'];
  link?: Maybe<Scalars['String']>;
  audiences: Array<Audiences>;
  editions?: Maybe<Array<Edition>>;
};

export type CreateDiscoverySummaryInput = {
  stepId: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
  orderNum: Scalars['Float'];
};

export type UpdateDiscoverySummaryInput = {
  stepId: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
  orderNum: Scalars['Float'];
  id: Scalars['Int'];
};

export type DiscoverySummaryOrderInput = {
  id: Scalars['Int'];
  orderNum: Scalars['Int'];
};

export type CreateDiscoveryStepInput = {
  discoveryId: Scalars['Int'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  orderNum: Scalars['Int'];
};

export type UpdateDiscoveryStepInput = {
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type DiscoveryStepOrderInput = {
  id: Scalars['Int'];
  orderNum: Scalars['Int'];
};

export type CreateArticleInput = {
  subjectIDs: Array<Scalars['Int']>;
  title: Scalars['String'];
  subTitle?: Maybe<Scalars['String']>;
  image: Scalars['String'];
  content: Scalars['String'];
  language: Scalars['String'];
  isPublished?: Maybe<Scalars['Boolean']>;
  actualTime: Scalars['Timestamp'];
  audiences: Array<Audiences>;
  editions?: Maybe<Array<Edition>>;
};

export type UpdateArticleInput = {
  subjectIDs: Array<Scalars['Int']>;
  title: Scalars['String'];
  subTitle?: Maybe<Scalars['String']>;
  image: Scalars['String'];
  content: Scalars['String'];
  language: Scalars['String'];
  isPublished?: Maybe<Scalars['Boolean']>;
  actualTime: Scalars['Timestamp'];
  audiences: Array<Audiences>;
  editions?: Maybe<Array<Edition>>;
};

export type GetSubjectListForBothLangQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSubjectListForBothLangQuery = { __typename?: 'Query', enSubjects: Array<Maybe<{ __typename?: 'Subject', id: number, title: string, description?: Maybe<string>, language: string }>>, svSubjects: Array<Maybe<{ __typename?: 'Subject', id: number, title: string, description?: Maybe<string>, language: string }>> };

export type GetArticleListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetArticleListQuery = { __typename?: 'Query', getArticleList: Array<Maybe<(
    { __typename?: 'Article' }
    & ArticleFragmentFragment
  )>> };

export type DeleteArticleMutationVariables = Exact<{
  articleId: Scalars['Int'];
}>;


export type DeleteArticleMutation = { __typename?: 'Mutation', deleteArticle: string };

export type CreateArticleMutationVariables = Exact<{
  article: CreateArticleInput;
}>;


export type CreateArticleMutation = { __typename?: 'Mutation', createArticle: (
    { __typename?: 'Article' }
    & ArticleFragmentFragment
  ) };

export type CreateDiscoveryMutationVariables = Exact<{
  discovery: CreateDiscoveryInput;
}>;


export type CreateDiscoveryMutation = { __typename?: 'Mutation', createDiscovery: (
    { __typename?: 'Discovery' }
    & DiscoveryFragmentFragment
  ) };

export type GetDiscoveryListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDiscoveryListQuery = { __typename?: 'Query', getDiscoveryList: Array<Maybe<(
    { __typename?: 'Discovery' }
    & DiscoveryFragmentFragment
  )>> };

export type DeleteDiscoveryMutationVariables = Exact<{
  discoveryId: Scalars['Int'];
}>;


export type DeleteDiscoveryMutation = { __typename?: 'Mutation', deleteDiscovery: string };

export type GetUploadUrlQueryVariables = Exact<{
  folder: Upload_Folder;
  filename: Scalars['String'];
}>;


export type GetUploadUrlQuery = { __typename?: 'Query', getUploadUrl: { __typename?: 'UploadOutput', uploadUrl: string, path: string, exp: number } };

export type SignInMutationVariables = Exact<{
  identity: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInMutation = { __typename?: 'Mutation', auth: { __typename?: 'AuthOutput', token: string } };

export type SetAuthorizedMutationVariables = Exact<{
  isAuthorized: Scalars['Boolean'];
}>;


export type SetAuthorizedMutation = { __typename?: 'Mutation', setAuthorized: boolean };

export type CreateSubjectMutationVariables = Exact<{
  subject: CreateSubjectInput;
}>;


export type CreateSubjectMutation = { __typename?: 'Mutation', createSubject: (
    { __typename?: 'Subject' }
    & SubjectFragmentFragment
  ) };

export type UpdateSubjectMutationVariables = Exact<{
  subject: UpdateSubjectInput;
}>;


export type UpdateSubjectMutation = { __typename?: 'Mutation', updateSubject: (
    { __typename?: 'Subject' }
    & SubjectFragmentFragment
  ) };

export type DeleteSubjectMutationVariables = Exact<{
  subjectId: Scalars['Int'];
}>;


export type DeleteSubjectMutation = { __typename?: 'Mutation', deleteSubject: string };

export type GetArticleQueryVariables = Exact<{
  articleId: Scalars['Int'];
}>;


export type GetArticleQuery = { __typename?: 'Query', getArticle?: Maybe<(
    { __typename?: 'Article' }
    & ArticleFragmentFragment
  )> };

export type UpdateArticleMutationVariables = Exact<{
  article: UpdateArticleInput;
  articleId: Scalars['Int'];
}>;


export type UpdateArticleMutation = { __typename?: 'Mutation', updateArticle: (
    { __typename?: 'Article' }
    & ArticleFragmentFragment
  ) };

export type CreateSummaryMutationVariables = Exact<{
  summary: CreateDiscoverySummaryInput;
}>;


export type CreateSummaryMutation = { __typename?: 'Mutation', createSummary: (
    { __typename?: 'Summary' }
    & SummaryFragmentFragment
  ) };

export type DeleteSummaryMutationVariables = Exact<{
  summaryId: Scalars['Int'];
}>;


export type DeleteSummaryMutation = { __typename?: 'Mutation', deleteSummary: string };

export type CreateStepMutationVariables = Exact<{
  input: CreateDiscoveryStepInput;
}>;


export type CreateStepMutation = { __typename?: 'Mutation', createStep: { __typename?: 'Step', id: number, discoveryId?: Maybe<number>, title: string, description: string, orderNum: number } };

export type DeleteStepMutationVariables = Exact<{
  stepId: Scalars['Int'];
}>;


export type DeleteStepMutation = { __typename?: 'Mutation', deleteStep: string };

export type SortDiscoverySummariesMutationVariables = Exact<{
  order: Array<DiscoverySummaryOrderInput>;
}>;


export type SortDiscoverySummariesMutation = { __typename?: 'Mutation', sortDiscoverySummaries: boolean };

export type SortDiscoveryStepsMutationVariables = Exact<{
  order: Array<DiscoveryStepOrderInput>;
}>;


export type SortDiscoveryStepsMutation = { __typename?: 'Mutation', sortDiscoverySteps: boolean };

export type GetGuideQueryVariables = Exact<{
  discoveryId: Scalars['Int'];
}>;


export type GetGuideQuery = { __typename?: 'Query', getDiscovery?: Maybe<(
    { __typename?: 'Discovery' }
    & DiscoveryFragmentFragment
  )> };

export type UpdateDiscoveryMutationVariables = Exact<{
  discovery: UpdateDiscoveryInput;
  discoveryId: Scalars['Int'];
}>;


export type UpdateDiscoveryMutation = { __typename?: 'Mutation', updateDiscovery: (
    { __typename?: 'Discovery' }
    & DiscoveryFragmentFragment
  ) };

export type UpdateSummaryMutationVariables = Exact<{
  summary: UpdateDiscoverySummaryInput;
}>;


export type UpdateSummaryMutation = { __typename?: 'Mutation', updateSummary: (
    { __typename?: 'Summary' }
    & SummaryFragmentFragment
  ) };

export type UpdateDiscoveryStepMutationVariables = Exact<{
  input: UpdateDiscoveryStepInput;
  stepId: Scalars['Int'];
}>;


export type UpdateDiscoveryStepMutation = { __typename?: 'Mutation', updateDiscoveryStep: boolean };

export type SubjectFragmentFragment = { __typename?: 'Subject', id: number, title: string, description?: Maybe<string>, language: string };

export type EditionFragmentFragment = { __typename?: 'SpecialEdition', id: number, type: string };

export type AudienceFragmentFragment = { __typename?: 'Audience', id: number, type: string };

export type ArticleFragmentFragment = { __typename?: 'Article', id: number, title: string, subTitle?: Maybe<string>, image: string, content: string, language: string, actualTime: any, isPublished: boolean, audiences: Array<Maybe<(
    { __typename?: 'Audience' }
    & AudienceFragmentFragment
  )>>, editions: Array<Maybe<(
    { __typename?: 'SpecialEdition' }
    & EditionFragmentFragment
  )>>, subjects: Array<Maybe<(
    { __typename?: 'Subject' }
    & SubjectFragmentFragment
  )>> };

export type SummaryFragmentFragment = { __typename?: 'Summary', id: number, stepId: number, orderNum: number, title: string, content: string };

export type StepFragmentFragment = { __typename?: 'Step', id: number, discoveryId?: Maybe<number>, title: string, description: string, orderNum: number, summaries: Array<Maybe<(
    { __typename?: 'Summary' }
    & SummaryFragmentFragment
  )>> };

export type DiscoveryFragmentFragment = { __typename?: 'Discovery', id: number, title: string, image: string, language: string, orderNum: number, link?: Maybe<string>, isPublished: boolean, actualTime: any, steps: Array<Maybe<(
    { __typename?: 'Step' }
    & StepFragmentFragment
  )>>, audiences?: Maybe<Array<Maybe<(
    { __typename?: 'Audience' }
    & AudienceFragmentFragment
  )>>>, editions?: Maybe<Array<Maybe<(
    { __typename?: 'SpecialEdition' }
    & EditionFragmentFragment
  )>>>, subjects: Array<Maybe<(
    { __typename?: 'Subject' }
    & SubjectFragmentFragment
  )>> };

export type Unnamed_1_QueryVariables = Exact<{ [key: string]: never; }>;


export type Unnamed_1_Query = { __typename?: 'Query', isAuthorized: boolean };

export type IsAuthorizedQueryVariables = Exact<{ [key: string]: never; }>;


export type IsAuthorizedQuery = { __typename?: 'Query', isAuthorized: boolean };
