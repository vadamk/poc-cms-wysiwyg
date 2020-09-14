import { Language } from 'core/models';

export enum Audiences {
  NEW_JOB = 'NEW_JOB',
  DEVELOP = 'DEVELOP',
  PROFILE = 'PROFILE',
  GIGGING = 'GIGGING',
  HELP = 'HELP',
  SWEDEN_JOB = 'SWEDEN_JOB',
}

export enum Edition {
  BEGINNER = 'BEGINNER',
  BOSS = 'BOSS',
  GOVERNMENT = 'GOVERNMENT',
}

export enum localStorageKeys {
  sidebarCollapsed = 'false',
  token = 'token',
  articlesView = 'articlesView',
}

export enum UploadFolder {
  CMS = 'CMS',
  ORDER = 'ORDER',
}

type EnvPropTypes = {
  apiUrl: string;
  apiPath: string;
};

export const env: EnvPropTypes = {
  apiUrl: process.env.REACT_APP_API_URL as string,
  apiPath: process.env.REACT_APP_API_PATH as string,
};

export const editionOptions = [
  {
    label: 'Beginner',
    value: Edition.BEGINNER,
  },
  {
    label: 'Boss',
    value: Edition.BOSS,
  },
  {
    label: "Gov't",
    value: Edition.GOVERNMENT,
  },
];

export const langOptions = [
  {
    label: 'Swedish',
    value: Language.SV,
  },
  {
    label: 'English',
    value: Language.EN,
  },
];

export const audienceOptions = [
  {
    label: 'Get a new job',
    value: Audiences.NEW_JOB,
  },
  {
    label: 'Develop within your job',
    value: Audiences.DEVELOP,
  },
  {
    label: 'Profile yourself in the industry',
    value: Audiences.PROFILE,
  },
  {
    label: 'Start gigging',
    value: Audiences.GIGGING,
  },
  {
    label: 'Help! I dont know what I want',
    value: Audiences.HELP,
  },
  {
    label: 'Get a job in Sweden',
    value: Audiences.SWEDEN_JOB,
  },
];
