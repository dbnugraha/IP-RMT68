import http from "../helpers/http";

export const googleLogin = async (credential) => {
  const { data } = await http.post("/auth/google-login", { credential });
  return data;
};

export const login = async (email, password) => {
  const { data } = await http.post("/auth/login", { email, password });
  return data;
};

export const register = async (email, password) => {
  const { data } = await http.post("/auth/register", { email, password });
  return data;
};
