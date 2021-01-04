export const EmailIsValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const MinPasswordLength = 8

export const PasswordIsValid = (password: string) : true | ErrorMessages => {
  if (password.length < MinPasswordLength) {
    return ErrorMessages.PasswordTooShort;
  }
  var hasUpperCase = /[A-Z]/.test(password);
  var hasLowerCase = /[a-z]/.test(password);
  var hasNumbers = /\d/.test(password);
  var hasSpecialChars = /\W/.test(password);
  
  if(!hasNumbers && !hasSpecialChars){
      return ErrorMessages.PasswordSpecialChars
  }

  if(!hasLowerCase || !hasUpperCase){
      return ErrorMessages.PasswordCases
  }

  return true
};
export enum ErrorMessages {
  EmailValidation = "Invalid email address",
  PasswordTooShort = `Password must be more than 8 characters`,
  PasswordSpecialChars = "Password must contain at least one number or special character",
  PasswordCases = "Password must contain at least 1 lower case and 1 upper case character",
  PasswordsDontMatch = "Passwords must match"
}
