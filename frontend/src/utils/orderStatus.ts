import type { OrderStatus } from '../types/order'

export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  RECEBIDO: 'EM_PREPARO',
  EM_PREPARO: 'SAIU_PARA_ENTREGA',
  SAIU_PARA_ENTREGA: 'ENTREGUE',
}

export function podeCancelar(status: OrderStatus): boolean {
  return status !== 'ENTREGUE' && status !== 'CANCELADO'
}

export const ALL_STATUSES: OrderStatus[] = [
  'RECEBIDO',
  'EM_PREPARO',
  'SAIU_PARA_ENTREGA',
  'ENTREGUE',
  'CANCELADO',
]

export const STATUS_LABEL: Record<OrderStatus, string> = {
  RECEBIDO: 'Recebido',
  EM_PREPARO: 'Em preparo',
  SAIU_PARA_ENTREGA: 'Saiu para entrega',
  ENTREGUE: 'Entregue',
  CANCELADO: 'Cancelado',
}

export const STATUS_COLOR: Record<OrderStatus, 'default' | 'warning' | 'info' | 'success' | 'error'> = {
  RECEBIDO: 'default',
  EM_PREPARO: 'warning',
  SAIU_PARA_ENTREGA: 'info',
  ENTREGUE: 'success',
  CANCELADO: 'error',
}
