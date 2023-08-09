import { useEffect, useMemo, useState } from 'react'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** import custom hooks
import useAsync from 'src/@core/hooks/useAsync'
import { RootState, AppDispatch } from 'src/store'

import { ApiParams } from 'src/types/api'

// ** import API services
import { csvDownload } from 'src/@core/helper/csv-export'

// ** Import Custom hooks
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
import { VideoService } from 'src/services'
import { useForm } from 'react-hook-form'

export const useComment = (serviceId: string | null) => {
  // ** Hook
  const { handleDrawer, handleModal } = useToggleDrawer()
  // const store = useSelector((state: RootState) => state.user)

  const dispatch = useDispatch<AppDispatch>()
  const form = useForm()

  const [comments, setComments] = useState<any[]>()
  const [type, setType] = useState<'ADD' | 'UPDATE'>('ADD')

  useEffect(() => {
    // serviceId && dispatch(fetchOneAction(serviceId))
  }, [serviceId])

  const getComment = async (id: string) => { }

  const getAllComments = async (query: ApiParams) => {
    //@ts-ignore
    VideoService.getAllComments(query).then(({ data }: any) => {
      if (data?.statusCode === '10000') {
        setComments(data?.data)
      }
    })
  }

  const addComment = async (id: any, body: any) => {
    const { data } = await VideoService.postComments(id, body)
    setType('ADD')
    return data
  }

  const likeComments = async (id: any) => {
    const { data } = await VideoService.likeComments(id)
    return data
  }

  const updateComment = async (id: string, body: any) => {
    const { data } = await VideoService.updateComments(id, body)
    setType('ADD')
    return data
  }

  const deleteComment = async (id: string) => {
    const { data } = await VideoService.deleteComments(id)
    return data
  }

  const exportComment = async () => {
    // csvDownload('Comments', store.entities)
  }

  return {
    comments,
    type,
    setType,
    setComments,
    form,
    getComment,
    getAllComments,
    addComment,
    updateComment,
    deleteComment,
    exportComment,
    likeComments
  }
}
