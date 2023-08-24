// ** MUI Imports
import Dialog from '@mui/material/Dialog'

// ** Import Custom hooks
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { Box, Typography, Card } from '@mui/material'
import { EmailShareButton, LinkedinShareButton, WhatsappShareButton } from 'react-share'
import Image from 'next/image'
import { useVideo } from 'src/@core/hooks/apps/useVideo'

const Page = ({ title = 'records', onAgree }: { title?: string; onAgree: () => void }) => {
  // ** hooks
  const { isModalOpen, handleModal } = useToggleDrawer()
  const { store } = useVideo(null)
  const handleClose = () => handleModal(null)

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      PaperProps={{
        sx:{
          borderRadius: '15px',
          background: 'linear-gradient(314deg, #101010 3.30%, rgba(20, 20, 20, 0.26) 100%) !important',
          boxShadow: '0px 4px 104px 0px rgba(158, 0, 255, 0.15) inset',
          backdropFilter: 'blur(100px)', 
        }
      }}

    >
      <Typography textAlign={'center'} padding={10}>
        Share With Friends And Family
      </Typography>
      <Box
        display={'flex'}
        marginLeft='auto'
        style={{ marginBottom: 15, justifyContent: 'space-evenly', padding: 20, width: '100%' }}
      >
        <WhatsappShareButton
          style={{ marginRight: '10px' }}
          title={'Hey, check this out'}
          url={
            (store?.entity as any)?.file?.public_source_url
          }
        >
          <Image
            src='/images/icons/project-icons/whatsappIcon.png'
            width={'36.37px'}
            height='36.37px'
            style={{ cursor: 'pointer' }}
            onClick={handleClose}
          />
        </WhatsappShareButton>
        <LinkedinShareButton
          style={{ marginRight: '10px' }}
          title={'Hey, check this out'}
          url={
            (store?.entity as any)?.file?.public_source_url || 'https://i.ytimg.com/vi/bmiQl7FrLLc/maxresdefault.jpg'
          }
        >
          <Image
            src='/images/icons/project-icons/linkedInIcon.png'
            width={'36.37px'}
            height='36.37px'
            style={{ cursor: 'pointer' }}
            onClick={handleClose}
          />
        </LinkedinShareButton>
        <EmailShareButton
          title={'Hey, check this out'}
          url={
            (store?.entity as any)?.file?.public_source_url || 'https://i.ytimg.com/vi/bmiQl7FrLLc/maxresdefault.jpg'
          }
        >
          <Image
            src='/images/icons/project-icons/emailIcon.png'
            width={'36.37px'}
            height='36.37px'
            style={{ cursor: 'pointer' }}
            onClick={handleClose}
          />
        </EmailShareButton>
      </Box>
    </Dialog>
  )
}

export default Page
