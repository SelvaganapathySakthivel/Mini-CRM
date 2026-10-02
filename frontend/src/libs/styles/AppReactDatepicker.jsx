import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

const StyledDatePickerWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  '& .react-datepicker-wrapper': {
    width: '100%',
  },
  '& .react-datepicker': {
    fontFamily: theme.typography.fontFamily,
    fontSize: '0.875rem',
    borderRadius: 12,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  '& .react-datepicker__header': {
    backgroundColor: '#f8fafc',
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(2),
  },
  '& .react-datepicker__current-month': {
    fontWeight: 600,
    fontSize: '0.95rem',
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
  },
  '& .react-datepicker__day-name': {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    width: 34,
    lineHeight: '34px',
    margin: '2px',
  },
  '& .react-datepicker__day': {
    color: theme.palette.text.primary,
    borderRadius: 8,
    width: 34,
    lineHeight: '34px',
    margin: '2px',
    transition: 'all 0.15s ease',
    '&:hover': {
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      color: theme.palette.primary.main,
    },
  },
  '& .react-datepicker__day--selected, & .react-datepicker__day--keyboard-selected': {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: '#ffffff !important',
    fontWeight: 700,
  },
  '& .react-datepicker__day--today': {
    fontWeight: 700,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  '& .react-datepicker__day--disabled': {
    color: `${theme.palette.text.disabled} !important`,
  },
}))

export const AppReactDatepicker = (props) => {
  return (
    <StyledDatePickerWrapper>
      <DatePicker {...props} />
    </StyledDatePickerWrapper>
  )
}

export default AppReactDatepicker
