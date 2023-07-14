export const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+55 \(\d{2}\) \d{5}-\d{4}$/;
  return phoneRegex.test(phoneNumber);
}


export const isValidCPF = (cpf) => {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return cpfRegex.test(cpf);
}

export const applyMask = (typeMask, value) => {
  const masks = {
    cpf: (value) => value.replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'),

    phone: (value) => value.replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '+$1 $2')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{4})$/, '$1-$2')
  }

  const maskSeleted = masks[typeMask];

  return maskSeleted(value);
}
