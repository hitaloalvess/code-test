import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
})

export const setupInterceptors = navigate => {

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {

        if (error.response.data?.message === 'Token inválido') {

          localStorage.removeItem('@Microdigo:token');
          localStorage.removeItem('@Microdigo:user');
          api.defaults.headers.common.Authorization = undefined;

          return navigate('/')
        }
      }

      return Promise.reject(error);
    }
  )
}
