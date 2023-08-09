import React from 'react'
import VideoUploader from 'src/@core/components/apps/videos/components/VideoUploader'
import ChannelAnalytics from 'src/@core/components/apps/videos/components/ChannelAnalytics'
import { Grid } from '@mui/material'
import TeacherList from 'src/@core/components/apps/videos/components/TeacherList'
import Drawer from 'src/@core/components/apps/channels/components/ChannelDrawer'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { useCourses } from 'src/@core/hooks/apps/useCourses'
import Cards from 'src/@core/components/apps/channels/components/Cards'

const Page = () => {
  return (
    <>
      <h1>Page</h1>
    </>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'playlist-page'
}

export default Page
