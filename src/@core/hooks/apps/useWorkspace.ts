import { useEffect, useMemo } from 'react'

// ** Third Party Imports
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** import custom hooks
import useAsync from 'src/@core/hooks/useAsync'
import { RootState, AppDispatch } from 'src/store'

import { workspaceSchema } from 'src/@core/schema'

import { ApiParams } from 'src/types/api'

// ** import API services
import { csvDownload } from 'src/@core/helper/csv-export'

// ** Actions Imports
import {
  fetchAllAction,
  fetchOneAction,
  addAction,
  updateAction,
  deleteAction,
  addFolderAction
} from 'src/store/apps/workspace'

// ** Import Custom hooks
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'

const defaultValues = {
  // role: 'STUDENT',
  // first_name: '',
  // last_name: '',
  // email: '',
  // password: '',
  // phone: '',
  // gender: ''
}

export const useWorkspace = (serviceId: string | null) => {
  // ** Hook
  const { handleDrawer, handleModal } = useToggleDrawer()
  const store = useSelector((state: RootState) => state.workspace)
  const dispatch = useDispatch<AppDispatch>()

  const form = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(workspaceSchema.add)
  })

  useEffect(() => {
    serviceId && dispatch(fetchOneAction(serviceId))
  }, [serviceId])

  useMemo(() => {
    if (store.entity && serviceId) {
      // console.log(store.entity,"---hello")
      // 'first_name' in store.entity && form.setValue('first_name', store.entity.first_name)
    } else {
      form.reset()
    }
  }, [store.entity, serviceId])

  const getWorkspace = async (id: string) => {
    dispatch(fetchOneAction(id))
  }

  const getAllWorkspacesFolder = async (query: ApiParams | any) => {
    dispatch(fetchAllAction(query))
  }

  const addWorkspace = async (data: any) => {
    dispatch(addAction({ ...data })).then(({ payload }: any) => {
      if (payload?.statusCode === '10000') {
        form.reset()
        handleDrawer(null)
      } else {
        // console.log('============API_ERROR===============')
        // console.log(payload)
        // console.log('====================================')
      }
    })
  }

  const addWorkspaceFiles = async (data: any) => {
    const { payload } = await dispatch(addAction({ ...data }))
    return payload
  }

  const addWorkspaceFolder = async (id: string, body: any) => {
    const { payload } = await dispatch(addFolderAction({ id, body }))
    return payload
  }

  const updateWorkspace = async (id: string, data: any) => {
    dispatch(updateAction({ id, data })).then(({ payload }: any) => {
      if (payload?.statusCode === '10000') {
        form.reset()
        handleDrawer(null)
      } else {
        // console.log('============API_ERROR===============')
        // console.log(payload)
        // console.log('====================================')
      }
    })
  }

  const deleteWorkspace = async (id: string) => {
    dispatch(deleteAction(id)).then(({ payload }: any) => {
      if (payload?.statusCode === '10000') {
        handleModal(null)
      } else {
        // console.log('============API_ERROR===============')
        // console.log(payload)
        // console.log('====================================')
      }
    })
  }

  const exportWorkspace = async () => {
    csvDownload('Workspace', store.entities)
  }

  return {
    form,
    store,
    getWorkspace,
    getAllWorkspacesFolder,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    exportWorkspace,
    addWorkspaceFolder,
    addWorkspaceFiles
    // student: defaultValues.name
  }
}
