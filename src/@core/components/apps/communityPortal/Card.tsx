import * as React from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Skeleton from '@mui/material/Skeleton'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { ModalType } from 'src/types'
import { DeleteOutline, DotsVertical, ImageEdit, Share, ThumbUp, Comment } from 'mdi-material-ui'
import { Box, Button, Grid, Menu, MenuItem, Tooltip } from '@mui/material'
import DeleteAlert from 'src/@core/components/common/deleteAlert'
import { useCommunityFeed } from 'src/@core/hooks/apps/useCommunityFeed'
import LoadingButton from '@mui/lab/LoadingButton'
import { ICommunityFeed } from 'src/types/apps/community-feed'
import { format, compareAsc, formatDistanceToNow } from 'date-fns'
import { AvatarWithImageLink, AvatarWithoutImageLink } from '../../mui/avatar'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { useAuth } from 'src/hooks/useAuth'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import { useFeedComments } from 'src/@core/hooks/apps/useFeedComments'
import CommentSection from './CommentSection'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'

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
    handleModal(id, ModalType.COMMUNITYFEED)
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
      <DeleteAlert title='client' onAgree={handleDelete} />
    </>
  )
}

const StyledTypography = styled(Typography)(({ variant }) => ({
  color: '#fff',
  variant
}))

// ** renders client column
export const RenderClient = (props: {
  profile_picture: string
  username: string
  status: string
  onClick: () => void
}) => {
  const { onClick, profile_picture, status, username } = props
  if (status === 'pending') {
    return <Skeleton animation='wave' variant='circular' width={40} height={40} />
  } else if (profile_picture) {
    return (
      <Tooltip title="Want To See This User's Posts?" onClick={onClick}>
        <CustomAvatar src={profile_picture} sx={{ mr: 3, width: 51, height: 51, cursor: 'pointer' }} />
      </Tooltip>
    )
  }

  return (
    <Tooltip title="Want To See This User's Posts?" onClick={onClick}>
      <CustomAvatar
        skin='light'
        color={'primary'}
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem', cursor: 'pointer' }}
        onClick={onClick}
      >
        {getInitials(username || 'UnKnown')}
      </CustomAvatar>
    </Tooltip>
  )
}

const CommunityCard = ({ feeds }: ICommunityFeed) => {
  const { push } = useRouter()

  const [showComments, setShowComments] = React.useState(false)

  const { user } = useAuth()

  const { serviceId } = useToggleDrawer()

  const { deleteCommunityFeed, store, likePostById } = useCommunityFeed(null)

  const handleDeletePost = () => {
    serviceId && deleteCommunityFeed(serviceId)
  }

  return (
    <Box display={'block'} margin='0  auto'>
      <Card sx={{ maxWidth: '100%', m: 2, minWidth: '100%' }}>
        <CardHeader
          sx={{ cursor: 'pointer' }}
          avatar={
            <RenderClient
              status={store.status}
              profile_picture={feeds?.user?.profile_picture}
              username={`${feeds?.user?.first_name} ${feeds?.user?.last_name}`}
              onClick={() => {
                push(`/community-portal/${feeds?.user?.id}`)
              }}
            />
          }
          action={feeds?.userId === user?.id ? <RowOptions id={feeds?.id} /> : null}
          title={
            <StyledTypography variant='h6'>{feeds?.user?.first_name + ' ' + feeds?.user?.last_name}</StyledTypography>
          }
          subheader={<StyledTypography variant='body2'>2 years</StyledTypography>}

          // subheader={feeds?.createdAt ? formatDistanceToNow(new Date(feeds?.createdAt), { addSuffix: true }) : null}
          // onClick={() => push(`/community-portal/${feeds?.user?.id}`)}
        />
        <CardContent>
          {
            <StyledTypography variant='body1' color='text.secondary'>
              {feeds?.content || 'No Content Found'}
            </StyledTypography>
          }
          {!feeds?.image ? null : (
            <CardMedia
              component='img'
              height='300'
              image={feeds?.image}
              alt={feeds?.content}
              sx={{ borderRadius: '14px' , marginTop: '20px' }}
            />
          )}
        </CardContent>
        <Grid md={6} xs={12} sm={12} marginTop={5} marginLeft={5}>
          <Box display={'flex'} flexWrap={'wrap'}>
            <Button
              style={{
                border: '#636363',
                marginRight: '10px',
                marginBottom: '10px'
              }}
              aria-label='Like'
              variant='outlined'
              startIcon={feeds?.isLiked ? <ThumbUp /> : <ThumbUpOffAltIcon />}
              onClick={() => likePostById(feeds?.id)}
            >
              {feeds?.isLiked ? 'Liked' : 'Like'}
              <Box component={'span'} ml={2}>
                {feeds?.likes_count > 0 ? feeds?.likes_count : null}
              </Box>
            </Button>
            <Button
              style={{
                border: '#636363',
                marginBottom: '10px'
              }}
              aria-label='Comment'
              variant='outlined'
              startIcon={<Comment />}
              onClick={() => setShowComments(!showComments)}
            >
              Comment
            </Button>
          </Box>
        </Grid>
        {showComments && <CommentSection postId={feeds?.id} />}
      </Card>
      <DeleteAlert title='Feed' type={ModalType.COMMUNITYFEED} onAgree={() => handleDeletePost()} />
    </Box>
  )
}

export default CommunityCard
