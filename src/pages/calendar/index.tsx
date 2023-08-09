// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Types
import { RootState, AppDispatch } from 'src/store'
import { CalendarColors, CalendarFiltersType } from 'src/types/apps/calendarTypes'

// ** FullCalendar & App Components Imports
import Calendar from './Calendar'
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'
import AddEventSidebar from './AddEventSidebar'

// ** Actions
import { addEvent, fetchEvents, deleteEvent, updateEvent, handleSelectEvent } from 'src/store/apps/calendar'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { Button } from '@mui/material'

// ** CalendarColors
const calendarsColor: CalendarColors = {
  Personal: 'error',
  Business: 'primary',
  Family: 'warning',
  Holiday: 'success',
  ETC: 'info'
}

const Page = () => {
  // ** States
  const [calendarApi, setCalendarApi] = useState<null | any>(null)
  const [eventEdit, setEventEdit] = useState<any>(false)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [addEventSidebarOpen, setAddEventSidebarOpen] = useState<boolean>(false)
  const [fullEvent, setFullEvent] = useState({})

  // ** Hooks
  const { settings } = useSettings()
  const dispatch = useDispatch<AppDispatch>()
  const store: any = useSelector((state: RootState) => state?.calendar)

  // ** Vars
  const addEventSidebarWidth = 400
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  useEffect(() => {
    dispatch(fetchEvents(store.selectedCalendars as CalendarFiltersType[]))
  }, [dispatch, store.selectedCalendars])

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  const handleAddEventSidebarToggle = () => setAddEventSidebarOpen(!addEventSidebarOpen)

  const handleSidebarToggleSidebar = () => {
    handleAddEventSidebarToggle()
    dispatch(handleSelectEvent(null))
  }

  return (
    <>
      <CalendarWrapper
        className='app-calendar'
        sx={{
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && { border: (theme: any) => `1px solid ${theme.palette.divider}` })
        }}
      >
        <Box
          sx={{
            pt: 2.25,
            flexGrow: 1,
            borderRadius: 1,
            boxShadow: 'none',
            ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {})
          }}
        >
          <Box display={'flex'} mb={5}>
            <Button variant='contained' onClick={handleSidebarToggleSidebar} sx={{ marginLeft: 'auto' }}>
              Add Event
            </Button>
          </Box>
          <Calendar
            fullEvent={fullEvent}
            setFullEvent={setFullEvent}
            eventEdit={eventEdit}
            setEventEdit={setEventEdit}
            store={store?.events?.data?.events}
            dispatch={dispatch}
            direction={direction}
            updateEvent={updateEvent}
            calendarApi={calendarApi}
            calendarsColor={calendarsColor}
            setCalendarApi={setCalendarApi}
            handleSelectEvent={handleSelectEvent}
            handleLeftSidebarToggle={handleLeftSidebarToggle}
            handleAddEventSidebarToggle={handleAddEventSidebarToggle}
          />
        </Box>
        <AddEventSidebar
          fullEvent={fullEvent}
          setFullEvent={setFullEvent}
          eventEdit={eventEdit}
          setEventEdit={setEventEdit}
          store={store}
          dispatch={dispatch}
          addEvent={addEvent}
          updateEvent={updateEvent}
          deleteEvent={deleteEvent}
          calendarApi={calendarApi}
          drawerWidth={addEventSidebarWidth}
          handleSelectEvent={handleSelectEvent}
          addEventSidebarOpen={addEventSidebarOpen}
          handleAddEventSidebarToggle={handleAddEventSidebarToggle}
        />
      </CalendarWrapper>
    </>
  )
}

Page.acl = {
  action: 'itsHaveAccess',
  subject: 'calendar-page'
}

export default Page
