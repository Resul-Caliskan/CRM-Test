import React, { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const Number = () => {
  const [phone, setPhone] = useState('');
  const isValid = isPhoneValid(phone);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      alert(`Submitted phone: ${phone}`);
      // Burada sunucuya telefon numarasını göndermek için gerekli işlemleri yapabilirsiniz
    } else {
      alert('Invalid phone number');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PhoneInput
        defaultCountry="ua"
        value={phone}
        onChange={(phone) => setPhone(phone)}
      />

      {!isValid && <div style={{ color: 'red' }}>Phone is not valid</div>}

      <button disabled={!isValid} type="submit">
      </button>
    </form>
  );
};

export default Number;
