export const validateForm = (email, password, t) => {
  const errors = {};

  if (!email) {
    errors.email = t("login.validate_email_empty");
  } else if (!/^\S+@\S+\.(com|net|org)$/i.test(email)) {
    errors.email = t("login.validate_email_error");
  } else {
    errors.email = false;
  }

  if (!password) {
    errors.password = t("login.validate_password_empty");
  } else if (password.length < 6) {
    errors.password = t("login.validate_password_error");
  } else {
    errors.password = false;
  }

  return errors;
};
