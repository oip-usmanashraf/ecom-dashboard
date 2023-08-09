import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Grid, Skeleton, Card, Typography, Box, IconButton, Menu, MenuItem } from '@mui/material'
import { usePlaylist } from 'src/@core/hooks/apps/usePlaylist'
import { useRouter } from 'next/router'
import DataNotFound from './DataNotFound'
import { textOverflow } from 'src/@core/helper/text'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { ModalType } from 'src/types'
import { DeleteOutline, DotsVertical, ImageEdit } from 'mdi-material-ui'
import DeleteAlert from 'src/@core/components/common/deleteAlert'
import { useAuth } from 'src/hooks/useAuth'

interface PlaylistParams {
  id: any
}

const RowOptions = ({ id }: { id: string }) => {
  const { handleModal, handleDrawer } = useToggleDrawer()

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
    handleModal(id, ModalType.COURSE)
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
        {/* <MenuItem onClick={handleUpdate}>
          <ImageEdit fontSize='small' sx={{ mr: 2 }} />
          Edit
        </MenuItem> */}
      </Menu>
      {/* <DeleteAlert title='client' onAgree={handleDelete} /> */}
    </>
  )
}

export const PlayList = () => {
  const {
    query: { id }
  } = useRouter()

  const { getAllPlaylist, store } = usePlaylist(null)

  React.useEffect(() => {
    const params: PlaylistParams = { id }
    getAllPlaylist(params.id)
  }, [])

  const { user } = useAuth()

  return (
    <Grid container rowSpacing={1} justifyContent={'flex-start'}>
      {store?.status === 'success' ? (
        !store?.entities?.length ? (
          <DataNotFound />
        ) : (
          store?.entities?.map(cards => {
            return (
              <Grid item xs={6} sm={12} md={4} lg={3} paddingLeft={0} width={'100%'} maxWidth={'100%'}>
                <Card sx={{ cursor: 'pointer', margin: '20px', minWidth: '250px' }}>
                  <Link href={`/course/${cards?.id}`}>
                    <Image
                      src={cards?.thumbnail}
                      width={'240px'}
                      height={'160px'}
                      objectFit='contain'
                      objectPosition={'10px center'}
                    />
                  </Link>
                  <Box display={'flex'}>
                    <Link href={`/course/${cards?.id}`}>
                      <Typography variant='body2' sx={{ paddingX: 5, pb: 2 }}>
                        {textOverflow(cards?.name, 20)}
                      </Typography>
                    </Link>
                    {user?.activeChannel?.channel?.id === cards.channelId ? (
                      <Box marginLeft={'auto'}>
                        <RowOptions id={cards?.id} />
                      </Box>
                    ) : null}
                  </Box>
                </Card>
              </Grid>
            )
          })
        )
      ) : (
        <Skeleton variant='rectangular' sx={{ height: '60vh', width: '75vw' }} />
      )}
    </Grid>
  )
}
