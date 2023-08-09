import * as React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import { Box, Button, Grid } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { InputField } from '../../form'
import { useCommunityFeed } from 'src/@core/hooks/apps/useCommunityFeed'
import FileUploaderRestrictions from './FileUploaderRestrictions'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { useAuth } from 'src/hooks/useAuth'
import { getInitials } from 'src/@core/utils/get-initials'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { IFile } from 'src/types/apps/file'
import LoadingButton from '@mui/lab/LoadingButton'

const CommunityHeader = () => {
  const {
    form: { control, handleSubmit, setValue },
    store,
    addCommunityFeed
  } = useCommunityFeed(null)

  const { user } = useAuth()

  const [files, setFiles] = React.useState([])

  const file: IFile = useSelector(({ file }: RootState) => file?.file)

  const onSubmit = async (body: any) => {
    let data = {
      content: body.content,
      image: file ? file?.file?.public_source_url : ''
    }
    await addCommunityFeed(data).then(res => {
      if (res?.statusCode === '10000') {
        setFiles([])
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ maxWidth: '100%', m: 2, minWidth: '100%' }}>
        <CardHeader
          avatar={
            user?.profile_picture ? (
              <CustomAvatar src={user?.profile_picture} sx={{ mr: 3, width: 34, height: 34 }} />
            ) : (
              <CustomAvatar skin='light' color={'primary'} sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}>
                {getInitials(user?.first_name + ' ' + user?.last_name || 'UnKnown')}
              </CustomAvatar>
            )
          }
          title={user?.first_name + ' ' + user?.last_name || 'John Doe'}
        />
        <InputField
          variant='outlined'
          type='text-area'
          name='content'
          fullWidth
          multiline
          minRows={5}
          size='small'
          placeholder='Whats On Your Mind...'
          sx={{ pl: 5, pb: 5, pr: 5 }}
          control={control}
        />
        <Grid item xs={12} sm={12}>
          <FileUploaderRestrictions
            accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
            maxFiles={1}
            maxSize={10000000}
            minSize={1}
            name='image'
            files={files}
            setFiles={setFiles}
          />
        </Grid>
        <Box display={'flex'} marginTop={10}>
          <LoadingButton
            disabled={store.status === 'pending'}
            loading={store.status === 'pending'}
            type='submit'
            style={{
              marginLeft: 'auto',
              border: '#636363',
              marginBottom: '10px'
            }}
            aria-label='Share'
            variant='outlined'
            startIcon={<SendIcon />}
          >
            Post
          </LoadingButton>
        </Box>
      </Card>
    </form>
  )
}

export default CommunityHeader
