const isEmpty = value => value === undefined || value === null || value === ''
    , join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0 /* first error */];

export function email(message = 'Invalid email address') {
  return value => {
    if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      return message;
    }
  };
};

export function required(message = 'Required') {
  return value => {
    if (isEmpty(value)) {
      return message;
    }
  };
};

export function isChecked(message = 'Should be selected') {
  return value => {
    if (value !== true) {
      return message;
    }
  };
};

export function notChecked(message = 'Should not be selected') {
  return value => {
    if (value === true) {
      return message;
    }
  };
};

export function minLength(min, message = `Must be at least ${min} characters`) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return message;
    }
  };
}

export function maxLength(max, message = `Must be no more than ${max} characters`) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return message;
    }
  };
};

export function integer(message = 'Must be an integer') {
  return value => {
    if (!Number.isInteger(Number(value))) {
      return message;
    }
  };
}

export function oneOf(enumeration, message = `Must be one of: ${enumeration.join(', ')}`) {
  return value => {
    if (!~enumeration.indexOf(value)) {
      return message;
    }
  };
};

export function shouldMatch(key, name, message = `Should match ${(name || key)}`) {
  return function (value, data) {
    if (data && data[key] !== value) {
      return message;
    }
  };
};

export function createValidator(rules) {
  return (data = {}) => {
    const errors = {};

    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key])) // concat enables both functions and arrays of functions
          , error = rule(data[key], data);
      
      if (error) errors[key] = error;
    });

    return errors;
  };
};