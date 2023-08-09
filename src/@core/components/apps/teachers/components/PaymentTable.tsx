import { useState, useEffect, MouseEvent, useCallback, ReactElement } from 'react'
// ** Next Import
import Link from 'next/link'
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'
// ** Icons Imports
import Laptop from 'mdi-material-ui/Laptop'
import ChartDonut from 'mdi-material-ui/ChartDonut'
import CogOutline from 'mdi-material-ui/CogOutline'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import { ImageEdit } from 'mdi-material-ui'

import AccountOutline from 'mdi-material-ui/AccountOutline'
// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
// ** Actions Imports
import { useTeacher } from 'src/@core/hooks/form/useTeachers'
// ** Import Custom hooks
import useToggleDrawer from 'src/@core/hooks/useToggleDrawer'
// ** Types Imports
import { ITeacher } from 'src/types/apps/teacher'
import { RootState, AppDispatch } from 'src/store'
import Image from 'next/image'

interface CellType {
  row: ITeacher
}

// ** renders client column
export const renderClient = (row: ITeacher) => {
  if (row?.user?.profile_picture) {
    return <CustomAvatar src={row?.user?.proile_picture} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(row?.user?.first_name + ' ' + row?.user?.last_name)}
      </CustomAvatar>
    )
  }
}

const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'user_name',
    headerName: 'User Name',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
            {renderClient(row)}
            <Typography noWrap component='a' variant='subtitle2' sx={{ color: 'text.primary', textDecoration: 'none' }}>
              {row?.user?.first_name} {row?.user?.last_name}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'subscription_name',
    headerName: 'Subscription Name',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap variant='body2'>
          {row?.subscription?.title}
        </Typography>
      )
    }
  },
  {
    flex: 0.09,
    // minWidth: 70,
    width: 10,
    field: 'price',
    headerName: 'Price',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap variant='body2'>
          {`$ ${row?.subscription?.price}`}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          skin='light'
          size='small'
          label={row?.status}
          color={row?.status === 'paid' ? 'success' : 'error'}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions id={row.id as string} />
  }
]

const RowOptions = ({ id }: { id: string }) => {
  // ** Hooks
  const { handleDrawer, handleModal } = useToggleDrawer()

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = async () => {
    handleModal(id)
    handleRowOptionsClose()
  }

  const handleUpdate = () => {
    handleRowOptionsClose()
    handleDrawer(id)
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <DotsVertical />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem onClick={handleDelete}>
          <DeleteOutline fontSize='small' sx={{ mr: 2 }} />
          Delete
        </MenuItem>
        <MenuItem onClick={handleUpdate}>
          <ImageEdit fontSize='small' sx={{ mr: 2 }} />
          Edit
        </MenuItem>
      </Menu>
    </>
  )
}

const PaymentTable = () => {
  // ** State
  const [pageSize, setPageSize] = useState<number>(10)

  // ** Hooks
  const store = useSelector((state: RootState) => state?.payment)

  return (
    <DataGrid
      autoHeight
      rows={store?.entities || []}
      columns={columns}
      // checkboxSelection
      pageSize={pageSize}
      disableSelectionOnClick
      rowsPerPageOptions={[10, 25, 50]}
      sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
      onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
    />
  )
}

export default PaymentTable
