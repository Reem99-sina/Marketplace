import axios from "axios";

export const getUsers = async ({ token }: { token: string }) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const res = await axios.get(`${baseUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// export async function getUserFromCookie() {
//   const res = await  axios.get("/api/auth/login");
// cos
//   return data;
// }