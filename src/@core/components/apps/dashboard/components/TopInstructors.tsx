import { Box, Grid, Rating, Typography } from '@mui/material'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { useDashboard } from 'src/@core/hooks/apps/useDashboard'
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
        {getInitials(row?.first_name + ' ' + row?.last_name)}
      </CustomAvatar>
    )
  }
}

const Page = () => {
  const { getAllTopInstructors, topInstructors } = useDashboard()

  useEffect(() => {
    getAllTopInstructors()
  }, [])

  return (
    <Grid
      item
      xs={2}
      sm={4}
      md={4}
      sx={{
        background: 'linear-gradient(135.45deg, #363636 11.55%, #000000 101.52%)',
        padding: '10px',
        borderRadius: '3px',
        maxHeight: '30vh',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant='h6'>Top Instructors</Typography>
        <Typography variant='caption' sx={{ cursor: 'pointer' }}>
          View All
        </Typography>
      </Box>
      {topInstructors?.map((instructors: IChannels) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 5
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {renderClient(instructors)}
              {/* <Image src='/images/avatars/instructor.png' alt='dummy' height={'29px'} width={'30px'} /> */}
              <Box display={'flex'} flexDirection={'column'} marginLeft={'10px'}>
                <Typography variant='caption' color={'#FFF'}>
                  {instructors?.first_name + ' ' + instructors?.last_name || 'No Name Found'}
                </Typography>
                <Typography variant='caption'>{instructors?.email}</Typography>
              </Box>
            </Box>
            <Box>
              <Box sx={{ display: 'block', textAlign: 'right', color: 'white' }}>
                <Rating name='read-only' value={3} readOnly size='small' />
              </Box>
              <Typography component='p' fontSize={10} color={'#7C7C7C'} textAlign={'right'}>
                25 Reviews
              </Typography>
            </Box>
          </Box>
        )
      })}
    </Grid>
  )
}

export default Page
