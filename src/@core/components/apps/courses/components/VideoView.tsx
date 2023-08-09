import React from 'react'

// ** MUI
import { CardContent, CardHeader, CardMedia, Stack, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import Image from 'next/image'
import { IFile } from 'src/types/apps/file'

const VideoView = ({ videoRef, video, width }: { videoRef?: any, video: IFile, width?: string }) => {
  return (
    <Card sx={{ width: width ? width : "360px" }}>
      <CardMedia
        component='video'
        image={video?.file?.public_source_url}
        autoPlay
        width={width ? width : '345px'}
        ref={videoRef}
        height='auto'
        controls
      />
      <CardContent>
        <Typography component='p'>Video Link</Typography>
        <a href={video?.public_source_url} target='_blank'>
          <Typography variant='caption'>{video?.public_source_url || 'Not Found'}</Typography>
        </a>
      </CardContent>
    </Card>
  )
}

export default VideoView
