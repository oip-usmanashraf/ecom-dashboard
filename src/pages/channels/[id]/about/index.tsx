import { Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect } from 'react'
import { useChannels } from 'src/@core/hooks/apps/useChannels'
// ** Component Imports
import ChannelLayout from 'src/@core/layouts/ChannelLayout'
import UserLayout from 'src/layouts/UserLayout'

const Page = () => {
  const {
    getChannelsAbout,
    store: {
      entity: { about }
    }
  } = useChannels(null)

  const {
    query: { id }
  } = useRouter()

  useEffect(() => {
    getChannelsAbout(id as any)
  }, [])

  return (
    <>
      <Typography variant='h3'>About</Typography>
      <Typography variant='body1'>{about || 'No About Found'}</Typography>
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
