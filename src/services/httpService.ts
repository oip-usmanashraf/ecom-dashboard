import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

const instance = axios.create({
  // baseURL: 'http://192.168.0.136:8002/api/v1', // local
  baseURL: 'https://d4af-182-189-125-122.ngrok-free.app/api/v1', // local
  // baseURL: 'http://128.199.151.93/api/v1', // new IP
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
