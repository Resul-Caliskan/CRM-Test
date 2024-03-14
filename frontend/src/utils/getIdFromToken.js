import { jwtDecode } from "jwt-decode";

export const getIdFromToken = (token) => {
  const id = jwtDecode(token);
  console.log("token id:" + id.companyId);
  return id.companyId;
};