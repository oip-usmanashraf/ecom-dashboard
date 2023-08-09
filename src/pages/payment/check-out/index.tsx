import { Box, Divider, Grid, Paper, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useRouter } from 'next/router'
import React from 'react'
import Checkout from 'src/@core/components/Checkout'

const Page = () => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === 'dark' ? 'linear-gradient(135.45deg, #363636 11.55%, #000000 101.52%)' : '#fff',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }))

  const { query: subscription }: any = useRouter()

  return (
    <>
      <Typography variant='h4'>Payment</Typography>
      <Grid container spacing={2}>
        <Grid item xs={7}>
          {/* @ts-ignore */}
          <Checkout subscription={subscription} />
        </Grid>
        <Grid item xs={5}>
          <Item style={{ margin: '20px' }}>
            <Box display={'flex'} justifyContent={'center'}>
              <Grid item xs={12}>
                <Box display={'flex'} justifyContent={'flex-end'}></Box>
                <Typography variant='h6' fontSize={'18px'} fontWeight={'600'} lineHeight={'140%'} m={'2.5rem'}>
                  {subscription?.title}
                </Typography>
                <Typography variant='h6' fontSize={'13px'} fontWeight={'400'} lineHeight={'161%'} margin={'2.5rem'}>
                  {subscription?.description}
                </Typography>
                <Divider sx={{ margin: '2.5rem' }} />
                <Typography variant='h6' fontSize={'18px'} fontWeight={'600'} lineHeight={'140%'} m={'2.5rem'}>
                  <Box component={'span'} color={'#B4782D'} fontSize={'72.132px'}>
                    ${subscription?.price}
                  </Box>
                  /{/* @ts-ignore */}
                  {subscription?.expireYears >= 1
                    ? 'Year'
                    : subscription?.expireMonths >= 1 && subscription?.expireYears <= 1
                    ? 'Month'
                    : 'Days'}
                </Typography>
                <Typography variant='h6' fontSize={'13px'} fontWeight={'400'} lineHeight={'161%'} margin={'2.5rem'}>
                  {subscription?.subTitle}
                </Typography>
                <Divider sx={{ margin: '2.5rem' }} />
                <Typography textAlign={'start'} margin={'2.5rem'} fontSize={'12px'}>
                  <Box component={'span'} color={'#B4782D'}>
                    DISCLAIMER
                  </Box>
                  {` Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s.`}
                </Typography>
              </Grid>
            </Box>
          </Item>
        </Grid>
      </Grid>
    </>
  )
}
Page.acl = {
  action: 'itsHaveAccess',
  subject: 'payment-checkout-page'
}

export default Page
