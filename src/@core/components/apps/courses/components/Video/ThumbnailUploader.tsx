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
  size: number
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
  control: any
}

const ThumbnailUploader = ({
  maxFiles = 1,
  maxSize = 2000000,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] },
  // accept = { 'video/*': ['.mp4'] },
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
      return (
        <img
          style={{
            position: 'static',
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            marginTop: '-1.5rem'
          }}
          // width={'100%'}
          // style={{ minHeight: '100px', maxHeight: '300px', objectFit: 'cover' }}
          alt={file.name}
          src={URL.createObjectURL(file as any)}
          className='fileImg'
        />
      )
    } else {
      return <FileDocumentOutline />
    }
  }

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }

  const fileList = files.map((file: FileProp) => (
    <div key={file.name} style={{ width: '100%' }}>
      {/* <div className='file-details'> */}
      {/*  */}
      {/* <div className='file-preview' 
        style={{ minHeight: '100px', maxHeight: '300px', objectFit: 'revert' }}
        > */}
      {renderFilePreview(file)}
      {/* </div> */}
      <div>
        <Typography className='file-name'>{file.name}</Typography>
        <Typography className='file-size' variant='body2'>
          {Math.round(file.size / 100) / 10 > 1000
            ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
            : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
        </Typography>
      </div>
      {/* </div> */}
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Close fontSize='small' />
      </IconButton>
    </div>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  useEffect(() => {
    handleUpload()
  }, [files])

  // useEffect(
  //   () => () => {
  //     // Make sure to revoke the data uris to avoid memory leaks
  //     files.forEach(file => URL.revokeObjectURL(file))
  //   },
  //   [files]
  // )

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
            // dispatch(Slice.actions.handleSetFile(res?.data?.data))
            onUpload(res?.data?.data)
            toast.success('uploaded!')
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
        <input {...getInputProps()} />
        <Box
          sx={{
            bgcolor: 'transparent',
            display: 'flex',
            flexDirection: 'row',
            height: 200
          }}
        >
          <div
            style={{
              minHeight: '0px',
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            {...getRootProps({ className: 'dropzone' })}
          >
            <Img alt='Upload img' src={'/images/icons/project-icons/thumbnail.png'} sx={{ textAlign: 'center' }} />
            <Typography component='p' sx={{ textAlign: 'center', marginTop: 0, padding: 0 }}>
              {`Upload Thumbnail`}
            </Typography>
          </div>
          {files.length ? (
            <Fragment>
              <List>{fileList}</List>
              {/* 
              <div className='buttons'>
                <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                  Remove All
                </Button>
                <LoadingButton
                  loading={status === 'pending'}
                  disabled={status === 'pending'}
                  loadingPosition='end'
                  size='large'
                  variant='contained'
                  type='button'
                  onClick={handleUpload}
                  sx={{
                    bgcolor: '#B4772C',
                    color: 'white'
                  }}
                >
                  Upload Files
                </LoadingButton>
              </div> */}
            </Fragment>
          ) : null}
        </Box>
        {/* </div> */}
      </Card>
    </DropzoneWrapper>
  )
}

export default ThumbnailUploader
