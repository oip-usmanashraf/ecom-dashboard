import React from 'react'
import VideoUploader from 'src/@core/components/apps/videos/components/VideoUploader'
import { Grid } from '@mui/material'
import Drawer from 'src/@core/components/apps/courses/components/Drawer'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { convertBitData } from 'src/@core/utils/bit-convert'

const Page = () => {
  const { serviceId, isDrawerOpen, handleDrawer } = useToggleDrawer()

  return (
    <>
      <Grid container sx={{ width: '100%' }}>
        <Grid item xs={4} sx={{ padding: 5 }}>
          <VideoUploader
            name='file'
            accept={{ 'video/*': ['.mp4'] }}
            maxFiles={1}
            // maxSize={10000000}
            // maxSize={convertBitData(10000000)}
            maxSize={2000000}
            minSize={1}
            onUpload={file => {
              handleDrawer(null)
            }}
          />
        </Grid>
      </Grid>
      <Drawer open={isDrawerOpen} serviceId={serviceId} toggle={() => handleDrawer(null)} />
    </>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'videos-page'
}

export default Page
