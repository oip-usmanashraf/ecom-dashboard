// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { workspaceService } from 'src/services'

// ** Types Imports
import { IWorkspace } from 'src/types/apps/workspace'

export interface DataParams {
  query?: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

interface InitialState {
  entities: IWorkspace[] | []
  entity: IWorkspace | {}
  total: number
  params: DataParams
  status: 'pending' | 'error' | 'success' | 'idle'
}

export const QueryAction = createAsyncThunk('workspace/query', async (query: string, { getState, dispatch }: Redux) => {
  dispatch(Slice.actions.handleQuery(query))
  return query
})

export const fetchOneAction = createAsyncThunk('workspace/fetchOne', async (id: string) => {
  const response = await workspaceService.getById(id)
  return response.data
})

export const fetchAllAction = createAsyncThunk(
  'workspace/fetchAll',
  async (params: DataParams, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    const response = await workspaceService.getAll(params)
    dispatch(Slice.actions.handleStatus('success'))
    return response.data
  }
)

export const addAction = createAsyncThunk(
  'workspace/add',
  async ({ id, formData }: { id: string; formData: IWorkspace }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await workspaceService.addWokspaceFiles(id, formData)
      const query = getState().workspace.params.query
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

export const addFolderAction = createAsyncThunk(
  'workspace/addFolder',
  async ({ id, body }: { id: string; body: IWorkspace }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await workspaceService.addWokspaceFolders(id, body)
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
  'workspace/update',
  async ({ id, data }: { id: string; data: IWorkspace }, { getState, dispatch }: Redux) => {
    dispatch(Slice.actions.handleStatus('pending'))
    try {
      const response = await workspaceService.update(id, data)
      const query = getState().workspace.params.query
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

export const deleteAction = createAsyncThunk('workspace/delete', async (id: string, { getState, dispatch }: Redux) => {
  dispatch(Slice.actions.handleStatus('pending'))
  try {
    const response = await workspaceService.delete(id)
    const query = getState().workspace.params.query
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
  name: 'workspace',
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
      state.entities = data.folder || []
      state.total = data.folder?.length || 0
    })
    builder.addCase(fetchOneAction.fulfilled, (state, action) => {
      const { data } = action.payload
      state.entity = data.workSpace || {}
    })
  }
})

export default Slice.reducer
