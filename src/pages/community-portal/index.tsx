import { Box, Grid, Skeleton } from '@mui/material'
import * as React from 'react'
import { useSelector } from 'react-redux'
import CommunityCard from 'src/@core/components/apps/communityPortal/Card'
import CommunityHeader from 'src/@core/components/apps/communityPortal/CommunityHeader'
import NoFeedFound from 'src/@core/components/apps/communityPortal/NoFeedFound'
import { useCommunityFeed } from 'src/@core/hooks/apps/useCommunityFeed'
import { RootState } from 'src/store'

const Page = () => {
  const { getAllCommunityFeeds } = useCommunityFeed(null)

  React.useEffect(() => {
    getAllCommunityFeeds({ query: '' })
  }, [])

  const store = useSelector((state: RootState) => state?.communityFeed)

  return (
    <>
      <Grid item xs={12} md={12} lg={12} sx={{ width: "100%", minWidth: "60%", maxWidth: "800px", margin: "0 auto" }}>
        <Box display={'block'} margin="0  auto" >
          <CommunityHeader />
        </Box>
        {store.status === 'success' ? (
          !store.entities.length ? (
            <NoFeedFound />
          ) : (
            store?.entities?.map(feeds => {
              return <CommunityCard feeds={feeds} />
            })
          )
        ) : (
          <Box display={'block'} margin="0  auto" borderRadius={20}>
            <Skeleton variant='rectangular' sx={{ height: '30vh', width: "100%" }} />
          </Box>
        )}
      </Grid>
    </>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'community-page'
}

export default Page
