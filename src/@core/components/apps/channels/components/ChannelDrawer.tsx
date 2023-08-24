import * as React from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Third Party Imports
import { useChannels } from 'src/@core/hooks/apps/useChannels'
import FileUploaderRestrictions from 'src/@core/components/form/File/FileUploaderRestrictions'

// ** import form support components
import { InputField } from 'src/@core/components/form'

// ** Types Imports
import { Grid } from '@mui/material'
import FormCheckbox from 'src/@core/components/form/Checkbox'
import { Close } from 'mdi-material-ui'
import LoadingButton from '@mui/lab/LoadingButton'

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

const RenderClient = (props: any) => {
  if (props?.errors?.thumnail_url?.message) {
    return (
      <Typography mt={2} fontWeight={'400'} color={'#FF4D49'} fontSize={'0.75rem'}>
        {props?.errors?.thumnail_url?.message}
      </Typography>
    )
  }
  return null;
}

const ChannelDrawer = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle, serviceId } = props

  // ** Hooks
  const {
    form: {
      control,
      handleSubmit,
      formState: { errors },
      reset
    },
    addChannel,
    store,
    getAllChannels,
    updateChannelById
  } = useChannels(serviceId)

  const onSubmit = async (body: any) => {
    if (body.isAgreed == undefined) {
      body.isAgreed = false
    }
    if (serviceId) {
      await updateChannelById(serviceId, body)
    } else {
      const { statusCode } = await addChannel(body)
      if (statusCode === '10000') {
        getAllChannels({ query: '' })
      }
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
      sx={{ '& .MuiDrawer-paper': { width: 800 } }}
      PaperProps={{
        sx:{
          borderRadius: '15px',
          background: 'linear-gradient(314deg, #101010 3.30%, rgba(20, 20, 20, 0.26) 100%) !important',
          boxShadow: '0px 4px 104px 0px rgba(158, 0, 255, 0.15) inset',
          backdropFilter: 'blur(100px)', 
        }
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Header>
          <Typography variant='h6'>{!serviceId ? 'Create Channel' : 'Update Channel'}</Typography>
          <Close fontSize='small' onClick={handleClose} sx={{ cursor: 'pointer' }} />
        </Header>
        <Box sx={{ padding: 5 }}>
          <Grid container spacing={10}>
            <Grid item xs={12} sm={12}>
              <InputField name='name' label='Channel Name' placeholder='Enter Name' control={control} />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputField name='slug' label='Channel Slug' placeholder='Enter Slug' control={control} />
            </Grid>
            <Grid item xs={12} sm={12}>
              <InputField
                type='text-area'
                rows={6}
                fullWidth
                name='about'
                label='Channel About'
                placeholder='Enter About'
                control={control}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FileUploaderRestrictions
                name='thumnail_url'
                accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
                maxFiles={1}
                maxSize={10000000}
                minSize={1}
                control={control}
              />
              <RenderClient errors={errors}/>
            </Grid>
          </Grid>
          <Grid container item xs={12} sm={12}>
            <Grid item xs={12} display={'flex'} alignItems='center'>
              <FormCheckbox control={control} name='isAgreed' />
              <Typography
                component={'p'}
                textAlign={'left'}
                lineHeight={1.3}
                fontSize={14}
                sx={{ width: '100%', mt: 5 }}
              >
                <Box component='span' color='#FF8A00'>
                  Term & Conditions
                </Box>{' '}
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                scrambled it to make a type specimen book. It has survived not only five centuries,
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} textAlign={'center'}>
            <LoadingButton
              loading={store.status === 'pending'}
              disabled={store.status === 'pending'}
              sx={{
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 5,
                width: '141px',
                color: '#fff',
                background: 'linear-gradient(135deg, #2862AD 0%, #3D1D91 46.88%, #AE20CA 100%)'
              }}
              type='submit'
            >
              {store.status === 'pending' ? 'Submitting' : 'Submit'}
              {/* {!serviceId ? store.status === "pending" ? 'Create' : 'Update'} */}
            </LoadingButton>
          </Grid>
        </Box>
      </form>
    </Drawer>
  )
}

export default ChannelDrawer
