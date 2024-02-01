import axios from "axios";

export const apiMicrocode = axios.create({
  baseURL: import.meta.env.VITE_API_MICRO_CODE

})

apiMicrocode.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@Microdigo:token');

    if(token){
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

export const setupInterceptorsApiMicroCode = navigate => {

  apiMicrocode.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {

        if (error.response.data?.message === 'Token inválido') {

          localStorage.removeItem('@Microdigo:token');
          apiMicrocode.defaults.headers.common.Authorization = undefined;

          return navigate('/')
        }
      }

      return Promise.reject(error);
    }
  )
}
