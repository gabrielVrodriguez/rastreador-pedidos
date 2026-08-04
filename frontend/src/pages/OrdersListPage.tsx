import { useEffect, useState, type MouseEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Fab from '@mui/material/Fab'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import { OrderStatusTracker } from '../components/OrderStatusTracker'
import { NewOrderDialog } from '../components/NewOrderDialog'
import { OrderDetailsDrawer } from '../components/OrderDetailsDrawer'
import { BillingSummary } from '../components/BillingSummary'
import { listOrders, updateOrderStatus } from '../api/orders'
import { ALL_STATUSES, NEXT_STATUS, STATUS_LABEL, podeCancelar } from '../utils/orderStatus'
import { calcularTotalPedido, formatCurrency, formatOrderCode } from '../utils/format'
import { getApiErrorMessage } from '../utils/errors'
import type { Order, OrderStatus } from '../types/order'

type ConfirmAction =
  | { type: 'advance'; orderId: number; nextStatus: OrderStatus }
  | { type: 'cancel'; orderId: number }

export function OrdersListPage() {
  const queryClient = useQueryClient()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const rastreioCompleto = useMediaQuery('(min-width:1300px)')

  const [newOrderOpen, setNewOrderOpen] = useState(false)
  const [menuState, setMenuState] = useState<{ anchorEl: HTMLElement; orderId: number } | null>(null)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState<OrderStatus | 'TODOS'>('TODOS')
  const [pedidoSelecionadoId, setPedidoSelecionadoId] = useState<number | null>(null)
  const [pagina, setPagina] = useState(0)
  const porPagina = 6

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: listOrders,
  })

  const pedidoSelecionado = orders?.find((order) => order.id === pedidoSelecionadoId) ?? null

  const pedidosFiltrados = (orders ?? [])
    .filter((order) => {
      const termo = busca.trim().toLowerCase()
      const combinaBusca =
        termo === '' ||
        String(order.id).includes(termo) ||
        formatOrderCode(order.id).toLowerCase().includes(termo) ||
        order.nomeCliente.toLowerCase().includes(termo) ||
        order.enderecoEntrega.toLowerCase().includes(termo)
      const combinaStatus = statusFiltro === 'TODOS' || order.status === statusFiltro
      return combinaBusca && combinaStatus
    })
    .sort((a, b) => ALL_STATUSES.indexOf(a.status) - ALL_STATUSES.indexOf(b.status))

  const pedidosPaginados = pedidosFiltrados.slice(pagina * porPagina, pagina * porPagina + porPagina)

  useEffect(() => {
    const maxPagina = Math.max(0, Math.ceil(pedidosFiltrados.length / porPagina) - 1)
    if (pagina > maxPagina) setPagina(maxPagina)
  }, [pedidosFiltrados.length, porPagina, pagina])

  function handleBuscaChange(valor: string) {
    setBusca(valor)
    setPagina(0)
  }

  function handleStatusFiltroChange(valor: OrderStatus | 'TODOS') {
    setStatusFiltro(valor)
    setPagina(0)
  }

  const advanceStatus = useMutation({
    mutationFn: (variables: { id: number; status: OrderStatus }) =>
      updateOrderStatus(variables.id, variables.status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    onError: (error) => setActionError(getApiErrorMessage(error, 'Não foi possível avançar o status')),
  })

  const cancelOrder = useMutation({
    mutationFn: (id: number) => updateOrderStatus(id, 'CANCELADO'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    onError: (error) => setActionError(getApiErrorMessage(error, 'Não foi possível cancelar o pedido')),
  })

  function abrirMenu(event: MouseEvent<HTMLElement>, orderId: number) {
    setMenuState({ anchorEl: event.currentTarget, orderId })
  }

  function fecharMenu() {
    setMenuState(null)
  }

  function abrirConfirmacaoCancelamento(orderId: number) {
    setConfirmAction({ type: 'cancel', orderId })
  }

  function pedirCancelamento() {
    if (menuState) abrirConfirmacaoCancelamento(menuState.orderId)
    fecharMenu()
  }

  function pedirAvanco(orderId: number, nextStatus: OrderStatus) {
    setConfirmAction({ type: 'advance', orderId, nextStatus })
  }

  function confirmarAcao() {
    if (!confirmAction) return
    if (confirmAction.type === 'advance') {
      advanceStatus.mutate({ id: confirmAction.orderId, status: confirmAction.nextStatus })
    } else {
      cancelOrder.mutate(confirmAction.orderId)
    }
    setConfirmAction(null)
  }

  function renderAcoes(order: Order) {
    const next = NEXT_STATUS[order.status]
    return (
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', justifyContent: 'flex-end' }}>
        {next && (
          <Button
            size="small"
            variant="contained"
            disabled={advanceStatus.isPending}
            onClick={() => pedirAvanco(order.id, next)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Avançar
          </Button>
        )}
        {podeCancelar(order.status) && (
          <IconButton size="small" onClick={(e) => abrirMenu(e, order.id)} aria-label="Mais ações">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Pedidos
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 1.5, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          {orders && orders.length > 0 && (
            <>
              <TextField
                placeholder="Buscar por código, cliente ou endereço"
                value={busca}
                onChange={(e) => handleBuscaChange(e.target.value)}
                sx={{ width: { xs: '100%', sm: 340 } }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                select
                label="Status"
                value={statusFiltro}
                onChange={(e) => handleStatusFiltroChange(e.target.value as OrderStatus | 'TODOS')}
                sx={{ width: { xs: '100%', sm: 140 } }}
              >
                <MenuItem value="TODOS">Todos</MenuItem>
                {ALL_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {STATUS_LABEL[status]}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setNewOrderOpen(true)}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          Novo pedido
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '8fr 2fr' },
          gap: 3,
          alignItems: 'flex-start',
        }}
      >
        <Box>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}
          {isError && <Alert severity="error">Não foi possível carregar os pedidos.</Alert>}

          {orders && orders.length === 0 && (
            <Paper sx={{ py: 8, textAlign: 'center' }}>
              <Inventory2OutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Nenhum pedido ainda.
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setNewOrderOpen(true)}>
                Criar o primeiro pedido
              </Button>
            </Paper>
          )}

          {orders && orders.length > 0 && pedidosFiltrados.length === 0 && (
            <Paper sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="text.secondary">Nenhum pedido encontrado para esse filtro.</Typography>
            </Paper>
          )}

          {pedidosFiltrados.length > 0 && isMobile && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {pedidosPaginados.map((order) => {
                const next = NEXT_STATUS[order.status]
                return (
                  <Paper
                    key={order.id}
                    onClick={() => setPedidoSelecionadoId(order.id)}
                    sx={{ p: 2, cursor: 'pointer' }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600 }} noWrap>{order.nomeCliente}</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {order.enderecoEntrega}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatOrderCode(order.id)}
                        </Typography>
                      </Box>
                      {podeCancelar(order.status) && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            abrirMenu(e, order.id)
                          }}
                          aria-label="Mais ações"
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>

                    <Divider sx={{ my: 1.5 }} />
                    <OrderStatusTracker status={order.status} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Typography sx={{ fontWeight: 700 }}>
                        {formatCurrency(calcularTotalPedido(order.itens))}
                      </Typography>
                      {next && (
                        <Button
                          size="small"
                          variant="contained"
                          disabled={advanceStatus.isPending}
                          onClick={(e) => {
                            e.stopPropagation()
                            pedirAvanco(order.id, next)
                          }}
                        >
                          Avançar
                        </Button>
                      )}
                    </Box>
                  </Paper>
                )
              })}
            </Box>
          )}

          {pedidosFiltrados.length > 0 && !isMobile && (
            <TableContainer component={Paper}>
              <Table sx={{ tableLayout: 'fixed', minWidth: rastreioCompleto ? 850 : 680 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '9%' }}>Código</TableCell>
                    <TableCell sx={{ width: rastreioCompleto ? '16%' : '19%' }}>Cliente</TableCell>
                    <TableCell sx={{ width: rastreioCompleto ? '24%' : '29%' }}>Endereço</TableCell>
                    <TableCell sx={{ width: rastreioCompleto ? '22%' : '13%' }}>Rastreio</TableCell>
                    <TableCell align="right" sx={{ width: '12%' }}>Total</TableCell>
                    <TableCell align="right" sx={{ width: rastreioCompleto ? '17%' : '18%' }}>Ação</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pedidosPaginados.map((order) => (
                    <TableRow
                      key={order.id}
                      hover
                      onClick={() => setPedidoSelecionadoId(order.id)}
                      sx={{ cursor: 'pointer', height: rastreioCompleto ? 72 : 64 }}
                    >
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        {formatOrderCode(order.id)}
                      </TableCell>
                      <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.nomeCliente}
                      </TableCell>
                      <TableCell
                        title={order.enderecoEntrega}
                        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {order.enderecoEntrega}
                      </TableCell>
                      <TableCell>
                        <OrderStatusTracker status={order.status} compact={!rastreioCompleto} />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {formatCurrency(calcularTotalPedido(order.itens))}
                      </TableCell>
                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        {renderAcoes(order)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {pedidosFiltrados.length > 0 && (
            <TablePagination
              component="div"
              count={pedidosFiltrados.length}
              page={pagina}
              onPageChange={(_, novaPagina) => setPagina(novaPagina)}
              rowsPerPage={porPagina}
              rowsPerPageOptions={[]}
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
            />
          )}
        </Box>

        {orders && <BillingSummary orders={orders} />}
      </Box>

      <Menu anchorEl={menuState?.anchorEl} open={!!menuState} onClose={fecharMenu}>
        <MenuItem onClick={pedirCancelamento} sx={{ color: 'error.main' }}>
          Cancelar pedido
        </MenuItem>
      </Menu>

      <Dialog open={!!confirmAction} onClose={() => setConfirmAction(null)}>
        <DialogTitle>
          {confirmAction?.type === 'cancel' ? 'Cancelar pedido' : 'Avançar status do pedido'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmAction?.type === 'cancel'
              ? 'Essa ação não pode ser desfeita. Tem certeza que quer cancelar este pedido?'
              : `Mudar o status para "${STATUS_LABEL[confirmAction?.nextStatus ?? 'RECEBIDO']}"? Depois de avançar não é possível voltar para o status anterior.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmAction(null)} color="inherit">
            Voltar
          </Button>
          <Button
            onClick={confirmarAcao}
            variant="contained"
            color={confirmAction?.type === 'cancel' ? 'error' : 'primary'}
          >
            {confirmAction?.type === 'cancel' ? 'Cancelar pedido' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

      <NewOrderDialog open={newOrderOpen} onClose={() => setNewOrderOpen(false)} />

      <OrderDetailsDrawer
        order={pedidoSelecionado}
        onClose={() => setPedidoSelecionadoId(null)}
        onAdvance={pedirAvanco}
        onCancel={abrirConfirmacaoCancelamento}
      />

      <Fab
        color="primary"
        aria-label="Novo pedido"
        onClick={() => setNewOrderOpen(true)}
        sx={{ display: { xs: 'flex', sm: 'none' }, position: 'fixed', bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>

      <Snackbar open={!!actionError} autoHideDuration={5000} onClose={() => setActionError(null)}>
        <Alert severity="error" onClose={() => setActionError(null)} sx={{ width: '100%' }}>
          {actionError}
        </Alert>
      </Snackbar>
    </Box>
  )
}
