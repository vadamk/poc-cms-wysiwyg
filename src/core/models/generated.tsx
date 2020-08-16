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

export type GuideStepSummary = {
  __typename?: 'GuideStepSummary';
  id: Scalars['Int'];
  stepId: Scalars['Int'];
  orderNum: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
};

export type GuideStep = {
  __typename?: 'GuideStep';
  id: Scalars['Int'];
  guideId: Scalars['Int'];
  title: Scalars['String'];
  description: Scalars['String'];
  image: Scalars['String'];
  orderNum: Scalars['Int'];
  summaries: Array<Maybe<GuideStepSummary>>;
};

export type Audience = {
  __typename?: 'Audience';
  id: Scalars['Int'];
  title: Scalars['String'];
  language: Language;
};

export enum Language {
  Sv = 'sv',
  En = 'en'
}

export type ServiceSubject = {
  __typename?: 'ServiceSubject';
  id: Scalars['Int'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  language: Language;
  services: Array<Maybe<Service>>;
  audiences: Array<Maybe<Audience>>;
};

export type ServiceDescription = {
  __typename?: 'ServiceDescription';
  language: Language;
  title: Scalars['String'];
  subTitle: Scalars['String'];
};

export type Service = {
  __typename?: 'Service';
  id: Scalars['Int'];
  image: Scalars['String'];
  price: Scalars['Float'];
  currency: Scalars['String'];
  shortCode: Scalars['String'];
  duration: Scalars['Int'];
  type: Scalars['String'];
  isActive: Scalars['Boolean'];
  orderNum: Scalars['Int'];
  description: Array<Maybe<ServiceDescription>>;
  editions: Array<Maybe<SpecialEdition>>;
  serviceSubjects: Array<Maybe<ServiceSubject>>;
};

export type SpecialEdition = {
  __typename?: 'SpecialEdition';
  id: Scalars['Int'];
  type: Scalars['String'];
  guides: Array<Maybe<Guide>>;
  articles: Array<Maybe<Article>>;
  services: Array<Maybe<Service>>;
};

export type Article = {
  __typename?: 'Article';
  id: Scalars['Int'];
  title: Scalars['String'];
  subTitle?: Maybe<Scalars['String']>;
  headerImage: Scalars['String'];
  image: Scalars['String'];
  content: Scalars['String'];
  language: Language;
  actualTime: Scalars['Timestamp'];
  readDuration: Scalars['Int'];
  isPublished: Scalars['Boolean'];
  orderNum: Scalars['Int'];
  editions: Array<Maybe<SpecialEdition>>;
  subjects: Array<Maybe<Subject>>;
};

export type Subject = {
  __typename?: 'Subject';
  id: Scalars['Int'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  language: Language;
  guides: Array<Maybe<Guide>>;
  articles: Array<Maybe<Article>>;
  audiences: Array<Maybe<Audience>>;
};

export type Guide = {
  __typename?: 'Guide';
  id: Scalars['Int'];
  title: Scalars['String'];
  headerImage: Scalars['String'];
  language: Language;
  actualTime: Scalars['Timestamp'];
  isPublished: Scalars['Boolean'];
  orderNum: Scalars['Int'];
  link?: Maybe<Scalars['String']>;
  steps: Array<Maybe<GuideStep>>;
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
  getArticles: Array<Maybe<Article>>;
  getAudience: Audience;
  getAudienceServiceSubjects: Array<Maybe<ServiceSubject>>;
  getAudienceSubjects: Array<Maybe<Subject>>;
  getAudiences: Array<Maybe<Audience>>;
  getGuide?: Maybe<Guide>;
  getGuideStep: GuideStep;
  getGuideStepSummary: GuideStepSummary;
  getGuides: Array<Maybe<Guide>>;
  getServiceSubjects: Array<ServiceSubject>;
  getServices: Array<Maybe<Service>>;
  getSubjects: Array<Maybe<Subject>>;
  getUploadUrl: UploadOutput;
  isAuthorized: Scalars['Boolean'];
};


export type QueryGetArticleArgs = {
  articleId: Scalars['Int'];
};


export type QueryGetAudienceArgs = {
  audienceId: Scalars['Int'];
};


export type QueryGetAudienceServiceSubjectsArgs = {
  audienceId: Scalars['Int'];
};


export type QueryGetAudienceSubjectsArgs = {
  audienceId: Scalars['Int'];
};


export type QueryGetAudiencesArgs = {
  language?: Maybe<Scalars['String']>;
};


export type QueryGetGuideArgs = {
  guideId: Scalars['Int'];
};


export type QueryGetGuideStepArgs = {
  stepId: Scalars['Int'];
};


export type QueryGetGuideStepSummaryArgs = {
  summaryId: Scalars['Int'];
};


export type QueryGetServiceSubjectsArgs = {
  language: Scalars['String'];
};


export type QueryGetSubjectsArgs = {
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
  addArticleEdition: Scalars['String'];
  addGuideEdition: Scalars['String'];
  addServiceEdition: Scalars['String'];
  auth: AuthOutput;
  createArticle: Article;
  createGuide: Guide;
  createGuideStep: GuideStep;
  createGuideStepSummary: GuideStepSummary;
  createSubject: Subject;
  deleteArticle: Scalars['String'];
  deleteGuide: Scalars['String'];
  deleteGuideStep: Scalars['Boolean'];
  deleteGuideStepSummary: Scalars['Boolean'];
  deleteS3Object: Scalars['String'];
  deleteSubject: Scalars['Boolean'];
  removeArticleEdition: Scalars['String'];
  removeGuideEdition: Scalars['String'];
  removeServiceEdition: Scalars['String'];
  setAuthorized: Scalars['Boolean'];
  sortArticles: Scalars['Boolean'];
  sortGuideStepSummaries: Scalars['Boolean'];
  sortGuideSteps: Scalars['Boolean'];
  sortServiceSubjects: Scalars['Boolean'];
  sortServices: Scalars['Boolean'];
  sortSubjects: Scalars['Boolean'];
  updateArticle: Article;
  updateGuide: Guide;
  updateGuideStep: Scalars['Boolean'];
  updateGuideStepSummary: GuideStepSummary;
  updateSubject: Subject;
};


export type MutationAddArticleEditionArgs = {
  edition: Edition;
  articleId: Scalars['Int'];
};


export type MutationAddGuideEditionArgs = {
  edition: Edition;
  guideId: Scalars['Int'];
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


export type MutationCreateGuideArgs = {
  input: CreateGuideInput;
};


export type MutationCreateGuideStepArgs = {
  input: CreateGuideStepInput;
};


export type MutationCreateGuideStepSummaryArgs = {
  input: CreateGuideStepSummaryInput;
};


export type MutationCreateSubjectArgs = {
  input: CreateSubjectInput;
};


export type MutationDeleteArticleArgs = {
  articleId: Scalars['Int'];
};


export type MutationDeleteGuideArgs = {
  guideId: Scalars['Int'];
};


export type MutationDeleteGuideStepArgs = {
  stepId: Scalars['Int'];
};


export type MutationDeleteGuideStepSummaryArgs = {
  summaryId: Scalars['Int'];
};


export type MutationDeleteS3ObjectArgs = {
  path: Scalars['String'];
};


export type MutationDeleteSubjectArgs = {
  subjectId: Scalars['Int'];
};


export type MutationRemoveArticleEditionArgs = {
  edition: Edition;
  articleId: Scalars['Int'];
};


export type MutationRemoveGuideEditionArgs = {
  edition: Edition;
  guideId: Scalars['Int'];
};


export type MutationRemoveServiceEditionArgs = {
  edition: Edition;
  serviceId: Scalars['Int'];
};


export type MutationSetAuthorizedArgs = {
  isAuthorized: Scalars['Boolean'];
};


export type MutationSortArticlesArgs = {
  order: Array<OrderArticleInput>;
};


export type MutationSortGuideStepSummariesArgs = {
  order: Array<GuideStepSummaryOrderInput>;
};


export type MutationSortGuideStepsArgs = {
  order: Array<GuideStepOrderInput>;
};


export type MutationSortServiceSubjectsArgs = {
  order: Array<OrderServiceSubjectInput>;
  audienceId: Scalars['Int'];
};


export type MutationSortServicesArgs = {
  order: Array<OrderServiceInput>;
};


export type MutationSortSubjectsArgs = {
  order: Array<OrderSubjectInput>;
  audienceId: Scalars['Int'];
};


export type MutationUpdateArticleArgs = {
  article: UpdateArticleInput;
  articleId: Scalars['Int'];
};


export type MutationUpdateGuideArgs = {
  input: UpdateGuideInput;
  guideId: Scalars['Int'];
};


export type MutationUpdateGuideStepArgs = {
  input: UpdateGuideStepInput;
  stepId: Scalars['Int'];
};


export type MutationUpdateGuideStepSummaryArgs = {
  input: UpdateGuideStepSummaryInput;
  summaryId: Scalars['Int'];
};


export type MutationUpdateSubjectArgs = {
  input: UpdateSubjectInput;
  subjectId: Scalars['Int'];
};

export type CreateSubjectInput = {
  audienceIDs?: Maybe<Array<Maybe<Scalars['Int']>>>;
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  language: Language;
};

export type UpdateSubjectInput = {
  audienceIDs?: Maybe<Array<Maybe<Scalars['Int']>>>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  language?: Maybe<Language>;
};

export type OrderSubjectInput = {
  id: Scalars['Int'];
  orderNum: Scalars['Int'];
};

export type CreateGuideInput = {
  subjectIDs: Array<Scalars['Int']>;
  title: Scalars['String'];
  headerImage: Scalars['String'];
  language: Language;
  isPublished?: Maybe<Scalars['Boolean']>;
  actualTime: Scalars['Timestamp'];
  orderNum: Scalars['Int'];
  link?: Maybe<Scalars['String']>;
  stepCount?: Maybe<Scalars['Int']>;
  editions?: Maybe<Array<Edition>>;
};

export enum Edition {
  Beginner = 'BEGINNER',
  Boss = 'BOSS',
  Government = 'GOVERNMENT'
}

export type UpdateGuideInput = {
  subjectIDs: Array<Scalars['Int']>;
  title: Scalars['String'];
  headerImage: Scalars['String'];
  language: Language;
  isPublished?: Maybe<Scalars['Boolean']>;
  actualTime: Scalars['Timestamp'];
  orderNum: Scalars['Int'];
  link?: Maybe<Scalars['String']>;
  editions?: Maybe<Array<Edition>>;
};

export type CreateGuideStepSummaryInput = {
  stepId: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
  orderNum: Scalars['Float'];
};

export type UpdateGuideStepSummaryInput = {
  stepId: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
  orderNum: Scalars['Float'];
};

export type GuideStepSummaryOrderInput = {
  id: Scalars['Int'];
  orderNum: Scalars['Int'];
};

export type CreateGuideStepInput = {
  guideId: Scalars['Int'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  image: Scalars['String'];
  orderNum: Scalars['Int'];
};

export type UpdateGuideStepInput = {
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  image: Scalars['String'];
};

export type GuideStepOrderInput = {
  id: Scalars['Int'];
  orderNum: Scalars['Int'];
};

export type CreateArticleInput = {
  subjectIDs: Array<Scalars['Int']>;
  title: Scalars['String'];
  subTitle?: Maybe<Scalars['String']>;
  headerImage: Scalars['String'];
  image: Scalars['String'];
  content: Scalars['String'];
  language: Language;
  actualTime: Scalars['Timestamp'];
  readDuration: Scalars['Int'];
  isPublished?: Maybe<Scalars['Boolean']>;
  orderNum?: Maybe<Scalars['Int']>;
  editions?: Maybe<Array<Edition>>;
};

export type UpdateArticleInput = {
  subjectIDs: Array<Scalars['Int']>;
  title: Scalars['String'];
  subTitle?: Maybe<Scalars['String']>;
  headerImage: Scalars['String'];
  image: Scalars['String'];
  content: Scalars['String'];
  language: Language;
  actualTime: Scalars['Timestamp'];
  readDuration: Scalars['Int'];
  isPublished?: Maybe<Scalars['Boolean']>;
  orderNum?: Maybe<Scalars['Int']>;
  editions?: Maybe<Array<Edition>>;
};

export type OrderArticleInput = {
  id: Scalars['Int'];
  orderNum: Scalars['Int'];
};

export type OrderServiceInput = {
  id: Scalars['Int'];
  orderNum: Scalars['Int'];
};

export type OrderServiceSubjectInput = {
  id: Scalars['Int'];
  orderNum: Scalars['Int'];
};

export type GetSubjectListForBothLangQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSubjectListForBothLangQuery = { __typename?: 'Query', enSubjects: Array<Maybe<(
    { __typename?: 'Subject' }
    & SubjectFragmentFragment
  )>>, svSubjects: Array<Maybe<(
    { __typename?: 'Subject' }
    & SubjectFragmentFragment
  )>> };

export type GetArticlesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetArticlesQuery = { __typename?: 'Query', getArticles: Array<Maybe<(
    { __typename?: 'Article' }
    & ArticleFragmentFragment
  )>> };

export type DeleteArticleMutationVariables = Exact<{
  articleId: Scalars['Int'];
}>;


export type DeleteArticleMutation = { __typename?: 'Mutation', deleteArticle: string };

export type SortArticlesMutationVariables = Exact<{
  order: Array<OrderArticleInput>;
}>;


export type SortArticlesMutation = { __typename?: 'Mutation', sortArticles: boolean };

export type CreateArticleMutationVariables = Exact<{
  article: CreateArticleInput;
}>;


export type CreateArticleMutation = { __typename?: 'Mutation', createArticle: (
    { __typename?: 'Article' }
    & ArticleFragmentFragment
  ) };

export type CreateGuideMutationVariables = Exact<{
  input: CreateGuideInput;
}>;


export type CreateGuideMutation = { __typename?: 'Mutation', createGuide: (
    { __typename?: 'Guide' }
    & GuideFragmentFragment
  ) };

export type GetGuidesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGuidesQuery = { __typename?: 'Query', getGuides: Array<Maybe<(
    { __typename?: 'Guide' }
    & GuideFragmentFragment
  )>> };

export type DeleteGuideMutationVariables = Exact<{
  guideId: Scalars['Int'];
}>;


export type DeleteGuideMutation = { __typename?: 'Mutation', deleteGuide: string };

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

export type GetAudiencesForBothLangQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAudiencesForBothLangQuery = { __typename?: 'Query', enAudiences: Array<Maybe<{ __typename?: 'Audience', id: number, title: string, language: Language }>>, svAudiences: Array<Maybe<{ __typename?: 'Audience', id: number, title: string, language: Language }>> };

export type GetAudienceSubjectsQueryVariables = Exact<{
  audienceId: Scalars['Int'];
}>;


export type GetAudienceSubjectsQuery = { __typename?: 'Query', getAudienceSubjects: Array<Maybe<(
    { __typename?: 'Subject' }
    & SubjectFragmentFragment
  )>> };

export type SortSubjectsMutationVariables = Exact<{
  order: Array<OrderSubjectInput>;
  audienceId: Scalars['Int'];
}>;


export type SortSubjectsMutation = { __typename?: 'Mutation', sortSubjects: boolean };

export type CreateSubjectMutationVariables = Exact<{
  input: CreateSubjectInput;
}>;


export type CreateSubjectMutation = { __typename?: 'Mutation', createSubject: (
    { __typename?: 'Subject' }
    & SubjectFragmentFragment
  ) };

export type UpdateSubjectMutationVariables = Exact<{
  input: UpdateSubjectInput;
  subjectId: Scalars['Int'];
}>;


export type UpdateSubjectMutation = { __typename?: 'Mutation', updateSubject: (
    { __typename?: 'Subject' }
    & SubjectFragmentFragment
  ) };

export type DeleteSubjectMutationVariables = Exact<{
  subjectId: Scalars['Int'];
}>;


export type DeleteSubjectMutation = { __typename?: 'Mutation', deleteSubject: boolean };

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

export type CreateGuideStepSummaryMutationVariables = Exact<{
  input: CreateGuideStepSummaryInput;
}>;


export type CreateGuideStepSummaryMutation = { __typename?: 'Mutation', createGuideStepSummary: (
    { __typename?: 'GuideStepSummary' }
    & SummaryFragmentFragment
  ) };

export type DeleteGuideStepSummaryMutationVariables = Exact<{
  summaryId: Scalars['Int'];
}>;


export type DeleteGuideStepSummaryMutation = { __typename?: 'Mutation', deleteGuideStepSummary: boolean };

export type CreateGuideStepMutationVariables = Exact<{
  input: CreateGuideStepInput;
}>;


export type CreateGuideStepMutation = { __typename?: 'Mutation', createGuideStep: { __typename?: 'GuideStep', id: number, guideId: number, title: string, description: string, orderNum: number } };

export type DeleteGuideStepMutationVariables = Exact<{
  stepId: Scalars['Int'];
}>;


export type DeleteGuideStepMutation = { __typename?: 'Mutation', deleteGuideStep: boolean };

export type SortGuideSummariesMutationVariables = Exact<{
  order: Array<GuideStepSummaryOrderInput>;
}>;


export type SortGuideSummariesMutation = { __typename?: 'Mutation', sortGuideStepSummaries: boolean };

export type SortGuideStepsMutationVariables = Exact<{
  order: Array<GuideStepOrderInput>;
}>;


export type SortGuideStepsMutation = { __typename?: 'Mutation', sortGuideSteps: boolean };

export type GetGuideQueryVariables = Exact<{
  guideId: Scalars['Int'];
}>;


export type GetGuideQuery = { __typename?: 'Query', getGuide?: Maybe<(
    { __typename?: 'Guide' }
    & GuideFragmentFragment
  )> };

export type UpdateGuideMutationVariables = Exact<{
  input: UpdateGuideInput;
  guideId: Scalars['Int'];
}>;


export type UpdateGuideMutation = { __typename?: 'Mutation', updateGuide: (
    { __typename?: 'Guide' }
    & GuideFragmentFragment
  ) };

export type UpdateGuideStepSummaryMutationVariables = Exact<{
  input: UpdateGuideStepSummaryInput;
  summaryId: Scalars['Int'];
}>;


export type UpdateGuideStepSummaryMutation = { __typename?: 'Mutation', updateGuideStepSummary: (
    { __typename?: 'GuideStepSummary' }
    & SummaryFragmentFragment
  ) };

export type UpdateGuideStepMutationVariables = Exact<{
  input: UpdateGuideStepInput;
  stepId: Scalars['Int'];
}>;


export type UpdateGuideStepMutation = { __typename?: 'Mutation', updateGuideStep: boolean };

export type AudienceFragmentFragment = { __typename?: 'Audience', id: number, title: string, language: Language };

export type EditionFragmentFragment = { __typename?: 'SpecialEdition', id: number, type: string };

export type SubjectFragmentFragment = { __typename?: 'Subject', id: number, title: string, description?: Maybe<string>, language: Language, audiences: Array<Maybe<(
    { __typename?: 'Audience' }
    & AudienceFragmentFragment
  )>>, articles: Array<Maybe<{ __typename?: 'Article', id: number, title: string }>>, guides: Array<Maybe<{ __typename?: 'Guide', id: number, title: string }>> };

export type ArticleFragmentFragment = { __typename?: 'Article', id: number, title: string, subTitle?: Maybe<string>, image: string, headerImage: string, content: string, language: Language, actualTime: any, isPublished: boolean, readDuration: number, editions: Array<Maybe<(
    { __typename?: 'SpecialEdition' }
    & EditionFragmentFragment
  )>>, subjects: Array<Maybe<{ __typename?: 'Subject', id: number, title: string, description?: Maybe<string>, language: Language }>> };

export type SummaryFragmentFragment = { __typename?: 'GuideStepSummary', id: number, stepId: number, orderNum: number, title: string, content: string };

export type StepFragmentFragment = { __typename?: 'GuideStep', id: number, guideId: number, title: string, description: string, image: string, orderNum: number, summaries: Array<Maybe<(
    { __typename?: 'GuideStepSummary' }
    & SummaryFragmentFragment
  )>> };

export type GuideFragmentFragment = { __typename?: 'Guide', id: number, title: string, headerImage: string, language: Language, orderNum: number, link?: Maybe<string>, isPublished: boolean, steps: Array<Maybe<(
    { __typename?: 'GuideStep' }
    & StepFragmentFragment
  )>>, editions?: Maybe<Array<Maybe<(
    { __typename?: 'SpecialEdition' }
    & EditionFragmentFragment
  )>>>, subjects: Array<Maybe<{ __typename?: 'Subject', id: number, title: string, description?: Maybe<string>, language: Language }>> };

export type Unnamed_1_QueryVariables = Exact<{ [key: string]: never; }>;


export type Unnamed_1_Query = { __typename?: 'Query', isAuthorized: boolean };

export type IsAuthorizedQueryVariables = Exact<{ [key: string]: never; }>;


export type IsAuthorizedQuery = { __typename?: 'Query', isAuthorized: boolean };

export type SharedDataQueryVariables = Exact<{ [key: string]: never; }>;


export type SharedDataQuery = { __typename?: 'Query', enAudiences: Array<Maybe<{ __typename?: 'Audience', id: number, title: string, language: Language }>>, svAudiences: Array<Maybe<{ __typename?: 'Audience', id: number, title: string, language: Language }>> };
