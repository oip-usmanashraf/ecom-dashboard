// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { ChannelService } from 'src/services'

// ** Types Imports
import { IChannels } from 'src/types/apps/channels'

export interface DataParams {
  query?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface InitialState {
  entities: IChannels[] | []
  entity: IChannels | {} | any
  total: number
  params: DataParams
  status: 'pending' | 'error' | 'success' | 'idle'
}

export const QueryAction = createAsyncThunk('channels/query', async (query: string, { getState, dispatch }: Redux) => {
  dispatch(Slice.actions.handleQuery(query))
  return query
})

export const fetchOneAction = createAsyncThunk('channels/fetchOne', async (id: any, { getState, dispatch }) => {
  dispatch(Slice.actions.handleStatus('pending'))
  try {
    const response = await ChannelService.getByChannelId(id)
    dispatch(Slice.actions.handleStatus('success'))
    return response.data
  } catch (error) {
    dispatch(Slice.actions.handleStatus('error'))
    return error
  }
})

export const fetchAllAction = createAsyncThunk(
  'channels/fetchAll',
  async (params: DataParams, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const { query } = params
      const response = await ChannelService.getAll({ query })
      // console.log(response, 'Api Response')
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error) {
      dispatch(Slice.actions.handleStatus('error'))
    }
  }
)

export const fetchAllActionAbout = createAsyncThunk(
  'about/fetchAll',
  async (params: DataParams, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      // const { query } = params
      const response = await ChannelService.getAbout(params)
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error) {
      dispatch(Slice.actions.handleStatus('error'))
    }
  }
)

export const fetchMyChannelAction = createAsyncThunk(
  'channels/fetchMyChannel',
  async (params: DataParams | any, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      // const { query } = params
      const response = await ChannelService.getChannelsByUserId(params)
      dispatch(Slice.actions.handleStatus('success'))
      // console.log(response, 'Api Response')
      return response.data
    } catch (error) {
      dispatch(Slice.actions.handleStatus('error'))
    }
  }
)

export const addAction = createAsyncThunk(
  'channels/add',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await ChannelService.add(data)
      // const query = getState().channels.params.query
      // dispatch(fetchMyChannelAction({ query }))
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

export const getChannelAction = createAsyncThunk(
  'getchannel/fetch',
  async ({ id }: { id: string }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await ChannelService.getByChannelId(id)
      const query = getState().channels.params.query
      // dispatch(fetchAllAction({ query }))
      // toast.success('updated succesfully!')
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
  'channels/update',
  async ({ id, data }: { id: string; data: IChannels }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await ChannelService.update(id, data)
      const query = getState().channels.params.query
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

export const deleteAction = createAsyncThunk('channels/delete', async (id: string, { getState, dispatch }: Redux) => {
  dispatch(Slice.actions.handleStatus('pending'))
  try {
    const response = await ChannelService.delete(id)
    const query = getState().channels.params.query
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
  name: 'channels',
  initialState: {
    entities: [],
    entity: {},
    total: 0,
    params: {},
    status: 'idle'
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
    builder.addCase(fetchMyChannelAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entities = data.entities || []
      state.total = data.entities?.length || 0
    })
    builder.addCase(fetchAllActionAbout.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entity = data?.entity || {}
    })
    builder.addCase(fetchOneAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entity = data?.entity || {}
    })
  }
})

export default Slice.reducer
