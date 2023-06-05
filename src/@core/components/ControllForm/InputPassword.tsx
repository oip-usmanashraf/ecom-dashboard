import React, { useState } from 'react'

import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  InputBaseProps
} from '@mui/material'

// ** Icons Imports
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

interface InputPasswordProps extends InputBaseProps {
  label: string
}

const InputPassword = ({ error, value, onChange, ...props }: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor='input-secret-text' error={Boolean(error)}>
        {props.label}
      </InputLabel>
      <OutlinedInput
        fullWidth
        value={value}
        onChange={onChange}
        id='input-secret-text'
        error={Boolean(error)}
        {...props}
        type={showPassword ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton edge='end' onMouseDown={e => e.preventDefault()} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
            </IconButton>
          </InputAdornment>
        }
      />
      {error && (
        <FormHelperText sx={{ color: 'error.main' }} id=''>
          {error}
        </FormHelperText>
      )}
    </FormControl>
  )
}

export default InputPassword
