import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { getTheme } from '../theme'

type Mode = 'light' | 'dark'

interface ThemeModeContextValue {
  mode: Mode
  toggleMode: () => void
}

const STORAGE_KEY = 'theme-mode'

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined)

function lerModoSalvo(): Mode {
  const salvo = localStorage.getItem(STORAGE_KEY)
  return salvo === 'dark' ? 'dark' : 'light'
}

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(lerModoSalvo)

  function toggleMode() {
    setMode((atual) => {
      const proximo: Mode = atual === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEY, proximo)
      return proximo
    })
  }

  const theme = useMemo(() => getTheme(mode), [mode])

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}

export function useThemeMode(): ThemeModeContextValue {
  const context = useContext(ThemeModeContext)
  if (!context) {
    throw new Error('useThemeMode precisa estar dentro de um ThemeModeProvider')
  }
  return context
}
