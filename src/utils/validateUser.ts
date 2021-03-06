export const validatePassword = (unhashedPassword: string) => {
  // confirm mimimum length, upper and lowercase, number, and special character
  const valid =
    unhashedPassword.length > 8 &&
    unhashedPassword.match(/[!%&@#$^*?_~]/) &&
    unhashedPassword.match(/[A-Z]/) &&
    unhashedPassword.match(/[a-z]/) &&
    unhashedPassword.match(/\d/)

  return !!valid
}

export const validateEmail = (email: string) => {
  // email validation can be expanded based on the company's email structure
  return email.match(/(@company.net)$/)
}
