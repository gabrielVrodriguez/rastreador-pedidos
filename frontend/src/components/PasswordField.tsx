import { useState } from 'react'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'slotProps'>

export function PasswordField(props: PasswordFieldProps) {
  const [visivel, setVisivel] = useState(false)

  return (
    <TextField
      {...props}
      type={visivel ? 'text' : 'password'}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setVisivel((atual) => !atual)}
                edge="end"
                size="small"
                aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
                sx={{ color: 'text.secondary' }}
              >
                {visivel ? (
                  <VisibilityOffOutlinedIcon fontSize="small" />
                ) : (
                  <VisibilityOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  )
}
