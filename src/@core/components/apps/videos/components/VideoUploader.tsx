// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Card from '@mui/material/Card'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import FileDocumentOutline from 'mdi-material-ui/FileDocumentOutline'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDropzone, DropzoneOptions } from 'react-dropzone'
import { Slice } from 'src/store/apps/file'

// ** Styled Component
import DropzoneWrapper from 'src/@core/styles/libs/react-dropzone'
import { fileService } from 'src/services'
import { useDispatch } from 'react-redux'

interface FileProp {
  name: string
  type: string
  size: number | string
}

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  // [theme.breakpoints.up('md')]: {
  //   marginRight: theme.spacing(10)
  // },
  // [theme.breakpoints.down('md')]: {
  //   marginBottom: theme.spacing(4)
  // },
  // [theme.breakpoints.down('sm')]: {
  //   width: 250
  // }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

// ** types
interface IFileUploader extends DropzoneOptions {
  name: string
  onUpload: (file: any) => void
}

const VideoUploader = ({
  maxFiles = 1,
  maxSize = 2000000,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
  onUpload,
  ...props
}: IFileUploader) => {
  // ** State
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<'idle' | 'pending' | 'succes' | 'error'>('idle')
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      setFiles([])
    }
  }, [])

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles,
    maxSize,
    accept,
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    },
    onDropRejected: () => {
      toast.error(`You can only upload ${maxFiles} files & maximum size of ${maxSize} MB.`, {
        duration: 2000
      })
    }
  })

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <FileDocumentOutline />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }

  const fileList = files.map((file: FileProp | any) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Close fontSize='small' />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  // useEffect(
  //   () => () => {
  //     Make sure to revoke the data uris to avoid memory leaks
  //     files.forEach((file) => URL.revokeObjectURL(file.preview));
  //   },
  //   [files]
  // );

  const handleUpload = async () => {
    setStatus('pending')
    dispatch(Slice.actions.handleStatus('pending'))
    if (files) {
      files.forEach(file => {
        const formData = new FormData()
        formData.append('file', file)
        fileService
          .fileUploadOnCloudinary(formData)
          .then(res => {
            dispatch(Slice.actions.handleSetFile(res?.data?.data))
            onUpload(res?.data?.data)
            toast.success('uploaded!')
            handleRemoveFile(file)
          })
          .catch(err => toast.error('upload field!'))
          .finally(() => {
            setStatus('idle')
            dispatch(Slice.actions.handleStatus('idle'))
          })
      })
    }
  }

  return (
    <DropzoneWrapper>
      <Card>
        {/* <div {...getRootProps({ className: 'dropzone' })}> */}
        <input {...getInputProps()} />
        <Box
          sx={{
            display: 'block',
            flexDirection: ['column', 'column', 'row'],
            alignItems: 'center',
            bgcolor: 'transparent',
            textAlign: 'center'
          }}
        >
          <div {...getRootProps({ className: 'dropzone' })}>
            <Img width='140px' height='140px' alt='Upload img' src={'/images/misc/upload.png'} />
            <Box sx={{ display: 'block', textAlign: 'center', color: '#7C7C7C', marginTop: '10px' }}>
              <Typography component='p' sx={{ textAlign: 'center' }}>
                Want to see metrics on your recent video? Upload and publish a video to get started.
              </Typography>
              <Typography color='textSecondary'>
                Allowed {accept[Object.keys(accept)[0]].map(acc => '*' + acc + ', ')}
              </Typography>
              <Typography color='textSecondary'>
                Max {maxFiles} files and max size of {maxSize} MB
              </Typography>
            </Box>
          </div>
          {files.length ? (
            <Fragment>
              <List>{fileList}</List>
              <div className='buttons'>
                <Button color='error' variant="outlined" onClick={handleRemoveAllFiles}>
                  Remove All
                </Button>
                <LoadingButton
                  loading={status === 'pending'}
                  disabled={status === 'pending'}
                  loadingPosition='end'
                  size='large'
                  type='button'
                  onClick={handleUpload}
                >
                  Upload Files
                </LoadingButton>
              </div>
            </Fragment>
          ) : null}
        </Box>
        {/* </div> */}
      </Card>
    </DropzoneWrapper>
  )
}

export default VideoUploader
