import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { listOrders, updateOrderStatus } from '../api/orders'
import { OrderStatusChip } from '../components/OrderStatusChip'
import { NEXT_STATUS } from '../utils/orderStatus'
import { useAuth } from '../context/AuthContext'
import type { OrderStatus } from '../types/order'

export function OrdersListPage() {
  const { logout } = useAuth()
  const queryClient = useQueryClient()

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: listOrders,
  })

  const advanceStatus = useMutation({
    mutationFn: (variables: { id: number; status: OrderStatus }) =>
      updateOrderStatus(variables.id, variables.status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  })

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4, px: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Pedidos</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={RouterLink} to="/pedidos/novo" variant="contained">
            Novo pedido
          </Button>
          <Button onClick={logout} color="inherit">Sair</Button>
        </Box>
      </Box>

      {isLoading && <CircularProgress />}
      {isError && <Alert severity="error">Não foi possível carregar os pedidos.</Alert>}

      {orders && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Endereço</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const next = NEXT_STATUS[order.status]
                return (
                  <TableRow key={order.id}>
                    <TableCell>{order.nomeCliente}</TableCell>
                    <TableCell>{order.enderecoEntrega}</TableCell>
                    <TableCell><OrderStatusChip status={order.status} /></TableCell>
                    <TableCell align="right">
                      {next && (
                        <Button
                          size="small"
                          disabled={advanceStatus.isPending}
                          onClick={() => advanceStatus.mutate({ id: order.id, status: next })}
                        >
                          Avançar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">Nenhum pedido ainda.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
