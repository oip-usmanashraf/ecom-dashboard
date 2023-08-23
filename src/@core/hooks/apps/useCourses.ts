import { useEffect, useMemo, useState } from 'react'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** import custom hooks
import useAsync from 'src/@core/hooks/useAsync'
import { RootState, AppDispatch } from 'src/store'
import { coursesSchema } from 'src/@core/schema'

import { ApiParams } from 'src/types/api'

// ** import API services
import { csvDownload } from 'src/@core/helper/csv-export'

// ** Actions Imports
import { addAction, fetchAllAction, fetchOneAction, deleteAction, updateAction, addActionVideo } from 'src/store/apps/courses'

const defaultValues = {
  title: '',
  description: '',
  subtitles: [],
  thumbnail_url: '',
  startAt: ""
}

// ** Import Custom hooks
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'

export const useCourses = (serviceId: string | null) => {
  // ** Hook
  const { handleDrawer, handleModal } = useToggleDrawer()
  const store = useSelector((state: RootState) => state.courses)
  const file_store = useSelector((state: RootState) => state.file)

  const dispatch = useDispatch<AppDispatch>()
  const form = useForm({
    defaultValues,
    mode: 'onChange',
    // @ts-ignore
resolver: yupResolver(coursesSchema.add),
    // shouldUnregister: true
  })


  const subValues = useWatch({
    control: form.control,
    name: "subtitles"
  })

  useEffect(() => {
    serviceId && dispatch(fetchOneAction(serviceId))
  }, [serviceId])

  useMemo(() => {
    if (store.entity && serviceId) {
      // 'first_name' in store.entity && form.setValue('first_name', store.entity.first_name)
    } else {
      form.reset()
    }
  }, [store.entity, serviceId])

  const getCourse = async (id: string) => {
    dispatch(fetchOneAction(id))
  }

  const getAllCourses = async ({ query }: ApiParams) => {
    dispatch(fetchAllAction({ query }))
  }

  const addCourse = async (data: any) => {
    dispatch(addAction({ ...data })).then(({ payload }: any) => {
      if (payload?.statusCode === '10000') {
        handleDrawer(null)
      }
    })
  }

  const addVideo = async (data: any) => {
    dispatch(addActionVideo({ ...data })).then(({ payload }: any) => {
      if (payload?.statusCode === '10000') {
        form.reset()
        handleDrawer(null)
      }
    })
  }

  const updateCourse = async (id: string, data: any) => {
    dispatch(updateAction({ id, data })).then(({ payload }: any) => {
      if (payload?.statusCode === '10000') {
        handleDrawer(null)
      }
    })
  }

  const deleteCourse = async (id: string) => {
    dispatch(deleteAction(id)).then(({ payload }: any) => {
      if (payload?.statusCode === '10000') {
        handleModal(null)
      }
    })
  }

  const exportCourses = async () => {
    csvDownload('courses', store.entities)
  }

  return {
    form,
    store,
    getCourse,
    getAllCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    exportCourses,
    file: file_store,
    subValues,
    addVideo
  }
}
