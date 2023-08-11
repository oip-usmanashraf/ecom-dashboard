// ** MUI Imports
import Dialog from '@mui/material/Dialog'

// ** Import Custom hooks
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { Box, Button, Grid, Typography } from '@mui/material'
import { InputField } from 'src/@core/components/form'
import { useWorkspace } from 'src/@core/hooks/apps/useWorkspace'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

const Page = ({ title = 'records', onAgree, id }: { title?: string; onAgree: () => void; id?: string }) => {
  // ** hooks
  const { isModalOpen, handleModal } = useToggleDrawer()
  const handleClose = () => handleModal(null)

  const { control, handleSubmit, reset } = useForm()

  const { addWorkspaceFolder, getAllWorkspacesFolder } = useWorkspace(null)

  const {
    query: { id: workspaceId }
  } = useRouter()

  const onSubmit = async (body: any) => {
    const { statusCode } = await addWorkspaceFolder(id as string, body)
    if (statusCode === '10000') {
      getAllWorkspacesFolder(workspaceId)
      handleClose()
      reset()
    }
  }

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography textAlign={'center'} padding={10}>
          Create Folder
        </Typography>
        <Box
          display={'flex'}
          marginLeft='auto'
          style={{ marginBottom: 15, justifyContent: 'space-evenly', padding: 20, width: '600px' }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12}>
              <InputField
                name='name'
                label='Enter Name'
                placeholder='Enter Name'
                //  @ts-ignore
                control={control}
              />
            </Grid>
          </Grid>
        </Box>
        <Button
          variant='contained'
          sx={{
            display: 'block',
            margin: 'auto',
            marginBottom: 5,
            color: '#fff',
            background: 'linear-gradient(135deg, #2862AD 0%, #3D1D91 46.88%, #AE20CA 100%)'
          }}
          type='submit'
        >
          Submit
        </Button>
      </form>
    </Dialog>
  )
}

export default Page
