import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import CloseIcon from '@mui/icons-material/Close'
import { OrderStatusTracker } from './OrderStatusTracker'
import { NEXT_STATUS, STATUS_LABEL, podeCancelar } from '../utils/orderStatus'
import { calcularTotalPedido, formatCurrency, formatDateTime, formatOrderCode } from '../utils/format'
import { fontDisplay } from '../theme'
import type { Order, OrderStatus } from '../types/order'

interface OrderDetailsDrawerProps {
  order: Order | null
  onClose: () => void
  onAdvance: (orderId: number, nextStatus: OrderStatus) => void
  onCancel: (orderId: number) => void
}

export function OrderDetailsDrawer({ order, onClose, onAdvance, onCancel }: OrderDetailsDrawerProps) {
  const next = order ? NEXT_STATUS[order.status] : undefined

  return (
    <Drawer
      anchor="right"
      open={!!order}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: '100%', sm: 420 } } } }}
    >
      {order && (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {formatOrderCode(order.id)}
              </Typography>
              <Typography sx={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: '1.25rem' }}>
                {order.nomeCliente}
              </Typography>
            </Box>
            <IconButton onClick={onClose} aria-label="Fechar">
              <CloseIcon />
            </IconButton>
          </Box>

          <OrderStatusTracker status={order.status} />

          <Divider />

          <Box>
            <Typography variant="body2" color="text.secondary">
              Endereço de entrega
            </Typography>
            <Typography>{order.enderecoEntrega}</Typography>
          </Box>

          <Divider />

          <Typography variant="subtitle1">Itens</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Descrição</TableCell>
                <TableCell align="right">Qtd.</TableCell>
                <TableCell align="right">Preço</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.itens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell align="right">{item.quantidade}</TableCell>
                  <TableCell align="right">{formatCurrency(item.precoUnitario)}</TableCell>
                  <TableCell align="right">{formatCurrency(item.quantidade * item.precoUnitario)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 700 }}>Total</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: 'primary.main' }}>
              {formatCurrency(calcularTotalPedido(order.itens))}
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              Criado em {formatDateTime(order.criadoEm)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Atualizado em {formatDateTime(order.atualizadoEm)}
            </Typography>
          </Box>

          <Box sx={{ mt: 'auto', display: 'flex', gap: 1, pt: 2 }}>
            {next && (
              <Button variant="contained" fullWidth onClick={() => onAdvance(order.id, next)}>
                Avançar para {STATUS_LABEL[next]}
              </Button>
            )}
            {podeCancelar(order.status) && (
              <Button variant="outlined" color="error" onClick={() => onCancel(order.id)}>
                Cancelar
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Drawer>
  )
}
