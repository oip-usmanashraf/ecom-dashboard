import { Card, Grid } from '@mui/material'
import React, { ReactNode } from 'react'
import { PlayList } from 'src/@core/components/apps/channels/components/Playlist'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'

// ** Component Imports
import TableHeader from 'src/@core/components/apps/playlist/components/TableHeader'
import Drawer from 'src/@core/components/apps/playlist/components/Drawer'
import ChannelLayout from 'src/@core/layouts/ChannelLayout'
import UserLayout from 'src/layouts/UserLayout'
import { ModalType } from 'src/types'
import DeleteAlert from 'src/@core/components/common/deleteAlert'
import { usePlaylist } from 'src/@core/hooks/apps/usePlaylist'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'

const Page = () => {
  const { serviceId, isDrawerOpen, handleDrawer } = useToggleDrawer()
  const { deletePlaylist } = usePlaylist(null)

  const {
    query: { id }
  } = useRouter()
  const {
    user: {
      activeChannel: { channel }
    }
  }: any = useAuth()

  const handleDeleteCourse = () => {
    serviceId && deletePlaylist(serviceId)
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card style={{ marginBottom: 10 }} sx={{ background: 'transparent' }}>
            {id === channel?.id && <TableHeader value={''} handleFilter={() => {}} toggle={() => handleDrawer(null)} />}
          </Card>
        </Grid>
      </Grid>
      <Grid container item rowSpacing={1} columnSpacing={1} width='100%'>
        <Grid display={'flex'} flexWrap={'wrap'} maxWidth={'100%'} width={'100%'}>
          <PlayList />
        </Grid>
      </Grid>
      <Drawer open={isDrawerOpen} serviceId={serviceId} toggle={() => handleDrawer(null)} />
      <DeleteAlert title='Course' type={ModalType.COURSE} onAgree={handleDeleteCourse} />
    </>
  )
}

Page.getLayout = (page: ReactNode) => (
  <UserLayout>
    <ChannelLayout>{page}</ChannelLayout>
  </UserLayout>
)
Page.acl = {
  action: 'itsHaveAccess',
  subject: 'channels-page'
}

export async function getServerSideProps() {
  // Return the fetched data as props
  return {
    props: {}
  }
}

export default Page
