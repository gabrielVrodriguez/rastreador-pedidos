import { createTheme, type PaletteMode, type Theme } from '@mui/material/styles'

export const fontDisplay = '"Poppins", "Inter", sans-serif'

const RED = '#EA1D2C'
const RED_DARK = '#C4141F'

export function getTheme(mode: PaletteMode): Theme {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: { main: RED, dark: RED_DARK, contrastText: '#FFFFFF' },
      secondary: { main: isDark ? '#F2F2F2' : '#1A1A1A' },
      error: { main: RED },
      background: {
        default: isDark ? '#101218' : '#F5F5F5',
        paper: isDark ? '#1A1D24' : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F2F2F2' : '#1A1A1A',
        secondary: isDark ? '#9AA0AA' : '#6C7B88',
      },
      divider: isDark ? '#2A2D35' : '#E6E6E6',
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      h5: { fontFamily: fontDisplay, fontWeight: 700 },
      h6: { fontFamily: fontDisplay, fontWeight: 600 },
      subtitle1: { fontFamily: fontDisplay, fontWeight: 600 },
    },
    components: {
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: isDark ? '0 2px 16px rgba(0, 0, 0, 0.4)' : '0 2px 12px rgba(26, 26, 26, 0.06)',
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontFamily: fontDisplay,
            fontWeight: 600,
            borderRadius: 999,
            paddingLeft: 20,
            paddingRight: 20,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
        },
      },
      MuiFormControl: {
        defaultProps: {
          size: 'small',
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: 12, backgroundColor: isDark ? '#1A1D24' : '#FFFFFF' },
          input: {
            '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus': {
              WebkitBoxShadow: `0 0 0 100px ${isDark ? '#1A1D24' : '#FFFFFF'} inset`,
              WebkitTextFillColor: isDark ? '#F2F2F2' : '#1A1A1A',
              caretColor: isDark ? '#F2F2F2' : '#1A1A1A',
              transition: 'background-color 600000s ease-in-out 0s',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontFamily: fontDisplay, fontWeight: 600, borderRadius: 999 },
        },
      },
    },
  })
}
