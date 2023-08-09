import * as React from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import LoadingButton from '@mui/lab/LoadingButton'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Third Party Imports
import { useCourses } from 'src/@core/hooks/apps/useCourses'
import { FormProvider } from 'react-hook-form'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

/**steper */
import { ICourses } from 'src/types/apps/courses'
import Step from './Step'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
  serviceId: string | null
}

interface IFile {
  // Define other properties of the file object here
  file?: {
    file?: {
      id: string | any
      // Define other properties of the file here
    }
  }
  fileId?: string | any
  visibility?: string
  startAt?: string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(5, 10),
  justifyContent: 'space-between',
  borderBottom: 1
}))

const StudentDrawer = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle, serviceId } = props

  // ** Hooks
  const { form, addCourse, store, file } = useCourses(null)

  // const methods = useForm()

  const onSubmit = async (data: IFile) => {
    data.fileId = (file as IFile).file?.file?.id
    data.visibility = 'PUBLIC'
    delete data.startAt
    // data.fileId = file?.file?.id
    // data.fileId = file?.file?.file?.id
    // data.visibility = 'PUBLIC'
    // console.log(data, 'Submitted Data')
    await addCourse(data)

    // if (serviceId) {
    //   await updateCourse(serviceId, data)
    // } else {
    //   await addCourse(data)
    // }
  }

  const handleClose = () => {
    form.reset()
    toggle()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: '70%' }, marginX: 10 }}
    >
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Header>
            <Typography variant='h6'>{!serviceId ? 'Add Video' : 'Update Video'}</Typography>
            <Box>
              <LoadingButton
                sx={{ mr: 3 }}
                loading={store.status === 'pending'}
                disabled={store.status === 'pending'}
                loadingPosition='end'
                size='small'
                variant='contained'
                type='submit'
              >
                Save as private
              </LoadingButton>
              <Close fontSize='medium' onClick={handleClose} sx={{ cursor: 'pointer' }} />
            </Box>
          </Header>
          <Step />
        </form>
      </FormProvider>
    </Drawer>
  )
}

export default StudentDrawer
