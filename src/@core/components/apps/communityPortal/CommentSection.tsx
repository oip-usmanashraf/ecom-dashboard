import React, { MouseEvent, useEffect, useState } from 'react'
import { Box, Button, Grid, IconButton, Menu, MenuItem, Typography, Card, Skeleton } from '@mui/material'
import Stack from '@mui/material/Stack'
import Image from 'next/image'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { InputField } from 'src/@core/components/form'
import { useComment } from 'src/@core/hooks/apps/useComments'
import { DeleteOutline, DotsVertical } from 'mdi-material-ui'
import toast from 'react-hot-toast'
import SendIcon from '@mui/icons-material/Send'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { IUser } from 'src/types/apps/user'
import CustomAvatar, { AvatarWithoutImageLink } from 'src/@core/components/mui/avatar'
import { ImageEdit } from 'mdi-material-ui'
import { getInitials } from 'src/@core/utils/get-initials'
import { AvatarWithImageLink } from 'src/@core/components/mui/avatar'
import { useFeedComments } from 'src/@core/hooks/apps/useFeedComments'
import { ICommunityFeed } from 'src/types/apps/community-feed'
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import DeleteAlert from 'src/@core/components/common/deleteAlert'
import { ModalType } from 'src/types'

// ** renders client column
export const renderClient = (row: ICommunityFeed) => {
  if (row && row?.user?.profile_picture) {
    return <CustomAvatar src={row?.user?.profile_picture} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar skin='light' color={'primary'} sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}>
        {getInitials(row?.user?.first_name + ' ' + row?.user?.last_name || 'UnKnown')}
      </CustomAvatar>
    )
  }
}

const CommentSection = ({ postId }: ICommunityFeed) => {
  const [commentId, setCommentId] = useState('')
  const [selectedCommentId, setSelectedCommentId] = useState(null)

  const {
    form: { setValue, handleSubmit, control, reset, watch },
    comments,
    setComments,
    getAllComments,
    updateComment,
    addComment,
    deleteComment,
    setType,
    type
  } = useFeedComments(null)

  const { serviceId } = useToggleDrawer()

  const { user } = useAuth()

  // ** Row Options
  const RowOptions = ({ comment }: { comment: ICommunityFeed }) => {
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
      handleModal(comment?.id, ModalType.FEEDCOMMENT)
    }

    const handleUpdate = () => {
      setType('UPDATE')
      setValue('comment', comment?.comment)
      setCommentId(comment?.id)
    }

    return (
      <>
        <IconButton size='small' onClick={handleRowOptionsClick} sx={{ margin: '0 0px 0 -10px', padding: 0 }}>
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

  const onSubmit = async (body: ICommunityFeed) => {
    let commentData = {
      communityPortalId: postId,
      comment: body.comment
    }
    if (type === 'ADD') {
      const { data } = await addComment(commentData)
      if (data?.statusCode === '10000') {
        if(Array.isArray(comments)){
          setComments([...comments, data?.data])
        }
        reset()
      }
    } else {
      const response = await updateComment(commentId, body)
      if (response?.statusCode === '10000') {
        if(Array.isArray(comments)){
          const commentIndex = comments.findIndex(comment => comment?.id === response?.data?.id)
          const updatedComments = [...comments]
          if(commentIndex !== -1){
            updatedComments.splice(commentIndex, 1, response?.data)
          }
          setComments(updatedComments)
          reset()
          setType('ADD')
        }
      }
    }
    setValue('comment', '')
  }

  useEffect(() => {
    getAllComments({ query: postId })
  }, [postId])

  const handleDeletePostComment = () => {
    serviceId && deleteComment(serviceId)
  }

  // const handleReplyButtonClick = (commentId: any) => {
  //   if (selectedCommentId === commentId) {
  //     setSelectedCommentId(null) // toggle off
  //   } else {
  //     setSelectedCommentId(commentId) // toggle on
  //   }
  // }

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          mt: 5,
          maxHeight: '40vh',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        <Card>
          <Grid container padding={5}>
            <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
              <Stack
                direction='row'
                spacing={10}
                mt={3}
                sx={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
              >
                <Box sx={{ display: 'flex', width: '100%', mb: 10 }}>
                  <Image
                    src={user?.profile_picture || '/images/avatars/Group.png'}
                    width='70px'
                    height='60px'
                    alt='Remy sharp'
                    style={{ borderRadius: 50 }}
                  />
                  <InputField
                    name='comment'
                    placeholder='Add Comments'
                    control={control}
                    fullWidth
                    style={{ marginLeft: 15 }}
                    required
                  />
                  <Button sx={{ ml: 5 }} type='submit' variant='outlined'>
                    {type === 'ADD' ? 'Post' : 'Update'}
                  </Button>
                  {type === 'ADD' ? null : (
                    <Button sx={{ ml: 5 }} type='submit' onClick={() => setType('ADD')} variant='outlined'>
                      Cancel
                    </Button>
                  )}
                </Box>
              </Stack>
            </form>
            {comments === null ? (
              <Skeleton animation='pulse' variant='rounded' sx={{ maxWidth: 750, m: 2, minWidth: 750, height: 100 }} />
            ) : (
              comments?.map((comment: ICommunityFeed) => {
                return (
                  <>
                    <Stack
                      direction='column'
                      spacing={10}
                      mt={3}
                      sx={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
                    >
                      <Box sx={{ display: 'flex', width: '100%' }}>
                        {renderClient(comment)}
                        <Stack direction={'column'} width='100%'>
                          <Box display={'flex'}>
                            <Typography component='p' variant='subtitle2'>
                              {`${comment?.user?.first_name + ' ' + comment?.user?.last_name}`}
                            </Typography>
                          </Box>
                          <Box sx={{ border: 1, padding: 2, borderRadius: 1, my: 2, width: '100%' }}>
                            <Typography component='p'>{comment?.comment}</Typography>
                          </Box>
                          <Box display={'flex'}>
                            {/* <FavoriteIcon
                              style={{ height: 20, marginTop: 3, cursor: 'pointer' }}
                              // onClick={() => likeComment(item?.id)}
                              // sx={item?.isLiked ? { color: 'red' } : { color: 'white' }}
                            />
                            <Typography component='p' color='#fff'>
                              0 Likes
                              {item?.likes_count} 
                            </Typography> 
                            <Typography
                              component='p'
                              color='#fff'
                              marginLeft={15}
                              sx={{ cursor: 'pointer' }}
                              onClick={() => handleReplyButtonClick(comment?.id)}
                            >
                              {selectedCommentId === comment?.id ? 'Cancel' : 'Reply'}
                            </Typography>
                            {item?._count?.children > 0 ? (
                                  <Typography
                                    component='p'
                                    color='#fff'
                                    marginLeft={15}
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => showReplies(item?.id)}
                                  >
                                    View Replies
                                  </Typography>
                                ) : null} */}
                          </Box>
                        </Stack>
                        <Box marginLeft={'auto'} sx={{ width: '14px' }}>
                          {user?.id === comment?.userId ? <RowOptions comment={comment} /> : null}
                        </Box>
                      </Box>
                      {/* {selectedCommentId === comment?.id ? (
                        <InputField
                          name='comment'
                          placeholder='Add Comments'
                          control={control}
                          fullWidth
                          style={{ marginLeft: 15 }}
                          required
                        />
                      ) : null} */}
                    </Stack>
                  </>
                )
              })
            )}
            {!comments?.length ? <Typography>No Comments</Typography> : null}
            {/* {item?.showReply ? <RepliesSection comment={item} videoId={videoId} /> : null}
                      {item?.replies ? (
                        <RepliesList replies={item} comments={comments} setComments={setComments} />
                      ) : null}
                    </>
                  )
                })
              ) : (
                <Typography textAlign={'center'}>0 Comments</Typography>
              )
            } */}
          </Grid>
        </Card>
      </Box>
      <DeleteAlert title='Comment' type={ModalType.FEEDCOMMENT} onAgree={() => handleDeletePostComment()} />
    </>
  )
}

export default CommentSection
