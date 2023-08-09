import * as React from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import CustomAvatar, { AvatarWithoutImageLink } from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'

// ** Third Party Imports
import { useReview } from 'src/@core/hooks/apps/useReview'

// ** import form support components
import { InputField } from 'src/@core/components/form'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// ** Types Imports
import {
  Avatar,
  CardMedia,
  Chip,
  Divider,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Rating,
  Stack,
  TextareaAutosize,
  TextField
} from '@mui/material'
import { useRouter } from 'next/router'
import { IReview } from 'src/types/apps/review'
import { AvatarWithImageLink } from 'src/@core/components/mui/avatar'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
  serviceId: string | null
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const Footer = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

export const renderClient = (row: IReview) => {
  if (row?.user && row?.user?.profile_picture) {
    return (
      // <AvatarWithImageLink href={`/playlist/${row.id}`}>
      <CustomAvatar src={row?.user?.profile_picture} sx={{ mr: 3, width: 40, height: 40 }} />
      // </AvatarWithImageLink>
    )
  } else {
    return (
      // <AvatarWithoutImageLink href={`/playlist/${row.id}`}>
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(`${row?.user?.first_name} ${row?.user?.last_name}`)}
      </CustomAvatar>
      // </AvatarWithoutImageLink>
    )
  }
}
const ReviewDrawer = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle, serviceId } = props

  const {
    query: { id }
  } = useRouter()

  // ** Hooks
  const {
    form: {
      control,
      reset,
      handleSubmit,
      formState: { errors }
      // setValue
    },
    addReview,
    updateReview,
    store
  } = useReview(serviceId)

  const onSubmit = async (data: any) => {
    if (serviceId) {
      await updateReview(serviceId, data)
    } else {
      await addReview(data)
    }
  }

  const handleClose = () => {
    reset()
    toggle()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: 700 }, background: 'transparent' }}
    >
      <Header>
        <Typography variant='h6'>Reviews</Typography>
        <Close fontSize='small' onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      {store?.reviews?.map((item: any) => {
        return (
          <>
            <Divider sx={{ mt: 0, mb: 1, width: '100%', marginTop: 10 }} />
            <Box sx={{ display: 'flex', p: 7 }}>
              {renderClient(item)}
              <Box marginTop={'2px'}>
                <Typography fontSize={'15px'}>
                  {item?.user?.first_name + ' ' + item?.user?.last_name || 'Not Found'}
                </Typography>
                <Rating name='half-rating-read' defaultValue={item?.reviews} precision={0.5} readOnly />
              </Box>
            </Box>
            <Box display={'flex'} justifyContent={'center'} width={'100%'}>
              <FormControl variant='standard' sx={{ width: '100%', marginX: 7, mb: 5 }}>
                {/* @ts-ignore */}
                <TextareaAutosize
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: '100px',
                    borderRadius: '5px',
                    minHeight: '70px',
                    minWidth: '100%',
                    padding: '10px',
                    maxWidth: '100%',
                    color: '#fff',
                    fontSize: '16px',
                    lineHeight: '1.4',
                    overflowY: 'scroll',
                    width: '100%'
                  }}
                  defaultValue={item?.description}
                  value={item?.description}
                  disabled
                />
              </FormControl>
            </Box>
          </>
        )
      })}
    </Drawer>
  )
}

export default ReviewDrawer
