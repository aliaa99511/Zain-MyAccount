import { Alert, Typography, type AlertColor } from '@mui/material'

function CustomAlert({alert}:{alert: {message: string, type: string}}) {
  return (
    <Alert 
      variant="outlined" 
      severity={alert.type as AlertColor}
      sx={{
        mt: 3, 
        backgroundColor: theme => theme.palette[alert.type].light, 
        borderColor: theme => theme.palette[alert.type].main, 
        color: theme => theme.palette[alert.type].main,
      }}
    >
      <Typography variant='body2'>{alert.message}</Typography>
    </Alert>
  )
}

export default CustomAlert