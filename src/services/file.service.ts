import axios, { AxiosResponse } from 'axios'
import requests from './httpService'

const Services = {
  file(body: any): Promise<AxiosResponse<any, any>> {
    return requests.post(`file`, body)
  },
  fileUploadOnCloudinary(formData: any): Promise<AxiosResponse<any, any>> {
    return axios({
      // url: 'http://54.145.247.199/api/v1/file', // live
      url: 'http://128.199.151.93/api/v1/file', // new IP
      // url: `http://192.168.0.136:8002/api/v1/file`, // local
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData
    })
  }
}

export default Services
