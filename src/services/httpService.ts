import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import { API_BASE_URL } from 'src/configs/global';

// const API_VERSION = 'v1'
// const DEV_URL = `http://128.199.151.93/api/${API_VERSION}`;
// const LOCAL_URL = `http://localhost:8002/api/${API_VERSION}`;
// const PROD_URL = DEV_URL;
// const baseURL = DEV_URL;

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 500000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor
instance.interceptors.request.use(function (config: any) {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!

  return {
    ...config,
    headers: {
      authorization: storedToken ? `Bearer ${storedToken}` : null
    }
  }
})

// const responseBody = (response: any) => response.data;

// const requests = {
//   get: (url: any, body?: any, headers?: any) => instance.get(url, body).then(responseBody),

//   post: (url: string, body: any) => instance.post(url, body).then(responseBody),

//   put: (url: any, body: any, headers: any) => instance.put(url, body).then(responseBody),

//   patch: (url: any, body: any) => instance.patch(url, body).then(responseBody),

//   delete: (url: any) => instance.delete(url).then(responseBody),
// };

export default instance
