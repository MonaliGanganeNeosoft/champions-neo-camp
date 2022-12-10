export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const NAME_REGEX = /^[a-zA-Z '.-]+$/
export const MINLENGHT8_REGEX = /^.{8,}$/

export const customErrorMessages = {
  firstName: {
    valueMissing: 'Please enter your first name',
    patternMismatch: 'Invalid characters entered'
  },
  lastName: {
    valueMissing: 'Please enter your last name',
    patternMismatch: 'Invalid characters entered'
  },
  email: {
    valueMissing: 'Please enter email address',
    typeMismatch: 'Invalid email address'
  },
  password: {
    valueMissing: 'Please enter password',
    patternMismatch: 'Password should have a minimum of 8 characters',
  },
  location: {
    valueMissing:'Please enter location',
    patternMismatch: 'Invalid characters entered'
  },
  department: {
    valueMissing: 'Please enter deparment',
    patternMismatch: 'Invalid characters entered'
  }
}