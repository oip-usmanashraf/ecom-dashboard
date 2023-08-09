// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { TeacherService } from 'src/services'

// ** Types Imports
import { ITeacher } from 'src/types/apps/teacher'

export interface DataParams {
  query?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface InitialState {
  entities: ITeacher[] | []
  entity: ITeacher | {} | any
  total: number
  params: DataParams
  status: 'pending' | 'error' | 'success' | 'idle'
}

export const QueryAction = createAsyncThunk('teacher/query', async (query: string, { getState, dispatch }: Redux) => {
  dispatch(Slice.actions.handleQuery(query))
  return query
})

export const fetchOneAction = createAsyncThunk('teacher/fetchOne', async (id: string) => {
  const response = await TeacherService.getById(id)
  return response.data
})

export const fetchAllAction = createAsyncThunk(
  'teacher/fetchAll',
  async (params: DataParams, { getState, dispatch }: Redux) => {
    const { query } = params
    const response = await TeacherService.getAll({ query })
    return response.data
  }
)

export const addAction = createAsyncThunk(
  'teacher/add',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await TeacherService.add(data)
      const query = getState().teacher.params.query
      dispatch(fetchAllAction({ query }))
      toast.success('Added succesfully!')
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message || 'Something went wrong!')
      dispatch(Slice.actions.handleStatus('error'))
      return error.response.data
    }
  }
)

export const updateAction = createAsyncThunk(
  'teacher/update',
  async ({ id, data }: { id: string; data: ITeacher }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await TeacherService.update(id, data)
      const query = getState().teacher.params.query
      dispatch(fetchAllAction({ query }))
      toast.success('updated succesfully!')
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message || 'Something went wrong!')
      dispatch(Slice.actions.handleStatus('error'))
      return error.response.data
    }
  }
)

export const deleteAction = createAsyncThunk('teacher/delete', async (id: string, { getState, dispatch }: Redux) => {
  dispatch(Slice.actions.handleStatus('pending'))
  try {
    const response = await TeacherService.delete(id)
    const query = getState().teacher.params.query
    dispatch(fetchAllAction({ query }))
    toast.success('deleted succesfully!')
    dispatch(Slice.actions.handleStatus('success'))
    return response.data
  } catch (error: any) {
    toast.error(error.response.data.message || 'Something went wrong!')
    dispatch(Slice.actions.handleStatus('error'))
    return error.response.data
  }
})

export const Slice = createSlice({
  name: 'teacher',
  initialState: {
    entities: [],
    entity: {},
    total: 0,
    params: {}
  } as InitialState,
  reducers: {
    handleStatus: (state, action) => {
      state.status = action.payload
    },
    handleQuery: (state, action) => {
      state.params.query = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchAllAction.fulfilled, (state, action) => {
      const { data } = action.payload
      // console.log(data)

      state.entities = data.users || []
      state.total = data.users?.length || 0
    })
    builder.addCase(fetchOneAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entity = data.user || {}
    })
  }
})

export default Slice.reducer
