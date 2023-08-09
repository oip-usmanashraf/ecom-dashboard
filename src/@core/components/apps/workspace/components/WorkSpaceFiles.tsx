// ** MUI Imports
import Box from '@mui/material/Box'
import { Card, CardContent, Direction, Divider, Typography, CardActions } from '@mui/material'

// ** Third Party Components
import { useKeenSlider } from 'keen-slider/react'
import { UrlToFileName } from 'src/@core/helper/url-manuplation'
import FileRender from './FileRender'

const SwiperFreeMode = ({ direction, folders: { File } }: { direction: Direction; folders: any }) => {
  // ** Hook
  const [ref] = useKeenSlider<HTMLDivElement>({
    loop: false,
    mode: 'free',
    rtl: direction === 'ltr',
    slides: {
      perView: 3,
      spacing: 0
    },
    breakpoints: {
      '(max-width: 1440px)': {
        loop: false,
        slides: {
          perView: 2
        }
      },
      '(max-width: 991px)': {
        loop: false,
        slides: {
          perView: 1
        }
      }
    }
  })

  return (
    <>
      <Box
        ref={ref}
        className='keen-slider'
        style={{ overflowX: 'hidden' }}
        sx={File?.length > 1 ? { display: 'flex', zIndex: '-1' } : null}
      >
        {File?.map((file: any) => {
          return (
            <>
              <Box className='keen-slider__slide' width={200} marginRight={'10px'}>
                <Card
                  sx={{
                    maxWidth: 345,
                    minWidth: 200,
                    minHeight: '300px',
                    margin: '10px 10px',
                    padding: '0px 10px'
                  }}
                >
                  <CardContent sx={{ p: 1, justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }} >
                      <FileRender file_type={file?.type} />
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ p: 1 }}>
                    <Typography variant='body1'>{UrlToFileName(file?.public_source_url)?.filename}</Typography>
                  </CardActions>
                </Card>
              </Box>
            </>
          )
        })}
      </Box>
    </>
  )
}

export default SwiperFreeMode
