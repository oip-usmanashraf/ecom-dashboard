// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { VideoService } from 'src/services'

// ** Types Imports
import { IVideo } from 'src/types/apps/video'
import { videoSDKService } from 'src/services'

export interface DataParams {
  query?: string | any
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface InitialState {
  entities: IVideo[] | []
  entity: IVideo | {} | any
  total: number
  params: DataParams
  status: 'pending' | 'error' | 'success' | 'idle'
}

export const QueryAction = createAsyncThunk('video/query', async (query: string, { getState, dispatch }: Redux) => {
  dispatch(Slice.actions.handleQuery(query))
  return query
})

export const fetchOneAction = createAsyncThunk('video/fetchOne', async (id: string, { dispatch }) => {
  dispatch(Slice.actions.handleStatus('pending'))
  try {
    const response = await VideoService.getById(id)
    dispatch(Slice.actions.handleStatus('success'))
    return response.data
  } catch (error) {
    dispatch(Slice.actions.handleStatus('error'))
  }
})

export const startVideoStreamingAction = createAsyncThunk(
  'video/startVideoStreaming',
  async ({ id }: { id: string }, { dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const { room } = await videoSDKService.createMeeting()
      const body = { status: 'IS_LIVED', roomId: room.roomId } // { status: "WAITING_FOR_LIVE", roomId: "" } // { status: "IS_LIVED", roomId: room.roomId }
      const response = await VideoService.updateVideo(id, body)
      dispatch(fetchOneAction(id))
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error) {
      dispatch(Slice.actions.handleStatus('error'))
    }
  }
)

export const fetchOneActionByPlaylistId = createAsyncThunk('playlistVideo/fetchOne', async (id: string) => {
  const response = await VideoService.getByPlaylistId(id)
  return response.data
})

export const fetchAllAction: AsyncThunk<any, DataParams, {}> = createAsyncThunk(
  'video/fetchAll',
  async (params: DataParams, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    const { query } = params
    const response = await VideoService.getAllByChannel(query)
    dispatch(Slice.actions.handleStatus('success'))
    return response.data
  }
)

export const fetchAllLikedVideosAction = createAsyncThunk(
  'video/fetchAllLikedVideos',
  async (params: DataParams, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    const response = await VideoService.getAllLikedVideos()
    dispatch(Slice.actions.handleStatus('success'))
    return response.data
  }
)

export const fetchAllSavedVideosAction = createAsyncThunk(
  'video/fetchAllSavedVideos',
  async (params: DataParams, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    const response = await VideoService.getAllSavedVideos()
    dispatch(Slice.actions.handleStatus('success'))
    return response.data
  }
)

export const fetchAllByPlaylist = createAsyncThunk(
  'video/fetchAllByPlaylistId',
  async (params: DataParams, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    const { query } = params
    const response = await VideoService.getAllByPlaylistId(query)
    dispatch(Slice.actions.handleStatus('success'))
    return response.data
  }
)

export const addAction = createAsyncThunk(
  'video/add',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await VideoService.add(data)
      const query = getState().video.params.query
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
  'video/update',
  async ({ id, data }: { id: string; data: IVideo }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await VideoService.update(id, data)
      const query = getState().video.params.query
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

export const deleteAction = createAsyncThunk('video/delete', async (id: string, { getState, dispatch }: Redux) => {
  dispatch(Slice.actions.handleStatus('pending'))
  try {
    const response = await VideoService.delete(id)
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
  name: 'video',
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
    },
    emptyVideo: state => {
      return { ...state, entity: {} }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchAllAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entities = data?.videos || []
      state.total = data.videos?.length || 0
    })
    builder.addCase(fetchAllByPlaylist.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entities = data?.videos || []
      state.total = data.videos?.length || 0
    })
    builder.addCase(fetchAllLikedVideosAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entities = data?.entities || []
      state.total = data.entities?.length || 0
    })
    builder.addCase(fetchAllSavedVideosAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entities = data?.entities || []
      state.total = data.entities?.length || 0
    })

    builder.addCase(fetchOneAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entity = data.video || {}
    })
    builder.addCase(fetchOneActionByPlaylistId.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entity = data.entity || {}
    })
    builder.addCase(deleteAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entities = state?.entities?.filter(item => item?.id !== data?.entity?.id)
    })
  }
})

export const { emptyVideo } = Slice.actions
export default Slice.reducer
