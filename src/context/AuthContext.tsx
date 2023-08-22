// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

import { AuthServices, CompanyServices, chatService } from 'src/services'

// ** Types
import {
  AuthValuesType,
  RegisterParams,
  LoginParams,
  ErrCallbackType,
  UserDataType,
  ISignupFormValues,
  ICompanyFormValues,
  ChannelParams,
  ResetPasswordParams
} from './types'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { IUser } from 'src/types/apps/user'

const steps = [
  {
    title: 'Create Account',
    subtitle: 'Add Persnol Details'
  },
  {
    title: 'Create Company',
    subtitle: 'Add Company Details'
  },
  {
    title: 'Subscriptions',
    subtitle: 'Pick a plan that works best for you'
  }
]

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
  createAccount: () => Promise.resolve(),
  profileUpdate: () => Promise.resolve(),
  changeCredentials: () => Promise.resolve(),
  createCompany(body, errorCallback?) {},
  // Signup related
  activeStep: 0,
  steps,
  handleBack: () => Promise.resolve(),
  handleNext: () => Promise.resolve(),
  handleReset: () => Promise.resolve(),
  forgotPassword(body) {},
  // forgotPassword: () => Promise.resolve(),

  // API status
  status: 'idle',
  // @ts-ignore
  setStatus: () => ''
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [userTmp, setUserTmp] = useState<UserDataType | null>(defaultProvider.user)
  const [accessTokenTmp, setAccessTokenTmp] = useState<string | null>('')
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [status, setStatus] = useState<AuthValuesType['status']>('idle')
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized)
  const [activeStep, setActiveStep] = useState<number>(defaultProvider.activeStep) // signup step form

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setLoading(true)
      setIsInitialized(true)
      const accessToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      const refreshToken = window.localStorage.getItem(authConfig.refreshTokenKeyName)
      const user = JSON.parse(window.localStorage.getItem('userData') || '{}')
      if (accessToken && refreshToken && user) {
        saveLogin({ accessToken, refreshToken, user })
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    AuthServices.login(params)
      .then(async ({ data: response }) => {
        // console.log('==========Login data================')
        // console.log(response)
        // console.log('====================================')

        saveLogin({
          accessToken: response.data.tokens.accessToken || '',
          refreshToken: response.data.tokens.refreshToken || '',
          user: response.data.user
        })
        router.push('/community-portal')
        setStatus('success')
      })
      .catch(error => {
        setStatus('error')
        if (errorCallback) errorCallback(error.response?.data)
      })
  }

  const handleSwitchChannel = async (params: number, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    AuthServices.channelSwitch(params)
      .then(async ({ data: response }) => {
        saveLogin({
          accessToken: response.data.tokens.accessToken || '',
          refreshToken: response.data.tokens.refreshToken || '',
          user: response.data.user
        })
        router.push(`/channels/${response.data.user.activeChannel.channel.id}`)
        setStatus('success')
      })
      .catch(error => {
        setStatus('error')
        if (errorCallback) errorCallback(error.response?.data)
      })
  }

  const handleLogout = () => {
    setUser(null)
    setIsInitialized(false)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    window.localStorage.removeItem(authConfig.refreshTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params: RegisterParams, query: any, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    AuthServices.signup(params, query)
      .then(async ({ data: response }) => {
        saveLogin({
          accessToken: response.data.tokens.accessToken || '',
          refreshToken: response.data.tokens.refreshToken || '',
          user: response.data.user
        })
        router.push('/channels')
        setStatus('success')
      })
      .catch(error => {
        setStatus('error')
        if (errorCallback) errorCallback(error.response?.data)
      })
  }

  const handleCreateAccount = async (body: ISignupFormValues, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    delete body.confirm_password
    delete body.API_ERROR
    try {
      const { data } = await AuthServices.signup(body)

      setUserTmp(data.data.user)
      setAccessTokenTmp(data.data.tokens.accessToken)

      window.localStorage.setItem(authConfig.storageTokenKeyName, data.data.tokens.accessToken)

      router.push('/community-portal')
      setStatus('success')
      handleNext()
    } catch (error: any) {
      setStatus('error')
      toast.error(error?.response?.data?.message || 'Something went wrong!')
      if (errorCallback) errorCallback(error?.response?.data)
    }
  }

  const changePassword = async (body: any, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    try {
      const { data } = await AuthServices.changePassword(body)
      router.push('/channels')
      setStatus('success')
      handleNext()
    } catch (error: any) {
      setStatus('error')
      toast.error(error?.response?.data?.message || 'Something went wrong!')
      if (errorCallback) errorCallback(error?.response?.data)
    }
  }

  const forgotPassword = async (body: any) => {
    setStatus('pending')
    try {
      const { data } = await AuthServices.forgotPass(body)
      setStatus('success')
      handleNext()
    } catch (error: any) {
      setStatus('error')
      toast.error(error?.response?.data?.message || 'Something went wrong!')
    }
  }

  const handleResetPassword = (params: ResetPasswordParams, token: string, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    AuthServices.resetPassword(params, token)
      .then(async ({ data: response }) => {
        toast.success('Password reset success, Try login Now')
        setStatus('success')
        router.push('/login')
      })
      .catch(error => {
        toast.error(`Something went wrong`)
        setStatus('error')
        if (errorCallback) errorCallback(error.response?.data)
      })
  }

  const handleProfileUpdate = (id: string, body: IUser, errorCallback?: ErrCallbackType) => {
    setStatus('pending')
    AuthServices.profileUpdate(id, body)
      .then(async ({ data: response }) => {
        let data = {
          activeChannel: response?.data?.employees?.activeChannel,
          email: response?.data?.employees?.email,
          firebase_uid: response?.data?.employees?.firebase_uid,
          first_name: response?.data?.employees?.first_name,
          gender: response?.data?.employees?.gender,
          id: response?.data?.employees?.id,
          last_name: response?.data?.employees?.last_name,
          profile_picture: response?.data?.employees?.profile_picture,
          referalCode: response?.data?.employees?.referalCode,
          role: response?.data?.employees?.role
        }
        saveLogin({
          accessToken: localStorage.getItem('accessToken') || '',
          refreshToken: localStorage.getItem('refreshToken') || '',
          user: data
        })
        router.push('/channels')
        setStatus('success')
      })
      .catch(error => {
        setStatus('error')
        if (errorCallback) errorCallback(error.response?.data)
      })
  }

  const handleCreateCompany = async (body: ICompanyFormValues, errorCallback?: ErrCallbackType) => {
    delete body.API_ERROR
    setStatus('pending')
    try {
      const { data } = await CompanyServices.add(body, {
        Authorization: `Bearer ${accessTokenTmp}`
      })
      // console.log('====================================')
      // console.log(accessTokenTmp)
      // console.log(data.data.company)
      // console.log('====================================')

      // saveLogin({
      //   accessToken: accessTokenTmp || "",
      //   refreshToken: accessTokenTmp || "",
      //   user: userTmp
      // })
      setStatus('success')
      handleNext()
    } catch (error: any) {
      setStatus('error')
      toast.error(error?.response?.data?.message || 'Something went wrong!')
      if (errorCallback) errorCallback(error?.response?.data)
    }
  }

  // Handle Stepper Back
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  // Handle Stepper Next
  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    if (activeStep === steps.length - 1) {
      toast.success('Form Submitted')
    }
  }

  // Handle Stepper Reset all process
  const handleReset = () => {
    setActiveStep(0)
  }

  const saveLogin = ({ accessToken, refreshToken, user }: { accessToken: string; refreshToken: string; user: any }) => {
    // save token in localStorage
    window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken)
    window.localStorage.setItem(authConfig.refreshTokenKeyName, refreshToken)

    const returnUrl = router.query.returnUrl

    // console.log('=========returnUrl===========================')
    // console.log(returnUrl)
    // console.log('====================================')

    setUser(user)
    window.localStorage.setItem('userData', JSON.stringify(user))

    const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : router.asPath

    // router.replace(redirectURL as string)
    router.replace(redirectURL as string)
  }

  const values = {
    user,
    loading,
    activeStep,
    steps,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    handleSwitchChannel,
    profileUpdate: handleProfileUpdate,
    logout: handleLogout,
    register: handleRegister,
    createAccount: handleCreateAccount,
    changeCredentials: changePassword,
    createCompany: handleCreateCompany,
    resetPassword: handleResetPassword,
    handleBack,
    handleNext,
    handleReset,
    status,
    forgotPassword,
    setStatus
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
