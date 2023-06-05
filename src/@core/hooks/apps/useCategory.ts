import { useEffect, useMemo } from 'react'

// ** Third Party Imports
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Import Custom hooks
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'

// ** import custom hooks
import { RootState, AppDispatch } from 'src/store'

import { categorySchema } from 'src/@core/schema'

// ** types
import { GetParams } from 'src/services/service'
import { CategoryForm, CategoryKeys, CategoryApi } from 'src/types/apps/category'

// ** import API services
import { ExportList, csvDownload } from 'src/@core/helper/csv-export'

// ** Actions Imports
import {
  fetchAllAction,
  fetchOneAction,
  addAction,
  updateAction,
  deleteAction,
} from 'src/store/apps/category'
import { setFormValues } from 'src/@core/helper/setFormValues'
import { payloadHandler } from 'src/@core/helper/payloadHandler'

const defaultValues: CategoryForm = {
  name: "",
  order: 1,
  title: "",
  status: "PUBLIC",
  id: "",
  image: "",
}

export const useCategory = (serviceId: string | null) => {
  // ** Hook
  const { handleDrawer, handleModal } = useToggleDrawer()
  const store = useSelector((state: RootState) => state.category)
  const dispatch = useDispatch<AppDispatch>()

  const form = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(categorySchema.add)
  })

  useEffect(() => {
    serviceId && dispatch(fetchOneAction({ id: serviceId }))
  }, [serviceId])


  useMemo(() => {
    if ('id' in store.entity && store.entity && serviceId) {
      setFormValues<CategoryKeys, CategoryApi>(store.entity, (key, value) => {
        form.setValue(key, value)
      })

    } else {
      form.reset()
    }
  }, [store.entity, serviceId])

  const getCategory = async (id: string) => {
    dispatch(fetchOneAction({ id }))
  }

  const getCategories = async ({ query }: GetParams) => {
    dispatch(fetchAllAction({ query }))
  }

  const addCategory = async (data: CategoryForm) => {
    dispatch(addAction({ data })).then(({ payload }: any) => {
      payloadHandler(payload, () => {
        form.reset()
        handleDrawer(null)
      })
    })
  }

  const updateCategory = async (id: string, data: CategoryForm) => {
    dispatch(updateAction({ id, data })).then(({ payload }: any) => {
      payloadHandler(payload, () => {
        form.reset()
        handleDrawer(null)
      })
    })
  }



  const deleteCategory = async (id: string) => {
    dispatch(deleteAction({ id })).then(({ payload }: any) => {
      payloadHandler(payload, () => {
        handleModal(null)
      })
    })
  }

  const exportCategories = async () => {
    csvDownload(ExportList.category, store.entities)
  }

  return {
    form,
    store,
    getCategory,
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    exportCategories,
  }
}
