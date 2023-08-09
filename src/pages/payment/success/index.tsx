import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Typography } from '@mui/material'

const Page = () => {
  useEffect(() => {
    toast.success('Payment Success')
  }, [])

  return (
    <>
      <Typography variant='h3' textAlign={'center'}>
        Payment Success
      </Typography>
    </>
  )
}
Page.acl = {
  action: 'itsHaveAccess',
  subject: 'payment-success-page'
}

export default Page
