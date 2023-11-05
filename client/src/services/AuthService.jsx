import { SHA256, enc, HmacSHA256 } from "crypto-js";

export const loginHandler = (response, navigate) => {
  if (!validate(response)) {
    console.log("Invalid login");
    return "Invalid login";
  }

	localStorage.setItem('user', JSON.stringify(response));
  console.log("Logged in");

  navigate("/");
};

const validate = async (data) => {

  const token = import.meta.env.VITE_TELEGRAM_TOKEN;
  const secretKey = SHA256(token).toString(enc.Hex);

  const data_check_string = Object.keys(data)
    .filter((key) => key !== "hash")
    .map((key) => `${key}=${data[key]}`)
    .sort()
    .join("\n");

  const check_hash = HmacSHA256(data_check_string, secretKey).toString(enc.Hex);

  return check_hash == data.hash;
};

export const isAuthenticated = () => {
	const user = localStorage.getItem('user');
	if (!user) {
		return {}
	}
	return JSON.parse(user);
};