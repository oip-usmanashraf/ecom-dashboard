import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, MenuItem, Typography } from '@mui/material'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FileUploader, InputField } from 'src/@core/components/form'
import SelectField from 'src/@core/components/form/Select'
import { useUser } from 'src/@core/hooks/apps/useUser'
import { useAuth } from 'src/hooks/useAuth'

const Page = () => {
  const { control, handleSubmit, reset } = useForm()

  const { user, changeCredentials } = useAuth()

  const onSubmit = (body: any) => {
    changeCredentials(body)
  }

  return (
    <>
      <Typography variant='h4' mb={5} mt={5}>
        Change Password
      </Typography>
      <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <InputField
                  type='password'
                  label='Change Password'
                  name='oldPassword'
                  placeholder='Please Enter Your Old Password'
                  control={control}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputField
                  type='password'
                  label='New Password'
                  name='confirmPassword'
                  placeholder='Please Enter Your New Password'
                  control={control}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <InputField
                  type='password'
                  label='Confirm Password'
                  name='newPassword'
                  placeholder='Please Enter Your New Password'
                  control={control}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2
            }}
          >
            <Button color='primary' variant='contained' type='submit'>
              Save details
            </Button>
          </Box>
        </Card>
      </form>
    </>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'change-password-page'
}

export default Page
