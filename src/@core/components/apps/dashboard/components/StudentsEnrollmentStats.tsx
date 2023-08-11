import { Box, Card, Grid, Typography } from '@mui/material'
import SouthIcon from '@mui/icons-material/South'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import VerticalBarChart from 'src/@core/components/apps/dashboard/components/VerticalChart'
import WavebarChart from 'src/@core/components/apps/dashboard/components/WavebarChart'
import { useDashboard } from 'src/@core/hooks/apps/useDashboard'
import { useEffect } from 'react'

const Page = () => {
  const { getWeeks, getMonths, weeksData, monthsData } = useDashboard()

  useEffect(() => {
    getWeeks()
    getMonths()
  }, [])

  return (
    <Grid
      item
      xs={6}
      sx={{
        display: 'flex',
        alignItems: 'center',
        // background: 'linear-gradient(135.45deg, #363636 11.55%, #000000 101.52%)',
        flexWrap: 'wrap',
        paddingTop: 5
      }}
    >

      <Grid item xs={6} sx={{ height: 'auto', background: 'linear-gradient(135.45deg, #363636 11.55%, #000000 101.52%)', padding: "20px", borderRadius: "20px" }}>
        <Box paddingLeft={5}>
          <Typography component='p'>Students Enrollment</Typography>
          <Typography component='p' fontSize={10} color={'#7C7C7C'}>
            In last 30 days enrollment of students
          </Typography>
        </Box>
        <Box display={'flex'}>
          <Box display={'flex'}>
            <Box paddingLeft={5}>
              <Typography variant='h5' textAlign={'center'}>
                {monthsData}
              </Typography>
              <Box paddingBottom={5}>
                <Typography component='p' fontSize={10} color={'#7C7C7C'}>
                  This Month
                </Typography>
              </Box>
            </Box>
            <Box paddingBottom={0} display={'flex'} paddingTop={2}>
              <SouthIcon color='error' />
              <Typography color='red'>16.93%</Typography>
            </Box>
          </Box>
          <Box display={'flex'}>
            <Box paddingLeft={5}>
              <Typography variant='h5' textAlign={'center'}>
                {weeksData}
              </Typography>
              <Box paddingBottom={5}>
                <Typography component='p' fontSize={10} color={'#7C7C7C'}>
                  This Week
                </Typography>
              </Box>
            </Box>
            <Box paddingBottom={0} display={'flex'} paddingTop={2}>
              <ArrowUpwardIcon color='success' />
              <Typography color='greenyellow'>4.26%</Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={6} sx={{ height: 'auto', background: 'linear-gradient(135.45deg, #363636 11.55%, #000000 101.52%)', borderRadius: "20px" }}>
        <VerticalBarChart
          yellow={'#FA00FF'}
          labelColor={'transparent'}
          borderColor={'transparent'}
          gridLineColor={'transparent'}
        />
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', height: 'auto', borderRadius: "20px" }}>
        <Grid item xs={6} mt={2} marginRight={2} >
          <Card>
            <Grid item xs={12} mt={2} paddingTop={5}>
              <Box display={'flex'}>
                <Box>
                  <Box paddingLeft={5}>
                    <Typography component='p'>Total Sales</Typography>
                  </Box>
                  <Box paddingLeft={5}>
                    <Typography variant='h6'>$9,495.20</Typography>
                  </Box>
                </Box>
                <Box ml={'auto'} paddingRight={5}>
                  <Box display={'flex'}>
                    <ArrowUpwardIcon color='success' />
                    <Typography color='greenyellow'>4.26%</Typography>
                  </Box>
                  <Box>
                    <Typography component='p' fontSize={10} color={'#7C7C7C'}>
                      vs. last month
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <WavebarChart
                white={'#fff'}
                warning={'#FA00FF'}
                primary={'#FA00FF'}
                success={'greenyellow'}
                labelColor={'transparent'}
                borderColor={'transparent'}
                gridLineColor={'transparent'}
              />
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={6} mt={2}>
          <Card>
            <Grid item xs={12} mt={2} paddingTop={5}>
              <Box display={'flex'}>
                <Box>
                  <Box paddingLeft={5}>
                    <Typography component='p'>This week so far</Typography>
                  </Box>
                  <Box paddingLeft={5}>
                    <Typography variant='h6'>$2,995.81</Typography>
                  </Box>
                </Box>
                <Box ml={'auto'} paddingRight={5}>
                  <Box display={'flex'}>
                    <ArrowUpwardIcon color='success' />
                    <Typography color='greenyellow'>4.26%</Typography>
                  </Box>
                  <Box>
                    <Typography component='p' fontSize={10} color={'#7C7C7C'}>
                      vs. last month
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <WavebarChart
                white={'#fff'}
                warning={'#FA00FF'}
                primary={'#FA00FF'}
                success={'greenyellow'}
                labelColor={'transparent'}
                borderColor={'transparent'}
                gridLineColor={'transparent'}
              />
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Page
