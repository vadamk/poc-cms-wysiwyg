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
  orderNum: Scalars['Float'];
  summaries: Array<Maybe<Summary>>;
};

export type Subject = {
  __typename?: 'Subject';
  id: Scalars['Int'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  language: Scalars['String'];
  discoveries?: Maybe<Array<Maybe<Discovery>>>;
  articles?: Maybe<Array<Maybe<Article>>>;
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
  subjectId: Scalars['Int'];
  title: Scalars['String'];
  subTitle?: Maybe<Scalars['String']>;
  image: Scalars['String'];
  content: Scalars['String'];
  language: Scalars['String'];
  actualTime: Scalars['Timestamp'];
  audiences?: Maybe<Array<Maybe<Audience>>>;
  editions?: Maybe<Array<Maybe<SpecialEdition>>>;
  subject: Subject;
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
  subjectId: Scalars['Int'];
  title: Scalars['String'];
  image: Scalars['String'];
  language: Scalars['String'];
  orderNum: Scalars['Int'];
  link: Scalars['String'];
  steps: Array<Maybe<Step>>;
  audiences?: Maybe<Array<Maybe<Audience>>>;
  editions?: Maybe<Array<Maybe<SpecialEdition>>>;
  subject: Subject;
};

export type UploadOutput = {
  __typename?: 'UploadOutput';
  uploadUrl: Scalars['String'];
  path: Scalars['String'];
  exp: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  getDiscoveryList: Array<Maybe<Discovery>>;
  getDiscovery?: Maybe<Discovery>;
  getArticle?: Maybe<Article>;
  getArticleList: Array<Maybe<Article>>;
  getUploadUrl: UploadOutput;
  getSubjectList: Array<Maybe<Subject>>;
  getSubjectListWithContent: Array<Maybe<Subject>>;
};


export type QueryGetDiscoveryArgs = {
  discoveryId: Scalars['Int'];
};


export type QueryGetArticleArgs = {
  articleId: Scalars['Int'];
};


export type QueryGetUploadUrlArgs = {
  folder: Upload_Folder;
};


export type QueryGetSubjectListWithContentArgs = {
  language: Scalars['String'];
};

export enum Upload_Folder {
  Cms = 'CMS',
  Order = 'ORDER'
}

export type Mutation = {
  __typename?: 'Mutation';
  auth: AuthOutput;
  createDiscovery: Discovery;
  updateDiscovery: Discovery;
  deleteDiscovery: Scalars['String'];
  addDiscoveryAudience: Scalars['String'];
  removeDiscoveryAudience: Scalars['String'];
  addDiscoveryEdition: Scalars['String'];
  removeDiscoveryEdition: Scalars['String'];
  createStep: Step;
  deleteStep: Scalars['String'];
  createSummary: Summary;
  updateSummary: Summary;
  deleteSummary: Scalars['String'];
  createArticle: Article;
  updateArticle: Article;
  deleteArticle: Scalars['String'];
  addArticleAudience: Scalars['String'];
  removeArticleAudience: Scalars['String'];
  addArticleEdition: Scalars['String'];
  removeArticleEdition: Scalars['String'];
  deleteS3Object: Scalars['String'];
  createSubject: Subject;
  updateSubject: Subject;
  deleteSubject: Scalars['String'];
  addServiceAudience: Scalars['String'];
  removeServiceAudience: Scalars['String'];
  addServiceEdition: Scalars['String'];
  removeServiceEdition: Scalars['String'];
};


export type MutationAuthArgs = {
  password: Scalars['String'];
  identity: Scalars['String'];
};


export type MutationCreateDiscoveryArgs = {
  discovery: CreateDiscoveryInput;
};


export type MutationUpdateDiscoveryArgs = {
  discovery: UpdateDiscoveryInput;
};


export type MutationDeleteDiscoveryArgs = {
  discoveryId: Scalars['Int'];
};


export type MutationAddDiscoveryAudienceArgs = {
  audience: Audiences;
  discoveryId: Scalars['Int'];
};


export type MutationRemoveDiscoveryAudienceArgs = {
  audience: Audiences;
  discoveryId: Scalars['Int'];
};


export type MutationAddDiscoveryEditionArgs = {
  edition: Edition;
  discoveryId: Scalars['Int'];
};


export type MutationRemoveDiscoveryEditionArgs = {
  edition: Edition;
  discoveryId: Scalars['Int'];
};


export type MutationCreateStepArgs = {
  orderNum: Scalars['Int'];
  discoveryId: Scalars['Int'];
};


export type MutationDeleteStepArgs = {
  stepId: Scalars['Int'];
};


export type MutationCreateSummaryArgs = {
  summary: CreateSummaryInput;
};


export type MutationUpdateSummaryArgs = {
  summary: UpdateSummaryInput;
};


export type MutationDeleteSummaryArgs = {
  summaryId: Scalars['Int'];
};


export type MutationCreateArticleArgs = {
  article: CreateArticleInput;
};


export type MutationUpdateArticleArgs = {
  article: UpdateArticleInput;
};


export type MutationDeleteArticleArgs = {
  articleId: Scalars['Int'];
};


export type MutationAddArticleAudienceArgs = {
  audience: Audiences;
  articleId: Scalars['Int'];
};


export type MutationRemoveArticleAudienceArgs = {
  audience: Audiences;
  articleId: Scalars['Int'];
};


export type MutationAddArticleEditionArgs = {
  edition: Edition;
  articleId: Scalars['Int'];
};


export type MutationRemoveArticleEditionArgs = {
  edition: Edition;
  articleId: Scalars['Int'];
};


export type MutationDeleteS3ObjectArgs = {
  path: Scalars['String'];
};


export type MutationCreateSubjectArgs = {
  subject: CreateSubjectInput;
};


export type MutationUpdateSubjectArgs = {
  subject: UpdateSubjectInput;
};


export type MutationDeleteSubjectArgs = {
  subjectId: Scalars['Int'];
};


export type MutationAddServiceAudienceArgs = {
  audience: Audiences;
  serviceId: Scalars['Int'];
};


export type MutationRemoveServiceAudienceArgs = {
  audience: Audiences;
  serviceId: Scalars['Int'];
};


export type MutationAddServiceEditionArgs = {
  edition: Edition;
  serviceId: Scalars['Int'];
};


export type MutationRemoveServiceEditionArgs = {
  edition: Edition;
  serviceId: Scalars['Int'];
};

export type CreateDiscoveryInput = {
  subjectId: Scalars['Int'];
  title: Scalars['String'];
  image: Scalars['String'];
  language: Scalars['String'];
  orderNum: Scalars['Int'];
  link: Scalars['String'];
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
  id: Scalars['Int'];
  subjectId: Scalars['Int'];
  title: Scalars['String'];
  image: Scalars['String'];
  language: Scalars['String'];
  orderNum: Scalars['Int'];
  link: Scalars['String'];
  audiences: Array<Audiences>;
  editions?: Maybe<Array<Edition>>;
};

export type CreateSummaryInput = {
  stepId: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
  orderNum: Scalars['Float'];
};

export type UpdateSummaryInput = {
  stepId: Scalars['Int'];
  title: Scalars['String'];
  content: Scalars['String'];
  orderNum: Scalars['Float'];
  id: Scalars['Int'];
};

export type CreateArticleInput = {
  subjectId: Scalars['Int'];
  title: Scalars['String'];
  subTitle?: Maybe<Scalars['String']>;
  image: Scalars['String'];
  content: Scalars['String'];
  language: Scalars['String'];
  actualTime: Scalars['Timestamp'];
  audiences: Array<Audiences>;
  editions?: Maybe<Array<Edition>>;
};

export type UpdateArticleInput = {
  id: Scalars['Int'];
  subjectId: Scalars['Int'];
  title: Scalars['String'];
  subTitle?: Maybe<Scalars['String']>;
  image: Scalars['String'];
  content: Scalars['String'];
  language: Scalars['String'];
  actualTime: Scalars['Timestamp'];
  audiences: Array<Audiences>;
  editions?: Maybe<Array<Edition>>;
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
