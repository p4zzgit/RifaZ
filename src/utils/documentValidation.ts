/**
 * Utility for CPF/CNPJ validation and masking
 */

export const validateCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  
  const digits = cpf.split('').map(Number);
  
  const calculateDigit = (slice: number[], factor: number) => {
    const sum = slice.reduce((acc, digit, idx) => acc + digit * (factor - idx), 0);
    const result = (sum * 10) % 11;
    return result === 10 ? 0 : result;
  };

  const digit1 = calculateDigit(digits.slice(0, 9), 10);
  const digit2 = calculateDigit(digits.slice(0, 10), 11);

  return digit1 === digits[9] && digit2 === digits[10];
};

export const validateCNPJ = (cnpj: string) => {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14 || !!cnpj.match(/(\d)\1{13}/)) return false;

  const calculateDigit = (numbers: string, length: number) => {
    let sum = 0;
    let pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    const result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return result;
  };

  const digits = cnpj.substring(12);
  const digit1 = calculateDigit(cnpj, 12);
  const digit2 = calculateDigit(cnpj, 13);

  return digit1 === parseInt(digits.charAt(0)) && digit2 === parseInt(digits.charAt(1));
};

export const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const maskCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const cleanDocumento = (value: string) => {
  return value.replace(/\D/g, '');
};
