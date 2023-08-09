import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
import CategoriesStats from 'src/@core/components/apps/dashboard/components/CategoriesStats'
import ApexChart from 'src/@core/components/apps/dashboard/components/ApexChart'
import TopInstructors from 'src/@core/components/apps/dashboard/components/TopInstructors'
import TopCourses from 'src/@core/components/apps/dashboard/components/TopCourses'
import SupportRequests from 'src/@core/components/apps/dashboard/components/SupportRequests'
import StudentsEnrollmentStats from 'src/@core/components/apps/dashboard/components/StudentsEnrollmentStats'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import DonutChart from 'src/@core/components/apps/dashboard/components/DonutChart'

const Page = () => {
  return (
    <>
      <Typography variant='h4'>Dashboard</Typography>
      <Typography component='p' color={'#7C7C7C'} mb={5}>
        Welcome To Learning Management Dashboard
      </Typography>
      <Grid container item xs={12} sx={{ justifyContent: "space-between" }}>
        <StudentsEnrollmentStats />
        <CategoriesStats />
        <Box sx={{ flexGrow: 1, mt: 10 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <TopCourses />
            <TopInstructors />
            <SupportRequests />
          </Grid>
        </Box>
        <Grid item xs={8}>
          <Box
            paddingLeft={5}
            sx={{
              background: 'linear-gradient(135.45deg, #363636 11.55%, #000000 101.52%)',
              mt: 5,
              padding: 5
            }}
          >
            <Typography component='p'>Active Students</Typography>
            <Typography component='p' fontSize={10} color={'#7C7C7C'}>
              How do your students visited in the time.
            </Typography>
            <Box display={'flex'} justifyContent={'center'}>
              <Box mt={5} mr={'auto'}>
                <Typography component='p' fontSize={10} color={'#7C7C7C'}>
                  Monthly
                </Typography>
                <Typography component='caption'>9.28K</Typography>
                <Box display={'flex'} paddingLeft={-2}>
                  <ArrowUpwardIcon color='success' />
                  <Typography color='greenyellow'>4.63%</Typography>
                </Box>
              </Box>
              <Box mt={5} justifyContent={'center'} mr={'auto'}>
                <Typography component='p' fontSize={10} color={'#7C7C7C'}>
                  Monthly
                </Typography>
                <Typography component='caption'>9.28K</Typography>
                <Box display={'flex'} paddingLeft={-2}>
                  <ArrowUpwardIcon color='success' />
                  <Typography color='greenyellow'>4.63%</Typography>
                </Box>
              </Box>
              <Box mt={5}>
                <Typography component='p' fontSize={10} color={'#7C7C7C'}>
                  Monthly
                </Typography>
                <Typography component='caption'>9.28K</Typography>
                <Box display={'flex'} paddingLeft={-2}>
                  <ArrowUpwardIcon color='success' />
                  <Typography color='greenyellow'>4.63%</Typography>
                </Box>
              </Box>
            </Box>
            <ApexChart />
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            padding={5}
            sx={{
              background: 'linear-gradient(135.45deg, #363636 11.55%, #000000 101.52%)',
              mt: 5,
              padding: 5
            }}
          >
            <Box display={'flex'}>
              <Typography component='p'>Traffic Sources</Typography>
              <Typography component='p' fontSize={10} color={'#7C7C7C'} ml={'auto'}>
                30 Days
              </Typography>
            </Box>
            <Box display={'flex'} paddingBottom={20}>
              <DonutChart />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'dashboard-page'
}

export default Page
