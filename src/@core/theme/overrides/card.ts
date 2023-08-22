// ** MUI Imports
import { Theme } from '@mui/material/styles'

// ** Theme Type Import
import { Skin } from 'src/@core/layouts/types'

const Card = (theme: Theme, skin: Skin) => {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          // boxShadow: skin !== 'bordered' ? theme.shadows[6] : theme.shadows[0],
          // ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` }),
          // '& .card-more-options': {
          //   marginTop: theme.spacing(-1),
          //   marginRight: theme.spacing(-3)
          // },
          // background: 'red'
          borderRadius: '15px',
          border: '1px solid',
          borderImage:
            'linear-gradient(109.62deg, #FA00FF -17.6%, rgba(209, 0, 255, 0) 10.2%, rgba(195, 0, 255, 0) 67.05%, #9E00FF 103.69%)',
          // borderImageSlice: 1,
          background: 'linear-gradient(314deg, #101010 3.30%, rgba(20, 20, 20, 0.26) 100%)',
          boxShadow: '0px 4px 104px 0px rgba(158, 0, 255, 0.15) inset',
          backdropFilter: 'blur(100px)',  
          // background:
          //   'linear-gradient(135.45deg, #363636 11.55%, #000000 101.52%), linear-gradient(136.64deg, rgba(255, 255, 255, 0.35) -0.95%, rgba(255, 255, 255, 0.32) 135.8%);'
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: theme.spacing(5),
          '& + .MuiCardContent-root, & + .MuiCollapse-root .MuiCardContent-root': {
            paddingTop: 0
          },
          '& .MuiCardHeader-subheader': {
            fontSize: '0.875rem'
          }
        },
        title: {
          lineHeight: 1.6,
          fontWeight: 500,
          fontSize: '1.25rem'
        },
        action: {
          marginTop: 0,
          marginRight: 0
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(5),
          '& + .MuiCardContent-root': {
            paddingTop: 0
          },
          '&:last-of-type': {
            paddingBottom: theme.spacing(5)
          },
          '& + .MuiCardActions-root': {
            paddingTop: 0
          }
        }
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: theme.spacing(5),
          '&.card-action-dense': {
            padding: theme.spacing(0, 2.5, 2.5),
            '.MuiCard-root .MuiCardMedia-root + &': {
              paddingTop: theme.spacing(2.5)
            },
            '.MuiCard-root &:first-of-type': {
              paddingTop: theme.spacing(5),
              paddingBottom: theme.spacing(5),
              '& + .MuiCardContent-root': {
                paddingTop: 0
              },
              '& + .MuiCardHeader-root': {
                paddingTop: 0
              }
            }
          },
          '& .MuiButton-text': {
            paddingLeft: theme.spacing(2.5),
            paddingRight: theme.spacing(2.5)
          }
        }
      }
    }
  }
}

export default Card