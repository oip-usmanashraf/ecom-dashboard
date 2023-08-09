import { Box, Grid, Typography } from '@mui/material'
import ApexBarChart from './ApexbarChat'

const Page = () => {
  return (
    <Grid item xs={5} padding={5} sx={{ background: 'linear-gradient(135.45deg, #363636 11.55%, #000000 101.52%)', borderRadius: "20px" }}>
      <Box mb={5}>
        <Typography component='p'>Top Categories</Typography>
        <Typography component='p' fontSize={10} color={'#7C7C7C'}>
          In last 15 days buy and sells overview.
        </Typography>
      </Box>
      <Box>
        <ApexBarChart />
      </Box>
    </Grid>
  )
}

export default Page
