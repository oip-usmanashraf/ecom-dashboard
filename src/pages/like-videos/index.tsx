import { Box, Card, CardContent, CardMedia, Divider, Grid, Skeleton, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useVideo } from 'src/@core/hooks/apps/useVideo'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Link from 'next/link'
import DataNotFound from 'src/@core/components/apps/channels/components/DataNotFound'
import { textOverflow } from 'src/@core/helper/text'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

const Page = () => {
  const { getAllLikedVideos, store } = useVideo(null)

  useEffect(() => {
    getAllLikedVideos()
  }, [])

  return (
    <>
      <Typography variant='h5' mb={5}>
        Like Videos
      </Typography>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        style={{
          background: 'linear-gradient(135.45deg, #363636 11.55%, #000000 101.52%)',
          borderRadius: '10px',
          padding: '20px'
        }}
      >
        {store?.status === 'success' ? (
          !store?.entities?.length ? (
            <DataNotFound />
          ) : (
            store?.entities?.map(videos => {
              return (
                <Grid item xs={12} md={6} lg={4} paddingBottom={'12px'}>
                  <Item>
                    <Box
                      sx={{
                        display: 'flex',
                        maxHeight: '300px',
                        background: 'linear-gradient(135.45deg, #363636 11.55%, #000000 101.52%)',
                        borderRadius: '10px',
                        overflowX: "hidden",
                      }}
                    >
                      <Link href={`/watch/${videos?.id}`}>
                        <CardMedia
                          sx={{
                            objectFit: 'fill'
                          }}
                          component='img'
                          height='194'
                          style={{ width: '150px', cursor: 'pointer' }}
                          image={
                            videos?.thumbnail_url ||
                            'https://i.ytimg.com/vi/iyCAW8svStE/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLCsCd0gsoWQkxqAHNhyBzd-HStfNA'
                          }
                          alt='Image'
                        />
                      </Link>
                      <CardContent>
                        <Link href={`/watch/${videos?.id}`}>
                          <Typography
                            component='p'
                            textAlign={'start'}
                            mb={3}
                            color={'white'}
                            sx={{ cursor: 'pointer' }}
                          >
                            {textOverflow(videos?.title, 22)}
                          </Typography>
                        </Link>
                        <Link href={`/channels/${videos?.channel?.id}`}>
                          <div style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "pre-wrap" }}>
                            <Typography
                              component='p'
                              textAlign={'start'}
                              color={'white'}
                              fontWeight={600}
                              sx={{ cursor: 'pointer', overflowX: "hidden" }}
                            >
                              {textOverflow(videos?.channel?.name, 22)}
                            </Typography>
                          </div>
                        </Link>
                        <Divider />
                        <Box display={'flex'}>
                          <FavoriteIcon color='error' />
                          <Typography component='p' textAlign={'start'} fontSize={'11px'} color={'white'} mt={1} ml={1}>
                            You Liked This Video
                          </Typography>
                        </Box>
                      </CardContent>
                    </Box>
                  </Item>
                </Grid>
              )
            })
          )
        ) : (
          <Skeleton variant='rectangular' width={'100%'} height={'500px'} />
        )}
      </Grid>
    </>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'like-videos-page'
}

export default Page
