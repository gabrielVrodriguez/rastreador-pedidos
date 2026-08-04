import { Outlet } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from './ThemeToggle'
import { fontDisplay } from '../theme'

export function AppShell() {
  const { logout } = useAuth()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Toolbar>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
            }}
          >
            <LocalShippingRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Typography
            component="div"
            sx={{ flexGrow: 1, fontFamily: fontDisplay, fontWeight: 700, fontSize: '1.1rem', color: 'text.primary' }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Rastreador de Pedidos
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
              Rastreador
            </Box>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
            <ThemeToggle />
            <Button onClick={logout} color="primary">
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 1.5, sm: 2 } }}>
        <Outlet />
      </Container>
    </Box>
  )
}
