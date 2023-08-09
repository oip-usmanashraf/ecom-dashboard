// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { playlistService } from 'src/services'

// ** Types Imports
import { IPlaylist } from 'src/types/apps/playlist'

export interface DataParams {
  query?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface InitialState {
  entities: IPlaylist[] | []
  entity: IPlaylist | {}
  total: number
  params: DataParams
  status: 'pending' | 'error' | 'success' | 'idle'
}

export const QueryAction = createAsyncThunk('playlist/query', async (query: string, { getState, dispatch }: Redux) => {
  dispatch(Slice.actions.handleQuery(query))
  return query
})

export const fetchOneAction = createAsyncThunk('playlist/fetchOne', async (id: string, { dispatch }) => {
  dispatch(Slice.actions.handleStatus('pending'))
  const response = await playlistService.getById(id)
  dispatch(Slice.actions.handleStatus('success'))
  return response.data
})

export const fetchAllAction = createAsyncThunk('playlist/fetchAll', async (id: string, { dispatch }) => {
  dispatch(Slice.actions.handleStatus('pending'))
  const response = await playlistService.getAll(id)
  dispatch(Slice.actions.handleStatus('success'))
  return response.data
})

export const addAction = createAsyncThunk(
  'playlist/add',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await playlistService.add(data)
      // const query = getState().playlist.params.query
      // dispatch(fetchAllAction(query))
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
  'playlist/update',
  async ({ id, data }: { id: string; data: IPlaylist }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await playlistService.update(id, data)
      const query = getState().playlist.params.query
      dispatch(fetchAllAction(''))
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

export const deleteAction = createAsyncThunk('playlist/delete', async (id: string, { getState, dispatch }: Redux) => {
  dispatch(Slice.actions.handleStatus('pending'))
  try {
    const response = await playlistService.delete(id)
    // const query = getState().playlist.params.query
    // dispatch(fetchAllAction(''))
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
  name: 'playlist',
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
      // state.total = data.entities?.length || 0
    })
    builder.addCase(fetchOneAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entity = data.entity || {}
    })
    builder.addCase(deleteAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entities = state?.entities?.filter(item => item?.id !== data?.challenge?.id)
    })
  }
})

export default Slice.reducer
