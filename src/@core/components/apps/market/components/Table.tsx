import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Import Custom hooks
import useAsync from 'src/@core/hooks/useAsync'

// ** Types Imports
import { marketService } from 'src/services'
import { IMarket } from 'src/types/apps/market'
import { Button } from '@mui/material'

interface CellType {
  row: IMarket
}

interface DataItem {
  ic: string
  avatarColor: any
  i: any
  coins: string
}

export const renderClient = (row: DataItem) => {
  if (row?.ic) {
    return <CustomAvatar src={row?.ic} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor || 'primary'}
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(row?.i)}
      </CustomAvatar>
    )
  }
}

const columns = [
  {
    flex: 0.2,
    minWidth: 280,
    field: 'Name',
    headerName: 'Name',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
            {renderClient(row as DataItem)}
            <Typography noWrap component='a' variant='subtitle2' sx={{ color: 'text.primary', textDecoration: 'none' }}>
              {row?.n} <Typography variant='caption'>* {row?.s}</Typography>
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 100,
    field: 'Change',
    headerName: 'Change',
    renderCell: ({ row }: CellType) => {
      return (
        <Button
          startIcon={<ArrowDropUpIcon />}
          sx={{ background: 'rgba(8, 209, 88, 0.1)', color: '#6ccf59', padding: 1 }}
        >
          {row?.p24}%
        </Button>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 100,
    field: 'Price',
    headerName: 'Price',
    renderCell: ({ row }: CellType) => {
      return <Typography color={'#FFF'}>{'PRs'}</Typography>
    }
  }
]

const Table = () => {
  // ** State
  const [pageSize, setPageSize] = useState<number>(10)
  const [data, setData] = useState<DataItem[]>([])

  // ** Hooks

  useEffect(() => {
    const getMarketData = async () => {
      const { data } = await marketService.getAll()
      setData(data)
    }
    getMarketData()

    const interval = setInterval(() => {
      getMarketData()
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <DataGrid
      autoHeight
      rows={(data && 'coins' in data && (data?.coins as any)) || []}
      getRowId={row => row?.i}
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

export default Table
