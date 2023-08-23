import React from 'react'

// ** MUI
import FormControl from '@mui/material/FormControl'
import TextField, { BaseTextFieldProps } from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'

// ** form handling lib
import { useController, UseControllerProps } from 'react-hook-form'

interface IField extends BaseTextFieldProps {
  name: string
  type?: 'text' | 'text-area' | 'number' | 'email' | 'password' | "date"
  label?: string
  placeholder?: string
  control: UseControllerProps['control'] | any
}

const Field = ({ control, ...props }: IField) => {
  const {
    field: { onChange, onBlur, name, value, ref },
    fieldState: { invalid, isTouched, isDirty, error },
    formState: { touchedFields, dirtyFields }
  } = useController({
    ...props,
    control
  })

  return (
    <FormControl fullWidth>
      <TextField
        {...props}
        onChange={onChange}
        onBlur={props.onBlur ? props.onBlur : onBlur}
        value={value}
        name={name}
        inputRef={ref}
        label={props.label}
        placeholder={props.placeholder}
        error={Boolean(error)}
        aria-describedby={`validation-schema-${name}`}
        multiline={props.type === 'text-area' ? true : false}
        fullWidth
        helperText={error && error?.message && error.message}

      // rows={props.rows}
      // InputProps={props.InputProps}
      />
    </FormControl>
  )
}

export default Field
