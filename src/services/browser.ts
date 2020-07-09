export const getFromLocalStorage = (key: string) => {
  // tslint:disable-next-line:strict-type-predicates
  if (typeof localStorage === 'undefined' || localStorage === null) {
    return null;
  }

  const data = localStorage.getItem(key);

  if (data !== null) {
    try {
      return JSON.parse(data);
    } catch (error) {
      // tslint:disable-next-line: no-console
      return data;
    }
  }

  return null;
};

export const saveInLocalStorage = (key: string, value: any) => {
  // tslint:disable-next-line:strict-type-predicates
  if (typeof localStorage === 'undefined' || localStorage === null) {
    return null;
  }

  if (typeof value === 'string') {
    localStorage.setItem(key, value);
  }

  localStorage.setItem(key, JSON.stringify(value));
};

export const removeFromLocalStorage = (key: string) => {
  // tslint:disable-next-line:strict-type-predicates
  if (typeof localStorage === 'undefined' || localStorage === null) {
    return null;
  }

  localStorage.removeItem(key);
};
