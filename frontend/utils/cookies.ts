import Cookies from "js-cookie";

const TOKEN_KEY = "swarnkart_token";

export const getToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  // Corresponds to your backend's JWT_EXPIRY
  Cookies.set(TOKEN_KEY, token, {
    expires: 14,
    secure: process.env.NODE_ENV === "production",
  });
};

export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY);
};
