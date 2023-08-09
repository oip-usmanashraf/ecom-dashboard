// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import toast from 'react-hot-toast'

import eventService from 'src/services/event.service'

// ** Types
import { CalendarFiltersType, AddEventType, EventType } from 'src/types/apps/calendarTypes'

// ** Fetch Events
export const fetchEvents = createAsyncThunk('appCalendar/fetchEvents', async (calendars: CalendarFiltersType[]) => {
  try {
    const response = await eventService.getAll()
    return response.data
  } catch (error) {}
})

// ** Add Event
export const addEvent = createAsyncThunk('appCalendar/addEvent', async (data: AddEventType | any, { dispatch }) => {
  try {
    const response = await eventService.add(data)
    dispatch(fetchEvents([]))
    toast.success('Added Successfully')
    return response?.data
  } catch (error) {}
})

// ** Update Event
export const updateEvent: any = createAsyncThunk(
  'appCalendar/updateEvent',
  async (
    body: {
      id: any
      body: any
    },
    { dispatch }
  ) => {
    let eventId = body?.id
    delete body.id
    try {
      const response = await eventService.update(eventId, body as any)
      dispatch(fetchEvents([]))
      toast.success('Updated Successfully')
      return response?.data
    } catch (error) {}
  }
)

// ** Delete Event
export const deleteEvent: any = createAsyncThunk('appCalendar/deleteEvent', async (id: string, { dispatch }) => {
  try {
    const response = await eventService.delete(id)
    dispatch(fetchEvents([]))
    toast.success('Deleted Successfully')
    return response.data
  } catch (error) {}
})

export const appCalendarSlice = createSlice({
  name: 'appCalendar',
  initialState: {
    events: [],
    selectedEvent: null,
    selectedCalendars: ['Personal', 'Business', 'Family', 'Holiday', 'ETC']
  },
  reducers: {
    handleSelectEvent: (state, action) => {
      state.selectedEvent = action.payload
    },
    handleCalendarsUpdate: (state, action) => {
      const filterIndex = state.selectedCalendars.findIndex(i => i === action.payload)
      if (state.selectedCalendars.includes(action.payload)) {
        state.selectedCalendars.splice(filterIndex, 1)
      } else {
        state.selectedCalendars.push(action.payload)
      }
      if (state.selectedCalendars.length === 0) {
        state.events.length = 0
      }
    },
    handleAllCalendars: (state, action) => {
      const value = action.payload
      if (value === true) {
        state.selectedCalendars = ['Personal', 'Business', 'Family', 'Holiday', 'ETC']
      } else {
        state.selectedCalendars = []
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.events = action.payload
    })
  }
})
export const { handleSelectEvent, handleCalendarsUpdate, handleAllCalendars } = appCalendarSlice.actions

export default appCalendarSlice.reducer
