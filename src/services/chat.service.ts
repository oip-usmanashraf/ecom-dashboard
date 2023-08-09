import requests from 'src/services/httpService'
import { Axios, AxiosResponse } from 'axios'
// import { GetParams } from 'src/services/service'

const Services = {
  getAll(): Promise<AxiosResponse> {
    console.log('first')
    return requests.get('auth/users/chat')
  },
  startConversation(id: string): Promise<AxiosResponse> {
    return requests.get(`/conversation/message/${id}`)
  },
  conversationStart(body: { participants: string[] }): Promise<AxiosResponse> {
    return requests.post(`/conversation`, body)
  },
  sendMsg(id: string, body: any): Promise<AxiosResponse> {
    return requests.post(`/conversation/message/${id}`, body)
  },
  delete(id: string): Promise<AxiosResponse> {
    return requests.delete(`/conversation/${id}`)
  },
  connection() {
    return 'ws://128.199.151.93'
    // return 'ws://192.168.0.136:8002'
  }
}

export default Services
