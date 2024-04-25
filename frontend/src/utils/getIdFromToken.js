import { jwtDecode } from "jwt-decode";

export const getIdFromToken = (token) => {
  const id = jwtDecode(token);
  return id.companyId;
};