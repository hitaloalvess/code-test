import jwtDecode from "jwt-decode";

export const isTokenValid = (token) => {
  if (!token) return null;

  try {
    const { exp: expiredTime } = jwtDecode(token);
    const currentTime = Date.now() / 1000; //Time in ms

    return expiredTime >= currentTime;
  } catch {
    return false;
  }
}
