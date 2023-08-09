// ** React Imports
import { useState, ChangeEvent, Fragment, useEffect } from 'react'

// ** MUI
import Grid from '@mui/material/Grid'

// ** Custom components
import VideoView from 'src/@core/components/apps/courses/components/VideoView'
import { InputField } from 'src/@core/components/form'

// ** Custom hooks
import { useCourses } from 'src/@core/hooks/apps/useCourses'
import { useFormContext } from 'react-hook-form'
import MultiSelect from '../../../playlist/components/PlaylistMultiSelect'
import { usePlaylist } from 'src/@core/hooks/apps/usePlaylist'
import { Box } from '@mui/system'
import { Paper, Typography, styled } from '@mui/material'
import ThumbnailUploader from './ThumbnailUploader'

const Details = ({ step }: { step: number }) => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    // padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }))

  // ** Hooks
  const { file } = useCourses(null)

  const { control, setValue, getValues } = useFormContext()

  return (
    <Fragment key={step}>
      <Grid container>
        <Grid item xs={7} sx={{ padding: 5 }}>
          <InputField
            name='title'
            label='Title (required)'
            placeholder='final wo music'
            rows={3}
            type='text-area'
            control={control}
          />
          <InputField
            sx={{ marginTop: 5 }}
            name='description'
            label='Description'
            placeholder='Tell viewers about your video'
            type='text-area'
            rows={5}
            control={control}
          />
        </Grid>
        <Grid item xs={5} sx={{ padding: 5 }}>
          <VideoView video={file.file} />
        </Grid>
        <Grid sx={{ padding: 5 }} textAlign={'start'}>
          <Typography variant='h6' fontSize={'19px'}>
            Thumbnail
          </Typography>
          <Typography component={'p'} fontSize={'15px'}>
            Select or upload a picture that shows what's in your video. A good thumbnail stands out and draws viewers'
            attention.{' '}
            <Box component={'span'} color={'#BF6700'}>
              Learn more
            </Box>
          </Typography>
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} paddingBottom={'12px'}>
            <Item>
              <Box sx={{ flexGrow: 1 }}>
                <ThumbnailUploader
                  name='thumbnail_url'
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
                  // accept={{ 'video/*': ['.mp4'] }}
                  maxFiles={1}
                  maxSize={1000000 * 10}
                  minSize={1}
                  control={control}
                  onUpload={e => {
                    getValues('thumbnail_url')
                    setValue('thumbnail_url', e?.file?.private_source_url)
                  }}
                />
              </Box>
            </Item>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default Details
