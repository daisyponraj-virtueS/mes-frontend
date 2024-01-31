import { toast } from 'react-toastify';
import { crudType, permissionsMapper } from './constants';

export const isEmpty = (val: any) => {
  /*
  test results
  --------------
  []        true, empty array
  {}        true, empty object
  null      true
  undefined true
  ""        true, empty string
  ''        true, empty string
  0         false, number
  true      false, boolean
  false     false, boolean
  Date      false
  function  false
  */
  if (val === undefined) return true;

  if (
    typeof val === 'function' ||
    typeof val === 'number' ||
    typeof val === 'boolean' ||
    Object.prototype.toString.call(val) === '[object Date]'
  )
    return false;

  if (val == null || val.length === 0)
    // null or 0 length array
    return true;

  if (typeof val == 'object') if (Object.keys(val).length === 0) return true;

  if (typeof val === 'string') if (val.trim() === '') return true;

  return false;
};

export const getNameInitial = (text: string | null | undefined, singleChar: boolean) => {
  const name = text === '' || text === null || !text ? 'NA' : text.split(' ');
  if (isEmpty(text)) {
    return 'NA';
  }
  const [firstName, lastName] = name;
  if (isEmpty(firstName) && isEmpty(lastName)) {
    return 'NA';
  }
  if (isEmpty(firstName) && !isEmpty(lastName)) {
    return `${lastName[0].toUpperCase()}`;
  }
  if (firstName && lastName) {
    const name = `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
    if (singleChar) return `${firstName[0].toUpperCase()}`;
    return name;
  } else {
    return `${firstName[0].toUpperCase()}`;
  }
};

export const setLocalStorage = (key: string, value: string) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorage = (key: string) => {
  const value: any = window.localStorage.getItem(key);
  return !isEmpty(value) ? JSON.parse(value) : null;
};

export const clearLocalStorage = (key: Array<string>) => {
  key.forEach((item) => window.localStorage.removeItem(item));
};

export const notify = (type: string, message: string) => {
  type === 'success'
    ? toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 10000,
        theme: 'colored',
      })
    : type === 'warning'
      ? toast.warning(message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 10000,
          theme: 'colored',
        })
      : toast.error(message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 10000,
          theme: 'colored',
        });
};

export const preventArrowBehavior = (e: any, data: any) => {
  if (
    e.keyCode === 40 ||
    e.keyCode === 38 ||
    (data.type === 'number' &&
      (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+')) ||
    (data === 'number' && (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+'))
  ) {
    e.preventDefault();
    return;
  }
};

export const debounce = (cb: any, d: any) => {
  let timer: any;
  return function (...args: any) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      cb(...args);
    }, d);
  };
};

export const validatePermissionList = (permissions: any) => {
  for (const category in permissions) {
    const functions = permissions[category];
    for (const func in functions) {
      if (functions[func].view) {
        return true;
      }
    }
  }
  return false;
};

export const validatePermissions = (module: string, subModule: string, type: string) => {
  const userInfo: any = getLocalStorage('userData');
  if (userInfo) {
    const { permission_list: permissions } = userInfo;
    try {
      return permissions[module][subModule][type];
    } catch (error) {
      return false;
    }
  } else {
    console.log('failed to fetch user info.');
  }
};

export const validateElementValues = (elementList: Array<any>) => {
  const errors = elementList.reduce((errorRows, element) => {
    const elementName = Object.keys(element)[0];
    const elementData = element[elementName];
    if (
      elementData.low > elementData.high ||
      elementData.low > elementData.aim ||
      elementData.high < elementData.low ||
      elementData.high < elementData.aim ||
      elementData.aim < elementData.low ||
      elementData.aim > elementData.high
    ) {
      errorRows.push(elementName);
    }
    return errorRows;
  }, [] as string[]);
  return errors;
};

export const getCommaSeparatedRoles = (rolesArr: any) => {
  const roleNames = rolesArr?.map((role: any) => role.role_name);
  const roles: string = roleNames?.join(', ');

  return roles;
};

export const validateLowAimHigh = (
  property: string,
  value: number,
  elementData: any,
  elementName: string
) => {
  let error = '';
  if (property === 'low') {
    if (!(value < elementData.high && value <= elementData.aim))
      error = `${elementName} : Low <= Aim <= High - (Values must be in the range  0 -100)`;
  } else if (property === 'high') {
    if (!(value >= elementData.low && value >= elementData.aim))
      error = `${elementName} : Low <= Aim <= High - (Values must be in the range  0 -100)`;
  } else if (property === 'aim') {
    if (!(value >= elementData.low && value <= elementData.high))
      error = `${elementName} : Low <= Aim <= High - (Values must be in the range  0 -100)`;
  }
  return error;
};

export const isUserFormFilled = (formData: any) => {
  for (const key in formData) {
    if (formData.hasOwnProperty(key)) {
      if (Array.isArray(formData[key]) && formData[key].length === 0) {
        return false;
      } else if (formData[key] === '') {
        return false;
      }
    }
  }
  return true;
};

export const isNumber = (value: number) => !isNaN(Number(value));

export const deepClone = (data: any) => JSON.parse(JSON.stringify(data));

export const getStatusId = (status: Array<string>) => {
  const statusInfo = [
    { id: '1', name: 'Scheduled' },
    { id: '2', name: 'Begin' },
    { id: '3', name: 'Hold' },
    { id: '4', name: 'Completed' },
  ];
  let result = statusInfo.filter((o1) => status.some((o2) => o1.name === o2));
  return result.map((res) => res.id);
};

export const hasErrors = (errorObject: any) => {
  return Object.values(errorObject).some((error) => error !== '');
};

export const getFormattedDate = (date: any) => {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return month + day + year;
};

/**
 * @description Retrieves permissions for a given path.
 * @param path - The path for which permissions are requested.
 * @returns Object containing create, delete, edit, and view permissions.
 */
export const getPermissions = (path: string) => {
  // Split the path using '/' as the delimiter
  const pathParts = path.split('/');

  // Extract the modules & subModules based on their positions
  const module = pathParts[1];
  const subModule = pathParts[2];

  // check different permissions
  const canCreate =
    validatePermissions(permissionsMapper[module], permissionsMapper[subModule], crudType.create) ||
    false;
  const canDelete =
    validatePermissions(permissionsMapper[module], permissionsMapper[subModule], crudType.delete) ||
    false;
  const canEdit =
    validatePermissions(permissionsMapper[module], permissionsMapper[subModule], crudType.edit) ||
    false;
  const canView =
    validatePermissions(permissionsMapper[module], permissionsMapper[subModule], crudType.view) ||
    false;

  // return the permissions
  return { canCreate, canDelete, canEdit, canView };
};

/**
 * @description Formats a number with a dynamic number of decimal places.
 * @param value - The number to be formatted.
 * @param decimalPlaces - The desired number of decimal places.
 * @returns The formatted number as string to maintain trailing zeroes.
 */
export const formatValueOfElements = (value: number, decimalPlaces: number): string => {
  // Round the value to the specified number of decimal places
  const roundedValue = Number(value.toFixed(decimalPlaces));

  // Convert to string to add trailing zeros if necessary
  const formattedString = roundedValue.toFixed(decimalPlaces);

  return formattedString;
};
export const preventExponentialInputInNumber = (evt: any) => {
  ['e', 'E', '+', '-', '.'].includes(evt.key) && evt.preventDefault();
  if (evt.keyCode === 40 || evt.keyCode === 38) {
    evt.preventDefault();
  }
};

export function trimAndEllipsis(str: string, maxLength: number) {
  return str && str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
}
