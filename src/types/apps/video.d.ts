import { IChannels } from './channels'

export interface IVideo {
  [key: string]: any
  name: any
  title: string
  channel: IChannels
  channelId: string
  id?: string
}
