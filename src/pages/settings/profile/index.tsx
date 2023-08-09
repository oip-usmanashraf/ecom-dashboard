import React, { useEffect } from 'react'
import { Button, Card, CardContent, CardHeader, Divider, Grid, MenuItem, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { FileUploader, InputField } from 'src/@core/components/form'
import ChangePassword from 'src/@core/components/apps/users/components/ChangePassword'
import { useUser } from 'src/@core/hooks/apps/useUser'
import { useAuth } from 'src/hooks/useAuth'
import SelectField from 'src/@core/components/form/Select'
import { IUser } from 'src/types/apps/user'

const Page = () => {
  const {
    form: { handleSubmit, control, setValue }
  } = useUser(null)

  const { user, profileUpdate }: IUser = useAuth()

  // console.log(user)

  useEffect(() => {
    setValue('first_name', user?.first_name)
    setValue('last_name', user?.last_name)
    setValue('email', user?.email)
  }, [])

  const onSubmit = (body: any) => {
    body.role = user?.role?.code
    profileUpdate(user?.id, body)
  }

  return (
    <>
      <Typography variant='h4' mb={5}>
        Profile Section
      </Typography>
      <Card>
        <FileUploader
          name='profile_picture'
          accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
          maxFiles={1}
          maxSize={10000000}
          minSize={1}
          control={control}
        />
      </Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader='The information can be edited' title='Profile' />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <InputField
                  name='first_name'
                  type='text'
                  label='First Name'
                  placeholder='Please Enter Your First Name'
                  control={control}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputField
                  type='text'
                  label='Last Name'
                  name='last_name'
                  placeholder='Please Enter Your Last Name'
                  control={control}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <InputField
                  type='email'
                  label='Email'
                  name='email'
                  placeholder='Please Enter Your Email'
                  control={control}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <SelectField
                  defaultValue={user?.gender}
                  name='gender'
                  label='Gender'
                  placeholder='Gender'
                  control={control}
                >
                  <MenuItem value='MALE'>MALE</MenuItem>
                  <MenuItem value='FEMALE'>FEMALE</MenuItem>
                </SelectField>
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
      <ChangePassword />
    </>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'settings-profile-page'
}

export default Page
