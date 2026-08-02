import Chip from '@mui/material/Chip'
import type { OrderStatus } from '../types/order'
import { STATUS_LABEL } from '../utils/orderStatus'

const COLOR: Record<OrderStatus, 'info' | 'warning' | 'secondary' | 'success' | 'error'> = {
  RECEBIDO: 'info',
  EM_PREPARO: 'warning',
  SAIU_PARA_ENTREGA: 'secondary',
  ENTREGUE: 'success',
  CANCELADO: 'error',
}

export function OrderStatusChip({ status }: { status: OrderStatus }) {
  return <Chip label={STATUS_LABEL[status]} color={COLOR[status]} size="small" />
}
