import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}
// const baseURL = 'http://127.0.0.1:8000/api';
// const baseURL = 'http://192.168.29.61:8000/api';
const baseURL = 'https://mizomade.pythonanywhere.com/api';

const mediaPath = 'https://mizomade-media-buckets.s3.ap-south-1.amazonaws.com/';

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const api = axios.create({
  // baseURL: 'https://mizomade.pythonanywhere.com/api',
  baseURL: baseURL,
});

// Add an interceptor to check for and attach a token to the request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // You can replace this with your preferred token storage mechanism
  if (token) {
    // config.headers.Authorization = `Authorization ${token}`;
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, mediaPath };
