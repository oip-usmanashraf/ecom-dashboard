import axios, { AxiosResponse } from 'axios'
import requests from './httpService'
import { API_BASE_URL } from 'src/configs/global'

const Services = {
  file(body: any): Promise<AxiosResponse<any, any>> {
    return requests.post(`file`, body)
  },
  fileUploadOnCloudinary(formData: any): Promise<AxiosResponse<any, any>> {
    return axios({
      url: `${API_BASE_URL}/file`, // new IP
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData
    })
  }
}

export default Services
