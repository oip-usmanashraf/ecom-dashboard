// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { paymentService } from 'src/services'

// ** Types Imports
import { IPayment } from 'src/types/apps/payment'

export interface DataParams {
  query?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface InitialState {
  entities: IPayment[] | []
  entity: IPayment | {}
  total: number
  params: DataParams
  status: 'pending' | 'error' | 'success' | 'idle'
}

export const QueryAction = createAsyncThunk('payment/query', async (query: string, { getState, dispatch }: Redux) => {
  dispatch(Slice.actions.handleQuery(query))
  return query
})

export const fetchOneAction = createAsyncThunk('payment/fetchOne', async (id: string) => {
  const response = await paymentService.getById(id)
  return response.data
})

export const fetchAllAction = createAsyncThunk(
  'payment/fetchAll',
  async (params: DataParams, { getState, dispatch }: Redux) => {
    const { query } = params
    const response = await paymentService.getAll({ query })
    return response.data
  }
)

export const addAction = createAsyncThunk(
  'payment/add',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await paymentService.add(data)
      const query = getState().payment.params.query
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
  'payment/update',
  async ({ id, data }: { id: string; data: IPayment }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await paymentService.update(id, data)
      const query = getState().payment.params.query
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

export const deleteAction = createAsyncThunk('payment/delete', async (id: string, { getState, dispatch }: Redux) => {
  dispatch(Slice.actions.handleStatus('pending'))
  try {
    const response = await paymentService.delete(id)
    const query = getState().payment.params.query
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
  name: 'payment',
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
