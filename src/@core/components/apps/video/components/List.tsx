import React, { useEffect } from 'react'

// ** MUI
import Grid from '@mui/material/Grid'

// ** components
import VideoCard from 'src/@core/components/apps/video/components/Card'

// **hooks
import { useVideo } from 'src/@core/hooks/apps/useVideo'
import { Skeleton } from '@mui/material'
import DataNotFound from '../../channels/components/DataNotFound'

interface Props {
  channelId: string
}

const VideosList: React.FC<Props> = ({ channelId }) => {
  const { getAllVideosByChannelId, store } = useVideo(null)

  useEffect(() => {
    getAllVideosByChannelId({ channelId })
  }, [channelId])

  return (
    <Grid container item rowSpacing={10} columnSpacing={5}>
      {store?.status === 'success' ? (
        !store?.entities?.length ? (
          <DataNotFound />
        ) : (
          store?.entities?.map((item, index) => (
            <Grid item xs={12} md={3} sm={6}>
              <VideoCard video={item} key={index} />
            </Grid>
          ))
        )
      ) : (
        <Skeleton variant='rectangular' sx={{ minWidth: '100%', height: '50vh', width: '100%' }} />
      )}
    </Grid>
  )
}

export default VideosList
