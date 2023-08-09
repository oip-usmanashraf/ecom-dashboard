// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { reviewService } from 'src/services'

// ** Types Imports
import { IReview } from 'src/types/apps/review'
import reviewTable from 'src/@core/components/apps/review/components/Table'

export interface DataParams {
  query?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface InitialState {
  entities: IReview[] | []
  reviews: IReview[] | []
  entity: IReview | {}
  total: number
  params: DataParams
  status: 'pending' | 'error' | 'success' | 'idle'
}

export const QueryAction = createAsyncThunk('review/query', async (query: string, { getState, dispatch }: Redux) => {
  dispatch(Slice.actions.handleQuery(query))
  return query
})

export const fetchOneAction = createAsyncThunk('review/fetchOne', async (id: string) => {
  const response = await reviewService.getById(id)
  return response.data
})

export const fetchAllAction = createAsyncThunk(
  'review/fetchAll',
  async (params: DataParams, { getState, dispatch }: Redux) => {
    const { query } = params
    const response = await reviewService.getAll({ query })
    // console.log(response, 'Api Response')
    return response.data
  }
)

export const fetchAllActionById = createAsyncThunk(
  'review/fetchAllById',
  async (params: DataParams, { getState, dispatch }: Redux) => {
    const response = await reviewService.getAllById(params)
    // console.log(response, 'Api Response')
    return response.data
  }
)

export const addAction = createAsyncThunk(
  'review/add',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await reviewService.add(data)
      // const query = getState().review.params.query
      // dispatch(fetchAllAction({ query }))
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
  'review/update',
  async ({ id, data }: { id: string; data: IReview }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await reviewService.update(id, data)
      const query = getState().review.params.query
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

export const deleteAction = createAsyncThunk('review/delete', async (id: string, { getState, dispatch }: Redux) => {
  dispatch(Slice.actions.handleStatus('pending'))
  try {
    const response = await reviewService.delete(id)
    const query = getState().review.params.query
    dispatch(fetchAllAction({ query: '' }))
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
  name: 'review',
  initialState: {
    entities: [],
    reviews: [],
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

      state.entities = data.entities || []
      state.total = data.entities?.length || 0
    })
    builder.addCase(fetchAllActionById.fulfilled, (state, action) => {
      const { data } = action.payload

      state.reviews = data.entities || []
      state.total = data.entities?.length || 0
    })
    builder.addCase(fetchOneAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entity = data.user || {}
    })
  }
})

export default Slice.reducer
