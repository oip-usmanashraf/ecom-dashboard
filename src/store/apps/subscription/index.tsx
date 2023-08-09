// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { SubscriptionService } from 'src/services'

// ** Types Imports
import { ISubscription } from 'src/types/apps/subscription'
// import StudentsTable from 'src/@core/components/apps/students/components/Table'

export interface DataParams {
  query?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface InitialState {
  entities: ISubscription[] | []
  entity: ISubscription | {}
  total: number
  params: DataParams
  status: 'pending' | 'error' | 'success' | 'idle'
}

export const QueryAction = createAsyncThunk(
  'subscription/query',
  async (query: string, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleQuery(query))
    return query
  }
)

export const fetchOneAction = createAsyncThunk('subscription/fetchOne', async (id: string) => {
  const response = await SubscriptionService.getById(id)
  return response.data
})

export const fetchAllAction = createAsyncThunk(
  'subscription/fetchAll',
  async (params: DataParams, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const { query } = params
      const response = await SubscriptionService.getAll({ query })
      // console.log(response, 'Api Response')
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error) {
      dispatch(Slice.actions.handleStatus('error'))
    }
  }
)

export const addAction = createAsyncThunk(
  'subscription/add',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await SubscriptionService.add(data)
      const query = getState().subscription.params.query
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
  'subscription/update',
  async ({ id, data }: { id: string; data: ISubscription }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await SubscriptionService.update(id, data)
      const query = getState().subscription.params.query
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

export const deleteAction = createAsyncThunk(
  'subscription/delete',
  async (id: string, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await SubscriptionService.delete(id)
      const query = getState().subscription.params.query
      dispatch(fetchAllAction({ query }))
      toast.success('deleted succesfully!')
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message || 'Something went wrong!')
      dispatch(Slice.actions.handleStatus('error'))
      return error.response.data
    }
  }
)

export const Slice = createSlice({
  name: 'subscription',
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

      state.entities = data.subscriptions || []
      state.total = data.subscriptions?.length || 0
    })
    builder.addCase(fetchOneAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entity = data.subscription || {}
    })
  }
})

export default Slice.reducer
