// ** MUI Imports
import { Theme } from '@mui/material/styles'
// ** Theme Type Import
import { Skin } from 'src/@core/layouts/types'

const Modal = (theme: Theme, skin: Skin) => {
  return {
    MuiModal: {
      styleOverrides: {
        root: {
          color: theme.palette.text.primary,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '& .MuiPaper-root': {
            background:
              'linear-gradient(135.45deg, #363636 11.55%, #000000 101.52%), linear-gradient(136.64deg, rgba(255, 255, 255, 0.35) -0.95%, rgba(255, 255, 255, 0.32) 135.8%);'
          }
        }
      }
    }
  }
}

export default Modal
