import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000"
})

export const setupInterceptors = navigate => {

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {

        if (error.response.data?.message === 'Token inválido') {

          console.log('RECEPTOR -> TOKEN INVALIDO')
          localStorage.removeItem('@Microdigo:token');
          api.defaults.headers.common.Authorization = undefined;

          return navigate('/')
        }
      }

      return Promise.reject(error);
    }
  )
}
