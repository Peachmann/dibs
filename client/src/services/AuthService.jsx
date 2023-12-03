import { SHA256, enc, HmacSHA256 } from 'crypto-js';

export const loginHandler = (response, setAuth) => {
  if (!validate(response)) {
    return 'Invalid login';
  }
  localStorage.setItem('user', JSON.stringify(response));
  setAuth(true);
};

export const logoutHandler = (setAuth) => {
  localStorage.removeItem('user');
  setAuth(false);
};

const validate = async (data) => {
  const token = import.meta.env.VITE_TELEGRAM_TOKEN;
  const secretKey = SHA256(token).toString(enc.Hex);

  const data_check_string = Object.keys(data)
    .filter((key) => key !== 'hash')
    .map((key) => `${key}=${data[key]}`)
    .sort()
    .join('\n');

  const check_hash = HmacSHA256(data_check_string, secretKey).toString(enc.Hex);

  return check_hash == data.hash;
};
