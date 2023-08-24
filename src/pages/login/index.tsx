// ** React Imports
import { useState, ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'
import Image from 'next/image'
// import LoginImage from '/public/images/cards/LoginImage.png'

// ** MUI Components
import MuiLink from '@mui/material/Link'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Card from '@mui/material/Card'

import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'
import GuestLayout from 'src/@core/layouts/GuestLayout'
import { Grid } from '@mui/material'

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))
const FlexBox = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  // height: '100vh',
  display: 'flex',
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    display: 'block'
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '50%',
  // height: '95vh',
  flex: '0 0 48%',
  maxWidth: '48%',
  borderRadius: '20px',
  [theme.breakpoints.down('md')]: {
    flex: '0 0 100%',
    maxWidth: '100%',
    height: 'auto',
    width: '100%'
  },
  [theme.breakpoints.down('sm')]: {
    flex: '0 0 100%',
    maxWidth: '100%',
    height: 'auto',
    width: '100%'
  },
  [theme.breakpoints.down('xs')]: {
    flex: '0 0 100%',
    maxWidth: '100%',
    height: 'auto',
    width: '100%'
  }
}))

const LeftWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '50%',
  // height: '95vh',
  flex: '0 0 48%',
  maxWidth: '48%',
  borderRadius: '20px',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    flex: '0 0 100%',
    maxWidth: '100%',
    height: 'auto',
    width: '100%'
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none'
  },
  [theme.breakpoints.down('xs')]: {
    display: 'none'
  }
}))

const RoundedCard = styled(Card)(() => ({
  height: '100px',
  width: '100px',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: '-50px',
  zIndex: 5
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required()
})

const defaultValues = {
  password: 'password',
  email: 'admin@smartchain.com'
}

interface FormData {
  email: string
  password: string
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgClasses = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    // @ts-ignore
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    const { email, password } = data
    auth.login({ email, password }, error => {
      setError('password', {
        type: 'manual',
        message: error?.message || 'Invalid credentials!'
      })
      toast.error(error?.message || 'Invalid credentials!')
    })
  }

  return (
    <Grid container display='flex' justifyContent='center' alignItems='center' height='100%'>
      <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
        <Grid container justifyContent='center'>
          <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
            <Box display='flex' justifyContent='center'>
              <RoundedCard>
                <img
                  src='/images/icons/project-icons/lock.png'
                  height='100%'
                  width='100%'
                  style={{ objectFit: 'contain' }}
                />
              </RoundedCard>
            </Box>
            <Card>
              <Grid container display='flex' justifyContent='center'>
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                    <Box display='flex' alignItems='center' flexDirection='column' padding={5}>
                      <Typography variant='h4' fontWeight={900} mt={14}>
                        Sign In
                      </Typography>
                      <FormControl fullWidth sx={{ mb: 12, mt: 12 }}>
                        <Controller
                          name='email'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              autoFocus
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={errors?.email ? !!errors.email : false}
                              placeholder='Email'
                              label='Email'
                              helperText={errors?.email?.message}
                            />
                          )}
                        />
                      </FormControl>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Controller
                          name='password'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              autoFocus
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={errors?.password ? !!errors.password : false}
                              placeholder='Password'
                              label='Password'
                              helperText={errors?.password?.message}
                            />
                          )}
                        />
                      </FormControl>
                      <Box display='flex' justifyContent='flex-start' width='100%' mb={4}>
                        <FormControlLabel
                          label='Remember Me'
                          control={<Checkbox />}
                          sx={{ '& .MuiFormControlLabel-label': { color: 'text.primary' } }}
                        />
                      </Box>
                      <LoadingButton
                        fullWidth
                        sx={{ mt: 3, my: 1, padding: 4 }}
                        loading={auth.status === 'pending'}
                        disabled={auth.status === 'pending'}
                        loadingPosition='end'
                        size='large'
                        // @ts-ignore
                        variant='gradient'
                        type='submit'
                      >
                        <Typography variant='body1' fontWeight={900}>
                          {auth.status === 'pending' ? 'Logging In' : 'Login'}
                        </Typography>
                      </LoadingButton>
                      <Box
                        sx={{
                          mb: 2,
                          mt: 4,
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          width: '100%'
                        }}
                      >
                        <Box display='flex'>
                          <Typography sx={{ mr: 2, color: 'text.secondary' }}>Don't have an account?</Typography>
                          <Typography>
                            <Link passHref href='/signup'>
                              <Typography component={MuiLink} sx={{ color: 'primary.main' }}>
                                Sign Up
                              </Typography>
                            </Link>
                          </Typography>
                        </Box>
                        <Link passHref href='/forgot-password'>
                          <Typography component={MuiLink} variant='body2' sx={{ color: 'primary.main' }}>
                            Forgot Password?
                          </Typography>
                        </Link>
                      </Box>
                    </Box>
                  </form>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

LoginPage.getLayout = (page: ReactNode) => (
  <BlankLayout>
    <GuestLayout>{page}</GuestLayout>
  </BlankLayout>
)

LoginPage.guestGuard = true

export default LoginPage
