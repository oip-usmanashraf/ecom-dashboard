import { useState, MouseEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import ShareIcon from '@mui/icons-material/Share'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { format, compareAsc } from 'date-fns'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Import Custom hooks
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { IStudents } from 'src/types/apps/student'
import { useAuth } from 'src/hooks/useAuth'

interface CellType {
  row: IStudents
}

// ** renders client column
export const renderClient = (row: IStudents) => {
  const { user } = useAuth()
  if (user && user?.profile_picture) {
    return <CustomAvatar src={user?.profile_picture} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(user?.first_name + ' ' + user?.last_name)}
      </CustomAvatar>
    )
  }
}

export const renderClientForSignUpUser = (row: IStudents) => {
  if (row && row?.profile_picture) {
    return <CustomAvatar src={row?.profile_picture} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(row?.first_name + ' ' + row?.last_name)}
      </CustomAvatar>
    )
  }
}

const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'first_name',
    headerName: 'From',
    renderCell: ({ row }: CellType) => {
      const { user } = useAuth()
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
            {renderClient(row)}
            <Typography noWrap component='a' variant='subtitle2' sx={{ color: 'text.primary', textDecoration: 'none' }}>
              {user?.first_name} {user?.last_name}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 150,
    field: 'share',
    headerName: 'Share/Link',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', cursor: 'pointer' }}>
            <ShareIcon />
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'to',
    headerName: 'To',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', cursor: 'pointer' }}>
            {renderClientForSignUpUser(row)}
            <Typography noWrap component='a' variant='subtitle2' sx={{ color: 'text.primary', textDecoration: 'none' }}>
              {row?.first_name} {row?.last_name}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'date-time',
    headerName: 'Date/Time',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', cursor: 'pointer' }}>
            <Typography noWrap component='a' variant='subtitle2' sx={{ color: 'text.primary', textDecoration: 'none' }}>
              {row?.createdAt ? format(new Date(row?.createdAt), "MM/dd/yyyy 'at' h:mm a") : ''}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 100,
    field: 'Recieve',
    headerName: 'recieve',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap variant='body2'>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row', cursor: 'pointer' }}>
            <AttachMoneyIcon />
            {row?.amount}
          </Box>
        </Typography>
      )
    }
  }
]

const StudentsTable = () => {
  // ** State
  const [pageSize, setPageSize] = useState<number>(10)

  // ** Hooks
  const store = useSelector((state: RootState) => state.students)

  return (
    <DataGrid
      autoHeight
      rows={store?.points || []}
      columns={columns}
      // checkboxSelection
      pageSize={pageSize}
      disableSelectionOnClick
      rowsPerPageOptions={[10, 25, 50]}
      sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
      onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
    // components={{ Toolbar: GridToolbar }}
    />
  )
}

export default StudentsTable
