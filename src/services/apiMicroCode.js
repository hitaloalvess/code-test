import axios from "axios";

export const apiMicroCode = axios.create({
  baseURL: import.meta.env.VITE_API_MICRO_CODE
})
