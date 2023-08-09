import { Box, Grid, Typography } from '@mui/material'
import Image from 'next/image'

const Page = () => {
  return (
    <Grid
      item
      xs={2}
      sm={4}
      md={4}
      sx={{
        background: 'linear-gradient(135.45deg, #363636 11.55%, #000000 101.52%)',
        padding: '10px',
        borderRadius: '3px'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant='h6'>Top Courses</Typography>
        <Typography variant='caption'>View All</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image src='/images/avatars/dummy.png' alt='dummy' height={'29px'} width={'30px'} />
          <Typography variant='caption' sx={{ marginLeft: '10px' }}>
            UI/UX Design with Adobe XD
          </Typography>
        </Box>
        <Box>
          <Typography variant='body1' sx={{ display: 'block', textAlign: 'right', color: 'white' }}>
            $2,125.00
          </Typography>
          <Typography component='p' fontSize={10} color={'#7C7C7C'} textAlign={'right'}>
            25 Sold
          </Typography>
        </Box>
      </Box>
    </Grid>
  )
}

export default Page
