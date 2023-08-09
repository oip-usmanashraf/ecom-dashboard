// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { communityFeedService } from 'src/services'

// ** Types Imports
import { ICommunityFeed } from 'src/types/apps/community-feed'

export interface DataParams {
  query?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface InitialState {
  entities: ICommunityFeed[] | []
  entity: ICommunityFeed | {} | any
  total: number
  params: DataParams
  status: 'pending' | 'error' | 'success' | 'idle'
}

export const QueryAction = createAsyncThunk(
  'community_feed/query',
  async (query: string, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleQuery(query))
    return query
  }
)

export const fetchOneAction = createAsyncThunk('community_feed/fetchOne', async (id: any, { getState, dispatch }) => {
  dispatch(Slice.actions.handleStatus('pending'))
  try {
    const response = await communityFeedService.getById(id)
    dispatch(Slice.actions.handleStatus('success'))
    return response.data
  } catch (error) {
    dispatch(Slice.actions.handleStatus('error'))
    return error
  }
})

export const fetchAllAction = createAsyncThunk(
  'community_feed/fetchAll',
  async (params: DataParams, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    const { query } = params
    try {
      const response = await communityFeedService.getAll({ query })
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message || 'Something went wrong!')
      dispatch(Slice.actions.handleStatus('error'))
      return error.response.data
    }
  }
)

export const fetchAllActionByUser = createAsyncThunk(
  'community_feed/fetchAllByUser',
  async (params: string, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    // const { query } = params
    try {
      const response = await communityFeedService.getAllByUser(params)
      dispatch(Slice.actions.handleStatus('success'))
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message || 'Something went wrong!')
      dispatch(Slice.actions.handleStatus('error'))
      return error.response.data
    }
  }
)

export const addAction = createAsyncThunk(
  'community_feed/add',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await communityFeedService.add(data)
      toast.success('Added succesfully!')
      dispatch(Slice.actions.handleStatus('success'))
      dispatch(fetchAllAction({ query: '' }))
      return response.data
    } catch (error: any) {
      toast.error(error.response.data.message || 'Something went wrong!')
      dispatch(Slice.actions.handleStatus('error'))
      return error.response.data
    }
  }
)

export const likeAction = createAsyncThunk(
  'community_feed/like',
  async (id: { id: any | string }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await communityFeedService.likePost(id)
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
  'community_feed/update',
  async ({ id, data }: { id: string; data: ICommunityFeed }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await communityFeedService.update(id, data)
      const query = getState().community_feed.params.query
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

export const deleteAction: any = createAsyncThunk(
  'community_feed/delete',
  async (id: string, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await communityFeedService.delete(id)
      // dispatch(fetchAllAction({ query: '' }))
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
  name: 'community_feed',
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
      state.entities = data?.communityPortal || []
      state.total = data?.communityPortal?.length || 0
    })
    builder.addCase(fetchAllActionByUser.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entities = data?.communityPortal || []
      state.total = data?.communityPortal?.length || 0
    })
    builder.addCase(deleteAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entities = state?.entities?.filter(item => item?.id != data?.communityPortals?.id)
    })
    builder.addCase(likeAction.fulfilled, (state, action) => {
      const updatedData = [...state.entities]
      const { data } = action.payload
      const index = state?.entities?.findIndex(ele => ele?.id === data?.id)
      updatedData?.splice(index, 1, data)
      state.entities = updatedData
    })
  }
})

export default Slice.reducer
