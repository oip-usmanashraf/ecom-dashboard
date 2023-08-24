// ** MUI Imports
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'

// ** Types
import { BlankLayoutProps } from './types'
import Image from 'next/image'

// Styled component for Blank Layout component
const BlankLayoutWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  // height: '100vh',
  padding: '50px 0',
  [theme.breakpoints.down('md')]: {
    // height: '100%'
  },

  // For V1 Blank layout pages
  '& .content-center': {
    display: 'flex',
    // minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(5),
    [theme.breakpoints.down('md')]: {
      // minHeight: '100%'
    }
  },

  // For V2 Blank layout pages
  '& .content-right': {
    display: 'flex',
    // minHeight: '100%',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      // minHeight: '100%'
    }
  }
}))

const BlankLayout = ({ children }: BlankLayoutProps) => {
  return (
    <>
      <Box position='absolute' style={{left:"50px" , top:"50px"}} sx={{md:{display:"none"}, sm:{display:"none"} , xs:{display:"none"}}}>
          <Image src={'/images/ecom-logo.png'} width='135px' height='81px' />
      </Box>
      <BlankLayoutWrapper className='layout-wrapper'>
        <Box className='app-content' sx={{ position: 'relative' }}>
          {children}
        </Box>
      </BlankLayoutWrapper>
    </>
  )
}

export default BlankLayout
