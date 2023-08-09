import { IUser } from './user'

export interface IChannels {
  about: string
  createdAt: string
  id: string
  isAgreed: boolean
  isDeleted: boolean
  isPublish: boolean
  isVerified: boolean
  name: string
  email?: string
  title?: string
  first_name?: string
  last_name?: string
  profile_picture?: string
  slug: string
  status: true
  subscribre_count: number
  thumnail_url: string
  updatedAt: Date
  userId: string
  views_count?: string
  time?: string
  avatarColor?: any
  subscriber?: any
  isSubscribed?: boolean
  user?: IUser
}
