import { Box, Button, Chip, Grid, Stack, Typography } from '@mui/material'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import React, { useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import Link from 'next/link'

const Page = () => {
  const {
    user: { referCode }
  }: any = useAuth()

  // const code = `http://54.145.247.199/signup/?key=${referCode}`
  const code = `http://128.199.151.93/signup/?key=${referCode}`

  const [copySuccess, setCopySuccess] = useState(false)

  const copyToClipboard = () => {
    setCopySuccess(true)
    setTimeout(() => {
      setCopySuccess(false)
    }, 1000)
  }

  return (
    <>
      <Typography variant={'h5'} paddingBottom={10} paddingTop={10}>
        Invite Friends
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ background: 'linear-gradient(135.45deg, #363636 11.55%, #000000 101.52%)' }}>
            <Typography variant='h6' paddingTop={15} textAlign='center'>
              Invite your friends and get $6 each
            </Typography>
            <Box width={'650px'} margin='auto' textAlign='center' paddingBottom={15}>
              <Typography component={'p'}>
                Share the code below or ask them to enter it during they signup, Earn when your friends signs up on our
                app
              </Typography>
            </Box>
            <Box sx={{ width: '50%', margin: 'auto', display: 'flex', paddingBottom: 15, justifyContent: "center" }}>
              <Stack direction='row' spacing={1} display='flex' justifyContent={'center'} >
                <Chip label={`http://ecomempire.io/signup/?key=${referCode}`} sx={{ padding: 5 }} />
              </Stack>
              <CopyToClipboard text={code} onCopy={() => copyToClipboard()}>
                <Button
                  variant='contained'
                  sx={{ width: 'auto', color: 'white' }}
                  type='submit'
                  startIcon={<ContentCopyIcon sx={{ color: 'white' }} />}
                >
                  Copy Link
                </Button>
              </CopyToClipboard>
              {copySuccess ? <Typography mt={2}>Copied</Typography> : null}
            </Box>
            <Typography variant='h6' textAlign={'center'} paddingBottom={10}>
              OR
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', paddingBottom: 15 }}>
              <Link href='/invite-friends/share'>
                <Button
                  variant='contained'
                  type='submit'
                >
                  Invite Friends
                </Button>
              </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'invite-friends-page'
}

export default Page
