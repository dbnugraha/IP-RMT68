import http from "../helpers/http";

/**
 * Login with Google OAuth
 * @returns { message, access_token }
 */
export const googleLogin = async (credential) => {
  const { data } = await http.post("/auth/google-login", { credential });
  return data;
};

/**
 * Login with email and password
 * @returns { message, access_token }
 */
export const login = async (email, password) => {
  const { data } = await http.post("/auth/login", { email, password });
  return data;
};

/**
 * Register a new user
 * @returns { message }
 */
export const register = async (email, password) => {
  const { data } = await http.post("/auth/register", { email, password });
  return data;
};
