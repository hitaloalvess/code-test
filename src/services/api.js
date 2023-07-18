import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000"
})

api.interceptors.response.use(
  response => response,
  error => {
    if(error.response?.status === 401){

      if(error.response.data?.message === 'Token inválido'){
        localStorage.removeItem('@Microdigo:token');
        api.defaults.headers.Authorization = undefined;

        window.location.replace('/');
      }
    }

    return Promise.reject(error);
  }
)
