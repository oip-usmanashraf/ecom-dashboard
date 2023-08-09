// ** Toolkit imports
import { configureStore, Dispatch } from '@reduxjs/toolkit'

// ** Reducers
import user from 'src/store/apps/user'
import video from 'src/store/apps/video'
import channels from 'src/store/apps/channels'
import teacher from 'src/store/apps/teacher'
import students from 'src/store/apps/students'
import courses from 'src/store/apps/courses'
import file from 'src/store/apps/file'
import playlist from 'src/store/apps/playlist'
import subscription from 'src/store/apps/subscription'
import review from 'src/store/apps/review'
import payment from 'src/store/apps/payment'
import workspace from 'src/store/apps/workspace'
import chat from 'src/store/apps/chat'
import calendar from 'src/store/apps/calendar'
import communityFeed from 'src/store/apps/community-feed'

// import project from './apps/project'

export const store = configureStore({
  reducer: {
    file,
    user,
    video,
    channels,
    teacher,
    students,
    courses,
    playlist,
    subscription,
    review,
    payment,
    workspace,
    chat,
    calendar,
    communityFeed
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export interface Redux {
  getState: any // ReturnType<typeof store.getState>
  dispatch: Dispatch<any>
}
