
export const validateForm = (email, password) => {

  const errors = {};

  if (!email) {

    errors.email = 'Email alanı boş bırakılamaz';

  } else if (!/^\S+@\S+\.(com|net|org)$/i.test(email)) {
    errors.email = 'Geçerli bir email girin';
  }
  else{
    errors.email=false;
  }


  if (!password) {

    errors.password = 'Şifre alanı boş bırakılamaz';

  } else if (password.length < 6) {

    errors.password = 'Geçersiz Şifre';

  }
  else{
    errors.password=false;
  }

  return errors;

};