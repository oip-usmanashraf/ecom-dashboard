// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { UserService } from 'src/services'

// ** Types Imports
import { IUser } from 'src/types/apps/user'
import { Redux } from 'src/store'
import { ApiParams } from 'src/types/api'

interface InitialState {
  entities: IUser[] | []
  entity: IUser | {}
  total: number
  params: ApiParams
  status: 'pending' | 'error' | 'success' | 'idle'
}

export const QueryAction = createAsyncThunk('user/query', async (query: string, { getState, dispatch }: Redux) => {
  dispatch(Slice.actions.handleQuery(query))
  return query
})

export const fetchOneAction = createAsyncThunk('user/fetchOne', async (id: string) => {
  const response = await UserService.getById(id)
  return response.data
})

export const fetchAllAction = createAsyncThunk(
  'user/fetchAll',
  async (params: ApiParams, { getState, dispatch }: Redux) => {
    const { query } = params
    const response = await UserService.getAll({ query })
    return response.data
  }
)

export const addAction = createAsyncThunk(
  'user/add',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await UserService.add(data)
      const query = getState().user.params.query
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
  'user/update',
  async ({ id, data }: { id: string; data: IUser }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await UserService.update(id, data)
      const query = getState().entity.params.query
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

export const deleteAction = createAsyncThunk('user/delete', async (id: string, { getState, dispatch }: Redux) => {
  dispatch(Slice.actions.handleStatus('pending'))
  try {
    const response = await UserService.delete(id)
    const query = getState().entity.params.query
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
  name: 'user',
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

      state.entities = data.users || []
      state.total = data.users?.length || 0
      // state.entities = []
      // state.total = 0
    })
    builder.addCase(fetchOneAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entity = data.user || {}
    })
  }
})

export default Slice.reducer
