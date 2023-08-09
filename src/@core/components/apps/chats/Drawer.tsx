import * as React from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Third Party Imports
import { useStudents } from 'src/@core/hooks/apps/useStudents'

// ** import form support components
import { InputField, Select } from 'src/@core/components/form'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

// ** Types Imports
import { Grid, MenuItem } from '@mui/material'
import UsersMultiSelect from './UsersMultiSelect'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { conversationStart, fetchChatsContacts } from 'src/store/apps/chat'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit'

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

const ChatDrawer = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle, serviceId } = props
  const { handleDrawer, isDrawerOpen } = useToggleDrawer()

  // ** Hooks
  const { store } = useStudents(serviceId)

  const { handleSubmit, setValue, reset, getValues, control } = useForm()

  const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch()

  const onSubmit = async (data: any) => {
    const result = await dispatch(conversationStart({ name: data?.name, participants: data?.users }))
    const { payload } = result
    if (payload?.statusCode === '10000') {
      dispatch(fetchChatsContacts())
      setValue('users', '')
      handleDrawer(null)
      reset()
    }
    // if (serviceId) {
    //   await updateStudent(serviceId, data)
    // } else {
    //   await addStudent(data)
    // }
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
      sx={{ '& .MuiDrawer-paper': { width: 700 } }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Header>
          <Typography variant='h6'>{!serviceId ? 'Add Participants' : 'Update Participants'}</Typography>
          <Close fontSize='small' onClick={handleClose} sx={{ cursor: 'pointer' }} />
        </Header>
        <Box sx={{ p: 5 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12}>
              <InputField name='name' label='Group Name' placeholder='Enter Group Name' type='text' control={control} />
            </Grid>
            <Grid item xs={12} sm={12}>
              <UsersMultiSelect
                users={getValues('users')}
                setUsers={selectedUser => {
                  setValue(
                    'users',
                    selectedUser?.map(selectedUsers => selectedUsers?.id)
                  )
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Footer sx={{ position: 'absolute', bottom: '0', width: '100%' }}>
          <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            sx={{ mr: 3 }}
            loading={store.status === 'pending'}
            disabled={store.status === 'pending'}
            loadingPosition='end'
            size='large'
            variant='contained'
            type='submit'
          >
            Submit
          </LoadingButton>
        </Footer>
      </form>
    </Drawer>
  )
}

export default ChatDrawer
