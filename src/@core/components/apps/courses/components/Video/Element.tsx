// ** React Imports
import { useState, Fragment } from 'react'
import Image from 'next/image'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import Subtitle from 'src/@core/components/apps/courses/components/Subtitle'

const Element = ({ step }: { step: number }) => {
  return (
    <Fragment key={step}>
      {/* <Card>
        <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={2}>
            <Image height={80} width={80} src='/images/icons/figma/mdi_subtitles-outline.png' />
          </Grid>

          <Grid item xs={8}>
            <Typography variant='h6' sx={{ textAlign: 'left' }}>
              Add subtitles
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'left' }}>
              Reach a broader audience by adding subtitles to your video ADD Add an end screen
            </Typography>
          </Grid>

          <Grid item xs={2}>
            <Button>ADD</Button>
          </Grid>
        </Grid>
      </Card> */}

      {/* <Card>
        <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={2}>
            <Image height={80} width={80} src='/images/icons/figma/mdi_subtitles-outline.png' />
          </Grid>

          <Grid item xs={8}>
            <Typography variant='h6' sx={{ textAlign: 'left' }}>
              Add an end screen
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'left' }}>
              Promote related content at the end of your video
            </Typography>
          </Grid>

          <Grid item xs={2}>
            <Button>ADD</Button>
          </Grid>
        </Grid>
      </Card> */}

      <Subtitle />
    </Fragment>
  )
}

export default Element
