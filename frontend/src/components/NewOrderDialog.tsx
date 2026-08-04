import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { createOrder } from '../api/orders'
import { calcularTotalPedido, formatCurrency } from '../utils/format'
import { getApiErrorMessage } from '../utils/errors'
import { fontDisplay } from '../theme'
import { MoneyField } from './MoneyField'
import type { OrderItemInput } from '../types/order'

interface ItemFormState extends OrderItemInput {
  key: string
}

function criarItemVazio(): ItemFormState {
  return { key: crypto.randomUUID(), descricao: '', quantidade: 1, precoUnitario: 0 }
}

interface NewOrderDialogProps {
  open: boolean
  onClose: () => void
}

export function NewOrderDialog({ open, onClose }: NewOrderDialogProps) {
  const [nomeCliente, setNomeCliente] = useState('')
  const [endereco, setEndereco] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [itens, setItens] = useState<ItemFormState[]>(() => [criarItemVazio()])
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      resetarEFechar()
    },
  })

  function resetarEFechar() {
    setNomeCliente('')
    setEndereco('')
    setNumero('')
    setComplemento('')
    setItens([criarItemVazio()])
    mutation.reset()
    onClose()
  }

  function atualizarItem(index: number, campo: 'descricao' | 'quantidade', valor: string) {
    setItens((atual) =>
      atual.map((item, i) =>
        i === index ? { ...item, [campo]: campo === 'descricao' ? valor : Number(valor) } : item,
      ),
    )
  }

  function atualizarPreco(index: number, precoUnitario: number) {
    setItens((atual) => atual.map((item, i) => (i === index ? { ...item, precoUnitario } : item)))
  }

  function adicionarItem() {
    setItens((atual) => [...atual, criarItemVazio()])
  }

  function removerItem(index: number) {
    setItens((atual) => atual.filter((_, i) => i !== index))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const enderecoEntrega = `${endereco.trim()}, ${numero.trim()}${complemento.trim() ? ` - ${complemento.trim()}` : ''}`
    mutation.mutate({
      nomeCliente,
      enderecoEntrega,
      itens: itens.map(({ key: _key, ...resto }) => resto),
    })
  }

  const errorMessage = getApiErrorMessage(mutation.error, 'Não foi possível criar o pedido')

  return (
    <Dialog open={open} onClose={resetarEFechar} fullWidth maxWidth="sm" fullScreen={fullScreen}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontFamily: fontDisplay, fontWeight: 700 }}>Novo pedido</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '12px !important' }}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <TextField label="Cliente" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} required />
          <TextField label="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' }, gap: 1 }}>
            <TextField label="Número" value={numero} onChange={(e) => setNumero(e.target.value)} required />
            <TextField label="Complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
          </Box>

          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle1">Itens</Typography>

          {itens.map((item, index) => (
            <Box
              key={item.key}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr auto' },
                gap: 1,
                alignItems: 'center',
              }}
            >
              <TextField
                label="Descrição"
                value={item.descricao}
                onChange={(e) => atualizarItem(index, 'descricao', e.target.value)}
                required
              />
              <TextField
                label="Qtd."
                type="number"
                value={item.quantidade}
                onChange={(e) => atualizarItem(index, 'quantidade', e.target.value)}
                slotProps={{ htmlInput: { min: 1 } }}
                required
              />
              <MoneyField
                label="Preço unitário"
                value={item.precoUnitario}
                onValueChange={(valor) => atualizarPreco(index, valor)}
                required
              />
              <IconButton
                onClick={() => removerItem(index)}
                disabled={itens.length === 1}
                aria-label="Remover item"
                sx={{ justifySelf: { xs: 'flex-end', sm: 'center' } }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<AddIcon />} onClick={adicionarItem} sx={{ alignSelf: 'flex-start' }}>
            Adicionar item
          </Button>

          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">Total</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: 'primary.main' }}>
              {formatCurrency(calcularTotalPedido(itens))}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={resetarEFechar} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? 'Salvando...' : 'Criar pedido'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
