import { Box, Grid, Typography } from '@mui/material'
import Image from 'next/image'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { textOverflow } from 'src/@core/helper/text'
import { IChannels } from 'src/types/apps/channels'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'


export const renderClient = (row: IChannels) => {
  if (row?.profile_picture) {
    return <CustomAvatar src={row?.profile_picture} sx={{ mr: 3, width: 30, height: 30 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 30, height: 30, fontSize: '1rem' }}
      >
        {getInitials(row?.first_name + " " + row?.last_name)}
      </CustomAvatar>
    )
  }
}

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
        <Typography variant='h6'>Support Requests</Typography>
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
          <CustomAvatar src={'/images/avatars/ellipse.png'} sx={{ mr: 3, width: 30, height: 30 }} />
          {/* <Image src='/images/avatars/ellipse.png' alt='dummy' height={'50px'} width={'50px'} /> */}
          <Box display={'flex'} flexDirection={'column'}>
            <Typography variant='caption' color={'#FFF'} ml={'10px'}>
              Steve Smith
            </Typography>
            <Typography variant='caption' sx={{ marginLeft: '10px' }}>
              {textOverflow('Thanks for contact us with your issues...', 35)}
            </Typography>
            <Typography variant='caption' sx={{ marginLeft: '10px', color: '#FFF' }}>
              6 min ago
            </Typography>
          </Box>
        </Box>
        <Box display={'flex'} marginLeft={'auto'}>
          <TaskAltIcon sx={{ background: '#FFF', color: 'black', borderRadius: '15px' }} />
        </Box>
      </Box>
    </Grid>
  )
}

export default Page
