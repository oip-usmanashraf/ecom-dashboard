import React from 'react'
import { Grid, Typography, Box } from '@mui/material'
import Image from 'next/image'
import { EmailShareButton, LinkedinShareButton, WhatsappShareButton } from 'react-share'
import { useAuth } from 'src/hooks/useAuth'

const Page = () => {
  const pointerStyle = {
    cursor: 'pointer'
  }

  const {
    user: { referalCode }
  }: any = useAuth()

  // const invitationLink = `http://54.145.247.199/signup/?key=${referalCode}`
  const invitationLink = `http://ecomempire.io/signup/?key=${referalCode}`

  return (
    <>
      <Typography variant={'h5'} paddingBottom={10} paddingTop={10}>
        Invite Friends
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{ background: 'linear-gradient(135.45deg, #363636 11.55%, #000000 101.52%)' }}
            mb={10}
            height={'100%'}
          >
            <Typography variant='h6' paddingTop={15} textAlign='center'>
              Share Refferal Code
            </Typography>
            <Box width={'650px'} margin='auto' textAlign='center' paddingBottom={5}>
              <Typography component={'p'} color='#949494'>
                You can share this code for any social app
              </Typography>
            </Box>
            <Box width={'40%'} bgcolor='#414141' borderRadius={'20px'} margin={'auto'}>
              <Box display={'flex'} padding={5} justifyContent={'space-evenly'}>
                <WhatsappShareButton title={'test'} url={invitationLink}>
                  <Image
                    src='/images/icons/project-icons/whatsappIcon.png'
                    width={'36.37px'}
                    height='36.37px'
                    style={pointerStyle}
                  />
                </WhatsappShareButton>
                <EmailShareButton title={'test'} url={invitationLink}>
                  <Image
                    src='/images/icons/project-icons/emailIcon.png'
                    width={'36.37px'}
                    height='36.37px'
                    style={pointerStyle}
                  />
                </EmailShareButton>
                <LinkedinShareButton title={'test'} url={invitationLink}>
                  <Image
                    src='/images/icons/project-icons/linkedInIcon.png'
                    width={'36.37px'}
                    height='36.37px'
                    style={pointerStyle}
                  />
                </LinkedinShareButton>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'share-invitations-page'
}

export default Page
