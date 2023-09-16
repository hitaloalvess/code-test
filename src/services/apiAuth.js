import axios from "axios";

export const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL
})

export const setupInterceptors = navigate => {

  apiAuth.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {

        if (error.response.data?.message === 'Token inválido') {

          localStorage.removeItem('@Microdigo:token');
          localStorage.removeItem('@Microdigo:user');
          apiAuth.defaults.headers.common.Authorization = undefined;

          return navigate('/')
        }
      }

      return Promise.reject(error);
    }
  )
}
