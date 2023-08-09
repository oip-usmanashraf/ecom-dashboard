// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// ** Icons Imports
import ExportVariant from 'mdi-material-ui/ExportVariant'
import { useContext } from 'react'
import { useChannels } from 'src/@core/hooks/apps/useChannels'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import CanViewTable from 'src/layouts/components/acl/CanViewTable'

interface TableHeaderProps {
  value: string
  toggle: () => void
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, value, toggle } = props

  const ability = useContext(AbilityContext)

  return (
    <>
      <Box
        sx={{ pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        {ability.can('itsHaveAccess', 'create-channel-button') && (
          <Button
            sx={{
              display: 'block',
              marginLeft: 'auto',
              marginTop: '10px',
              marginBottom: '20px',
              width: '180px',
              color: '#fff',
              background: 'linear-gradient(360deg, #EFD9AE -73.58%, #B4772C 97.53%)'
            }}
            onClick={() => toggle()}
          >
            Create Channel
          </Button>
        )}
      </Box>
    </>
  )
}

// TableHeader.ability = {
//   action: 'itsHaveAccess',
//   subject: 'thead'
// }

export default TableHeader
