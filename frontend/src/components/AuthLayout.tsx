import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded'
import { ThemeToggle } from './ThemeToggle'
import { fontDisplay } from '../theme'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
        py: 4,
      }}
    >
      <Paper sx={{ width: '100%', maxWidth: 880, display: 'flex', overflow: 'hidden' }}>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '42%',
            p: 4,
            bgcolor: 'action.hover',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LocalShippingRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: '1.05rem' }}>
              Rastreador
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Rastreador de Pedidos
            </Typography>
            <Typography color="text.secondary">
              Acompanhe pedidos de delivery do recebimento até a entrega, em tempo real.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              © 2026 Rastreador de Pedidos
            </Typography>
            <ThemeToggle />
          </Box>
        </Box>

        <Box sx={{ flex: 1, p: { xs: 3, sm: 5 }, minWidth: 0 }}>
          <Typography sx={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: '1.5rem', mb: 0.5 }}>
            {title}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {subtitle}
          </Typography>

          {children}

          <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'center', mt: 3 }}>
            <ThemeToggle />
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
