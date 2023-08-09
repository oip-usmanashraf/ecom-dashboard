import { Card, Typography, CardContent, Grid, Stack } from '@mui/material'
import Image from 'next/image'
import React from 'react'

const DataNotFound = () => {
  return (
    <>
      <Grid item xs={12} md={3} sm={6}>
        <Card>
          <Image
            src={
              'https://cdn.dribbble.com/userupload/2905383/file/original-4ea237e94e803ddd575a66eb32198899.png?compress=1&resize=400x300&vertical=top'
            }
            width='600px'
            height='400px'
            alt='Video Image'
            objectFit='cover'
          />
          <CardContent sx={{ position: 'relative' }}>
            <Stack direction='row' height='40px' alignItems='center' sx={{ cursor: 'pointer', textAlign: 'center' }}>
              <Typography variant='body1' color='#ffffff' mr='10px' lineHeight='20px'>
                No Records Found
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </>
  )
}

export default DataNotFound
