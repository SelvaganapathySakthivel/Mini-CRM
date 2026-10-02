import React, { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'

const CustomTextFieldRoot = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    transform: 'none',
    lineHeight: 1.154,
    position: 'relative',
    marginBottom: theme.spacing(1),
    fontSize: theme.typography.body2.fontSize,
    color: `${theme.palette.text.primary} !important`,
    fontWeight: 500,
    '&.Mui-error': {
      color: `${theme.palette.error.main} !important`,
    },
    '& .MuiFormLabel-asterisk': {
      color: theme.palette.error.main,
    },
  },
  '& .MuiInputBase-root': {
    backgroundColor: 'transparent !important',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius || 6,
    display: 'flex',
    alignItems: 'center',
    paddingRight: '6px',
    transition: theme.transitions.create(['border-color', 'box-shadow'], {
      duration: theme.transitions.duration.shorter,
    }),
    '&:before, &:after': {
      display: 'none',
    },
    '&:hover:not(.Mui-disabled)': {
      borderColor: theme.palette.text.secondary,
    },
    '&.Mui-focused': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.light}25`,
    },
    '&.Mui-error': {
      borderColor: theme.palette.error.main,
    },
    '&.Mui-disabled': {
      backgroundColor: `${theme.palette.action.hover} !important`,
    },
    '& .MuiInputBase-input': {
      padding: '8.5px 14px',
      fontSize: '0.9375rem',
      lineHeight: 1.5,
      flex: 1,
      '&::placeholder': {
        color: theme.palette.text.disabled,
        opacity: 1,
      },
    },
    '& .MuiInputAdornment-root': {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.text.secondary,
      margin: '0 4px',
    },
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
    marginTop: theme.spacing(1),
    fontSize: theme.typography.caption.fontSize,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    display: 'none',
  },
}))

export const CustomTextField = forwardRef((props, ref) => {
  const { size = 'small', InputLabelProps, InputProps, slotProps, ...rest } = props

  const mergedInputProps = {
    ...InputProps,
    ...slotProps?.input,
  }

  const mergedSlotProps = {
    ...slotProps,
    input: mergedInputProps,
  }

  return (
    <CustomTextFieldRoot
      size={size}
      inputRef={ref}
      variant='outlined'
      InputLabelProps={{ shrink: true, ...InputLabelProps }}
      InputProps={mergedInputProps}
      slotProps={mergedSlotProps}
      {...rest}
    />
  )
})

export default CustomTextField
