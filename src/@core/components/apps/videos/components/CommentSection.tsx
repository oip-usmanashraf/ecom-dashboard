import React, { MouseEvent, useEffect, useState } from 'react'
import { Box, Button, Grid, IconButton, Menu, MenuItem, Typography, Card } from '@mui/material'
import Stack from '@mui/material/Stack'
import Image from 'next/image'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { InputField } from 'src/@core/components/form'
import { useComment } from 'src/@core/hooks/apps/useComments'
import { useForm } from 'react-hook-form'
import { DeleteOutline, DotsVertical, HelpCircleOutline } from 'mdi-material-ui'
import toast from 'react-hot-toast'
import SendIcon from '@mui/icons-material/Send'
import RepliesList from './RepliesList'
import RepliesSection from './RepliesSection'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { IUser } from 'src/types/apps/user'
import CustomAvatar, { AvatarWithoutImageLink } from 'src/@core/components/mui/avatar'
import { ImageEdit } from 'mdi-material-ui'
import { getInitials } from 'src/@core/utils/get-initials'
import { AvatarWithImageLink } from 'src/@core/components/mui/avatar'

const CommentSection = ({ videoId }: any) => {
  const { control, handleSubmit, setValue, reset } = useForm()

  const {
    getAllComments,
    comments,
    setComments,
    addComment,
    deleteComment,
    type,
    setType,
    updateComment,
    likeComments
  } = useComment(null)

  const { user } = useAuth()

  const [commentId, setCommentId] = useState('')

  // const [showReplies, setshowReplies] = useState(false)

  const [showInput, setShowInput] = useState(false)

  const {
    query: { slug }
  } = useRouter()

  useEffect(() => {
    getAllComments(slug as any)
  }, [slug])

  const renderClient = (row: IUser) => {
    if (row && row?.user?.profile_picture) {
      return (
        <AvatarWithImageLink href={`/channels/${row.id}`} sx={{ width: 50, height: 50, borderRadius: '50px' }}>
          <CustomAvatar src={row?.user?.profile_picture} sx={{ mr: 3, width: 34, height: 34 }} />
        </AvatarWithImageLink>
      )
    } else {
      return (
        <AvatarWithoutImageLink
          href={`/channels/${row.id}`}
          sx={{ width: '70px', height: '60px', borderRadius: '50px' }}
        >
          <CustomAvatar
            skin='light'
            color={row.avatarColor || 'primary'}
            sx={{ mr: 3, width: 50, height: 50, borderRadius: '40px', fontSize: '1rem' }}
          >
            {getInitials(row?.user?.first_name + ' ' + row?.user?.last_name || 'UnKnown')}
          </CustomAvatar>
        </AvatarWithoutImageLink>
      )
    }
  }

  const RowOptions = ({ comment }: { comment: any }) => {
    // ** State
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }

    const handleDelete = async () => {
      const response = await deleteComment(comment?.id)
      if (response?.statusCode === '10000') {
        setComments(comments?.filter((item: any) => item?.id !== comment?.id))
        reset()
        toast.success('Deleted Successfully!')
      }
    }

    const handleUpdate = () => {
      setType('UPDATE')
      setValue('comment', comment?.comment)
      setCommentId(comment?.id)
    }

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
          <MenuItem onClick={handleUpdate}>
            <ImageEdit fontSize='small' sx={{ mr: 2 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <DeleteOutline fontSize='small' sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Menu>
      </>
    )
  }

  const onSubmit = async (body: any) => {
    const trimmedValue = body.comment.trim()
    if (trimmedValue === '') {
      toast.error('Field Cannot Be Empty')
    } else {
      if (type === 'ADD') {
        const response = await addComment(slug, body)
        if (response?.statusCode === '10000') {
          getAllComments(slug as any)
          reset()
          toast.success('Added Successfully!')
          setValue('comment', '')
        }
      } else if (type === 'UPDATE') {
        const response = await updateComment(commentId, body)
        if (response?.statusCode === '10000') {
          getAllComments(slug as any)
          setValue('comment', '')
          reset()
          toast.success('Updated Successfully!')
        } else {
          setValue('comment', '')
        }
      }
    }
  }

  // const showComment = (id: string) => {
  //   const data = [...comments]
  //   const response = data?.find(item => item?.id === id)
  //   const index = data.indexOf(response)
  //   response.showReply = !response.showReply ? true : !response.showReply
  //   console.log(response)

  //   data.splice(index, 1, response)
  //   setComments(data)
  // }

  const showReplies = (id: string) => {
    const data = [...(comments as any)]
    const response = data?.find(item => item?.id === id)
    const index = data.indexOf(response)
    response.replies = !response.replies ? true : !response.replies
    data.splice(index, 1, response)
    setComments(data)
  }

  const likeComment = async (id: string) => {
    const response = await likeComments(id)
    if (response?.statusCode === '10000') {
      getAllComments(slug as any)
    }
  }

  const [commentStates, setCommentStates] = useState(
    Array(comments?.length).fill({ showInput: false, showReplies: false })
  )

  // function to toggle the input box for a specific comment
  const toggleInput = (commentIndex: any) => {
    setCommentStates(prevStates => {
      const newStates = [...prevStates]
      newStates[commentIndex] = { ...newStates[commentIndex], showInput: !newStates[commentIndex]?.showInput }
      return newStates
    })
  }

  // function to toggle the replies list for a specific comment
  const toggleReplies = (commentIndex: any) => {
    setCommentStates(prevStates => {
      const newStates = [...prevStates]
      newStates[commentIndex] = { ...newStates[commentIndex], showReplies: !newStates[commentIndex]?.showReplies }
      return newStates
    })
  }

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
            <Grid item xs={4}>
              {/* @ts-ignore */}
              <Typography variant='body1'>{`${comments?.length || 0} Comments`} </Typography>
            </Grid>
            <Grid item xs={8}></Grid>
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
                    {/* <SendIcon /> */}
                  </Button>
                  {type === 'ADD' ? null : (
                    <Button sx={{ ml: 5 }} type='submit' onClick={() => setType('ADD')} variant='outlined'>
                      Cancel
                    </Button>
                  )}
                  {/* <Button sx={{ ml: 5 }} type='submit'>
                    <SendIcon />
                  </Button> */}
                </Box>
              </Stack>
            </form>
            {
              //@ts-ignore
              comments?.length > 0 ? (
                comments?.map((item: any, index: number) => {
                  return (
                    <>
                      <Stack
                        direction='column'
                        spacing={10}
                        mt={3}
                        sx={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
                      >
                        <Box sx={{ display: 'flex', width: '100%' }}>
                          {renderClient(item)}
                          <Stack direction={'column'} width='100%'>
                            <Box display={'flex'}>
                              <Typography component='p' variant='subtitle1'>
                                {`${item?.user?.first_name + ' ' + item?.user?.last_name}`}
                              </Typography>
                            </Box>
                            <Box sx={{ border: 1, padding: 2, borderRadius: 1, my: 2 }}>
                              <Typography component='p'>{item?.comment}</Typography>
                            </Box>
                            <Box display={'flex'}>
                              <FavoriteIcon
                                style={{ height: 16, cursor: 'pointer' }}
                                onClick={() => likeComment(item?.id)}
                                sx={item?.isLiked ? { color: 'red' } : { color: 'white' }}
                              />
                              <Typography component='p' variant='caption'>
                                {item?.likes_count}
                              </Typography>
                              <Typography
                                component='p'
                                variant='caption'
                                marginLeft={15}
                                sx={{ cursor: 'pointer' }}
                                onClick={() => toggleInput(index)}
                              >
                                {showInput ? 'Hide Reply' : 'Reply'}
                              </Typography>
                              <Typography
                                component='p'
                                variant='caption'
                                marginLeft={15}
                                sx={{ cursor: 'pointer' }}
                                onClick={() => showReplies(item?.id)}
                              >
                                {item?.showReply ? 'Hide Replies' : 'View Replies'}
                              </Typography>
                            </Box>
                          </Stack>
                          <Box marginLeft={'auto'}>
                            {user?.id === item?.userId ? <RowOptions comment={item} /> : null}
                          </Box>
                        </Box>
                      </Stack>
                      {commentStates[index]?.showInput && (
                        <RepliesSection
                          comment={item}
                          videoId={videoId}
                          setshowReplies={() => toggleReplies(index)}
                          setShowInput={setShowInput}
                        />
                      )}
                      {item?.replies ? (
                        <RepliesList replies={item} comments={comments} setComments={setComments} />
                      ) : null}
                      {/* {item?.replies && <RepliesList replies={item} comments={comments} setComments={setComments} />} */}
                    </>
                  )
                })
              ) : (
                <Typography textAlign={'center'}>0 Comments</Typography>
              )
            }
          </Grid>
        </Card>
      </Box>
    </>
  )
}

export default CommentSection
