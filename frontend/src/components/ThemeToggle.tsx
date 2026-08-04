import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import { useThemeMode } from '../context/ThemeModeContext'

export function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode()

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        bgcolor: 'action.selected',
        borderRadius: 999,
        p: 0.5,
        gap: 0.5,
      }}
    >
      <IconButton
        size="small"
        onClick={() => mode !== 'light' && toggleMode()}
        aria-label="Tema claro"
        sx={{
          bgcolor: mode === 'light' ? 'background.paper' : 'transparent',
          boxShadow: mode === 'light' ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        <LightModeRoundedIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => mode !== 'dark' && toggleMode()}
        aria-label="Tema escuro"
        sx={{
          bgcolor: mode === 'dark' ? 'background.paper' : 'transparent',
          boxShadow: mode === 'dark' ? '0 1px 4px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <DarkModeRoundedIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}
