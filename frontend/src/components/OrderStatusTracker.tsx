import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CheckIcon from '@mui/icons-material/Check'
import { fontDisplay } from '../theme'
import { STATUS_COLOR, STATUS_LABEL } from '../utils/orderStatus'
import type { OrderStatus } from '../types/order'

const STAGES: OrderStatus[] = ['RECEBIDO', 'EM_PREPARO', 'SAIU_PARA_ENTREGA', 'ENTREGUE']

interface OrderStatusTrackerProps {
  status: OrderStatus
  compact?: boolean
}

export function OrderStatusTracker({ status, compact }: OrderStatusTrackerProps) {
  if (compact) {
    return <Chip label={STATUS_LABEL[status]} color={STATUS_COLOR[status]} size="small" variant="outlined" />
  }

  if (status === 'CANCELADO') {
    return (
      <Box
        sx={{
          display: 'inline-block',
          bgcolor: 'action.disabledBackground',
          color: 'text.secondary',
          borderRadius: 999,
          px: 1.5,
          py: 0.5,
          fontFamily: fontDisplay,
          fontWeight: 600,
          fontSize: '0.7rem',
        }}
      >
        Cancelado
      </Box>
    )
  }

  const currentIndex = STAGES.indexOf(status)

  return (
    <Box sx={{ minWidth: 200 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {STAGES.map((stage, index) => {
          const reached = index <= currentIndex
          const isLast = index === STAGES.length - 1
          return (
            <Box key={stage} sx={{ display: 'flex', alignItems: 'center', flex: isLast ? '0 0 auto' : 1 }}>
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: reached ? 'primary.main' : 'action.disabledBackground',
                }}
              >
                {reached && <CheckIcon sx={{ fontSize: 12, color: '#fff' }} />}
              </Box>
              {!isLast && (
                <Box
                  sx={{
                    flex: 1,
                    height: 3,
                    borderRadius: 999,
                    bgcolor: index < currentIndex ? 'primary.main' : 'action.disabledBackground',
                    mx: 0.5,
                  }}
                />
              )}
            </Box>
          )
        })}
      </Box>
      <Typography
        sx={{
          mt: 0.75,
          fontFamily: fontDisplay,
          fontWeight: 600,
          fontSize: '0.75rem',
          color: 'primary.main',
        }}
      >
        {STATUS_LABEL[status]}
      </Typography>
    </Box>
  )
}
