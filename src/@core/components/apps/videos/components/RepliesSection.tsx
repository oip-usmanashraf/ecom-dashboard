import { Box, Button } from '@mui/material'
import { InputField } from 'src/@core/components/form'
import SendIcon from '@mui/icons-material/Send'
import { useReplies } from 'src/@core/hooks/apps/useReplies'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useComment } from 'src/@core/hooks/apps/useComments'
import { ConsoleLine } from 'mdi-material-ui'
import CancelIcon from '@mui/icons-material/Cancel'
import toast from 'react-hot-toast'

const Page = ({ comment, videoId, edit, setReplies, commentReplies, replyId, setshowReplies, setShowInput }: any) => {
  const { control, handleSubmit, reset } = useForm()

  const { addReply, getAllRepliesByCommentId, replies, updateReply } = useReplies(null)

  const { getAllComments } = useComment(null)

  const {
    query: { slug }
  } = useRouter()

  const onSubmit = async (body: any) => {
    if (!edit) {
      body.parentId = comment?.id
      body.videoId = slug
      const response = await addReply(body)
      if (response?.statusCode === '10000') {
        toast.success('Posted Successfully')
        // const updatedData = [...commentReplies]
        // getAllComments(slug)
        // getAllRepliesByCommentId(comment?.id)
        setShowInput(false)
        reset()
      }
    } else {
      const response = await updateReply(replyId, body)
      // console.log(response,"RESPONSE")
      if (response?.statusCode === '10000') {
        toast.success('Updated Successfully')
        const commentIndex = commentReplies?.findIndex((item: any) => item?.id === response?.data?.id)
        const updatedReplies = [...commentReplies]
        updatedReplies.splice(commentIndex, 1, response?.data)
        setReplies(updatedReplies)
        reset()
        // setType('ADD')
      }
      // if (statusCode === '10000') {
      //   const updatedReplies = [...comment]
      //   getAllRepliesByCommentId(comment?.parentId)
      //   reset()
      // }
    }
  }

  const onCancel = () => {
    const data = [...commentReplies]
    const response: any = data?.find(item => item?.id === comment?.id)
    const index = data?.indexOf(response)
    response.showEdit = false
    data?.splice(index, 1, response)
    setReplies(data)
  }

  return (
    <>
      <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', width: '100%', mb: 10, mt: 4, ml: 10 }}>
          <InputField
            name='comment'
            placeholder='Reply'
            control={control}
            fullWidth
            style={{ marginLeft: 15 }}
            required
          />
          {edit ? (
            <Button sx={{ ml: 5 }} type='button' onClick={() => onCancel()}>
              <CancelIcon />
            </Button>
          ) : null}
          <Button sx={{ ml: 5, mr: 5 }} type='submit'>
            <SendIcon />
          </Button>
        </Box>
      </form>
    </>
  )
}

export default Page
