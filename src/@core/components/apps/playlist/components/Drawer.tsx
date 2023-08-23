import * as React from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Third Party Imports
import { usePlaylist } from 'src/@core/hooks/apps/usePlaylist'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import { Grid } from '@mui/material'
import { InputField } from 'src/@core/components/form'
import { VideosMultiSelect } from './VideosMultiSelect'
import FileUploaderRestrictions from 'src/@core/components/form/File/FileUploaderRestrictions'
import { IVideo } from 'src/types/apps/video'
import { useRouter } from 'next/router'
import { CosineWave } from 'mdi-material-ui'
import toast from 'react-hot-toast'

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
  backgroundColor: theme.palette.background.default,
  marginTop: '49%'
}))

const RenderClient = (props: any) => {
  if (props?.errors?.thumnail_url?.message) {
    return (
      <Typography mt={2} fontWeight={'400'} color={'#FF4D49'} fontSize={'0.75rem'}>
        {props?.errors?.thumnail_url?.message}
      </Typography>
    )
  }
  return null
}

const CategoryDrawer = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle, serviceId } = props

  // ** Hooks
  const {
    form: {
      control,
      reset,
      handleSubmit,
      formState: { errors },
      setValue,
      getValues
    },
    addPlaylist,
    updatePlaylist,
    getAllPlaylist,
    store
  } = usePlaylist(serviceId)

  const {
    query: { id }
  } = useRouter()

  const playlistId = typeof id !== 'undefined' ? id.toString() : ''

  const onSubmit = async (data: any) => {
    data.videos = data.videos.map((item: IVideo) => item.id)
    // console.log(first)
    if (data.videos.length > 0) {
      if (serviceId) {
        await updatePlaylist(serviceId, data)
      } else {
        const response = await addPlaylist(data)
        if (response?.payload?.statusCode === '10000') {
          getAllPlaylist(playlistId)
        }
      }
    } else {
      toast.error('Video must be selected')
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
      sx={{ '& .MuiDrawer-paper': { width: 700 } }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Header>
          <Typography variant='h6'>{!serviceId ? 'Add Course' : 'Update Course'}</Typography>
          <Close fontSize='small' onClick={handleClose} sx={{ cursor: 'pointer' }} />
        </Header>
        <Box sx={{ p: 5 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12}>
              <InputField name='name' label='Enter Name' placeholder='Enter Name' control={control} />
            </Grid>
          </Grid>
          <Grid container spacing={4} mt={2}>
            <Grid item xs={12} sm={12}>
              <VideosMultiSelect
                videos={getValues('videos')}
                setVideos={(selectedVideo: any) => {
                  setValue('videos', selectedVideo)
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={4} mt={2}>
            <Grid item xs={12} sm={12}>
              <FileUploaderRestrictions
                name='thumbnail'
                accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
                maxFiles={1}
                maxSize={10000000}
                minSize={1}
                control={control}
              />
              <RenderClient errors={errors} />
            </Grid>
          </Grid>
        </Box>
        <Footer>
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

export default CategoryDrawer
