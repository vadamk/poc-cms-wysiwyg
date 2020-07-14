export enum Language {
  EN = 'en',
  SV = 'sv',
}

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
  ORDER = 'ORDER'
}

type EnvPropTypes = {
  apiUrl: string;
  apiPath: string;
  userAppUrl: string;
};

export const env: EnvPropTypes = {
  apiUrl: process.env.REACT_APP_API_URL as string,
  apiPath: process.env.REACT_APP_API_PATH as string,
  userAppUrl: process.env.REACT_APP_USER_APP_URL as string,
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
    label: 'Government',
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
    label: 'New Job',
    value: Audiences.NEW_JOB,
  },
  {
    label: 'Develop',
    value: Audiences.DEVELOP,
  },
  {
    label: 'Profile',
    value: Audiences.PROFILE,
  },
  {
    label: 'Gigging',
    value: Audiences.GIGGING,
  },
  {
    label: 'Help',
    value: Audiences.HELP,
  },
  {
    label: 'Sweden Job',
    value: Audiences.SWEDEN_JOB,
  },
];
