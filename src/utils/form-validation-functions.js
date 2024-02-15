export const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
  return phoneRegex.test(phoneNumber);
}


export const isValidCPF = (cpf) => {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return cpfRegex.test(cpf);
}

export const formatCPF = (cpf) => cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

export const formatPhone = (phone) => phone.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, '+$1 ($2) $3-$4');

export const applyMask = (typeMask, value) => {
  const masks = {
    cpf: (value) => value.replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'),

    phone: (value) => value.replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{4})$/, '$1-$2'),

    mac: (value) => value.replace(/[^\da-fA-F]/gi, '')
      .replace(/^([\da-fA-F]{2})([\da-fA-F])/, '$1:$2')
      .replace(/([\da-fA-F]{2})([\da-fA-F])/, '$1:$2')
      .replace(/([\da-fA-F]{2})([\da-fA-F])/, '$1:$2')
      .replace(/([\da-fA-F]{2})([\da-fA-F])/, '$1:$2')
      .replace(/([\da-fA-F]{2})([\da-fA-F])/, '$1:$2')
      .slice(0, 17) //12 character limit included ":"
      .toLowerCase()
  }

  const maskSeleted = masks[typeMask];

  return maskSeleted(value);
}

export const removeSpecialCharacters = (text) => text.replace(/[^\w\s]/gi, '')

export const removeSpaces = (text) => text.replace(/\s/g, '');


export const formatInputDateDefaultValue = (date) => {
  return new Date(date).toISOString().split('T')[0];
}
