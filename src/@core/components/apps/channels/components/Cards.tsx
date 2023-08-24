import * as React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import Link from 'next/link'
import { Stack } from '@mui/system'
import { DeleteOutline, DotsVertical, ImageEdit } from 'mdi-material-ui'
import { Button, Menu, MenuItem, Box, CardMedia, Skeleton, Avatar, Grid } from '@mui/material'
import { useChannels } from 'src/@core/hooks/apps/useChannels'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import DeleteAlert from 'src/@core/components/common/deleteAlert'
import CheckIcon from '@mui/icons-material/Check'
import { formatDistanceToNow } from 'date-fns'
import { styled } from '@mui/material/styles'

import Paper from '@mui/material/Paper'
import DataNotFound from './DataNotFound'
import LoadingButton from '@mui/lab/LoadingButton'
import { useAuth } from 'src/hooks/useAuth'
import { ModalType } from 'src/types'
import { textOverflow } from 'src/@core/helper/text'
import { PusherContext } from 'src/context/PusherContext'
import { Client } from '@pusher/push-notifications-web'
import Pusher from 'pusher-js'

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary
}))

export default function Cards() {
  const { getAllChannels, store, subscribeChannelsById } = useChannels(null)
  const [status, setStatus] = React.useState('')
  const { handleDrawer, handleModal } = useToggleDrawer()

  const { setChannelId }: any = React.useContext(PusherContext)

  // const pusher = new Pusher('80cd3aa7f3d3d0f9b278', {
  //   cluster: 'mt1',
  //   useTLS: true
  //   // add any other options here, such as encrypted: true
  // })

  const RowOptions = ({ id }: { id: string }) => {
    // ** State
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }

    const handleDelete = async () => {
      handleRowOptionsClose()
      handleModal(id, ModalType.CHANNEL)
    }

    const handleUpdate = () => handleDrawer(id)

    return (
      <>
        <IconButton size='small' onClick={handleRowOptionsClick}>
          <DotsVertical />
        </IconButton>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={handleRowOptionsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          PaperProps={{ style: { minWidth: '8rem' } }}
        >
          <MenuItem onClick={handleDelete}>
            <DeleteOutline fontSize='small' sx={{ mr: 2 }} />
            Delete
          </MenuItem>
          <MenuItem onClick={handleUpdate}>
            <ImageEdit fontSize='small' sx={{ mr: 2 }} />
            Edit
          </MenuItem>
        </Menu>
        <DeleteAlert title='client' onAgree={handleDelete} />
      </>
    )
  }

  React.useEffect(() => {
    getAllChannels({ query: '' })

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then(registration => {
            console.log('Service Worker registered: ', registration)
          })
          .catch(registrationError => {
            console.log('Service Worker registration failed: ', registrationError)
          })
      })
    }
  }, [])

  const { user } = useAuth()

  const channelSubscription = async (id: any) => {
    setStatus(id)
    const { statusCode } = await subscribeChannelsById(id, 'ALL')
    if (statusCode === '10000') {
      setStatus((prevState: any) => ({
        ...prevState,
        [id]: false // Set loading state to false for the clicked card
      }))
      // const channel = store.entities.filter(item => item.id === id)
      // let channelName = `channel-${channel[0]?.id}`
      // const channelObject = pusher.subscribe(channelName)
      // channelObject.bind('my-event', (data: any) => {
      //   console.log(`Received event on ${channelName}:`, data)
      //   // Handle the received event data for each channel here
      // })
      // console.log(pusher);
    }
  }

  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 0, sm: 2, md: 3 }}>
      {store?.status === 'success' ? (
        !store?.entities?.length ? (
          <DataNotFound />
        ) : (
          store?.entities?.map(cards => {
            return (
              <Grid item xs={12} md={3} sm={6}>
                {/* <Item
                  sx={{
                    maxWidth: '100%',
                    float: 'none',
                    mr: 0,
                    mb: 2,
                    position: 'relative'
                  }}
                > */}
                  <Card>
                    {cards?.thumnail_url === '' || cards?.thumnail_url === undefined || cards?.thumnail_url === null ? (
                      <Image
                        src={'/images/pages/404image.jpg'}
                        width='600px'
                        height='250px'
                        alt='Video Image'
                        objectFit='cover'
                      />
                    ) : (
                      <Image
                        src={cards?.thumnail_url}
                        width='600px'
                        height='250px'
                        alt='Video Image'
                        objectFit='cover'
                      />
                    )}
                    <CardContent sx={{ position: 'relative' }}>
                      <Stack direction='row' height='40px' alignItems='center' sx={{ cursor: 'pointer' }}>
                        <Link href={`channels/${cards?.id}`}>
                          <Typography variant='body1' color='#ffffff' mr='10px' lineHeight='20px'>
                            {textOverflow(cards?.name, 20)}
                          </Typography>
                        </Link>
                        <Box marginLeft={'auto'}>
                          {user?.id === cards?.userId ? <RowOptions id={cards?.id} /> : null}
                        </Box>
                      </Stack>

                      <Typography variant='body2' color='#787878' marginBottom={5} height={'20px'}>
                        {cards?.subscriber?.length > 1
                          ? cards?.subscriber?.length + ' Subscribers'
                          : cards?.subscriber?.length + ' Subscriber'}{' '}
                        - {formatDistanceToNow(new Date(cards?.createdAt), { addSuffix: true })}
                      </Typography>
                      <LoadingButton
                        loading={status === cards.id}
                        disabled={status === cards.id}
                        loadingPosition='end'
                        style={
                          cards?.isSubscribed
                            ? { background: 'white', color: 'black' }
                            : {
                              color: '#fff',
                              background: 'linear-gradient(135deg, #2862AD 0%, #3D1D91 46.88%, #AE20CA 100%)'
                            }
                        }
                        sx={{
                          display: 'flex',
                          margin: 'auto',
                          width: '200px'
                        }}
                        onClick={() => channelSubscription(cards?.id)}
                        endIcon={cards?.isSubscribed ? <CheckIcon color='success' /> : null}
                      >
                        {cards?.isSubscribed ? 'Subscribed' : 'Subscribe'}
                      </LoadingButton>
                    </CardContent>
                  </Card>
                {/* </Item> */}
              </Grid>
            )
          })
        )
      ) : (
        <Skeleton variant='rectangular' width={'100%'} height={'80vh'} />
      )}
    </Grid>
  )
}
