// ** MUI Imports
import { styled } from '@mui/material/styles'
import MuiBox, { BoxProps } from '@mui/material/Box'
import { StepIconProps } from '@mui/material/StepIcon'

// ** Icons Imports
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// ** Util Imports
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// Styled Box component
const Box = styled(MuiBox)<BoxProps>(({ theme }) => ({
  width: 20,
  height: 20,
  borderWidth: 3,
  borderRadius: '50%',
  borderStyle: 'solid',
  borderColor: hexToRGBA(theme.palette.primary.main, 0.12)
}))

const StepperCustomDot = (props: StepIconProps) => {
  // ** Props
  const { active, completed, error } = props

  if (error) {
    return <WarningOutlinedIcon sx={{ width: 20, height: 20, color: 'error.main', transform: 'scale(1.2)' }} />
  } else if (completed) {
    return <CheckCircleIcon sx={{ width: 20, height: 20, color: 'primary.main', transform: 'scale(1.2)' }} />
  } else {
    return (
      <Box
        sx={{
          ...(active && { borderColor: 'primary.main' })
        }}
      />
    )
  }
}

export default StepperCustomDot
