// ** MUI Imports
import { Theme } from '@mui/material/styles'

const TextField = (theme: Theme) => {
  return {
    MuiFilledInput: {
      styleOverrides: {
        root: {},
        input: {
          paddingBottom: '18px',
          paddingTop: '18px',
          '&.MuiFilledInput-input': {
            color: '#000',
            backgroundColor: '#fff',
            borderRadius:"5px",
          }
        }
      }
    }
  }
}

export default TextField
