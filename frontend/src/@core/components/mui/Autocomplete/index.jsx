import React, { forwardRef } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Paper from '@mui/material/Paper'

const CustomAutocomplete = forwardRef((props, ref) => {
  return (
    <Autocomplete
      ref={ref}
      PaperComponent={props => <Paper {...props} elevation={4} sx={{ mt: 1, borderRadius: 2 }} />}
      {...props}
    />
  )
})

export default CustomAutocomplete
