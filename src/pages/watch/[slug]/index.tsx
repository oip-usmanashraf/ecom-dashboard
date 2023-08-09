import React, { useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Typography,
  CardMedia,
  Stack,
  Button,
  Box,
  Avatar,
  Grid,
  Skeleton,
  BoxProps,
  IconButton,
  IconButtonProps
} from '@mui/material'
import { useVideo } from 'src/@core/hooks/apps/useVideo'
import ThumbUp from '@mui/icons-material/ThumbUp'
import { Share } from 'mdi-material-ui'
import SaveIcon from '@mui/icons-material/Save'
import CheckIcon from '@mui/icons-material/Check'
import { convertToTimestamp } from 'src/@core/helper/convertToTimestamp'
import CommentSection from 'src/@core/components/apps/videos/components/CommentSection'
import ShareVideo from 'src/@core/components/apps/videos/components/VideoShare'
import { useDispatch } from 'react-redux'
import { emptyVideo } from 'src/store/apps/video'
import Link from 'next/link'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import LoadingButton from '@mui/lab/LoadingButton'
import { textOverflow } from 'src/@core/helper/text'
import { IVideo } from 'src/types/apps/video'
import { styled } from '@mui/material/styles'
import LiveIcon from '@mui/icons-material/LiveTv'
import toast from 'react-hot-toast'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { AuthContext } from 'src/context/AuthContext'
import dynamic from 'next/dynamic'
import { add, format, formatDistanceToNow } from 'date-fns'

const LiveVideoSDK = dynamic(() => import('src/@core/components/apps/liveVideoSdk/LiveVideoSDK'), {
  ssr: false // Disable server-side rendering
})

const ThumbnailBox = styled(Box)<BoxProps>(({ theme }) => ({
  cursor: 'pointer',
  position: 'relative'
}))

const IconButtonWrapper = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  position: 'absolute',
  right: 0
}))

const LiveStartAtBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'absolute',
  left: 0,
  padding: '4px 10px',
  background: '#000',
  borderRadius: 5,
  lineHeight: 0,
  margin: '10px',
  width: 'auto'
}))

const Page = () => {
  const ability = useContext(AbilityContext)
  const { user } = useContext(AuthContext)

  const {
    query: { slug }
  } = useRouter()

  const videoRef = useRef(null)

  const { handleDrawer, handleModal } = useToggleDrawer()

  const handleDelete = async () => {
    handleModal(null)
    // handleRowOptionsClose()
  }

  const [flag, setFlag] = useState(false)

  const dispatch = useDispatch()

  const { store, getVideoBySlug, likeVideoById, saveVideoById, startVideoStreaming } = useVideo(null)
  const [video, setVideo] = useState({})

  const [startLive, setStartLive] = useState(false)

  useEffect(() => {
    //@ts-ignore
    getVideoBySlug(slug)
    setVideo(video)
  }, [slug])

  const getLikedByVideoId = (id: string) => {
    likeVideoById(id)
  }

  useEffect(() => {
    if (!store?.entity?.subtitles) return
    if (flag) return
    if (store?.entity?.status !== 'UPLOADED') return
    const VTTFile = makeVTT(store?.entity?.subtitles)
    const vid: any = videoRef.current
    const track: any = document.createElement('track')
    track.kind = 'captions'
    track.label = 'English'
    track.srclang = 'en'
    track.src = URL.createObjectURL(VTTFile)
    vid.addEventListener('loadedmetadata', (evt: any) => {
      track.mode = 'showing'
      vid.textTracks[0].mode = 'showing' // thanks Firefox
    })
    vid.append(track)
    function makeVTT(array: any) {
      setFlag(true)

      const text: any = array?.reduce((str: any, { start, end, text }: any, index: number) => {
        // you would also have to make a "seconds to timestamp" parser
        // but I leave it to the reader as an exercise

        const formatedTimeStamp = convertToTimestamp(start, end)

        // 00:00:10.500 --> 00:00:13.000

        return (
          str +
          `
        ${formatedTimeStamp}
        ${text}`
        )
      }, `WEBVTT`)

      return new Blob([text], { type: 'text/plain' })
    }

    return () => {
      //@ts-ignore
      vid.removeEventListener('loadedmetadata', evt => {
        track.mode = 'showing'
        vid.textTracks[0].mode = 'showing' // thanks Firefox
      })
    }
  }, [store?.entity])

  useEffect(() => {
    return () => {
      dispatch(emptyVideo())
    }
  }, [])

  const onSave = (id: string) => {
    saveVideoById(id)
  }

  const renderMediaPlayer = (video: IVideo) => {
    console.log('renderMediaPlayer', video)
    if (video.status === 'UPLOADED') {
      return (
        <CardMedia
          component='video'
          image={video?.file?.public_source_url}
          autoPlay
          ref={videoRef}
          width='100%'
          height='250px'
          controls
          style={{ boxShadow: 'rgb(255 255 255 / 10%) 0px 30px 30px' }}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 0,
            borderRadius: 1,
            p: 0,
            minWidth: '30%',
            minHeight: 500,
            gap: 2,
            mt: 4,
            objectFit: 'cover'
          }}
        />
      )
    } else if (video.status === 'WAITING_FOR_LIVE') {
      return (
        <ThumbnailBox>
          <IconButtonWrapper color='error'>
            <LiveIcon />
          </IconButtonWrapper>
          <LiveStartAtBox>
            <Typography variant='caption'>
              Live In
              <Box component={'span'}> {format(add(new Date(video.startAt), { days: 7 }), 'MMMM dd, yyyy')}</Box>
              <Box component={'br'} />
              <Box component={'span'}> {format(add(new Date(video.startAt), { days: 7 }), 'p (zzzz)')}</Box>
            </Typography>
          </LiveStartAtBox>
          <CardMedia
            component='img'
            image={video?.thumbnail_url}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 0,
              borderRadius: 1,
              p: 0,
              minWidth: '30%',
              minHeight: 200,
              maxHeight: 500,
              gap: 2,
              mt: 4,
              objectFit: 'cover'
            }}
          />
        </ThumbnailBox>
      )
    } else if (video.status === 'IS_LIVED') {
      return <LiveVideoSDK roomId={video.roomId} video={video} />
    } else {
      return <Typography>Video Not Found</Typography>
    }
  }

  const startStreaming = async (video: any) => {
    await startVideoStreaming(video.id)
  }

  return (
    <>
      <Box sx={{ width: '100% ', overflow: 'hidden' }}>
        {/* height='250px' */}
        {/* {store.status === 'pending' ? (
          <Skeleton width={'100%'} height={250} />
        ) : renderMediaPlayer(store?.entity)} */}

        {/* <LiveVideoSDK setStartLive={setStartLive} /> */}
        {/* <LiveVideoSDK setStartLive={setStartLive} /> */}

        {/* {
                  startLive ? (
                    null
                  ) : ( */}
        {/* {
          store?.entity?.status === 'UPLOADED' ? (
            <CardMedia
              component='video'
              image={store?.entity?.file?.public_source_url}
              autoPlay
              ref={videoRef}
              width='100%'
              height='250px'
              controls
              style={{ boxShadow: 'rgb(255 255 255 / 10%) 0px 30px 30px' }}
              sx={{
                bgcolor: 'background.paper',
                boxShadow: 0,
                borderRadius: 1,
                p: 0,
                minWidth: '30%',
                minHeight: 500,
                gap: 2,
                mt: 4,
                objectFit: 'cover'
              }}
            />
          ) : (
            <ThumbnailBox>
                <CardMedia
                  component='img'
                  image={store?.entity?.thumbnail_url}
                  sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 0,
                    borderRadius: 1,
                    p: 0,
                    minWidth: '30%',
                    minHeight: 200,
                    maxHeight: 500,
                    gap: 2,
                    mt: 4,
                    objectFit: 'cover'
                  }}
                />
            </ThumbnailBox>
          )
        } */}
        {store.status === 'pending' ? (
          <Skeleton width={'100%'} height={600} />
        ) : (
          <>
            {/* @ts-ignore */}
            {renderMediaPlayer(store?.entity)}
            {/* @ts-ignore */}
            <Typography variant='h5' mb={5} mt={10}>
              {/* @ts-ignore */}
              {store?.entity?.title || 'Not Found'}
            </Typography>
            <Grid md={12} xs={12}>
              <Stack direction='row' spacing={10} mt={3} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Grid md={6} xs={12} sm={12}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {/* @ts-ignore */}
                    <Link href={`/channels/${store?.entity?.channel?.id}`}>
                      <Avatar
                        src={store?.entity?.thumbnail_url || '/images/avatars/Group.png'}
                        sx={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50px',
                          cursor: 'pointer'
                        }}
                      />
                    </Link>
                    <Stack direction='column' sx={{ marginLeft: '20px' }}>
                      <Typography variant='h4' margin={0} mt={2}></Typography>
                      <Box display={'flex'} m={'auto'} flexWrap={'wrap'}>
                        <Box display={'flex'} flexDirection={'column'} flexWrap={'wrap'}>
                          <Typography variant='body1'>
                            {store?.entity &&
                              'channel' in store?.entity &&
                              'name' in (store?.entity.channel as { name: string }) &&
                              (textOverflow((store?.entity.channel as { name: string }).name, 22) || 'John Doe')}
                            <CheckIcon
                              sx={{
                                mt: '19px',
                                width: '12px',
                                height: '12px',
                                background: '#00A3FF',
                                ml: 2,
                                borderRadius: '50%'
                              }}
                            />
                          </Typography>
                          <Typography variant='body1'>
                            {store?.entity &&
                              'channel' in store?.entity &&
                              (store?.entity?.channel?.subscribre_count > 1
                                ? store?.entity?.channel?.subscribre_count + ' Subscribers'
                                : store?.entity?.channel?.subscribre_count + ' Subscriber')}
                          </Typography>
                        </Box>
                        <Typography variant='body1' marginTop={3} ml='20px'>
                          {/* @ts-ignore */}
                          {store?.entity?.createdAt
                            ? //@ts-ignore
                              formatDistanceToNow(new Date(store?.entity?.createdAt), { addSuffix: true })
                            : null}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
                <Grid md={6} xs={12} sm={12}>
                  <Box display={'flex'} marginLeft={'auto'} flexWrap={'wrap'}>
                    {/* @ts-ignore */}
                    {/* {(ability.can('itsHaveAccess', 'START_STREAMING_BUTTON') && store?.entity?.channelId === user.activeChannel?.channel.id) ? (
                        <LoadingButton
                          loadingPosition='end'
                          variant='outlined'
                          sx={{ marginRight: '20px', marginBottom: '10px' }}
                          startIcon={<LiveIcon style={{ backgroundColor: 'transparent' }} />}
                          onClick={() => startStreaming(store.entity)}
                        >
                          Start Streaming
                        </LoadingButton>
                      ) : (
                        <LoadingButton
                          loadingPosition='end'
                          variant='outlined'
                          sx={{ marginRight: '20px', marginBottom: '10px' }}
                          startIcon={<LiveIcon style={{ backgroundColor: 'transparent' }} />}
                          onClick={() => startStreaming(store.entity)}
                        >
                          End Streaming
                        </LoadingButton>
                      )} */}
                    {ability.can('itsHaveAccess', 'START_STREAMING_BUTTON') &&
                    store?.entity?.channelId === user?.activeChannel?.channel.id ? (
                      <>
                        {store?.entity?.status === 'WAITING_FOR_LIVE' ? (
                          <LoadingButton
                            loadingPosition='end'
                            variant='outlined'
                            sx={{ marginRight: '20px', marginBottom: '10px' }}
                            startIcon={<LiveIcon style={{ backgroundColor: 'transparent' }} />}
                            onClick={() => startStreaming(store.entity)}
                          >
                            Start Streaming
                          </LoadingButton>
                        ) : store?.entity?.status === 'IS_LIVED' ? (
                          <LoadingButton
                            loadingPosition='end'
                            variant='contained'
                            color='error'
                            sx={{ marginRight: '20px', marginBottom: '10px' }}
                            startIcon={<LiveIcon style={{ backgroundColor: 'transparent' }} />}
                            onClick={() => toast.error('End in progress')}
                          >
                            End Streaming
                          </LoadingButton>
                        ) : null}
                      </>
                    ) : null}
                    <LoadingButton
                      // loading={store.status === 'pending'}
                      // disabled={store.status === 'pending'}
                      loadingPosition='end'
                      style={{
                        background: '#636363',
                        border: '#636363',
                        borderRadius: '90px',
                        marginRight: '20px',
                        marginBottom: '10px',
                        width: '150px'
                      }}
                      sx={
                        store?.entity?.isLiked
                          ? { background: 'linear-gradient(360deg, #EFD9AE -73.58%, #B4772C 97.53%)', color: 'black' }
                          : { color: '#fff', background: 'white' }
                      }
                      aria-label='Like'
                      variant='outlined'
                      startIcon={<ThumbUp style={{ backgroundColor: 'transparent' }} />}
                      //  @ts-ignore
                      onClick={() => getLikedByVideoId(store?.entity && 'id' in store?.entity && store?.entity?.id)}
                    >
                      {store?.entity && 'isLiked' in store?.entity && (store?.entity?.isLiked ? 'Liked' : 'Like')}
                      <Box component={'span'} ml={2}>
                        {/* @ts-ignore  */}
                        {store?.entity && 'likes_count' in store?.entity && store?.entity?.likes_count}
                      </Box>
                    </LoadingButton>
                    <Button
                      style={{
                        marginRight: '20px',
                        background: '#636363',
                        color: '#fff',
                        border: '#636363',
                        borderRadius: '90px',
                        marginBottom: '10px',
                        width: '150px'
                      }}
                      aria-label='Share'
                      variant='outlined'
                      startIcon={<Share />}
                      onClick={handleDelete}
                    >
                      Share
                    </Button>
                    <LoadingButton
                      // loading={store.status === 'pending'}
                      // disabled={store.status === 'pending'}
                      loadingPosition='end'
                      style={{
                        background: '#636363',
                        border: '#636363',
                        borderRadius: '90px',
                        marginBottom: '10px',
                        width: '150px'
                      }}
                      sx={
                        store?.entity?.isSaved
                          ? { background: 'linear-gradient(360deg, #EFD9AE -73.58%, #B4772C 97.53%)', color: 'black' }
                          : { color: '#fff', background: 'white' }
                      }
                      aria-label='Save'
                      variant='outlined'
                      startIcon={<SaveIcon style={{ backgroundColor: 'transparent' }} />}
                      onClick={() => onSave(store?.entity?.id)}
                    >
                      {store?.entity && 'isSaved' in store?.entity && (store?.entity?.isSaved ? 'Saved' : 'Save')}
                    </LoadingButton>
                  </Box>
                </Grid>
              </Stack>
            </Grid>
            <CommentSection videoId={store?.entity && 'id' in store?.entity && store?.entity?.id} />
          </>
        )}
        <ShareVideo title='videoShare' onAgree={handleDelete} />
      </Box>
    </>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'watch-videos'
}

export async function getServerSideProps() {
  // Return the fetched data as props
  return {
    props: {}
  }
}

export default Page
