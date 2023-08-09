import requests from 'src/services/httpService'
import { AxiosResponse } from 'axios'

const Services = {
  getAllMonths(): Promise<AxiosResponse> {
    return requests.get(`/auth/student?filter=month`)
  },
  getAllWeeks(): Promise<AxiosResponse> {
    return requests.get(`/auth/student`)
  },
  getAllInstructors(): Promise<AxiosResponse> {
    return requests.get(`auth/teachers`)
  },
  getById(id: string): Promise<AxiosResponse> {
    return requests.get(`auth/users/${id}`)
  },
  add(body: any): Promise<AxiosResponse> {
    return requests.post('auth/user', body)
  },
  update(id: string, body: any): Promise<AxiosResponse> {
    return requests.put(`auth/users/${id}`, body)
  },
  delete(id: string): Promise<AxiosResponse> {
    return requests.delete(`auth/users/${id}`)
  }
}

export default Services
