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
    <>
      <FlexBox>
        <LeftWrapper>
          <Image src={'/images/cards/LoginImage.png'} alt='loginImage' width='300px' height='300px' />
        </LeftWrapper>

        <RightWrapper>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    label='Email'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder='email'
                  />
                )}
              />
              {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                Password
              </InputLabel>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    value={value}
                    onBlur={onBlur}
                    label='Password'
                    onChange={onChange}
                    id='auth-login-v2-password'
                    error={Boolean(errors.password)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: 'error.main' }} id=''>
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
            <Box
              sx={{ mb: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <FormControlLabel
                label='Remember Me'
                control={<Checkbox />}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.primary' } }}
              />
              <Link passHref href='/forgot-password'>
                <Typography component={MuiLink} variant='body2' sx={{ color: 'primary.main' }}>
                  Forgot Password?
                </Typography>
              </Link>
            </Box>

            <LoadingButton
              fullWidth
              sx={{ my: 1 }}
              loading={auth.status === 'pending'}
              disabled={auth.status === 'pending'}
              loadingPosition='end'
              size='large'
              variant='outlined'
              type='submit'
            >
              {auth.status === 'pending' ? 'Logging In' : 'Login'}
            </LoadingButton>

            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography sx={{ mr: 2, color: 'text.secondary' }}>Don't have an account?</Typography>
              <Typography>
                <Link passHref href='/signup'>
                  <Typography component={MuiLink} sx={{ color: 'primary.main' }}>
                    Sign Up
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </form>
        </RightWrapper>
      </FlexBox>
      {/* <Grid container alignItems={'center'} height="75vh" sx={{ justifyContent: "center", alignItems: "center", padding: "20px", borderRadius: "20px" }}>
        <Grid item md={6} xs={12} textAlign='center'>
          <Image src={'/images/cards/LoginImage.png'} alt='loginImage' width='300px' height='300px' />
        </Grid>
        <Grid item md={6} xs={12}>
          <Box sx={{ mb: 10 }}></Box>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    autoFocus
                    label='Email'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder='email'
                  />
                )}
              />
              {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                Password
              </InputLabel>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    value={value}
                    onBlur={onBlur}
                    label='Password'
                    onChange={onChange}
                    id='auth-login-v2-password'
                    error={Boolean(errors.password)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: 'error.main' }} id=''>
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl>
            <Box
              sx={{ mb: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <FormControlLabel
                label='Remember Me'
                control={<Checkbox />}
                sx={{ '& .MuiFormControlLabel-label': { color: 'text.primary' } }}
              />
              <Link passHref href='/forgot-password'>
                <Typography component={MuiLink} variant='body2' sx={{ color: 'primary.main' }}>
                  Forgot Password?
                </Typography>
              </Link>
            </Box>

            <LoadingButton
              fullWidth
              sx={{ my: 1 }}
              loading={auth.status === 'pending'}
              disabled={auth.status === 'pending'}
              loadingPosition='end'
              size='large'
              variant='contained'
              type='submit'
            >
              {auth.status === "pending" ? "Logging In" : "Login"}
            </LoadingButton>

            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography sx={{ mr: 2, color: 'text.secondary' }}>Don't have an account?</Typography>
              <Typography>
                <Link passHref href='/signup'>
                  <Typography component={MuiLink} sx={{ color: 'primary.main' }}>
                    Sign Up
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </form>
        </Grid>
      </Grid>  */}
    </>
  )
}

LoginPage.getLayout = (page: ReactNode) => (
  <BlankLayout>
    <GuestLayout>{page}</GuestLayout>
  </BlankLayout>
)

LoginPage.guestGuard = true

export default LoginPage
