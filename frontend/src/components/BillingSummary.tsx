import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { calcularTotalPedido, formatCurrency } from '../utils/format'
import { STATUS_LABEL } from '../utils/orderStatus'
import type { Order, OrderStatus } from '../types/order'

const ORDEM_STATUS: OrderStatus[] = ['RECEBIDO', 'EM_PREPARO', 'SAIU_PARA_ENTREGA', 'ENTREGUE', 'CANCELADO']

function Linha({ label, value, destaque }: { label: string; value: string; destaque?: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', py: 0.75, gap: 1 }}>
      <Typography variant="body2" color="text.secondary" noWrap>
        {label}

      </Typography>
      <Typography sx={{ fontWeight: destaque ? 700 : 600, fontSize: destaque ? '1.15rem' : '0.9rem' }} noWrap>
        {value}
      </Typography>
    </Box>
  )
}

export function BillingSummary({ orders }: { orders: Order[] }) {
  const faturados = orders.filter((order) => order.status === 'ENTREGUE')
  const emAndamento = orders.filter((order) => order.status !== 'ENTREGUE' && order.status !== 'CANCELADO')
  const validos = orders.filter((order) => order.status !== 'CANCELADO')

  const totalFaturado = faturados.reduce((soma, order) => soma + calcularTotalPedido(order.itens), 0)
  const totalEmAndamento = emAndamento.reduce((soma, order) => soma + calcularTotalPedido(order.itens), 0)
  const ticketMedio =
    validos.length > 0
      ? validos.reduce((soma, order) => soma + calcularTotalPedido(order.itens), 0) / validos.length
      : 0

  const contagemPorStatus: Partial<Record<OrderStatus, number>> = {}
  for (const order of orders) {
    contagemPorStatus[order.status] = (contagemPorStatus[order.status] ?? 0) + 1
  }

  return (
    <Paper sx={{ p: 3, position: { md: 'sticky' }, top: { md: 88 } }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Faturamento
      </Typography>

      <Linha label="Faturado (entregue)" value={formatCurrency(totalFaturado)} destaque />
      <Linha label="Em andamento" value={formatCurrency(totalEmAndamento)} />
      <Linha label="Ticket médio" value={formatCurrency(ticketMedio)} />

      <Divider sx={{ my: 1.5 }} />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        Pedidos por status
      </Typography>
      {ORDEM_STATUS.map((status) => (
        <Linha key={status} label={STATUS_LABEL[status]} value={String(contagemPorStatus[status] ?? 0)} />
      ))}

      <Divider sx={{ my: 1.5 }} />
      <Linha label="Total de pedidos" value={String(orders.length)} />
    </Paper>
  )
}
