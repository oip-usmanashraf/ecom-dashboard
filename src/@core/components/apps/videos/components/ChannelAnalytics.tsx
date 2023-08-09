import React from 'react'

/**Mui components */

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { Typography } from '@mui/material'

const ChannelAnalytics = () => {
  return (
    <>
      <Card>
        <Box>
          <Typography
            variant='h5'
            sx={{ color: 'white', paddingLeft: '10px', paddingBottom: '10px', paddingTop: '10px' }}
          >
            Channel Analytics
          </Typography>
          <Typography
            component='p'
            sx={{ color: '#7C7C7C', paddingLeft: '10px', paddingBottom: '10px', paddingTop: '10px' }}
          >
            Current subscribers
          </Typography>
          <Typography
            variant='h4'
            sx={{
              color: 'white',
              paddingLeft: '20px',
              paddingBottom: '20px',
              paddingTop: '10px',
              borderBottom: '1px solid #4D4D4D'
            }}
          >
            0
          </Typography>
        </Box>
        <Box>
          <Typography variant='h6' sx={{ color: 'white', padding: '10px' }}>
            Summary
          </Typography>
          <Typography component='p' sx={{ color: '#7C7C7C', padding: '10px', paddingTop: '0' }}>
            Last 28 days
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography component='p' sx={{ color: '#7C7C7C', padding: '10px' }}>
            Views
          </Typography>
          <Typography component='p' sx={{ color: '#7C7C7C', padding: '10px' }}>
            0-
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #4D4D4D'
          }}
        >
          <Typography component='p' sx={{ color: '#7C7C7C', padding: '10px', paddingTop: '0' }}>
            Watch time (hours)
          </Typography>
          <Typography component='p' sx={{ color: '#7C7C7C', padding: '10px', paddingTop: '0' }}>
            0.0 -
          </Typography>
        </Box>
        <Box sx={{ paddingBottom: '10px' }}>
          <Typography component='h6' sx={{ color: 'white', padding: '10px' }}>
            Top Videos
          </Typography>
          <Typography component='p' sx={{ color: '#7C7C7C', padding: '10px', paddingTop: '0' }}>
            Last 48 hours - Views
          </Typography>
        </Box>
      </Card>
    </>
  )
}
export default ChannelAnalytics
