export enum localStorageKeys {
  token = 'token',
  account = 'account',
  myAssessments = 'myAssessments',
  currentlyAssessedDoc = 'currentlyAssessedDoc',
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

// TODO: make it dynamic
export const HEADER_HEIGHT = 165;
